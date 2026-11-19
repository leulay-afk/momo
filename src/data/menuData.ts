import { MenuItem, StoreLocation } from '../types/menu';

export const HERO_IMAGE = '/src/assets/images/hero_smash_burger_1795091627434.jpg';

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'downtown',
    name: 'Downtown Flagship',
    address: '418 Market Street',
    city: 'Downtown District',
    hours: '10:30 AM – 11:30 PM',
    pickupMinutes: 12,
    phone: '(555) 234-8910',
  },
  {
    id: 'westside',
    name: 'Westside Kitchen',
    address: '1290 Oakwood Ave',
    city: 'Westside Arts',
    hours: '11:00 AM – 11:00 PM',
    pickupMinutes: 15,
    phone: '(555) 234-8942',
  },
  {
    id: 'northgate',
    name: 'Northgate Express',
    address: '85 Harbor Boulevard',
    city: 'Northgate',
    hours: '10:30 AM – 12:00 AM',
    pickupMinutes: 10,
    phone: '(555) 234-8977',
  },
];

export const COMBO_DRINKS = [
  'House Craft Cola',
  'Zero Sugar Cola',
  'Fresh Lemon-Lime',
  'Sparkling Blood Orange',
  'Iced Peach Tea',
];

export const COMBO_SIDES = [
  'Rosemary Sea Salt Fries',
  'Crispy Onion Strings (+$1.00)',
  'Spicy Cajun Fries',
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'classic-double-smash',
    name: 'Classic Double Smash',
    category: 'Smash Burgers',
    description:
      'Two seared prime chuck patties with lacy crispy edges, melted aged cheddar, dill pickles, shredded iceberg, and house ember sauce on toasted sesame brioche.',
    basePrice: 10.95,
    calories: 680,
    prepMinutes: 10,
    image: '/src/assets/images/burger_classic_smash_1795091627256.jpg',
    featuredTag: 'House Favorite',
    comboEligible: true,
    sizes: [
      { id: 'single', label: 'Single Patty', priceDelta: -2.0, caloriesDelta: -210 },
      { id: 'double', label: 'Double Patty', priceDelta: 0, caloriesDelta: 0 },
      { id: 'triple', label: 'Triple Stack', priceDelta: 3.25, caloriesDelta: 220 },
    ],
    addons: [
      { id: 'bacon', label: 'Applewood Smoked Bacon', price: 1.75 },
      { id: 'extra-cheddar', label: 'Extra Aged Cheddar', price: 1.0 },
      { id: 'jalapenos', label: 'Pickled Jalapenos', price: 0.5 },
      { id: 'ember-sauce', label: 'Extra Ember Sauce', price: 0.5 },
    ],
  },
  {
    id: 'smoky-bacon-swiss',
    name: 'Smoky Bacon & Swiss',
    category: 'Smash Burgers',
    description:
      'Double seared beef layered with thick-cut applewood bacon, melted cave-aged Swiss, slow-caramelized sweet onions, wild arugula, and roasted garlic aioli.',
    basePrice: 12.95,
    calories: 760,
    prepMinutes: 12,
    image: '/src/assets/images/burger_truffle_swiss_1795091627189.jpg',
    comboEligible: true,
    sizes: [
      { id: 'double', label: 'Double Patty', priceDelta: 0, caloriesDelta: 0 },
      { id: 'triple', label: 'Triple Stack', priceDelta: 3.25, caloriesDelta: 220 },
    ],
    addons: [
      { id: 'extra-bacon', label: 'Double Smoked Bacon', price: 2.0 },
      { id: 'caramel-onion', label: 'Extra Caramelized Onions', price: 0.75 },
      { id: 'garlic-aioli', label: 'Side Garlic Aioli', price: 0.6 },
    ],
  },
  {
    id: 'nashville-hot-chicken',
    name: 'Nashville Hot Chicken',
    category: 'Crispy Chicken',
    description:
      '24-hour buttermilk-brined chicken thigh fried crisp, brushed with smoky cayenne chili glaze, crunchy red cabbage slaw, and thick kosher pickles on a potato bun.',
    basePrice: 11.5,
    calories: 640,
    prepMinutes: 11,
    image: '/src/assets/images/chicken_spicy_sandwich_1795091627916.jpg',
    spicy: true,
    featuredTag: 'Spicy Kick',
    comboEligible: true,
    sizes: [
      { id: 'medium-heat', label: 'Classic Chili Heat', priceDelta: 0, caloriesDelta: 0 },
      { id: 'mild-honey', label: 'Mild Honey Glaze', priceDelta: 0, caloriesDelta: 20 },
      { id: 'extra-hot', label: 'Reaper Hot Oil', priceDelta: 0.5, caloriesDelta: 0 },
    ],
    addons: [
      { id: 'pimento-cheese', label: 'Sharp Cheddar Slice', price: 1.0 },
      { id: 'extra-slaw', label: 'Extra Crunch Slaw', price: 0.65 },
      { id: 'ranch-dip', label: 'Cool Buttermilk Ranch', price: 0.6 },
    ],
  },
  {
    id: 'hand-breaded-tenders',
    name: 'Buttermilk Crispy Tenders',
    category: 'Crispy Chicken',
    description:
      'Hand-dredged all-natural chicken breast tenders seasoned with cracked black pepper and thyme. Served hot with stone-ground honey mustard and smoky ranch.',
    basePrice: 10.25,
    calories: 540,
    prepMinutes: 9,
    image: '/src/assets/images/chicken_crispy_tenders_1795091627111.jpg',
    comboEligible: true,
    sizes: [
      { id: '3pc', label: '3 Pieces', priceDelta: -2.25, caloriesDelta: -180 },
      { id: '5pc', label: '5 Pieces', priceDelta: 0, caloriesDelta: 0 },
      { id: '8pc', label: '8 Pieces Share Box', priceDelta: 4.5, caloriesDelta: 340 },
    ],
    addons: [
      { id: 'honey-mustard', label: 'Extra Honey Mustard', price: 0.5 },
      { id: 'smoky-ranch', label: 'Extra Smoky Ranch', price: 0.5 },
      { id: 'hot-glaze', label: 'Side Nashville Chili Glaze', price: 0.75 },
    ],
  },
  {
    id: 'rosemary-sea-salt-fries',
    name: 'Rosemary Sea Salt Fries',
    category: 'Sides',
    description:
      'Double-fried skin-on Russet potatoes tossed hot with flaky Maldon sea salt and crisp rosemary needles. Paired with house tomato ketchup and roasted garlic aioli.',
    basePrice: 4.75,
    calories: 380,
    prepMinutes: 6,
    image: '/src/assets/images/sides_loaded_fries_1795091627578.jpg',
    vegetarian: true,
    comboEligible: false,
    sizes: [
      { id: 'regular', label: 'Regular Bowl', priceDelta: 0, caloriesDelta: 0 },
      { id: 'large', label: 'Large Share Bowl', priceDelta: 1.75, caloriesDelta: 190 },
    ],
    addons: [
      { id: 'cheese-sauce', label: 'Warm Aged Cheddar Dip', price: 1.5 },
      { id: 'cajun-dust', label: 'Spicy Cajun Dust', price: 0.4 },
      { id: 'extra-aioli', label: 'Extra Garlic Aioli', price: 0.6 },
    ],
  },
  {
    id: 'salted-caramel-shake',
    name: 'Salted Caramel Bean Shake',
    category: 'Shakes',
    description:
      'Hand-spun Madagascar vanilla bean custard blended thick with house burnt-sugar salted caramel, topped with softly whipped cream and flaky sea salt.',
    basePrice: 6.25,
    calories: 590,
    prepMinutes: 5,
    image: '/src/assets/images/shake_salted_caramel_1795091627404.jpg',
    vegetarian: true,
    comboEligible: false,
    sizes: [
      { id: '12oz', label: 'Regular 12 oz', priceDelta: 0, caloriesDelta: 0 },
      { id: '16oz', label: 'Tall 16 oz', priceDelta: 1.5, caloriesDelta: 180 },
    ],
    addons: [
      { id: 'espresso-shot', label: 'Cold Brew Shot', price: 1.25 },
      { id: 'malt-powder', label: 'Classic Diner Malt', price: 0.75 },
      { id: 'extra-caramel', label: 'Extra Caramel Drizzle', price: 0.5 },
    ],
  },
  {
    id: 'stack-house-feast-combo',
    name: 'The Stack House Box',
    category: 'Combos',
    description:
      'Our signature full meal tray: Double Smash Cheeseburger, full bowl of Rosemary Sea Salt Fries, house pickles, and a chilled craft soda over crushed ice.',
    basePrice: 14.95,
    calories: 1120,
    prepMinutes: 12,
    image: '/src/assets/images/combo_feast_box_1795091627288.jpg',
    featuredTag: 'Best Value',
    comboEligible: false,
    sizes: [
      { id: 'standard-box', label: 'Standard Meal', priceDelta: 0, caloriesDelta: 0 },
      { id: 'king-box', label: 'Triple Burger + Large Fries', priceDelta: 4.0, caloriesDelta: 360 },
    ],
    addons: [
      { id: 'upgrade-shake', label: 'Upgrade Drink to Caramel Shake', price: 2.75 },
      { id: 'add-2-tenders', label: 'Add 2 Crispy Tenders', price: 3.5 },
      { id: 'extra-sauce', label: 'Ember + Garlic Aioli Duo', price: 0.9 },
    ],
  },
];

export const FREE_DELIVERY_THRESHOLD = 25;
export const DELIVERY_FEE = 3.99;
export const TAX_RATE = 0.0825;
export const COMBO_UPGRADE_PRICE = 3.99;
