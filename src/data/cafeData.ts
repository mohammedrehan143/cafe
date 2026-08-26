import { MenuItem, SignatureDish, Testimonial, GalleryItem, Order } from '@/types/cafe';

export const CAFE_INFO = {
  name: "Zafiroo",
  shortName: "Zafiroo Kitchen",
  tagline: "Gourmet Artisan Cafe, Specialty Brews & Cloud Kitchen",
  phonetic: "Gourmet Cafe & Kitchen • India",
  editorialHeadline: "Handcrafted specialty coffees, thick creamy milkshakes, loaded crispy fries, artisan sandwiches, stone-baked pizzas & molten lava desserts delivered fresh.",
  address: "Zafiroo Culinary Studio, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038, India",
  googleMapsUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru+India",
  phone: "+91 98860 12345",
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919886012345",
  email: "orders@zafiroo.com",
  instagram: "@zafiroo.kitchen",
  deliveryRadius: "Superfast Delivery across Bengaluru, Mumbai & Delhi NCR",
  avgDeliveryTime: "20–30 Mins",
  avgPickupTime: "10–15 Mins",
  minimumOrder: "₹149",
  deliveryFee: 40,
  freeDeliveryThreshold: 299,
  hours: {
    weekday: "8:00 AM – 11:30 PM",
    weekend: "8:00 AM – 12:00 AM",
    kitchenClose: "Live kitchen active now",
  },
  roastingStats: {
    currentBatch: "Batch #204 — Single-Origin Chikmagalur Arabica",
    roastTemp: "218°C",
    elevation: "1,400m Western Ghats Harvest",
    scaScore: "89.0 Specialty Grade",
  }
};

export const MENU_ITEMS: MenuItem[] = [
  // 1. Classic Hot Coffee
  {
    id: "classic-hot-coffee",
    name: "Classic Hot Coffee",
    category: "coffee",
    description: "Freshly pulled rich espresso combined with silky steamed microfoam and delicate latte art.",
    detailedDescription: "Brewed from our single-origin 100% Arabica beans roasted in-house. Pulled with precision into double espresso, blended with velvety micro-textured whole milk, creating a comforting, buttery cup with dark chocolate and hazelnut notes.",
    price: "₹149",
    priceNumber: 149,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Specialty Brew"],
    tasteNotes: ["Velvety Microfoam", "Dark Cacao", "Roasted Hazelnut"],
    origin: "Single-Origin Chikmagalur",
    featured: true,
    signature: false,
    pairing: "Brownie Chocolate Lava",
    customizationOptions: {
      temperature: ["Piping Hot (Recommended)", "Extra Hot", "Warm (Kid-Friendly)"],
      sweetness: ["No Sugar", "Regular Sweetness", "Extra Sweet (Brown Sugar)"],
      portion: ["Regular Cup (250ml)", "Large Mug (350ml) (+₹40)"],
    }
  },

  // 2. Zafiroo Signature Coffee
  {
    id: "zafiroo-signature-coffee",
    name: "Zafiroo Signature Coffee",
    category: "coffee",
    description: "Zafiroo's exclusive house blend brewed with aromatic beans, secret caramel-hazelnut syrup, and a velvety whipped cream crown.",
    detailedDescription: "The crown jewel of Zafiroo. A rich triple-ristretto base steeped with hand-crafted salted butter caramel and toasted hazelnuts, finished with a luscious sea salt cream froth and a dusting of Belgian cocoa.",
    price: "₹220",
    priceNumber: 220,
    prepTime: "4 min",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Chef Signature", "House Special"],
    tasteNotes: ["Salted Caramel", "Whipped Cream Crown", "Dark Mocha Depth"],
    origin: "Zafiroo Secret Recipe",
    featured: true,
    signature: true,
    pairing: "Cheesy Fries & Veg Sandwich",
    customizationOptions: {
      temperature: ["Hot Latte Style", "Iced Cold Cloud (Recommended)"],
      sweetness: ["Zafiroo Balanced Sweetness", "Less Sweet (70%)", "Extra Sweet"],
      portion: ["Standard Glass", "Grande Jar (+₹50)"],
    }
  },

  // 3. Classic Cold Coffee
  {
    id: "classic-cold-coffee",
    name: "Classic Cold Coffee",
    category: "coffee",
    description: "Bold slow-steeped dark roast espresso blended with chilled milk and ice, topped with a frothy coffee crest.",
    detailedDescription: "The timeless summer and study companion. Strong dark espresso pulled fresh over chilled whole milk and blended with ice into a thick, frothy, energizing coffee shake.",
    price: "₹169",
    priceNumber: 169,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Chilled Favorite"],
    tasteNotes: ["Crisp Espresso Kick", "Thick Froth", "Creamy Finish"],
    origin: "Estate Arabica Blend",
    featured: true,
    signature: false,
    pairing: "Classic French Fries",
    customizationOptions: {
      temperature: ["Chilled with Ice", "Extra Chilled (Crushed Ice)"],
      sweetness: ["Regular Sweet", "Low Sugar", "No Sugar"],
    }
  },

  // 4. Chocolate Cold Coffee
  {
    id: "chocolate-cold-coffee",
    name: "Chocolate Cold Coffee",
    category: "coffee",
    description: "Decadent Dutch cocoa syrup swirled into thick iced espresso and whole milk, drizzled with dark chocolate ganache.",
    detailedDescription: "A luscious marriage of intense cold drip espresso and rich Dutch cocoa ganache. Swirled over creamy milk and crushed ice, topped with chocolate drizzle.",
    price: "₹199",
    priceNumber: 199,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Chocoholic Choice"],
    tasteNotes: ["Dutch Dark Cocoa", "Espresso Fusion", "Silky Ganache Drizzle"],
    origin: "Zafiroo Beverage Bar",
    featured: false,
    signature: false,
    pairing: "Pastries & Cupcakes",
    customizationOptions: {
      sweetness: ["Standard Sweet", "Extra Chocolatey", "Mild Sweet"],
      portion: ["Standard (350ml)", "Monster Mug (450ml) (+₹50)"],
    }
  },

  // 5. Zafiroo Royal Cold Coffee
  {
    id: "zafiroo-royal-cold-coffee",
    name: "Zafiroo Royal Cold Coffee",
    category: "coffee",
    description: "The ultimate cold indulgence — double shot espresso, Belgian chocolate flakes, creamy vanilla bean gelato, and caramelized almond crunch.",
    detailedDescription: "An opulent dessert-in-a-glass. Double-extracted specialty espresso blended with creamy Madagascar vanilla gelato, poured over Belgian chocolate chips, and crowned with whipped cream, almond brittle, and dark chocolate shavings.",
    price: "₹249",
    priceNumber: 249,
    prepTime: "4 min",
    image: "https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Royal Signature", "House Special"],
    tasteNotes: ["Gelato Creaminess", "Belgian Chocolate Curls", "Almond Brittle"],
    origin: "Zafiroo Royal Reserve",
    featured: true,
    signature: true,
    pairing: "Pizzas & Peri Peri Fries",
    customizationOptions: {
      portion: ["Royal Goblet (400ml)", "Mega Royal (550ml) (+₹60)"],
      sweetness: ["Royal Sweetness", "Moderate Sweetness"],
    }
  },

  // 6. Vanilla Milkshake
  {
    id: "vanilla-milkshake",
    name: "Vanilla Milkshake",
    category: "shakes",
    description: "Ultra-thick and creamy shake churned with premium Madagascar vanilla beans, fresh whole cream, and topped with whipped peaks.",
    detailedDescription: "Pure classic elegance. High-grade Madagascar bourbon vanilla bean extract blended with slow-churned whole cream ice cream and farm-fresh milk into a super dense, velvety shake.",
    price: "₹179",
    priceNumber: 179,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Creamy Classic"],
    tasteNotes: ["Madagascar Vanilla", "Thick Cream Texture", "Whipped Frosting"],
    origin: "Zafiroo Creamery",
    featured: false,
    signature: false,
    pairing: "Peri Peri French Fries",
    customizationOptions: {
      sweetness: ["Regular Sweet", "Extra Creamy"],
      portion: ["Standard (350ml)", "Jumbo (500ml) (+₹50)"],
    }
  },

  // 7. Chocolate Milkshake
  {
    id: "chocolate-milkshake",
    name: "Chocolate Milkshake",
    category: "shakes",
    description: "Rich Belgian dark chocolate blended to creamy perfection, layered with chocolate fudge and chocolate vermicelli.",
    detailedDescription: "Dense, spoon-thick shake made with double dark chocolate ice cream, melted Belgian couverture, and chilled milk. Garnished with rich chocolate fudge sauce and crunchy chocolate curls.",
    price: "₹199",
    priceNumber: 199,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Rich Chocolate"],
    tasteNotes: ["Belgian Couverture", "Fudge Ribbon", "Malted Cocoa"],
    origin: "Zafiroo Creamery",
    featured: true,
    signature: false,
    pairing: "Cheesy Fries",
    customizationOptions: {
      sweetness: ["Standard Sweet", "Dark & Intense", "Extra Sweet"],
      portion: ["Standard (350ml)", "Jumbo (500ml) (+₹50)"],
    }
  },

  // 8. KitKat Shake
  {
    id: "kitkat-shake",
    name: "KitKat Shake",
    category: "shakes",
    description: "Crispy crushed KitKat wafer bars blended into thick chocolate malt shake, garnished with whole KitKat fingers and fudge.",
    detailedDescription: "A crunch in every sip! Crisp KitKat chocolate wafers crushed and folded into our signature chocolate malt shake, topped with whipped cream, chocolate syrup swirl, and whole crispy KitKat bars.",
    price: "₹229",
    priceNumber: 229,
    prepTime: "4 min",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Bestseller", "Crunchy Delight"],
    tasteNotes: ["Wafer Crunch", "Milk Chocolate Malt", "Whipped Topping"],
    origin: "Zafiroo Signature Shakes",
    featured: true,
    signature: true,
    pairing: "Egg Sandwich & Peri Peri Fries",
    customizationOptions: {
      portion: ["Standard (380ml)", "Monster Shake with Extra KitKat (+₹60)"],
      sweetness: ["Regular Sweet", "Extra Chocolate"],
    }
  },

  // 9. Classic French Fries
  {
    id: "classic-french-fries",
    name: "Classic French Fries",
    category: "fries",
    description: "Golden, skin-on potatoes triple-fried to crispy perfection, dusted with flaky sea salt and served with house mayo dip.",
    detailedDescription: "Hand-cut premium russet potatoes soaked, blanched, and triple-cooked to achieve a glass-like golden exterior and a fluffy, steaming potato interior. Tossed in mineral sea salt.",
    price: "₹129",
    priceNumber: 129,
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop",
    dietary: ["100% Vegan", "Gluten-Free"],
    tasteNotes: ["Crispy Glass Crunch", "Fluffy Potato Heart", "Flaky Sea Salt"],
    origin: "Zafiroo Fryer Station",
    featured: true,
    signature: false,
    pairing: "Classic Cold Coffee",
    customizationOptions: {
      portion: ["Regular Basket", "Large Bucket (+₹40)"],
    }
  },

  // 10. Peri Peri French Fries
  {
    id: "peri-peri-french-fries",
    name: "Peri Peri French Fries",
    category: "fries",
    description: "Extra crunchy fries tossed vigorously in our spicy, tangy African bird's eye chili Peri Peri seasoning blend.",
    detailedDescription: "Golden crispy fries tossed fresh out of the fryer with our proprietary spice mix: crushed bird's eye chilies, smoked paprika, garlic powder, onion herbs, and zesty lemon zest.",
    price: "₹149",
    priceNumber: 149,
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Spicy Favorite", "Vegan"],
    tasteNotes: ["Smoky Tangy Heat", "Zesty Lemon Paprika", "Crunchy Salt"],
    origin: "Zafiroo Fryer Station",
    featured: true,
    signature: false,
    pairing: "Vanilla Milkshake or Cold Drinks",
    customizationOptions: {
      sweetness: ["Medium Spicy", "Extra Hot Peri Peri", "Mild Tangy"],
      portion: ["Regular Basket", "Large Bucket (+₹40)"],
    }
  },

  // 11. Cheesy Fries
  {
    id: "cheesy-fries",
    name: "Cheesy Fries",
    category: "fries",
    description: "Crispy golden fries smothered in warm molten cheddar cheese sauce, melted mozzarella, and finished with herbs.",
    detailedDescription: "Crisp golden fries loaded under a double blanket of velvety warm cheddar cheese sauce and shredded mozzarella, flashed in the salamander oven for a gooey pull, garnished with chili flakes and oregano.",
    price: "₹199",
    priceNumber: 199,
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Loaded Indulgence"],
    tasteNotes: ["Molten Cheddar Sauce", "Gooey Mozzarella Pull", "Herbed Seasoning"],
    origin: "Zafiroo Melt Station",
    featured: true,
    signature: true,
    pairing: "Zafiroo Signature Coffee",
    customizationOptions: {
      portion: ["Regular Loaded Plate", "Mega Cheese Overload (+₹60)"],
      sweetness: ["Add Pickled Jalapenos", "Extra Cheese Dip on Side (+₹30)", "Classic (No Jalapeno)"],
    }
  },

  // 12. Veg Sandwich
  {
    id: "veg-sandwich",
    name: "Veg Sandwich",
    category: "sandwiches",
    description: "Freshly toasted artisan bread stuffed with crunchy cucumber, ripe tomatoes, bell peppers, melted cheddar, and zesty mint pesto.",
    detailedDescription: "Crafted on thick-cut golden herbed brioche bread. Layered with fresh English cucumbers, vine-ripened tomatoes, roasted bell peppers, sliced cheddar cheese, and a punchy house mint-coriander aioli.",
    price: "₹179",
    priceNumber: 179,
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Fresh & Crunchy"],
    tasteNotes: ["Zesty Herb Pesto", "Melted Cheddar", "Crispy Toasted Brioche"],
    origin: "Zafiroo Sandwich Grill",
    featured: true,
    signature: false,
    pairing: "Classic Cold Coffee",
    customizationOptions: {
      temperature: ["Toasted Extra Crispy (Recommended)", "Soft Grilled"],
      sweetness: ["Spicy Green Chilis Added", "Mild Pesto", "No Chilis"],
      portion: ["Single Sandwich (2 Halves)", "Double Sandwich (+₹90)"],
    }
  },

  // 13. Egg Sandwich
  {
    id: "egg-sandwich",
    name: "Egg Sandwich",
    category: "sandwiches",
    description: "Fluffy seasoned scrambled eggs, caramelized onions, melted cheese, and garlic aioli layered inside golden grilled brioche toast.",
    detailedDescription: "Silky soft scrambled farm-fresh eggs folded with melted sharp cheddar, sweet balsamic caramelized onions, and house garlic pepper aioli inside butter-toasted artisan brioche.",
    price: "₹199",
    priceNumber: 199,
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop",
    dietary: ["High Protein", "Egg Specialty"],
    tasteNotes: ["Silky Scrambled Eggs", "Caramelized Sweet Onions", "Garlic Butter Aioli"],
    origin: "Zafiroo Sandwich Grill",
    featured: true,
    signature: true,
    pairing: "Classic Hot Coffee or KitKat Shake",
    customizationOptions: {
      temperature: ["Toasted Golden Crispy", "Warm Brioche"],
      portion: ["Standard", "Double Egg & Extra Cheese (+₹50)"],
    }
  },

  // 14. Brownie Chocolate Lava
  {
    id: "brownie-chocolate-lava",
    name: "Brownie Chocolate Lava",
    category: "desserts",
    description: "Warm fudgy chocolate brownie with a molten dark chocolate center that oozes with every bite, served with vanilla cream.",
    detailedDescription: "Baked fresh in small batches using 70% dark Belgian cocoa. A delicate crust gives way to an intensely warm, molten chocolate lava core that cascades smoothly when spooned.",
    price: "₹229",
    priceNumber: 229,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Molten Heaven"],
    tasteNotes: ["70% Belgian Dark Cocoa", "Warm Oozing Center", "Fudgy Texture"],
    origin: "Zafiroo Bakery",
    featured: true,
    signature: true,
    pairing: "Classic Hot Coffee",
    customizationOptions: {
      temperature: ["Served Warm & Molten (Recommended)", "Room Temp"],
      portion: ["Single Molten Cake", "With Scoop of Vanilla Gelato (+₹50)"],
    }
  },

  // 15. Cupcakes
  {
    id: "cupcakes",
    name: "Cupcakes",
    category: "desserts",
    description: "Soft and airy gourmet cupcakes swirled with velvety buttercream frosting, colorful sprinkles, and rich chocolate fillings.",
    detailedDescription: "Fluffy, melt-in-mouth sponge cupcakes freshly piped with whipped Madagascar vanilla and chocolate buttercream rosettes, finished with artisanal sprinkles and chocolate chips.",
    price: "₹119",
    priceNumber: 119,
    prepTime: "2 min",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Sweet Treat"],
    tasteNotes: ["Airy Sponge Cake", "Silky Buttercream Frosting", "Chocolate Shavings"],
    origin: "Zafiroo Bakery",
    featured: false,
    signature: false,
    pairing: "Classic Cold Coffee",
    customizationOptions: {
      portion: ["Single Cupcake", "Box of 2 (+₹100)", "Party Box of 4 (+₹200)"],
    }
  },

  // 16. Pizzas
  {
    id: "pizzas",
    name: "Zafiroo Artisan Pizzas",
    category: "pizza",
    description: "Hand-stretched crispy thin crust baked in stone oven, rich San Marzano tomato sauce, bubbly melted mozzarella, and fresh basil.",
    detailedDescription: "Fermented for 48 hours to create a blistered, airy, crunchy crust. Smothered in tangy Italian plum tomato sauce, loaded with fresh Fior di Latte mozzarella, herbs, and cold-pressed extra virgin olive oil.",
    price: "₹299",
    priceNumber: 299,
    prepTime: "7 min",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Stone-Baked"],
    tasteNotes: ["Crispy Blistered Crust", "Bubbly Mozzarella", "Fresh Basil & Oregano"],
    origin: "Zafiroo Stone Oven",
    featured: true,
    signature: true,
    pairing: "Peri Peri French Fries & Cold Drinks",
    customizationOptions: {
      flavor: ["Classic Margherita (Tomato & Basil)", "Farmhouse Veggie Supreme", "Spicy Paneer Tikka"],
      portion: ["Medium 8-inch", "Large 11-inch (+₹120)"],
    }
  },

  // 17. Pastries
  {
    id: "pastries",
    name: "Artisan Pastries",
    category: "desserts",
    description: "Flaky French-style butter croissants, Danish pastries, and chocolate eclairs baked golden and crisp each morning.",
    detailedDescription: "Laminated with pure cultured French butter to achieve 81 delicate, crisp flaky layers. Golden on the outside, light and honeycomb on the inside, filled with dark chocolate or sweet cream.",
    price: "₹149",
    priceNumber: 149,
    prepTime: "2 min",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegetarian", "Flaky Crisp"],
    tasteNotes: ["Cultured French Butter", "Flaky Golden Layers", "Dark Chocolate Filling"],
    origin: "Zafiroo Bakery",
    featured: false,
    signature: false,
    pairing: "Classic Hot Coffee",
    customizationOptions: {
      flavor: ["Pain au Chocolat (Chocolate Croissant)", "Butter Croissant", "Berry Glazed Danish"],
      temperature: ["Warm & Flaky", "Standard"],
    }
  },

  // 18. Cold Drinks
  {
    id: "cold-drinks",
    name: "Cold Drinks & Refreshers",
    category: "drinks",
    description: "Chilled fizzy sodas, iced lemonades, and sparkling fruit refreshers served over cracked ice with fresh lime.",
    detailedDescription: "Refreshing ice-cold beverages to quench your thirst. Choice of classic sparkling cola, sparkling lime cooler, and iced berry fizz garnished with fresh mint sprigs and lime slices.",
    price: "₹99",
    priceNumber: 99,
    prepTime: "2 min",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop",
    dietary: ["Vegan", "Sparkling Refreshment"],
    tasteNotes: ["Iced Fizzy Burst", "Fresh Lime Twist", "Crisp Mint Cool"],
    origin: "Zafiroo Cooler Bar",
    featured: false,
    signature: false,
    pairing: "Cheesy Fries & Pizzas",
    customizationOptions: {
      flavor: ["Classic Sparkling Cola", "Zesty Iced Lemonade", "Berry Sparkling Cooler"],
      temperature: ["Chilled with Ice", "No Ice (Extra Drink)"],
    }
  }
];

export const SIGNATURE_DISHES: SignatureDish[] = [
  {
    id: "sig-zafiroo-coffee",
    name: "Zafiroo Signature Coffee",
    subtitle: "The Masterpiece Roast",
    description: "Single-origin Chikmagalur espresso infused with house salted caramel and topped with thick sea salt velvet cream.",
    price: "₹220",
    priceNumber: 220,
    prepTime: "4 min",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    tags: ["Salted Caramel", "Whipped Cream Crown", "House Blend"],
    flavorProfile: {
      sweetness: 65,
      intensity: 90,
      richness: 95,
      acidity: 40,
    },
    chefNote: "We pull our espresso at an optimal 9 bars of pressure to preserve maximum crema, finished with whipped sea salt cream that balances the bittersweet roast.",
    pairing: "Brownie Chocolate Lava"
  },
  {
    id: "sig-cheesy-fries",
    name: "Cheesy Fries Overload",
    subtitle: "Triple-Fried Crisp Perfection",
    description: "Hand-cut crispy fries smothered under hot molten cheddar sauce, melted mozzarella, and herbed seasonings.",
    price: "₹199",
    priceNumber: 199,
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1200&auto=format&fit=crop",
    tags: ["Molten Cheddar", "Triple Cooked", "Crisp Crunch"],
    flavorProfile: {
      sweetness: 20,
      intensity: 85,
      richness: 95,
      acidity: 30,
    },
    chefNote: "Triple-cooking creates an impenetrable crunchy crust that never goes soggy under thick molten cheese.",
    pairing: "KitKat Shake"
  },
  {
    id: "sig-artisan-pizza",
    name: "Zafiroo Artisan Pizzas",
    subtitle: "Stone-Baked 48h Fermented Crust",
    description: "San Marzano plum tomato reduction, gooey melted mozzarella, garden basil, and garlic infused olive oil.",
    price: "₹299",
    priceNumber: 299,
    prepTime: "7 min",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    tags: ["Stone Baked", "Bubbly Mozzarella", "Fresh Herbs"],
    flavorProfile: {
      sweetness: 45,
      intensity: 85,
      richness: 88,
      acidity: 65,
    },
    chefNote: "Baked on volcanic baking stone at 450°C for blistering leopard spots and a cloud-like interior.",
    pairing: "Cold Drinks & Peri Peri Fries"
  }
];

export const BRAND_PILLARS = [
  {
    number: "01",
    title: "100% Specialty Arabica Roasts",
    description: "Sourced from high-altitude estates in the Western Ghats and roasted in small batches for unbeatable coffee aroma.",
    stat: "100%",
    statLabel: "Specialty Grade",
  },
  {
    number: "02",
    title: "Triple-Fried Crispy & Stone-Baked",
    description: "Our fries are triple-cooked for glass-like crunch, and pizzas are stone-baked with 48h fermented sourdough.",
    stat: "48h",
    statLabel: "Slow Dough Ferment",
  },
  {
    number: "03",
    title: "Eco-Thermal Fast Delivery",
    description: "Custom ventilated thermal containers lock in heat and crispness so your food arrives restaurant-hot in under 25 mins.",
    stat: "<25min",
    statLabel: "Average Dispatch",
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Zafiroo Signature Coffee",
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    aspect: "tall",
    caption: "Single-origin roast with whipped sea salt cream and caramel swirl."
  },
  {
    id: "gal-2",
    title: "Molten Brownie Chocolate Lava",
    category: "Food",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop",
    aspect: "square",
    caption: "Warm Belgian chocolate core that flows luxuriously upon breaking."
  },
  {
    id: "gal-3",
    title: "Stone-Baked Artisan Pizza",
    category: "Food",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    aspect: "wide",
    caption: "Fermented crispy crust with blistered bubbles and mozzarella pull."
  },
  {
    id: "gal-4",
    title: "KitKat Crunch Milkshake",
    category: "Coffee",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop",
    aspect: "tall",
    caption: "Thick malted shake packed with wafer crunch and chocolate ganache."
  },
  {
    id: "gal-5",
    title: "Loaded Cheesy French Fries",
    category: "Food",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1200&auto=format&fit=crop",
    aspect: "wide",
    caption: "Triple-cooked golden crunch smothered under melted cheddar cheese."
  },
  {
    id: "gal-6",
    title: "Fresh Cafe Bakery & Roastery",
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
    aspect: "square",
    caption: "Our modern studio kitchen designed for rapid dispatch and maximum flavor."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote: "Zafiroo has completely changed our late-night coffee and dessert game. The Zafiroo Royal Cold Coffee and Molten Lava Brownie arrived piping fresh and hot in 20 minutes!",
    author: "Rohan & Sneha",
    role: "Food Enthusiasts",
    publication: "Bengaluru Cafe Digest",
    rating: 5,
  },
  {
    id: "test-2",
    quote: "The cheesy fries stay extraordinarily crisp even in delivery, and the KitKat Shake is hands down the best thick shake in town. Zafiroo is unmatched.",
    author: "Pooja Dhingra",
    role: "Food Critic & Pastry Chef",
    publication: "Urban Gastronomy India",
    rating: 5,
  },
  {
    id: "test-3",
    quote: "Top-notch specialty coffee, blistered stone-baked pizzas, and lightning-fast packaging. Zafiroo sets the gold standard for cloud kitchen dining.",
    author: "Chef Vikramjit",
    role: "Culinary Director",
    publication: "Modern Food Network",
    rating: 5,
  }
];
