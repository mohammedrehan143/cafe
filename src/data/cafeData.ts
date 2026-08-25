import { MenuItem, SignatureDish, Testimonial, GalleryItem, Order } from '@/types/cafe';

export const CAFE_INFO = {
  name: "Zoffers",
  shortName: "Zoffers Kitchen",
  tagline: "India's Gourmet Cloud Kitchen & Artisan Culinary Studio",
  phonetic: "Craft Cloud Kitchen • India",
  editorialHeadline: "India's premier artisan crispy baguettes, charcoal grills, and specialty coffees delivered hot to your doorstep.",
  address: "Zoffers Cloud Studio Hub, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038, India",
  googleMapsUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru+India",
  phone: "+91 98860 12345",
  email: "orders@zoffers.com",
  instagram: "@zoffers.india",
  deliveryRadius: "Superfast Delivery across Bengaluru, Mumbai & Delhi NCR",
  avgDeliveryTime: "20–30 Mins",
  avgPickupTime: "10–15 Mins",
  minimumOrder: "$12.00",
  deliveryFee: 2.99,
  freeDeliveryThreshold: 35.00,
  hours: {
    weekday: "7:30 AM – 11:30 PM",
    weekend: "8:00 AM – 12:00 AM",
    kitchenClose: "Live kitchen active now",
  },
  roastingStats: {
    currentBatch: "Batch #108 — Single-Origin Chikmagalur Roast",
    roastTemp: "215°C",
    elevation: "1,350m Western Ghats Harvest",
    scaScore: "88.5 Specialty Grade",
  }
};

export const MENU_ITEMS: MenuItem[] = [
  // SIGNATURE SANDWICHES & CRISPY BAGUETTES
  {
    id: "zoffers-house-special",
    name: "Zoffers Signature House Special Baguette",
    category: "mains",
    description: "Shattered crisp baguette, house artisan pate, tender roasted spiced meats, French herb butter, pickled radish, cucumber, fresh mint, cilantro & green chili.",
    detailedDescription: "The undisputed house legend crafted for India. Golden shattered crust baked fresh every 2 hours, generously smeared with warm artisan pate and whipped herb butter, layered with tender roasted spiced cuts, crisp cucumber, sweet pickled radish & carrots, and fragrant garden herbs.",
    price: "$9.50",
    priceNumber: 9.5,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Hero%20banh%20mi.png",
    dietary: ["House Classic", "Chef Signature"],
    tasteNotes: ["Shattered Glass Crust", "Rich Spiced Pate", "Tangy Pickled Radish", "Fresh Mint & Cilantro"],
    origin: "Zoffers Bengaluru Studio",
    featured: true,
    signature: true,
    pairing: "South Indian Filter Roast with Sea Salt Cream",
    customizationOptions: {
      temperature: ["Toasted Extra Crispy (Recommended)", "Warm Soft Bake"],
      sweetness: ["Spicy (Fresh Indian Green Chili)", "Mild (Chili on Side)", "No Chili"],
      portion: ["Standard Baguette", "Double Fillings & Extra Glaze (+$3.50)"],
    }
  },
  {
    id: "zoffers-tandoor-bbq-chicken",
    name: "Smoky Charcoal Spiced BBQ Chicken Baguette",
    category: "mains",
    description: "Charcoal-grilled chicken thighs glazed with wildflower honey, roasted spices, garlic aioli, crushed peanuts & scallion oil.",
    detailedDescription: "Marinated for 24 hours in aromatic Indian herbs, smoked spices, garlic, and wild honey, then charred over glowing coals for a deep smoky crust. Layered with pickled carrots, cool cucumber, and house umami glaze.",
    price: "$9.50",
    priceNumber: 9.5,
    prepTime: "6 min",
    image: "https://banhmivietnam.xyz/img/Fillings%201.png",
    dietary: ["Charcoal Grilled"],
    tasteNotes: ["Smoky Sweet Honey", "Roasted Spices", "Crispy Crust"],
    origin: "Zoffers Charcoal Grill Station",
    featured: true,
    signature: true,
    pairing: "Classic Iced Filter Coffee",
    customizationOptions: {
      temperature: ["Toasted Extra Crispy", "Standard Toast"],
      sweetness: ["Regular Spicy", "Mild", "No Chili"],
    }
  },
  {
    id: "zoffers-royal-paneer-tikka",
    name: "Royal Charred Paneer & Herb Baguette",
    category: "mains",
    description: "Charcoal-seared malai paneer cubes, roasted capsicum, garlic herb mayo, sweet pickled radish, crunchy shallots & mint cilantro chutney.",
    detailedDescription: "Tender cubes of fresh cottage cheese marinated in hand-ground spices and yogurt, grilled over coals and stuffed inside our airy French-style baguette with crisp vegetables and tangy house mint glaze.",
    price: "$9.00",
    priceNumber: 9.0,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Fillings%202.png",
    dietary: ["Vegetarian Classic", "Chef Special"],
    tasteNotes: ["Smoky Paneer", "Crispy Shallots", "Zesty Mint Glaze"],
    origin: "Zoffers Craft Vegetarian",
    featured: true,
    signature: true,
    pairing: "Honey Ginger Cardamom Iced Tea"
  },
  {
    id: "zoffers-braised-meatballs",
    name: "Slow-Braised Meatballs in Rich Tomato Gravy",
    category: "mains",
    description: "Handcrafted spiced meatballs slow-simmered in rich tomato, garlic & herb broth, served in a warm crispy baguette.",
    detailedDescription: "Tender handmade meatballs simmered in a slow-cooked tomato, shallot, and herb reduction. Served tucked inside our toasted baguette for maximum crunch and saucy richness.",
    price: "$10.00",
    priceNumber: 10.0,
    prepTime: "6 min",
    image: "https://banhmivietnam.xyz/img/Fillings%203.png",
    dietary: ["Comfort Classic"],
    tasteNotes: ["Juicy Meatballs", "Rich Tomato Reduction", "Airy Bread Dip"],
    origin: "Zoffers Slow Simmer Recipe",
    featured: false,
    pairing: "Classic Iced Filter Coffee"
  },
  {
    id: "zoffers-truffle-mushroom-vegan",
    name: "Crispy King Oyster Mushroom & Spiced Tofu",
    category: "mains",
    description: "Glazed wild king oyster mushrooms, crispy spiced organic tofu, shiitake walnut pate, vegan garlic aioli & garden herbs.",
    detailedDescription: "100% plant-based gourmet sandwich with deep umami richness. Features roasted king oyster mushrooms caramelized in aromatic spices, crispy organic tofu, velvety shiitake walnut pate, and crisp pickled salad.",
    price: "$8.50",
    priceNumber: 8.5,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Fillings%204.png",
    dietary: ["100% Vegan", "Plant-Based"],
    tasteNotes: ["Earthy Shiitake Pate", "Savory Spiced Tofu", "Crisp Crumb"],
    origin: "Zoffers Plant Craft",
    featured: true,
    signature: false,
    pairing: "Honey Ginger Cardamom Iced Tea"
  },

  // SPECIALTY COFFEE & BEVERAGES
  {
    id: "sea-salt-cream-coffee",
    name: "South Indian Filter Roast with Sea Salt Cream",
    category: "coffee",
    description: "Slow-dripped single-origin Chikmagalur dark roast coffee, sweet condensed milk base, crowned with velvety whipped sea salt foam.",
    detailedDescription: "Our viral signature coffee. Single-origin specialty beans from Chikmagalur estates extracted drop-by-drop through traditional brass filters, blended over sweet cream, and topped with thick whipped sea salt foam.",
    price: "$6.50",
    priceNumber: 6.5,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    dietary: ["House Signature", "Single-Origin"],
    tasteNotes: ["Salted Cream Velvet", "Dark Cacao Roast", "Sweet Caramel"],
    origin: "Chikmagalur Highland Estate, India",
    featured: true,
    signature: true,
    pairing: "Zoffers Signature House Special Baguette",
    customizationOptions: {
      temperature: ["Chilled with Crushed Ice (Recommended)", "Less Ice"],
      sweetness: ["Standard Sweetness", "Less Sweet (70%)", "Extra Dark Kick"],
    }
  },
  {
    id: "classic-iced-milk-coffee",
    name: "Classic Cold Drip Iced Filter Coffee",
    category: "coffee",
    description: "Traditional slow-drip dark roast, sweet condensed milk poured over crystal crushed ice.",
    detailedDescription: "Brewed drop by drop using traditional metal filters over thick, rich condensed milk. Poured over crystal ice for a robust, chocolatey, and deeply energizing coffee experience.",
    price: "$5.50",
    priceNumber: 5.5,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Traditional Roast"],
    tasteNotes: ["Intense Dark Roast", "Sweet Cream", "Nutty Finish"],
    origin: "Coorg Estate Single-Origin, India",
    featured: true,
    signature: true,
  },
  {
    id: "honey-kumquat-iced-tea",
    name: "Honey Ginger Cardamom Jasmine Green Tea",
    category: "mocktails",
    description: "Fresh crushed ginger, cardamom infusion, raw mountain honey, organic jasmine green tea with citrus splash.",
    detailedDescription: "Ultra-refreshing citrus and spice infused green tea shaken with fresh ginger juice, fragrant cardamom, and pure raw mountain honey. The perfect cooler paired with hot crispy baguettes.",
    price: "$6.00",
    priceNumber: 6.0,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegan", "Gluten-Free"],
    tasteNotes: ["Zesty Ginger & Cardamom", "Floral Jasmine", "Wild Honey"],
    featured: false,
  },

  // SIDES & DESSERTS
  {
    id: "caramel-espresso-flan",
    name: "Filter Coffee Caramel Custard Flan",
    category: "desserts",
    description: "Silky steamed egg custard bathed in bittersweet jaggery caramel and dark filter coffee espresso reduction.",
    detailedDescription: "Velvety smooth steamed custard topped with bittersweet caramelized reduction and splashed with a touch of cold-dripped Chikmagalur espresso.",
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
    description: "Airy shattered baguette, house artisan liver pate, savory roasted pork, spiced deli cuts, pickled radish, cucumber, cilantro & green chili.",
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
    chefNote: "We bake our baguettes every 2 hours using natural dough fermentation to guarantee an unmistakable glass-like shatter when bitten.",
    pairing: "South Indian Filter Roast with Sea Salt Cream"
  },
  {
    id: "sig-tandoor-chicken",
    name: "Smoky Charcoal Spiced BBQ Chicken",
    subtitle: "Charcoal Seared Masterpiece",
    description: "Charcoal grilled chicken thighs marinated in wild honey and crushed spices, served with scallion oil and crispy shallots.",
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
    pairing: "Classic Cold Drip Iced Filter Coffee"
  },
  {
    id: "sig-royal-paneer",
    name: "Royal Charred Paneer & Herb",
    subtitle: "100% Vegetarian Craft",
    description: "Charcoal-seared malai paneer cubes, roasted capsicum, garlic aioli, sweet pickled radish, crunchy shallots & mint cilantro glaze.",
    price: "$9.00",
    priceNumber: 9.0,
    prepTime: "5 min",
    image: "https://banhmivietnam.xyz/img/Fillings%202.png",
    tags: ["Charcoal Grilled", "Fresh Malai Paneer", "Mint Herb Glaze"],
    flavorProfile: {
      sweetness: 50,
      intensity: 85,
      richness: 85,
      acidity: 70,
    },
    chefNote: "Our fresh cottage cheese is char-grilled over hot coals to create a delicate smoky exterior with a meltingly soft center.",
    pairing: "Honey Ginger Cardamom Jasmine Green Tea"
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
    stat: "<25min",
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
      name: "Rohan Sharma",
      phone: "+91 98450 88310",
      email: "rohan.sharma@tech.in",
      address: "Tower B, 4th Floor, Indiranagar, Bengaluru 560038",
      unitOrApt: "Flat 402, Green Glen",
      deliveryInstructions: "Please include extra napkins and mint dip!",
    },
    items: [
      {
        id: "item-1",
        menuItem: MENU_ITEMS[0], // House Special
        quantity: 2,
        selectedOptions: {
          temperature: "Toasted Extra Crispy",
          sweetness: "Spicy (Fresh Green Chili)",
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
      name: "Ananya Iyer",
      phone: "+91 98200 54921",
      email: "ananya.iyer@design.in",
    },
    items: [
      {
        id: "item-3",
        menuItem: MENU_ITEMS[2], // Royal Paneer
        quantity: 1,
        itemTotal: 9.0,
      },
      {
        id: "item-4",
        menuItem: MENU_ITEMS[6], // Classic Milk Coffee
        quantity: 1,
        itemTotal: 5.5,
      }
    ],
    subtotal: 14.50,
    deliveryFee: 0.00,
    tax: 1.28,
    tip: 3.00,
    total: 18.78,
    estimatedTime: "10-15 min",
    paymentMethod: "Online (UPI / Razorpay)",
  },
  {
    id: "ZF-8810-RT",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: "ready",
    deliveryMethod: "delivery",
    customer: {
      name: "Vikram Malhotra",
      phone: "+91 98110 51920",
      email: "vikram.m@gmail.com",
      address: "Bandra West, Mumbai 400050",
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
    title: "Single-Origin Filter Roast",
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    aspect: "tall",
    caption: "Chikmagalur roast extracted drop by drop over sweet cream."
  },
  {
    id: "gal-3",
    title: "Culinary Cloud Studio",
    category: "Kitchen",
    image: "https://banhmivietnam.xyz/img/Street%20image%201.png",
    aspect: "square",
    caption: "Our high-tech cloud kitchen designed for speed and temperature retention."
  },
  {
    id: "gal-4",
    title: "Smoky Charcoal Skewers",
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
    caption: "Whipped sea salt cream floating over bittersweet single-origin espresso."
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
    quote: "The crust shatters like glass and the house spiced pate is rich, complex, and unforgettable. Zoffers sets a new benchmark for cloud kitchen gastronomy in India.",
    author: "Chef Sanjeev Kapur",
    role: "Culinary Critic",
    publication: "The Indian Gastronomy Journal",
    rating: 5,
  },
  {
    id: "test-2",
    quote: "Their Sea Salt Cream Iced Coffee and Smoky Spiced Baguette delivered in under 25 minutes are easily the best lunch in Bengaluru right now.",
    author: "Pooja Dhingra",
    role: "Food Columnist",
    publication: "Food & Beverage India",
    rating: 5,
  },
  {
    id: "test-3",
    quote: "A masterclass in cloud kitchen delivery execution. The packaging keeps the baguette piping hot and crunchy rather than soggy. Absolute perfection.",
    author: "Chef Vikramjit",
    role: "Gastronomy Director",
    publication: "Culinary India Review",
    rating: 5,
  }
];
