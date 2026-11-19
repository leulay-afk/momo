import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Clock,
  MapPin,
  Plus,
  Search,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { FoodImage } from './components/FoodImage';
import { ItemModal } from './components/ItemModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  HERO_IMAGE,
  MENU_ITEMS,
  STORE_LOCATIONS,
} from './data/menuData';
import {
  CartItem,
  FulfillmentMode,
  MenuCategory,
  MenuItem,
  OrderRecord,
  OrderStage,
  StoreLocation,
} from './types/menu';

const CATEGORIES: MenuCategory[] = [
  'All',
  'Smash Burgers',
  'Crispy Chicken',
  'Sides',
  'Shakes',
  'Combos',
];

const CART_STORAGE_KEY = 'stackhouse_cart_v1';
const ORDERS_STORAGE_KEY = 'stackhouse_orders_v1';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'spicy' | 'vegetarian'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [fulfillment, setFulfillment] = useState<FulfillmentMode>('pickup');
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORE_LOCATIONS[0]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as OrderRecord[]) : [];
    } catch {
      return [];
    }
  });

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota issues
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage quota issues
    }
  }, [orders]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      if (dietaryFilter === 'spicy' && !item.spicy) {
        return false;
      }
      if (dietaryFilter === 'vegetarian' && !item.vegetarian) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, dietaryFilter, searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleAddToCart = (newCartItem: CartItem) => {
    setCart((prev) => [...prev, newCartItem]);
    setToastMessage(`Added ${newCartItem.menuItem.name} to your bag`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    const defaultSize =
      item.sizes.find((s) => s.priceDelta === 0) ?? item.sizes[0];
    const quickItem: CartItem = {
      cartItemId: `${item.id}-${defaultSize.id}-quick-${Date.now()}`,
      menuItem: item,
      selectedSize: defaultSize,
      selectedAddons: [],
      isCombo: false,
      quantity: 1,
      notes: '',
      unitPrice: item.basePrice + defaultSize.priceDelta,
    };
    handleAddToCart(quickItem);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handlePlaceOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setActiveOrderId(order.id);
    setIsTrackerOpen(true);
  };

  const handleAdvanceOrderStage = (orderId: string) => {
    const sequence: OrderStage[] = ['received', 'grilling', 'packing', 'ready'];
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const nextIdx = Math.min(
          sequence.length - 1,
          sequence.indexOf(ord.stage) + 1
        );
        return { ...ord, stage: sequence[nextIdx] };
      })
    );
  };

  const jumpToCombos = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveCategory('Combos');
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#141413]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E6E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#141413] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8231A] rounded-sm"
          >
            Stack House
          </a>

          {/* Zone 2: 4 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57554E]" aria-label="Primary Navigation">
            <a
              href="#menu"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Menu
            </a>
            <a
              href="#menu"
              onClick={jumpToCombos}
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Combos
            </a>
            <a
              href="#locations"
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Locations
            </a>
            <button
              type="button"
              onClick={() => setIsTrackerOpen(true)}
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Track Order
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="min-h-[40px] sm:min-h-[42px] px-4 py-2 rounded-xl bg-[#141413] hover:bg-[#2A2927] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8231A] focus-visible:ring-offset-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Bag</span>
              <span className="font-mono tabular-nums text-white/90">
                ({cartCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Section 1: Storefront Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8 lg:gap-12">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8 py-2">
              <div className="space-y-5">
                <p className="text-xs font-medium text-[#6B6962]">
                  {selectedStore.name} · Open {selectedStore.hours}
                </p>

                <h1
                  className="font-display font-bold tracking-tight text-[#141413] leading-[1.06] max-w-xl"
                  style={{
                    fontSize: 'clamp(2.25rem, 4vw, 3.65rem)',
                    textWrap: 'balance',
                  }}
                >
                  Flame-seared smash burgers and crispy chicken, made to order.
                </h1>

                <p className="text-base sm:text-lg text-[#57554E] leading-relaxed max-w-lg">
                  Fresh-ground prime chuck smashed to crisp lacy edges on cast iron, paired with 24-hour buttermilk chicken and rosemary skin-on fries.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#F3F2EE] border border-[#E6E4DD] space-y-3 max-w-lg">
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#E6E3DA] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFulfillment('pickup')}
                      className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        fulfillment === 'pickup'
                          ? 'bg-white text-[#141413] shadow-xs'
                          : 'text-[#57554E] hover:text-[#141413]'
                      }`}
                    >
                      Counter Pickup ({selectedStore.pickupMinutes} min)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillment('delivery')}
                      className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        fulfillment === 'delivery'
                          ? 'bg-white text-[#141413] shadow-xs'
                          : 'text-[#57554E] hover:text-[#141413]'
                      }`}
                    >
                      Local Delivery (25–35 min)
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white border border-[#E6E4DD] rounded-xl px-3.5 py-2">
                    <MapPin className="w-4 h-4 text-[#C8231A] shrink-0" />
                    <label htmlFor="hero-store-select" className="sr-only">
                      Select store kitchen
                    </label>
                    <select
                      id="hero-store-select"
                      value={selectedStore.id}
                      onChange={(e) => {
                        const store = STORE_LOCATIONS.find((s) => s.id === e.target.value);
                        if (store) setSelectedStore(store);
                      }}
                      className="w-full bg-transparent text-sm font-medium text-[#141413] focus:outline-none cursor-pointer"
                    >
                      {STORE_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} — {loc.address}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#menu"
                    className="min-h-[48px] px-6 py-3 rounded-xl bg-[#C8231A] hover:bg-[#B01D15] text-white text-sm font-semibold inline-flex items-center justify-center transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8231A] focus-visible:ring-offset-2"
                  >
                    Order from Menu
                  </a>
                  <PWAInstallButton variant="secondary" showDesktopFallback={true} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[280px] sm:min-h-[380px] rounded-2xl overflow-hidden bg-[#EAE7DF] border border-[#E6E4DD]">
                <FoodImage
                  src={HERO_IMAGE}
                  alt="Stack House double smash burger with melted cheddar and seasoned fries"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 sm:p-6">
                  <p className="text-xs text-white/80">
                    Featured Meal · Made Fresh to Order
                  </p>
                  <p className="mt-1 font-display text-lg sm:text-xl font-bold text-white">
                    Classic Double Smash &amp; Rosemary Fries
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4-column kitchen proof strip below hero split */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border border-[#E6E4DD] rounded-2xl bg-white divide-y lg:divide-y-0 lg:divide-x divide-[#E6E4DD]">
            <div className="p-5">
              <div className="font-mono text-lg font-semibold text-[#141413] tabular-nums">
                100% Prime
              </div>
              <div className="mt-1 text-xs text-[#57554E]">
                Fresh chuck ground daily, never frozen
              </div>
            </div>
            <div className="p-5 border-l border-[#E6E4DD] lg:border-l-0">
              <div className="font-mono text-lg font-semibold text-[#141413] tabular-nums">
                12 Minutes
              </div>
              <div className="mt-1 text-xs text-[#57554E]">
                Average hot counter pickup prep time
              </div>
            </div>
            <div className="p-5">
              <div className="font-mono text-lg font-semibold text-[#141413] tabular-nums">
                Free over $25
              </div>
              <div className="mt-1 text-xs text-[#57554E]">
                Local courier delivery across 3 zones
              </div>
            </div>
            <div className="p-5 border-l border-[#E6E4DD] lg:border-l-0">
              <div className="font-mono text-lg font-semibold text-[#141413] tabular-nums">
                Code STACK10
              </div>
              <div className="mt-1 text-xs text-[#57554E]">
                Save 10% on any online or app order
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Menu & Collection Grid */}
        <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-t border-[#E6E4DD]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
                Kitchen Menu
              </h2>
              <p className="mt-1.5 text-sm text-[#57554E]">
                Tap any item to customize patties, heat level, toppings, or upgrade to a full combo meal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#6B6962] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu..."
                  aria-label="Search menu items"
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-[#E6E4DD] bg-white text-sm text-[#141413] placeholder:text-[#8A877E] focus:outline-none focus:ring-2 focus:ring-[#C8231A]"
                />
              </div>

              <div className="inline-flex items-center p-1 bg-[#F3F2EE] border border-[#E6E4DD] rounded-xl shrink-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'spicy', label: 'Spicy' },
                  { id: 'vegetarian', label: 'Veg' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setDietaryFilter(opt.id as 'all' | 'spicy' | 'vegetarian')
                    }
                    className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      dietaryFilter === opt.id
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-[#57554E] hover:text-[#141413]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#E6E4DD]">
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#141413] text-white'
                      : 'bg-white border border-[#E6E4DD] text-[#57554E] hover:text-[#141413] hover:border-[#C8C4B8]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* 3-Column Product Grid */}
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-[#E6E4DD] bg-white p-12 text-center">
              <h3 className="font-display text-lg font-bold text-[#141413]">
                No menu items match your filters
              </h3>
              <p className="mt-1.5 text-sm text-[#57554E]">
                Try clearing your search or switching back to all categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setDietaryFilter('all');
                  setSearchQuery('');
                }}
                className="mt-5 min-h-[44px] px-5 py-2 rounded-xl bg-[#141413] text-white text-sm font-semibold hover:bg-[#2A2927] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col bg-white rounded-2xl border border-[#E6E4DD] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="block w-full aspect-[4/3] bg-[#F3F2EE] overflow-hidden text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8231A]"
                    aria-label={`Customize ${item.name}`}
                  >
                    <FoodImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>

                  <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#6B6962] flex items-center gap-1.5">
                        <span>{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{item.calories} kcal</span>
                        {item.featuredTag && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-[#C8231A]">
                              {item.featuredTag}
                            </span>
                          </>
                        )}
                        {item.spicy && !item.featuredTag && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-[#C8231A]">Spicy</span>
                          </>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-baseline justify-between gap-3">
                        <h3 className="text-base font-semibold text-[#141413] leading-snug">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="text-left hover:text-[#C8231A] transition-colors cursor-pointer"
                          >
                            {item.name}
                          </button>
                        </h3>
                        <span className="font-mono text-[15px] font-semibold text-[#141413] tabular-nums shrink-0">
                          ${item.basePrice.toFixed(2)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#57554E] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F0EEE8] flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-[#E6E4DD] bg-[#FAF9F6] hover:bg-[#EFECE5] text-sm font-medium text-[#141413] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Customize
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(item)}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C8231A] hover:bg-[#B01D15] text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Section 3: Kitchen Locations & Installable Web App */}
        <section id="locations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-t border-[#E6E4DD]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
                Kitchen Locations
              </h2>
              <p className="mt-1.5 text-sm text-[#57554E]">
                Choose your nearest kitchen for express counter pickup or local delivery.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsTrackerOpen(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#E6E4DD] bg-white hover:bg-[#F3F2EE] text-sm font-medium text-[#141413] inline-flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#C8231A]" />
              View Active Orders ({orders.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORE_LOCATIONS.map((loc) => {
              const isSelected = selectedStore.id === loc.id;
              return (
                <div
                  key={loc.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between gap-5 bg-white ${
                    isSelected ? 'border-[#141413]' : 'border-[#E6E4DD]'
                  }`}
                >
                  <div>
                    <div className="text-xs text-[#6B6962]">
                      {loc.city} · Pickup in ~{loc.pickupMinutes} min
                    </div>
                    <h3 className="mt-1 font-display text-xl font-bold text-[#141413]">
                      {loc.name}
                    </h3>
                    <p className="mt-2 text-sm text-[#57554E]">{loc.address}</p>
                    <p className="mt-1 text-xs text-[#6B6962] tabular-nums">
                      Daily {loc.hours} · {loc.phone}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStore(loc);
                      setFulfillment('pickup');
                      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`min-h-[44px] w-full px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#141413] text-white'
                        : 'bg-[#FAF9F6] border border-[#E6E4DD] text-[#141413] hover:bg-[#EFECE5]'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    {isSelected ? 'Selected Kitchen' : 'Order from This Kitchen'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Dedicated Mobile & Desktop PWA Install Card */}
          <div className="mt-8 rounded-2xl border border-[#E6E4DD] bg-[#F3F2EE] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#141413] text-white flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[#141413]">
                  Take Stack House on Your Phone
                </h3>
                <p className="mt-1 text-sm text-[#57554E] max-w-xl">
                  Install the Stack House web app directly to your iPhone, Android, or desktop home screen for instant reordering, offline menu browsing, and live order tracking.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <PWAInstallButton variant="primary" showDesktopFallback={true} />
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[#E6E4DD] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6B6962]">
          <div>
            <span className="font-semibold text-[#141413]">Stack House Kitchens</span>
            {' · '}
            <span>Fresh Smash Burgers, Crispy Chicken &amp; Shakes</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#menu" className="hover:text-[#141413] transition-colors">
              Full Menu
            </a>
            <a href="#locations" className="hover:text-[#141413] transition-colors">
              Locations
            </a>
            <button
              type="button"
              onClick={() => setIsTrackerOpen(true)}
              className="hover:text-[#141413] transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span>© {new Date().getFullYear()} Stack House</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Cart CTA (compact, respects <=15% sticky height cap) */}
      {cartCount > 0 && !isCartOpen && !selectedItem && !isTrackerOpen && (
        <div className="md:hidden fixed bottom-3 inset-x-4 z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full h-12 px-4 rounded-xl bg-[#C8231A] text-white text-sm font-semibold shadow-lg flex items-center justify-between cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              View Bag ({cartCount})
            </span>
            <span className="font-mono tabular-nums">${cartSubtotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Subtle Add-to-Bag Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3 rounded-xl bg-[#141413] text-white px-4 py-3 text-xs sm:text-sm font-medium shadow-xl border border-white/10"
          role="status"
          aria-live="polite"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="text-[#E8A54B] hover:underline font-semibold whitespace-nowrap cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}

      <OfflineIndicator />

      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        fulfillment={fulfillment}
        onFulfillmentChange={setFulfillment}
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        activeOrderId={activeOrderId}
        onSelectOrder={setActiveOrderId}
        onAdvanceStage={handleAdvanceOrderStage}
      />
    </div>
  );
}
