import React, { useEffect } from 'react';
import { Check, Clock, Flame, PackageCheck, X } from 'lucide-react';
import { OrderRecord, OrderStage } from '../types/menu';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  activeOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onAdvanceStage: (orderId: string) => void;
}

const STAGES: { key: OrderStage; label: string; detail: string }[] = [
  { key: 'received', label: 'Order Received', detail: 'Ticket sent to kitchen' },
  { key: 'grilling', label: 'On the Grill', detail: 'Seared fresh to order' },
  { key: 'packing', label: 'Packing Order', detail: 'Quality check & sealing' },
  { key: 'ready', label: 'Ready', detail: 'Ready at counter / courier en route' },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  activeOrderId,
  onSelectOrder,
  onAdvanceStage,
}) => {
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

  const currentOrder =
    orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null;

  const currentStageIndex = currentOrder
    ? STAGES.findIndex((s) => s.key === currentOrder.stage)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-tracker-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl max-h-[90vh] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl border border-[#E6E4DD] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E6E4DD] flex items-center justify-between gap-4">
          <h2 id="order-tracker-title" className="font-display text-xl font-bold text-[#141413]">
            Live Order Tracker
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#57554E] hover:bg-[#F3F2EE] hover:text-[#141413] cursor-pointer"
            aria-label="Close order tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!currentOrder ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F3F2EE] text-[#6B6962] flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#141413]">
                No Active Orders Yet
              </h3>
              <p className="text-sm text-[#57554E] max-w-xs mx-auto">
                Once you place an order, your live kitchen progress and pickup code will appear here.
              </p>
            </div>
          ) : (
            <>
              {orders.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {orders.map((ord) => (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => onSelectOrder(ord.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap shrink-0 border cursor-pointer ${
                        ord.id === currentOrder.id
                          ? 'bg-[#141413] text-white border-[#141413]'
                          : 'bg-[#FAF9F6] text-[#57554E] border-[#E6E4DD] hover:text-[#141413]'
                      }`}
                    >
                      Order #{ord.id}
                    </button>
                  ))}
                </div>
              )}

              <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#6B6962]">
                    Order <span className="font-mono font-semibold text-[#141413]">#{currentOrder.id}</span>
                    {' · '}
                    {currentOrder.fulfillment === 'pickup' ? 'Pickup' : 'Delivery'}
                  </div>
                  <div className="mt-1 font-display text-lg font-bold text-[#141413]">
                    {currentOrder.stage === 'ready'
                      ? currentOrder.fulfillment === 'pickup'
                        ? `Ready at ${currentOrder.store.name}`
                        : 'Courier On The Way'
                      : `${STAGES[currentStageIndex].label} — ${currentOrder.store.name}`}
                  </div>
                  <div className="mt-0.5 text-xs text-[#57554E]">
                    {currentOrder.fulfillment === 'pickup'
                      ? `${currentOrder.store.address} · Est. ${currentOrder.store.pickupMinutes} min`
                      : `Delivering to ${currentOrder.deliveryAddress}`}
                  </div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#C8231A]/10 text-[#C8231A] flex items-center justify-center shrink-0">
                  {currentOrder.stage === 'ready' ? (
                    <PackageCheck className="w-5 h-5" />
                  ) : (
                    <Flame className="w-5 h-5" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {STAGES.map((stage, idx) => {
                  const completed = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <div
                      key={stage.key}
                      className={`flex items-start gap-3.5 p-3 rounded-xl border ${
                        isCurrent
                          ? 'border-[#C8231A] bg-[#C8231A]/5'
                          : completed
                          ? 'border-[#E6E4DD] bg-white'
                          : 'border-[#E6E4DD] bg-[#FAF9F6] opacity-60'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                          completed
                            ? 'bg-[#C8231A] text-white'
                            : 'bg-[#E6E4DD] text-[#57554E]'
                        }`}
                      >
                        {completed ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#141413]">
                          {stage.label}
                        </div>
                        <div className="text-xs text-[#57554E]">
                          {stage.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentOrder.stage !== 'ready' && (
                <button
                  type="button"
                  onClick={() => onAdvanceStage(currentOrder.id)}
                  className="w-full min-h-[42px] px-4 py-2 rounded-xl border border-[#E6E4DD] bg-[#FAF9F6] hover:bg-[#EFECE5] text-xs font-semibold text-[#141413] transition-colors cursor-pointer"
                >
                  Advance Kitchen Status (Demo Preview)
                </button>
              )}

              <div className="border-t border-[#E6E4DD] pt-4">
                <h3 className="text-xs font-semibold text-[#6B6962] uppercase tracking-wider mb-3">
                  Receipt Summary
                </h3>
                <ul className="space-y-2 text-sm">
                  {currentOrder.items.map((item) => (
                    <li key={item.cartItemId} className="flex justify-between gap-4">
                      <span className="text-[#34332F]">
                        <span className="font-mono font-medium">{item.quantity}x</span>{' '}
                        {item.menuItem.name}{' '}
                        <span className="text-xs text-[#6B6962]">
                          ({item.selectedSize.label}{item.isCombo ? ', Combo' : ''})
                        </span>
                      </span>
                      <span className="font-mono tabular-nums text-[#141413] shrink-0">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-[#E6E4DD] flex justify-between text-sm font-bold text-[#141413]">
                  <span>Total Paid ({currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : currentOrder.paymentMethod === 'apple_pay' ? 'Express Pay' : 'Card'})</span>
                  <span className="font-mono tabular-nums">${currentOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
