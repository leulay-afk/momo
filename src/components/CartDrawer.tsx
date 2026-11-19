import React, { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  STORE_LOCATIONS,
  TAX_RATE,
} from '../data/menuData';
import {
  CartItem,
  FulfillmentMode,
  OrderRecord,
  PaymentMethod,
  StoreLocation,
} from '../types/menu';
import { FoodImage } from './FoodImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  fulfillment: FulfillmentMode;
  onFulfillmentChange: (mode: FulfillmentMode) => void;
  selectedStore: StoreLocation;
  onStoreChange: (store: StoreLocation) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: OrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  fulfillment,
  onFulfillmentChange,
  selectedStore,
  onStoreChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout'>('bag');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('bag');
      setFormError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discount = appliedPromo === 'STACK10' ? subtotal * 0.1 : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const freeDeliveryUnlocked = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee =
    fulfillment === 'delivery' && items.length > 0 && !freeDeliveryUnlocked
      ? DELIVERY_FEE
      : 0;
  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + deliveryFee + tax;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'STACK10') {
      setAppliedPromo('STACK10');
      setPromoMessage('STACK10 applied — 10% off your food subtotal.');
    } else {
      setAppliedPromo(null);
      setPromoMessage('Code not recognized. Try STACK10 for 10% off.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Please enter your full name for the order ticket.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 7) {
      setFormError('Please enter a valid phone number for order updates.');
      return;
    }
    if (fulfillment === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Please enter your street delivery address.');
      return;
    }
    setFormError(null);

    const newOrder: OrderRecord = {
      id: `SH-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      fulfillment,
      store: selectedStore,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: fulfillment === 'delivery' ? deliveryAddress.trim() : undefined,
      paymentMethod,
      items: [...items],
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
      stage: 'received',
    };

    onClearCart();
    onClose();
    onPlaceOrder(newOrder);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Order Bag and Checkout"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white border-l border-[#E6E4DD] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E6E4DD] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#141413] hover:bg-[#F3F2EE] cursor-pointer"
                aria-label="Back to bag"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-display text-xl font-bold text-[#141413]">
              {step === 'bag' ? 'Your Order Bag' : 'Checkout'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#57554E] hover:bg-[#F3F2EE] hover:text-[#141413] cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-[#F3F2EE] flex items-center justify-center text-[#6B6962] mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#141413]">
                Your bag is empty
              </h3>
              <p className="mt-1.5 text-sm text-[#57554E] max-w-xs">
                Add a flame-seared smash burger, crispy tenders, or a salted caramel shake to start your order.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#141413] text-white text-sm font-semibold hover:bg-[#2A2927] transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : step === 'bag' ? (
            <>
              <div className="space-y-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD]">
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#EAE7DF] rounded-lg">
                  <button
                    type="button"
                    onClick={() => onFulfillmentChange('pickup')}
                    className={`min-h-[38px] rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      fulfillment === 'pickup'
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-[#57554E] hover:text-[#141413]'
                    }`}
                  >
                    Pickup ({selectedStore.pickupMinutes} min)
                  </button>
                  <button
                    type="button"
                    onClick={() => onFulfillmentChange('delivery')}
                    className={`min-h-[38px] rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      fulfillment === 'delivery'
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-[#57554E] hover:text-[#141413]'
                    }`}
                  >
                    Delivery (25–35 min)
                  </button>
                </div>

                <div>
                  <label htmlFor="bag-store" className="block text-xs font-medium text-[#57554E] mb-1">
                    Kitchen Location
                  </label>
                  <select
                    id="bag-store"
                    value={selectedStore.id}
                    onChange={(e) => {
                      const found = STORE_LOCATIONS.find((s) => s.id === e.target.value);
                      if (found) onStoreChange(found);
                    }}
                    className="w-full min-h-[40px] rounded-lg border border-[#E6E4DD] bg-white px-3 text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
                  >
                    {STORE_LOCATIONS.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} — {store.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {fulfillment === 'delivery' && (
                <div className="text-xs text-[#57554E] bg-[#FAF9F6] border border-[#E6E4DD] rounded-xl px-3.5 py-2.5">
                  {freeDeliveryUnlocked ? (
                    <span className="font-medium text-[#141413]">
                      Free local delivery unlocked on orders over ${FREE_DELIVERY_THRESHOLD}.
                    </span>
                  ) : (
                    <span>
                      Add <strong className="font-mono text-[#141413] tabular-nums">${amountToFreeDelivery.toFixed(2)}</strong> more for free delivery.
                    </span>
                  )}
                </div>
              )}

              <ul className="divide-y divide-[#E6E4DD]">
                {items.map((item) => (
                  <li key={item.cartItemId} className="py-4 first:pt-0 flex gap-3.5">
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#F3F2EE] shrink-0">
                      <FoodImage
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#141413] leading-snug">
                          {item.menuItem.name}
                        </h3>
                        <span className="font-mono text-sm font-semibold text-[#141413] tabular-nums shrink-0">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-[#6B6962] space-y-0.5">
                        <div>{item.selectedSize.label}</div>
                        {item.isCombo && (
                          <div>
                            Combo: {item.comboSide} · {item.comboDrink}
                          </div>
                        )}
                        {item.selectedAddons.length > 0 && (
                          <div>
                            + {item.selectedAddons.map((a) => a.label).join(', ')}
                          </div>
                        )}
                        {item.notes && (
                          <div className="italic text-[#57554E]">
                            Note: {item.notes}
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#E6E4DD] rounded-lg bg-[#FAF9F6]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                            className="min-h-[34px] min-w-[34px] flex items-center justify-center text-[#141413] hover:bg-[#EAE7DF] rounded-l-lg cursor-pointer"
                            aria-label={`Decrease quantity of ${item.menuItem.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                            className="min-h-[34px] min-w-[34px] flex items-center justify-center text-[#141413] hover:bg-[#EAE7DF] rounded-r-lg cursor-pointer"
                            aria-label={`Increase quantity of ${item.menuItem.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="min-h-[34px] px-2 text-xs text-[#6B6962] hover:text-[#C8231A] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleApplyPromo} className="pt-2">
                <label htmlFor="promo-code" className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Promo Code (Try STACK10)
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 min-h-[42px] rounded-xl border border-[#E6E4DD] bg-[#FAF9F6] px-3 text-sm text-[#141413] uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
                  />
                  <button
                    type="submit"
                    className="min-h-[42px] px-4 rounded-xl bg-[#141413] text-white text-xs font-semibold hover:bg-[#2A2927] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`mt-1.5 text-xs ${appliedPromo ? 'text-[#157A3D]' : 'text-[#C8231A]'}`}>
                    {promoMessage}
                  </p>
                )}
              </form>
            </>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] p-3.5 text-xs text-[#57554E] space-y-1">
                <div className="font-semibold text-[#141413]">
                  {fulfillment === 'pickup'
                    ? `Pickup from ${selectedStore.name}`
                    : `Local Delivery from ${selectedStore.name}`}
                </div>
                <div>
                  {fulfillment === 'pickup'
                    ? `${selectedStore.address} · Ready in ~${selectedStore.pickupMinutes} mins`
                    : 'Estimated arrival in 25–35 mins'}
                </div>
              </div>

              {formError && (
                <div className="rounded-xl bg-[#C8231A]/8 border border-[#C8231A]/25 px-3.5 py-2.5 text-xs font-medium text-[#C8231A]">
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="cust-name" className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Full Name
                </label>
                <input
                  id="cust-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full min-h-[44px] rounded-xl border border-[#E6E4DD] bg-white px-3.5 text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
                />
              </div>

              <div>
                <label htmlFor="cust-phone" className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Mobile Number
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(555) 390-1284"
                  className="w-full min-h-[44px] rounded-xl border border-[#E6E4DD] bg-white px-3.5 text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
                />
              </div>

              {fulfillment === 'delivery' && (
                <div>
                  <label htmlFor="cust-address" className="block text-xs font-semibold text-[#141413] mb-1.5">
                    Delivery Address
                  </label>
                  <input
                    id="cust-address"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="742 Evergreen Terrace, Apt 4B"
                    className="w-full min-h-[44px] rounded-xl border border-[#E6E4DD] bg-white px-3.5 text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
                  />
                </div>
              )}

              <div>
                <span className="block text-xs font-semibold text-[#141413] mb-2">
                  Payment Method
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Card' },
                    { id: 'apple_pay', label: 'Express Pay' },
                    { id: 'cod', label: 'Cash on Delivery' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                      className={`min-h-[44px] px-2 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        paymentMethod === option.id
                          ? 'border-[#C8231A] bg-[#C8231A]/5 text-[#141413]'
                          : 'border-[#E6E4DD] bg-white text-[#57554E] hover:border-[#C8C4B8]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E6E4DD] bg-[#FAF9F6] px-6 py-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#57554E]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#157A3D]">
                  <span>Discount (STACK10)</span>
                  <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}
              {fulfillment === 'delivery' && (
                <div className="flex justify-between text-[#57554E]">
                  <span>Delivery Fee</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#57554E]">
                <span>Estimated Tax</span>
                <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E6E4DD] text-base font-bold text-[#141413]">
                <span>Total</span>
                <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#C8231A] hover:bg-[#B01D15] text-white text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#C8231A] hover:bg-[#B01D15] text-white text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Place Order</span>
                <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
