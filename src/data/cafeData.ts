import { MenuItem, SignatureDish, Testimonial, GalleryItem, Order } from '@/types/cafe';

export const CAFE_INFO = {
  name: "Zoffers",
  shortName: "Zoffers Kitchen",
  tagline: "Gourmet Cloud Kitchen & Artisan Culinary Studio • India",
  phonetic: "Craft Cloud Kitchen • India",
  editorialHeadline: "India's premier artisan crispy baguettes and gourmet creations, delivered hot to your doorstep.",
  address: "Zoffers Cloud Studio, 100 Feet Road, Indiranagar, Bengaluru, India",
  googleMapsUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru+India",
  phone: "+91 98860 12345",
  email: "orders@zoffers.com",
  instagram: "@zoffers.india",
  deliveryRadius: "Fast Delivery across Bengaluru, Mumbai & Delhi NCR",
  avgDeliveryTime: "20–30 Mins",
  avgPickupTime: "10–15 Mins",
  minimumOrder: "$12.00",
  deliveryFee: 2.99,
  freeDeliveryThreshold: 35.00,
  hours: {
    weekday: "7:30 AM – 10:30 PM",
    weekend: "8:00 AM – 11:30 PM",
    kitchenClose: "Live kitchen active now",
  },
  roastingStats: {
    currentBatch: "Batch #108 — Micro-Lot Roast",
    roastTemp: "215°C",
    elevation: "1,250m Highland Harvest",
    scaScore: "88.5 Specialty Grade",
  }
};

export const MENU_ITEMS: MenuItem[] = [
  // SIGNATURE SANDWICHES & CRISPY BAGUETTES
  {
    id: "zoffers-house-special",
    name: "Zoffers Signature House Special Baguette",
    category: "mains",
    description: "Crispy shattered baguette, house artisan liver pate, savory roasted pork cuts, spiced deli rolls, pickled radish, fresh cucumber, garden cilantro & mild chili.",
    detailedDescription: "The undisputed house legend. Golden shattered crust baked fresh every two hours, generously smeared with warm artisan pate and French whipped herb butter, layered with tender roasted pork cuts, savory mortadella, crisp cucumber, sweet pickled radish & carrots, and fresh garden herbs.",
    price: "$9.50",
    priceNumber: 9.5,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Hero%20banh%20mi.png",
    dietary: ["House Classic", "Chef Signature"],
    tasteNotes: ["Crispy Shatter Crust", "Savory Umami Pate", "Tart Pickled Radish", "Fresh Herbs"],
    origin: "Zoffers Culinary Studio",
    featured: true,
    signature: true,
    pairing: "Sea Salt Cream Iced Coffee",
    customizationOptions: {
      temperature: ["Toasted Extra Crispy (Recommended)", "Warm Soft Bake"],
      sweetness: ["Spicy (Fresh Garden Chili)", "Mild (Chili on Side)", "No Chili"],
      portion: ["Standard Baguette", "Double Meat & Extra Pate (+$3.50)"],
    }
  },
  {
    id: "zoffers-bbq-pork",
    name: "Caramelized Honey BBQ Pork Baguette",
    category: "mains",
    description: "Charcoal-grilled caramelized pork shoulder glazed in wild honey, roasted garlic, crushed peanuts & scallion oil.",
    detailedDescription: "Marinated for 24 hours in aromatic herbs, garlic, and wildflower honey, then seared over charcoal for a smoky caramelized crust. Finished with scallion glaze, pickled carrots, and house umami reduction sauce.",
    price: "$9.50",
    priceNumber: 9.5,
    prepTime: "6 min",
    image: "https://banhmivietnam.xyz/img/Fillings%201.png",
    dietary: ["Charcoal Grilled"],
    tasteNotes: ["Smoky Sweet Honey", "Roasted Peanuts", "Crispy Crust"],
    origin: "Zoffers Grill Station",
    featured: true,
    signature: true,
    pairing: "Classic Cold Drip Iced Milk Coffee",
    customizationOptions: {
      temperature: ["Toasted Extra Crispy", "Standard Toast"],
      sweetness: ["Regular Spicy", "Mild", "No Chili"],
    }
  },
  {
    id: "zoffers-lemongrass-chicken",
    name: "Crispy Lemongrass Grilled Chicken Baguette",
    category: "mains",
    description: "Char-grilled lemongrass chicken thighs, garlic aioli, sweet pickled carrots, crispy shallot crunch & cilantro.",
    detailedDescription: "Juicy free-range chicken thighs marinated with fresh crushed lemongrass and citrus honey glaze, layered over creamy garlic aioli, fresh cucumber ribbons, and crispy golden shallots.",
    price: "$9.00",
    priceNumber: 9.0,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Fillings%202.png",
    dietary: ["Poultry Classic"],
    tasteNotes: ["Savory Chicken", "Garlic Crunch", "Zesty Herbs"],
    origin: "Zoffers Farm-to-Table",
    featured: false,
    pairing: "Iced Honey Kumquat Jasmine Tea"
  },
  {
    id: "zoffers-braised-meatballs",
    name: "Braised Meatballs in Rich Tomato Gravy",
    category: "mains",
    description: "Handcrafted pork & water chestnut meatballs slow-braised in rich tomato broth, served in a warm crispy baguette.",
    detailedDescription: "Tender handmade meatballs simmered in a slow-cooked tomato, shallot, and herb reduction. Served tucked inside our toasted French-style baguette or with bread for dipping.",
    price: "$10.00",
    priceNumber: 10.0,
    prepTime: "6 min",
    image: "https://banhmivietnam.xyz/img/Fillings%203.png",
    dietary: ["Comfort Classic"],
    tasteNotes: ["Juicy Meatballs", "Rich Tomato Glaze", "Airy Bread Dip"],
    origin: "Zoffers Slow Simmer Recipe",
    featured: false,
    pairing: "Classic Cold Drip Iced Milk Coffee"
  },
  {
    id: "zoffers-truffle-mushroom-vegan",
    name: "Crispy King Oyster Mushroom & Tofu Baguette",
    category: "mains",
    description: "Glazed wild king oyster mushrooms, crispy spiced tofu, shiitake walnut pate, vegan garlic mayo & herbs.",
    detailedDescription: "100% plant-based gourmet sandwich with rich umami depth. Features roasted king oyster mushrooms caramelized in tamari, spiced organic tofu, velvety shiitake walnut pate, and fresh pickled vegetables.",
    price: "$8.50",
    priceNumber: 8.5,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Fillings%204.png",
    dietary: ["100% Vegan", "Plant-Based"],
    tasteNotes: ["Earthy Shiitake Pate", "Savory Mushrooms", "Crisp Crumb"],
    origin: "Zoffers Plant Craft",
    featured: true,
    signature: false,
    pairing: "Iced Honey Kumquat Jasmine Tea"
  },

  // SPECIALTY COFFEE & BEVERAGES
  {
    id: "sea-salt-cream-coffee",
    name: "Sea Salt Cream Iced Coffee (House Special)",
    category: "coffee",
    description: "Slow-dripped dark roast coffee, sweet cream base, crowned with velvety whipped sea salt foam.",
    detailedDescription: "The viral house specialty beverage. Bold, dark-roasted specialty coffee slowly extracted drop-by-drop, sweetened with condensed milk, and topped with a thick, decadent layer of whipped sea salt cream foam.",
    price: "$6.50",
    priceNumber: 6.5,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    dietary: ["House Signature"],
    tasteNotes: ["Salted Cream Velvet", "Dark Cacao Roast", "Sweet Caramel"],
    origin: "Zoffers Specialty Roastery",
    featured: true,
    signature: true,
    pairing: "Zoffers Signature House Special Baguette",
    customizationOptions: {
      temperature: ["Chilled with Crushed Ice (Recommended)", "Less Ice"],
      sweetness: ["Standard Sweetness", "Less Sweet (70%)", "Extra Dark Coffee Kick"],
    }
  },
  {
    id: "classic-iced-milk-coffee",
    name: "Classic Cold Drip Iced Milk Coffee",
    category: "coffee",
    description: "Traditional metal filter slow drip, sweet condensed milk over crystal crushed ice.",
    detailedDescription: "Brewed drop by drop using traditional metal filters over thick, rich condensed milk. Poured over crystal ice for a robust, chocolatey, and deeply energizing coffee experience.",
    price: "$5.50",
    priceNumber: 5.5,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Traditional Roast"],
    tasteNotes: ["Intense Dark Roast", "Sweet Cream", "Nutty Finish"],
    origin: "Single-Origin Highland Harvest",
    featured: true,
    signature: true,
  },
  {
    id: "honey-kumquat-iced-tea",
    name: "Iced Honey Kumquat Jasmine Green Tea",
    category: "mocktails",
    description: "Fresh squeezed tropical kumquats, raw mountain honey, freshly brewed organic jasmine green tea.",
    detailedDescription: "Ultra-refreshing citrus-infused green tea shaken with fresh tropical calamansi kumquats and pure raw mountain honey. The perfect thirst quencher paired with hot crispy baguettes.",
    price: "$6.00",
    priceNumber: 6.0,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegan", "Gluten-Free"],
    tasteNotes: ["Tart Kumquat Citrus", "Floral Jasmine", "Wild Honey"],
    featured: false,
  },

  // SIDES & DESSERTS
  {
    id: "caramel-espresso-flan",
    name: "Caramel Custard Flan with Espresso Glaze",
    category: "desserts",
    description: "Silky steamed egg custard bathed in bittersweet caramel and dark roast espresso reduction.",
    detailedDescription: "Velvety smooth steamed custard topped with bittersweet burnt caramel sauce and splashed with a touch of cold-dripped espresso.",
    price: "$6.00",
    priceNumber: 6.0,
    prepTime: "2 min",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian"],
    tasteNotes: ["Silky Vanilla Custard", "Bittersweet Caramel", "Bold Coffee Glaze"],
    featured: true,
    signature: true,
  }
];

export const SIGNATURE_DISHES: SignatureDish[] = [
  {
    id: "sig-house-special",
    name: "Zoffers Signature House Special",
    subtitle: "The Gourmet Street Legend",
    description: "Airy shattered baguette, house artisan liver pate, savory roasted pork, spiced deli cuts, pickled radish, cucumber, cilantro & garden chili.",
    price: "$9.50",
    priceNumber: 9.5,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Hero%20banh%20mi.png",
    tags: ["Shattered Crust", "House Artisan Pate", "Baked Every 2 Hours"],
    flavorProfile: {
      sweetness: 45,
      intensity: 95,
      richness: 90,
      acidity: 75,
    },
    chefNote: "We bake our baguettes every 2 hours using a proprietary dough fermentation to guarantee an unmistakable glass-like shatter when bitten.",
    pairing: "Sea Salt Cream Iced Coffee"
  },
  {
    id: "sig-bbq-pork",
    name: "Caramelized Honey BBQ Pork",
    subtitle: "Charcoal Seared Masterpiece",
    description: "Charcoal grilled pork shoulder marinated in wild honey and crushed lemongrass, served with scallion oil and crispy shallots.",
    price: "$9.50",
    priceNumber: 9.5,
    prepTime: "6 min",
    image: "https://banhmivietnam.xyz/img/Fillings%201.png",
    tags: ["24h Marinade", "Charcoal Seared", "Scallion Glaze"],
    flavorProfile: {
      sweetness: 80,
      intensity: 90,
      richness: 85,
      acidity: 60,
    },
    chefNote: "Charcoal grilling caramelizes the wildflower honey and infuses an unmistakable deep smoky aroma.",
    pairing: "Classic Cold Drip Iced Milk Coffee"
  },
  {
    id: "sig-vegan-mushroom",
    name: "Crispy King Mushroom & Tofu",
    subtitle: "100% Plant-Based Craft",
    description: "Glazed wild king oyster mushrooms, spiced crispy tofu, rich shiitake walnut pate, vegan mayo, and fresh garden herbs.",
    price: "$8.50",
    priceNumber: 8.5,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Fillings%204.png",
    tags: ["100% Plant-Based", "Shiitake Walnut Pate", "King Oyster"],
    flavorProfile: {
      sweetness: 50,
      intensity: 85,
      richness: 80,
      acidity: 70,
    },
    chefNote: "Our shiitake walnut pate offers deep earthy umami and buttery spreadability that rivals traditional recipes.",
    pairing: "Iced Honey Kumquat Jasmine Tea"
  }
];

export const BRAND_PILLARS = [
  {
    number: "01",
    title: "Airy Shattered Baguette",
    description: "Naturally fermented and baked fresh every 2 hours for an unforgettable crisp crunch.",
    stat: "100%",
    statLabel: "Crispy Guarantee",
  },
  {
    number: "02",
    title: "Artisan House Pate & Glazes",
    description: "Slow-simmered in copper pots with shallots, cracked pepper, and herbs for deep savory richness.",
    stat: "24h",
    statLabel: "Marinade & Simmer",
  },
  {
    number: "03",
    title: "Eco-Luxe Thermal Packaging",
    description: "Custom ventilated food containers prevent steam condensation so the crust stays crunchy until your first bite.",
    stat: "<20min",
    statLabel: "Average Dispatch",
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ZF-8812-XK",
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    status: "new",
    deliveryMethod: "delivery",
    customer: {
      name: "Marcus Sterling",
      phone: "+1 (917) 555-8831",
      email: "marcus.sterling@gmail.com",
      address: "120 Prince St, Apt 4C, SoHo, NY 10012",
      unitOrApt: "Apt 4C (Buzzer 04)",
      deliveryInstructions: "Please include extra napkins and cutlery!",
    },
    items: [
      {
        id: "item-1",
        menuItem: MENU_ITEMS[0], // House Special
        quantity: 2,
        selectedOptions: {
          temperature: "Toasted Extra Crispy",
          sweetness: "Spicy (Fresh Garden Chili)",
        },
        itemTotal: 19.0,
      },
      {
        id: "item-2",
        menuItem: MENU_ITEMS[5], // Sea Salt Cream Coffee
        quantity: 2,
        selectedOptions: {
          temperature: "Chilled with Crushed Ice",
          sweetness: "Standard Sweetness",
        },
        itemTotal: 13.0,
      }
    ],
    subtotal: 32.0,
    deliveryFee: 2.99,
    tax: 2.84,
    tip: 6.00,
    total: 43.83,
    estimatedTime: "20-25 min",
    paymentMethod: "Online (Razorpay Verified)",
  },
  {
    id: "ZF-8811-LM",
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: "preparing",
    deliveryMethod: "pickup",
    customer: {
      name: "Chloe Vance",
      phone: "+1 (212) 555-4921",
      email: "chloe.vance@design.org",
    },
    items: [
      {
        id: "item-3",
        menuItem: MENU_ITEMS[1], // BBQ Pork
        quantity: 1,
        itemTotal: 9.5,
      },
      {
        id: "item-4",
        menuItem: MENU_ITEMS[6], // Classic Milk Coffee
        quantity: 1,
        itemTotal: 5.5,
      }
    ],
    subtotal: 15.00,
    deliveryFee: 0.00,
    tax: 1.33,
    tip: 3.00,
    total: 19.33,
    estimatedTime: "10-15 min",
    paymentMethod: "Credit Card (Online)",
  },
  {
    id: "ZF-8810-RT",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: "ready",
    deliveryMethod: "delivery",
    customer: {
      name: "Hannah Goldstein",
      phone: "+1 (646) 555-1920",
      email: "hannah.g@gmail.com",
      address: "480 Broome St, 6th Floor, SoHo, NY 10013",
    },
    items: [
      {
        id: "item-5",
        menuItem: MENU_ITEMS[4], // Vegan Mushroom
        quantity: 2,
        itemTotal: 17.0,
      }
    ],
    subtotal: 17.00,
    deliveryFee: 2.99,
    tax: 1.51,
    tip: 4.00,
    total: 25.50,
    estimatedTime: "5-10 min remaining",
    paymentMethod: "Online (Razorpay)",
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "The Golden Shattered Crust",
    category: "Food",
    image: "https://banhmivietnam.xyz/img/Hero%20banh%20mi.png",
    aspect: "wide",
    caption: "Baked fresh every 2 hours with house artisan pate and pickled vegetables."
  },
  {
    id: "gal-2",
    title: "Artisan Slow Drip Coffee",
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    aspect: "tall",
    caption: "Single-origin roast extracted drop by drop over sweet cream."
  },
  {
    id: "gal-3",
    title: "Culinary Cloud Studio",
    category: "Kitchen",
    image: "https://banhmivietnam.xyz/img/Street%20image%201.png",
    aspect: "square",
    caption: "Our high-tech SoHo cloud kitchen designed for speed and temperature retention."
  },
  {
    id: "gal-4",
    title: "Charcoal Lemongrass Skewers",
    category: "Food",
    image: "https://banhmivietnam.xyz/img/Fillings%201.png",
    aspect: "wide",
    caption: "Seared over glowing wood coals for deep caramelized honey glaze."
  },
  {
    id: "gal-5",
    title: "Sea Salt Cream Coffee",
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    aspect: "square",
    caption: "Whipped sea salt cream floating over bittersweet espresso."
  },
  {
    id: "gal-6",
    title: "Thermal Eco Packaging",
    category: "Packaging",
    image: "https://banhmivietnam.xyz/img/Street%20image%202.png",
    aspect: "tall",
    caption: "Ventilated thermal wraps that preserve the crisp crunch during transit."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote: "The crust shatters like glass and the house pate is rich, complex, and unforgettable. Zoffers sets a new benchmark for cloud kitchen food.",
    author: "Elena Vance",
    role: "Culinary Critic",
    publication: "The New York Dining Journal",
    rating: 5,
  },
  {
    id: "test-2",
    quote: "Their Sea Salt Cream Iced Coffee and Signature Baguette delivered in under 25 minutes are easily the best lunch in SoHo right now.",
    author: "Sarah Jenkins",
    role: "Food Columnist",
    publication: "Eater New York",
    rating: 5,
  },
  {
    id: "test-3",
    quote: "A masterclass in cloud kitchen execution. The packaging keeps the sandwich warm and crunchy rather than soggy. Absolute perfection.",
    author: "Chef Kenji Sato",
    role: "Gastronomy Director",
    publication: "Michelin Guide Review",
    rating: 5,
  }
];
