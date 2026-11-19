import React, { useEffect, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import { COMBO_DRINKS, COMBO_SIDES, COMBO_UPGRADE_PRICE } from '../data/menuData';
import { AddonOption, CartItem, MenuItem, SizeOption } from '../types/menu';
import { FoodImage } from './FoodImage';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [isCombo, setIsCombo] = useState(false);
  const [comboDrink, setComboDrink] = useState(COMBO_DRINKS[0]);
  const [comboSide, setComboSide] = useState(COMBO_SIDES[0]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      const defaultSize =
        item.sizes.find((s) => s.priceDelta === 0) ?? item.sizes[0];
      setSelectedSize(defaultSize);
      setSelectedAddons([]);
      setIsCombo(false);
      setComboDrink(COMBO_DRINKS[0]);
      setComboSide(COMBO_SIDES[0]);
      setQuantity(1);
      setNotes('');
    }
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item || !selectedSize) return null;

  const toggleAddon = (addon: AddonOption) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const comboSideExtra = isCombo && comboSide.includes('+$1.00') ? 1.0 : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice =
    item.basePrice +
    selectedSize.priceDelta +
    addonsTotal +
    (isCombo ? COMBO_UPGRADE_PRICE + comboSideExtra : 0);
  const totalPrice = unitPrice * quantity;
  const totalCalories =
    item.calories + selectedSize.caloriesDelta + (isCombo ? 410 : 0);

  const handleConfirm = () => {
    const cartItem: CartItem = {
      cartItemId: `${item.id}-${selectedSize.id}-${isCombo ? 'combo' : 'solo'}-${Date.now()}`,
      menuItem: item,
      selectedSize,
      selectedAddons,
      isCombo,
      comboDrink: isCombo ? comboDrink : undefined,
      comboSide: isCombo ? comboSide : undefined,
      quantity,
      notes: notes.trim(),
      unitPrice,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl border border-[#E6E4DD] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-[#D5D2C9]" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="relative aspect-[16/9] w-full bg-[#F3F2EE]">
            <FoodImage
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/95 text-[#141413] shadow-md hover:bg-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8231A]"
              aria-label="Close item customization"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#6B6962]">
                <span>{item.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{totalCalories} kcal</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Prep {item.prepMinutes} min</span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between gap-4">
                <h2 id="item-modal-title" className="font-display text-2xl font-bold text-[#141413]">
                  {item.name}
                </h2>
                <span className="font-mono text-lg font-semibold text-[#141413] tabular-nums shrink-0">
                  ${unitPrice.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#57554E]">
                {item.description}
              </p>
            </div>

            <div className="border-t border-[#E6E4DD] pt-5">
              <h3 className="text-sm font-semibold text-[#141413] mb-3">
                Choose Size or Style
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {item.sizes.map((size) => {
                  const active = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        active
                          ? 'border-[#C8231A] bg-[#C8231A]/5 text-[#141413]'
                          : 'border-[#E6E4DD] bg-white text-[#34332F] hover:border-[#C8C4B8]'
                      }`}
                    >
                      <span className="text-sm font-medium">{size.label}</span>
                      <span className="font-mono text-xs text-[#6B6962] tabular-nums">
                        {size.priceDelta === 0
                          ? 'Included'
                          : size.priceDelta > 0
                          ? `+$${size.priceDelta.toFixed(2)}`
                          : `-$${Math.abs(size.priceDelta).toFixed(2)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {item.comboEligible && (
              <div className="border-t border-[#E6E4DD] pt-5">
                <button
                  type="button"
                  onClick={() => setIsCombo((prev) => !prev)}
                  className={`w-full min-h-[56px] px-4 py-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                    isCombo
                      ? 'border-[#C8231A] bg-[#C8231A]/5'
                      : 'border-[#E6E4DD] bg-[#FAF9F6] hover:border-[#C8C4B8]'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-[#141413]">
                      Make it a Full Combo Meal
                    </div>
                    <div className="text-xs text-[#57554E] mt-0.5">
                      Includes choice of seasoned side + 16 oz chilled craft drink
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-semibold text-[#C8231A] tabular-nums">
                      +${COMBO_UPGRADE_PRICE.toFixed(2)}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isCombo
                          ? 'bg-[#C8231A] border-[#C8231A] text-white'
                          : 'border-[#C8C4B8] bg-white'
                      }`}
                    >
                      {isCombo && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    </span>
                  </div>
                </button>

                {isCombo && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD]">
                    <div>
                      <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                        Combo Side
                      </label>
                      <select
                        value={comboSide}
                        onChange={(e) => setComboSide(e.target.value)}
                        className="w-full min-h-[44px] rounded-lg border border-[#E6E4DD] bg-white px-3 text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
                      >
                        {COMBO_SIDES.map((side) => (
                          <option key={side} value={side}>
                            {side}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                        Combo Drink
                      </label>
                      <select
                        value={comboDrink}
                        onChange={(e) => setComboDrink(e.target.value)}
                        className="w-full min-h-[44px] rounded-lg border border-[#E6E4DD] bg-white px-3 text-sm text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
                      >
                        {COMBO_DRINKS.map((drink) => (
                          <option key={drink} value={drink}>
                            {drink}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {item.addons.length > 0 && (
              <div className="border-t border-[#E6E4DD] pt-5">
                <h3 className="text-sm font-semibold text-[#141413] mb-3">
                  Optional Extras & Sauces
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.addons.map((addon) => {
                    const checked = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon)}
                        className={`min-h-[46px] px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                          checked
                            ? 'border-[#141413] bg-[#FAF9F6] text-[#141413]'
                            : 'border-[#E6E4DD] bg-white text-[#34332F] hover:border-[#C8C4B8]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                              checked
                                ? 'bg-[#141413] border-[#141413] text-white'
                                : 'border-[#C8C4B8] bg-white'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" strokeWidth={2.5} />}
                          </span>
                          <span className="text-sm truncate">{addon.label}</span>
                        </div>
                        <span className="font-mono text-xs text-[#6B6962] tabular-nums shrink-0">
                          +${addon.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-[#E6E4DD] pt-5">
              <label htmlFor="kitchen-notes" className="block text-sm font-semibold text-[#141413] mb-2">
                Kitchen Instructions
              </label>
              <textarea
                id="kitchen-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="No pickles, sauce on the side, allergy note..."
                className="w-full rounded-xl border border-[#E6E4DD] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#141413] placeholder:text-[#8A877E] focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E6E4DD] bg-white px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center border border-[#E6E4DD] rounded-xl bg-[#FAF9F6]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#141413] hover:bg-[#EFECE5] rounded-l-xl transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-mono text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#141413] hover:bg-[#EFECE5] rounded-r-xl transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 min-h-[48px] px-6 py-3 rounded-xl bg-[#C8231A] hover:bg-[#B01D15] text-white text-sm font-semibold flex items-center justify-between gap-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8231A] focus-visible:ring-offset-2"
          >
            <span>Add to Bag</span>
            <span className="font-mono tabular-nums">${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
