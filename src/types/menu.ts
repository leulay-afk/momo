export type MenuCategory =
  | 'All'
  | 'Smash Burgers'
  | 'Crispy Chicken'
  | 'Sides'
  | 'Shakes'
  | 'Combos';

export type FulfillmentMode = 'pickup' | 'delivery';

export type PaymentMethod = 'card' | 'apple_pay' | 'cod';

export type OrderStage =
  | 'received'
  | 'grilling'
  | 'packing'
  | 'ready';

export interface SizeOption {
  id: string;
  label: string;
  priceDelta: number;
  caloriesDelta: number;
}

export interface AddonOption {
  id: string;
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  description: string;
  basePrice: number;
  calories: number;
  prepMinutes: number;
  image: string;
  spicy?: boolean;
  vegetarian?: boolean;
  featuredTag?: string;
  comboEligible?: boolean;
  sizes: SizeOption[];
  addons: AddonOption[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  selectedSize: SizeOption;
  selectedAddons: AddonOption[];
  isCombo: boolean;
  comboDrink?: string;
  comboSide?: string;
  quantity: number;
  notes: string;
  unitPrice: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: string;
  pickupMinutes: number;
  phone: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  fulfillment: FulfillmentMode;
  store: StoreLocation;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  stage: OrderStage;
}
