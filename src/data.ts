import { Product, Review } from './types';

export const HERO_IMAGE = '/src/assets/images/hero_workspace_scene_1779713233196.png';

export const PRODUCTS: Product[] = [
  {
    id: 'kb-01',
    name: 'Luminary Mechanical Keyboard',
    description: 'A silver-anodized tenkeyless mechanical board with deep custom acoustic dampening and tactile amber backlighting.',
    longDescription: 'Engineered for typography and development purists. Featuring a CNC-milled 6063 aluminum chassis sandblasted to a satin finish, the Luminary keyboard features hot-swappable MX linear switches pre-lubricated with Krytox 205g0. Internally, a multi-layer poron and silicone dampening system filters out harsh frequencies to produce a deep, rounded typing acoustics (the classic premium "thock").',
    price: 189,
    category: 'Keyboards',
    image: '/src/assets/images/product_keyboard_1779713252980.png',
    rating: 4.9,
    reviewCount: 42,
    features: [
      'CNC-milled 6063 aluminum chassis',
      'Hot-swappable tactile linear switches (pre-lubed)',
      'Subtle amber LED backlighting with 5 brightness profiles',
      'Integrated sound-absorbing silicone sheet and plate foam',
      'Detachable braided USB-C paracord cable included',
      'N-Key rollover and full QMK/VIA customization'
    ],
    specs: {
      'Layout': 'TKL Layout (80%)',
      'Case Material': 'Satin Anodized Aluminum',
      'Switch Type': 'Aether Linear Switches (45g actuator)',
      'Connectivity': 'USB-C detachable',
      'Weight': '1.6 kg (3.5 lbs)',
      'Dimensions': '355 x 135 x 38 mm',
      'Compatibility': 'macOS / Windows / Linux'
    },
    colors: [
      { name: 'Satin Silver', hex: '#E5E7EB' },
      { name: 'Cosmic Charcoal', hex: '#374151' }
    ],
    stock: 12
  },
  {
    id: 'hp-02',
    name: 'Sarien Studio ANC Headphones',
    description: 'Precision-engineered active noise-canceling headphones with sandblasted silver arms and soft natural leather.',
    longDescription: 'An acoustic masterpiece for focused creators. The Sarien headphones integrate ultra-rich 40mm custom bio-cellulose diaphragm drivers to deliver high-resolution spatial audio. Our industry-leading Active Noise Cancellation system is driven by six hybrid microphones to completely mute external ambient sound, letting you dive into deep work sessions.',
    price: 299,
    category: 'Audio',
    image: '/src/assets/images/product_headphones_1779713272681.png',
    rating: 4.8,
    reviewCount: 31,
    features: [
      'High-resolution bio-cellulose drivers',
      'Hybrid active noise reduction up to 40dB',
      'Sumptuous beige natural leather headband and memory foam cups',
      'Full gesture controls built into sandblasted aluminum ear cups',
      'Up to 45 hours of battery life with ANC on',
      'Fast-charging USB-C (10 mins equals 4 hours of playback)'
    ],
    specs: {
      'Driver Size': '40mm custom dynamic',
      'Frequency Response': '10Hz - 40,000Hz',
      'Noise Reduction': 'Active Hybrid ANC',
      'Bluetooth Version': 'Bluetooth 5.3 with aptX Adaptive',
      'Battery Capacity': '800mAh (45 hrs life)',
      'Charging Time': '1.5 hours',
      'Weight': '265g (9.3 oz)'
    },
    colors: [
      { name: 'Alabaster Silver', hex: '#F3F4F6' },
      { name: 'Sable Black', hex: '#111827' }
    ],
    stock: 7
  },
  {
    id: 'dp-03',
    name: 'Merino Wool Felt Desk Pad',
    description: 'A luxurious dark charcoal desk blotter crafted from sustainable non-zip merino felt with anti-fray edging.',
    longDescription: 'Design for your desk surface. Crafted carefully from double-layered, high-density 100% merino wool felt, this desk pad offers a warm, textured tactility. Designed to protect your desk surface, it dampens keyboard echo, smooths out mouse movement, and anchors your workflow visually in modern workspace aesthetics.',
    price: 49,
    category: 'Accessories',
    image: '/src/assets/images/product_desk_pad_1779713290320.png',
    rating: 4.7,
    reviewCount: 88,
    features: [
      '100% premium sustainable Merino wool felt',
      'Precision stitched non-fray borders for long longevity',
      'Natural water-resistant and self-cleaning fiber characteristics',
      'Eco-friendly natural rubber grip backing keeps pad perfectly in place',
      'Extremely smooth glide path optimized for high-performance laser mice'
    ],
    specs: {
      'Material': '85% Merino Wool Felt, 15% Cork base layer',
      'Thickness': '4.5 mm',
      'Size Options': 'Medium (800 x 300 mm)',
      'Heat Resistance': 'Up to 110°C (230°F)',
      'Care Instructions': 'Spot clean with lukewarm water, air dry',
      'Texture': 'Medium plush velvet surface'
    },
    colors: [
      { name: 'Charcoal Dust', hex: '#1F2937' },
      { name: 'Heather Gray', hex: '#9CA3AF' }
    ],
    stock: 25
  },
  {
    id: 'la-04',
    name: 'Architectural LED Task Light',
    description: 'Slender matte black balancing task light providing uniform desktop diffusion and touch-sensitive ambient warm glow.',
    longDescription: 'Industrial sculpture meets premium workspace illumination. This slender matte black desk lamp rotates on solid brass dual-axis pivots, counterbalanced for featherweight adjustments. Utilizing an advanced, flicker-free side-lit LED matrix, it illuminates your work area with highly accurate color indices (95+ CRI) to maximize visual comfort and reduce ocular strain.',
    price: 139,
    category: 'Lighting',
    image: '/src/assets/images/product_task_light_1779713310575.png',
    rating: 4.6,
    reviewCount: 19,
    features: [
      'Fully counterbalanced architecture with solid brass joints',
      'Flicker-free warm-to-cool LED panel (2700K - 6500K)',
      'Fluid slider touch control on the arm for brightness level',
      '95+ Color Rendering Index (CRI) replicates natural sunlight',
      'Architectural space-saving desk clamping or heavy iron base'
    ],
    specs: {
      'Luminous Flux': 'Up to 850 lumens',
      'LED Lifespan': '50,000 hours',
      'Color Temperature': 'Continuous adjustable (2700K - 5500K)',
      'Power Consumption': '12W Max',
      'Max Height Extension': '780 mm',
      'Base Weight': '2.1 kg solid iron base'
    },
    colors: [
      { name: 'Nordic Dark Matte', hex: '#111827' },
      { name: 'Sanded Aluminum', hex: '#9CA3AF' }
    ],
    stock: 5
  }
];

export const MOCK_REVIEWS: Record<string, Review[]> = {
  'kb-01': [
    { id: 'r1', userName: 'Ethan V.', rating: 5, comment: 'Hands down the best typing experience I have had in a decade. The custom lubing gives it an incredibly smooth travel, and the sound is beautifully deep and subtle. Feels incredibly heavy and sturdy.', date: 'May 12, 2026' },
    { id: 'r2', userName: 'Sophia M.', rating: 5, comment: 'Stunning industrial design. The warm amber lighting is much more professional and cozy than standard rainbow RGB. Fits my minimalist desk setup perfectly!', date: 'April 28, 2026' },
    { id: 'r3', userName: 'Liam K.', rating: 4, comment: 'Typing acoustical profile is absolute heaven. Docked one star just because standard USB routing doesn\'t support coiled cables easily due to the deep inset port. Still highly recommend details.', date: 'March 15, 2026' }
  ],
  'hp-02': [
    { id: 'r4', userName: 'Marcus T.', rating: 5, comment: 'The spatial soundscape is extremely clear and authentic. The leather has a beautiful buttery feel to it. Noise cancellation makes my office dead silent.', date: 'May 19, 2026' },
    { id: 'r5', userName: 'Anna L.', rating: 4, comment: 'Extremely cozy around the ears during long 8-hour editing sessions. The gestures are responsive, though occasionally I touch it by accident when adjusting.', date: 'May 02, 2026' }
  ],
  'dp-03': [
    { id: 'r6', userName: 'Julian P.', rating: 5, comment: 'Really grounds my wooden desk visually. My mouse glides with the perfect level of passive feedback. Heavy enough that it lies fully flat on day one without curled corners.', date: 'May 20, 2026' },
    { id: 'r7', userName: 'Chloe F.', rating: 4, comment: 'Beautiful texture. It is actual merino wool, so it feels exceptionally soft, but you do have to be cautious with coffee spills! It has great moisture-wicking properties, but still is felt.', date: 'May 10, 2026' }
  ],
  'la-04': [
    { id: 'r8', userName: 'David S.', rating: 5, comment: 'Exceptional build. The counterbalanced pivot arms move with an amazing hydraulic-like fluidity. The warm light calibration makes long malamutes of coding so much easier on the eyes.', date: 'May 24, 2026' },
    { id: 'r9', userName: 'Emma G.', rating: 4, comment: 'Perfect desk lighting. Sleek design, does not clutter my narrow desk space. The light dispersion is uniform without any hot spots.', date: 'April 30, 2026' }
  ]
};
