export type MenuBoardType = 'coastal' | 'treats';

export type IngredientId =
  | 'garlic'
  | 'chili'
  | 'lime'
  | 'basil'
  | 'coconut'
  | 'sugar'
  | 'nipa'
  | 'honey'
  | 'strawberry'
  | 'seablite'
  | 'tamarind'
  | 'herbs';

export type DishId =
  | 'cockleSalad'
  | 'shrimpBlite'
  | 'crabRoeDip'
  | 'oysterOmelette'
  | 'steamedMussels'
  | 'steamedMudCrab'
  | 'riverPrawns'
  | 'sourCurryChaOm'
  | 'papayaOyster'
  | 'pickledCrabSomTum'
  | 'blanchedCockles'
  | 'waterMimosa'
  | 'sourCurryBlite'
  | 'oysterSalad'
  | 'nipaGelato'
  | 'honeyFizz'
  | 'crepeCake'
  | 'berryFloat'
  | 'matchaBottle'
  | 'palmTart';

export interface Ingredient {
  id: IngredientId;
  en: string;
  th: string;
}

export interface Dish {
  id: DishId;
  board: MenuBoardType;
  category: string;
  ecoRole: string;
  en: string;
  th: string;
  priceLabel: string;
  shortDesc: string;
  shellsReward: number;
  kpReward: number;
  recipe: [IngredientId, IngredientId];
  prepVerb: string;
  prepVerbTh: string;
  story: {
    local: string;
    mangrove: string;
    shell: string;
  };
  quiz: {
    question: string;
    options: [string, string, string];
    answerIndex: number;
  };
}

export interface SaplingStage {
  id: number;
  atShells: number;
  en: string;
  th: string;
  rewardText: string;
}

export interface WardrobeItem {
  id: 'hat' | 'crab' | 'can' | 'chime' | 'crown';
  en: string;
  th: string;
  kpCost: number;
  desc: string;
}

export const INGREDIENTS: Ingredient[] = [
  { id: 'garlic', en: 'Garlic', th: 'กระเทียม' },
  { id: 'chili', en: 'Bird Chili', th: 'พริกขี้หนู' },
  { id: 'lime', en: 'Coastal Lime', th: 'มะนาว' },
  { id: 'herbs', en: 'Lemongrass', th: 'ตะไคร้สมุนไพร' },
  { id: 'seablite', en: 'Sea Blite', th: 'ใบชะคราม' },
  { id: 'tamarind', en: 'Tamarind', th: 'น้ำมะขาม' },
  { id: 'coconut', en: 'Coconut Milk', th: 'กะทิสด' },
  { id: 'sugar', en: 'Palm Sugar', th: 'น้ำตาลมะพร้าว' },
  { id: 'basil', en: 'Sweet Basil', th: 'โหระพา' },
  { id: 'nipa', en: 'Nipa Palm', th: 'ลูกจาก' },
  { id: 'honey', en: 'Mangrove Honey', th: 'น้ำผึ้งป่าชายเลน' },
  { id: 'strawberry', en: 'Strawberry', th: 'สตรอว์เบอร์รี' },
];

export const DISHES: Dish[] = [
  // === REAL BANG KHUN THIAN RESTAURANT MENUS (Pink Coastal Kitchen) ===
  {
    id: 'cockleSalad',
    board: 'coastal',
    category: 'Shell & Bio-Barrier',
    ecoRole: 'Primary Shell Waste Source',
    en: 'Spicy Cockle Salad',
    th: 'ยำหอยแครง',
    priceLabel: '+1 Shell',
    shortDesc: 'Tangy Bang Khun Thian cockles tossed with lime, chili, and herbs.',
    shellsReward: 1,
    kpReward: 8,
    recipe: ['chili', 'lime'],
    prepVerb: 'Toss Yum',
    prepVerbTh: 'คลุกยำ',
    story: {
      local: 'Fresh mud cockles harvested from Bang Khun Thian’s tidal flats, dressed in zesty chili-lime.',
      mangrove: 'Cockle beds thrive in soft nutrient-rich mud trapped along mangrove channels.',
      shell: 'Discarded hard clam shells provide durable aggregate for wave-breaking biobarriers around saplings.',
    },
    quiz: {
      question: 'Why are discarded cockle shells so valuable for mangrove restoration?',
      options: [
        'They form durable wave-breaking biobarriers',
        'They melt into freshwater',
        'They float away in storms',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'blanchedCockles',
    board: 'coastal',
    category: 'Shell & Bio-Barrier',
    ecoRole: 'Primary Shell Waste Source',
    en: 'Blanched Cockles & Dip',
    th: 'หอยแครงลวกจิ้ม',
    priceLabel: '+1 Shell',
    shortDesc: 'Tender blanched cockles paired with spicy garlic seafood sauce.',
    shellsReward: 1,
    kpReward: 8,
    recipe: ['garlic', 'chili'],
    prepVerb: 'Blanch & Plate',
    prepVerbTh: 'ลวกจิ้ม',
    story: {
      local: 'A signature Bang Khun Thian seafood platter served at waterfront restaurants.',
      mangrove: 'Mangrove roots buffer gentle tides so young cockles stay anchored in mud.',
      shell: 'Collected cockle shells are packed into mesh cages to shield young mangrove seedlings.',
    },
    quiz: {
      question: 'What happens to empty cockle shells collected from local restaurants?',
      options: [
        'They are packed into coastal wave barriers',
        'They are turned into plastic bags',
        'They are buried inland',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'steamedMussels',
    board: 'coastal',
    category: 'Shell & Bio-Barrier',
    ecoRole: 'Bivalve Shell Waste',
    en: 'Steamed Mussels',
    th: 'หอยแมลงภู่นึ่ง',
    priceLabel: '+1 Shell',
    shortDesc: 'Fresh bivalve mussels steamed aromatic with coastal lemongrass & basil.',
    shellsReward: 1,
    kpReward: 8,
    recipe: ['herbs', 'basil'],
    prepVerb: 'Herb Steam',
    prepVerbTh: 'นึ่งสมุนไพร',
    story: {
      local: 'Fresh Bang Khun Thian mussels steamed in clay pots with fragrant lemongrass and basil.',
      mangrove: 'Bivalves naturally filter coastal water, keeping mangrove estuaries clear and healthy.',
      shell: 'Dark bivalve shells offer dense calcium carbonate ideal for biofences on mudflats.',
    },
    quiz: {
      question: 'How do discarded mussel shells help protect mangrove mudflats?',
      options: [
        'Dense calcium carbonate shells reduce wave impact in biofences',
        'They heat up tidal water',
        'They block rainwater',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'oysterOmelette',
    board: 'coastal',
    category: 'Biostructure Anchors',
    ecoRole: 'Biostructure Material',
    en: 'Oyster Omelette',
    th: 'ไข่เจียวหอยนางรม',
    priceLabel: '+1 Shell',
    shortDesc: 'Crispy golden omelette loaded with plump coastal oysters and garlic.',
    shellsReward: 1,
    kpReward: 8,
    recipe: ['garlic', 'herbs'],
    prepVerb: 'Crisp Fry',
    prepVerbTh: 'ทอดไข่เจียว',
    story: {
      local: 'Savory pan-fried omelette filled with local coastal oysters from nearby reefs.',
      mangrove: 'Oyster clusters slow currents and help trap fine sediment along mangrove edges.',
      shell: 'Heavy oyster shells decompose very slowly, anchoring sediment on eroded shorelines.',
    },
    quiz: {
      question: 'Why are oyster shells great structural anchors for eroded shorelines?',
      options: [
        'They dissolve in one day',
        'They are heavy and decompose very slowly',
        'They drift on top of waves',
      ],
      answerIndex: 1,
    },
  },
  {
    id: 'papayaOyster',
    board: 'coastal',
    category: 'Biostructure Anchors',
    ecoRole: 'Biostructure Material',
    en: 'Papaya Salad w/ Oysters',
    th: 'ส้มตำหอยนางรม',
    priceLabel: '+1 Shell',
    shortDesc: 'Crunchy spicy papaya salad topped with sweet fresh oysters.',
    shellsReward: 1,
    kpReward: 8,
    recipe: ['chili', 'tamarind'],
    prepVerb: 'Pound & Mix',
    prepVerbTh: 'ตำส้มตำ',
    story: {
      local: 'A fiery coastal favorite pairing crisp shredded papaya with fresh local oysters.',
      mangrove: 'Healthy coastal mangroves shade estuary reefs where oysters settle and grow.',
      shell: 'Heavy oyster shells saved from the kitchen strengthen shoreline sediment traps.',
    },
    quiz: {
      question: 'What role do heavy oyster shells play along eroding coasts?',
      options: [
        'Anchoring and trapping shoreline sediment',
        'Draining away mudflats',
        'Blocking crab burrows',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'oysterSalad',
    board: 'coastal',
    category: 'Biostructure Anchors',
    ecoRole: 'Biostructure Material',
    en: 'Spicy Oyster Salad',
    th: 'ยำหอยนางรม',
    priceLabel: '+1 Shell',
    shortDesc: 'Chilled oysters with bright lime, chili, and fragrant coastal herbs.',
    shellsReward: 1,
    kpReward: 8,
    recipe: ['lime', 'herbs'],
    prepVerb: 'Zest & Toss',
    prepVerbTh: 'ยำทรงเครื่อง',
    story: {
      local: 'Plump local oysters topped with chili-lime dressing and aromatic herbs.',
      mangrove: 'Estuary tides carry plankton from mangrove leaf litter to nourish coastal oysters.',
      shell: 'Slow-decaying oyster shells become lasting biostructure bases for new saplings.',
    },
    quiz: {
      question: 'What nourishes coastal oysters near mangrove forests?',
      options: [
        'Nutrients from mangrove leaf litter carried by tides',
        'Dry inland dust',
        'Mountain snowmelt',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'crabRoeDip',
    board: 'coastal',
    category: 'Mangrove Fauna',
    ecoRole: 'Mangrove Ecosystem Engineer',
    en: 'Crab Roe Coconut Dip',
    th: 'ปูไข่หลน',
    priceLabel: '+1 Shell',
    shortDesc: 'Velvety coconut-milk dip simmered with rich mud crab roe & herbs.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['coconut', 'herbs'],
    prepVerb: 'Simmer Dip',
    prepVerbTh: 'เคี่ยวหลน',
    story: {
      local: 'A treasured Bang Khun Thian recipe simmering rich mud crab roe in fresh coconut milk.',
      mangrove: 'Mud crabs are essential ecosystem engineers whose burrows aerate soil for young roots.',
      shell: 'Crushed crab shells enrich coastal compost while protecting mudflat habitats.',
    },
    quiz: {
      question: 'How do burrowing mud crabs act as mangrove ecosystem engineers?',
      options: [
        'They aerate the soil for young mangrove roots',
        'They chop down mangrove branches',
        'They dry out the canals',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'steamedMudCrab',
    board: 'coastal',
    category: 'Mangrove Fauna',
    ecoRole: 'Mangrove Ecosystem Engineer',
    en: 'Steamed Mud Crab',
    th: 'ปูทะเลนึ่ง',
    priceLabel: '+1 Shell',
    shortDesc: 'Whole black mud crab steamed sweet with garlic and peppery herbs.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['garlic', 'lime'],
    prepVerb: 'Steam Crab',
    prepVerbTh: 'นึ่งปูทะเล',
    story: {
      local: 'Whole black mud crabs caught responsibly along Bang Khun Thian’s winding estuaries.',
      mangrove: 'Crab tunnels bring oxygen deep into waterlogged mud so mangrove roots breathe.',
      shell: 'Sustainable crab harvests depend directly on thriving, intact mangrove canals.',
    },
    quiz: {
      question: 'Why do mangrove roots benefit from mud crab burrows?',
      options: [
        'Burrows bring oxygen into dense coastal mud',
        'Burrows block high tides completely',
        'Burrows turn mud into sand',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'pickledCrabSomTum',
    board: 'coastal',
    category: 'Mangrove Fauna',
    ecoRole: 'Mangrove Fauna Representative',
    en: 'Pickled Crab Papaya Salad',
    th: 'ส้มตำปูไข่ดอง',
    priceLabel: '+1 Shell',
    shortDesc: 'Bold spicy papaya salad tossed with pickled coastal crab roe.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['chili', 'garlic'],
    prepVerb: 'Pound & Toss',
    prepVerbTh: 'ตำปูไข่ดอง',
    story: {
      local: 'A beloved spicy Bang Khun Thian dish showcasing local blue crab and mud crab roe.',
      mangrove: 'Juvenile crabs shelter among submerged mangrove prop roots during low tide.',
      shell: 'Supporting local crab conservation keeps mangrove soil aerated and alive.',
    },
    quiz: {
      question: 'Where do juvenile coastal crabs hide during low tide?',
      options: [
        'Among submerged mangrove prop roots',
        'On dry paved roads',
        'High in coconut palms',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'riverPrawns',
    board: 'coastal',
    category: 'Estuary Nursery',
    ecoRole: 'Estuary & Canopy Nursery Species',
    en: 'Grilled River Prawns',
    th: 'กุ้งแม่น้ำเผา',
    priceLabel: '+1 Shell',
    shortDesc: 'Char-grilled estuary prawns brushed with garlic and spicy lime dip.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['garlic', 'lime'],
    prepVerb: 'Char Grill',
    prepVerbTh: 'ย่างถ่าน',
    story: {
      local: 'Sweet juicy river prawns grilled over charcoal and served with tangy seafood sauce.',
      mangrove: 'Juvenile prawns rely heavily on mangrove prop-root forests as safe nurseries.',
      shell: 'Every prawn dish sponsors shoreline shell reefs that guard nursery canopies.',
    },
    quiz: {
      question: 'Why are mangrove prop-root forests vital for river prawns?',
      options: [
        'They act as safe nurseries for juvenile prawns',
        'They freeze estuary water',
        'They keep prawns on dry land',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'shrimpBlite',
    board: 'coastal',
    category: 'Coastal Flora & Greens',
    ecoRole: 'Local Flora Representative',
    en: 'Shrimp & Sea Blite Salad',
    th: 'ยำกุ้งใบชะคราม',
    priceLabel: '+1 Shell',
    shortDesc: 'Plump shrimp tossed with sea blite leaves, coconut, and chili.',
    shellsReward: 1,
    kpReward: 9,
    recipe: ['seablite', 'coconut'],
    prepVerb: 'Creamy Toss',
    prepVerbTh: 'คลุกยำชะคราม',
    story: {
      local: 'Pairs sweet coastal shrimp with sea blite (ชะคราม), a succulent salt-marsh green.',
      mangrove: 'Sea blite stabilizes tidal bank soil and absorbs excess coastal salinity.',
      shell: 'Salt-tolerant coastal plants and shell barriers work together to heal eroded banks.',
    },
    quiz: {
      question: 'How does sea blite (ใบชะคราม) help coastal mangrove banks?',
      options: [
        'It stabilizes tidal soil and absorbs excess salinity',
        'It turns seawater into oil',
        'It grows only in cold snow',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'sourCurryBlite',
    board: 'coastal',
    category: 'Coastal Flora & Greens',
    ecoRole: 'Local Brackish Flora',
    en: 'Sour Curry w/ Sea Blite',
    th: 'แกงส้มใบชะครามกุ้งสด',
    priceLabel: '+1 Shell',
    shortDesc: 'Tangy tamarind sour curry simmered with sea blite and fresh shrimp.',
    shellsReward: 1,
    kpReward: 9,
    recipe: ['seablite', 'tamarind'],
    prepVerb: 'Simmer Curry',
    prepVerbTh: 'ต้มแกงส้ม',
    story: {
      local: 'A comforting Bang Khun Thian curry balancing sour tamarind with crisp sea blite.',
      mangrove: 'Growing along brackish banks, sea blite helps guard the transition zone to mangroves.',
      shell: 'Every bowl funds shoreline restoration where coastal greens and mangroves meet.',
    },
    quiz: {
      question: 'Where does sea blite naturally grow in Bang Khun Thian?',
      options: [
        'Along salty brackish coastal banks',
        'Inside desert caves',
        'On snowy mountain peaks',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'sourCurryChaOm',
    board: 'coastal',
    category: 'Coastal Flora & Greens',
    ecoRole: 'Local Brackish Flora',
    en: 'Sour Curry w/ Cha-Om & Prawns',
    th: 'แกงส้มชะอมกุ้ง',
    priceLabel: '+1 Shell',
    shortDesc: 'Fragrant climbing wattle omelette and prawns in tangy tamarind broth.',
    shellsReward: 1,
    kpReward: 9,
    recipe: ['tamarind', 'chili'],
    prepVerb: 'Simmer Broth',
    prepVerbTh: 'ต้มแกงส้ม',
    story: {
      local: 'Savory Cha-Om omelette squares soaked in bright tamarind-chili curry with prawns.',
      mangrove: 'Highlights plants thriving along freshwater-to-saltwater boundary canals.',
      shell: 'Protecting boundary canals keeps healthy tidal flow reaching mangrove forests.',
    },
    quiz: {
      question: 'What ecosystem boundary does Cha-Om & prawn sour curry celebrate?',
      options: [
        'Freshwater and saltwater boundary canals',
        'High alpine glaciers',
        'Dry rocky canyons',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'waterMimosa',
    board: 'coastal',
    category: 'Coastal Flora & Greens',
    ecoRole: 'Local Aquatic & Wetland Flora',
    en: 'Stir-Fried Water Mimosa',
    th: 'ผัดกระเฉดไฟแดง',
    priceLabel: '+1 Shell',
    shortDesc: 'Crisp canal water mimosa flash-seared with garlic and red chili.',
    shellsReward: 1,
    kpReward: 9,
    recipe: ['chili', 'garlic'],
    prepVerb: 'Flash Wok',
    prepVerbTh: 'ผัดไฟแดง',
    story: {
      local: 'Crunchy indigenous water mimosa (ผักกระเฉด) flash-fried over high flame with chili.',
      mangrove: 'Floating wetland plants filter excess nutrients and prevent canal bank erosion.',
      shell: 'Cleaner canal water flows out to keep coastal mangrove nurseries thriving.',
    },
    quiz: {
      question: 'How does floating water mimosa (ผักกระเฉด) help Bang Khun Thian canals?',
      options: [
        'It filters nutrients and prevents canal bank erosion',
        'It blocks all sunlight from trees',
        'It turns water salty',
      ],
      answerIndex: 0,
    },
  },

  // === MANGROVE SWEETS & DRINKS (Blue Menu Board) ===
  {
    id: 'nipaGelato',
    board: 'treats',
    category: 'Gelato & Soft Serve',
    ecoRole: 'Mangrove Palm Harvest',
    en: 'Nipa Palm Gelato',
    th: 'เจลาโต้ลูกจาก',
    priceLabel: '+1 Shell',
    shortDesc: 'Creamy coconut scoop swirled with translucent mangrove nipa palm.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['nipa', 'coconut'],
    prepVerb: 'Churn & Scoop',
    prepVerbTh: 'ปั่นไอศกรีม',
    story: {
      local: 'Coastal bakers harvest sweet jelly-like nipa palm seeds from mangrove palms.',
      mangrove: 'Nipa palms anchor riverbanks and buffer storms alongside red mangroves.',
      shell: 'Each gelato cup sponsors one shell bundle for a young nipa palm shoot.',
    },
    quiz: {
      question: 'Where do sweet translucent nipa palm seeds come from?',
      options: ['Mangrove river palms', 'Pine forests', 'Cactus flowers'],
      answerIndex: 0,
    },
  },
  {
    id: 'honeyFizz',
    board: 'treats',
    category: 'Sparkling Drinks',
    ecoRole: 'Mangrove Pollination',
    en: 'Mangrove Honey Fizz',
    th: 'น้ำผึ้งป่าชายเลนโซดา',
    priceLabel: '+1 Shell',
    shortDesc: 'Chilled sparkling limeade sweetened with wild mangrove honey.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['honey', 'lime'],
    prepVerb: 'Shake & Fizz',
    prepVerbTh: 'เขย่าซ่า',
    story: {
      local: 'Beekeepers place hives near blooming mangroves for fragrant golden honey.',
      mangrove: 'Wild bees pollinate mangrove blossoms, helping new seeds form each season.',
      shell: 'Refreshing drink orders keep pollination habitats thriving on the coast.',
    },
    quiz: {
      question: 'How do coastal bees help mangrove forests?',
      options: ['They dig mud tunnels', 'They pollinate blossoms', 'They carry big rocks'],
      answerIndex: 1,
    },
  },
  {
    id: 'crepeCake',
    board: 'treats',
    category: 'Bakery & Cakes',
    ecoRole: 'Coastal Palm Craft',
    en: 'Palm Sugar Crêpe Cake',
    th: 'เครปเค้กน้ำตาลมะพร้าว',
    priceLabel: '+1 Shell',
    shortDesc: 'Fluffy cream layers glazed with caramelized coastal palm sugar.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['coconut', 'sugar'],
    prepVerb: 'Whip & Layer',
    prepVerbTh: 'ปาดครีม',
    story: {
      local: 'Artisans slowly simmer palm sap in wide woks to craft golden palm sugar.',
      mangrove: 'Coastal palm groves shade the upper shoreline behind mangrove wetlands.',
      shell: 'Every cake slice funds a protective shell collar around baby saplings.',
    },
    quiz: {
      question: 'How is traditional coastal palm sugar made?',
      options: ['Simmering palm sap slowly', 'Freezing seawater', 'Grinding seashells'],
      answerIndex: 0,
    },
  },
  {
    id: 'berryFloat',
    board: 'treats',
    category: 'Gelato & Soft Serve',
    ecoRole: 'Blue Carbon Special',
    en: 'Ichigo Berry Float',
    th: 'สตรอว์เบอร์รีโฟลต',
    priceLabel: '+2 Shells',
    shortDesc: 'Pink strawberry cream soda crowned with a whipped cloud.',
    shellsReward: 2,
    kpReward: 12,
    recipe: ['strawberry', 'coconut'],
    prepVerb: 'Swirl & Float',
    prepVerbTh: 'ราดโฟลต',
    story: {
      local: 'Our cafe’s signature pink float pairs local coconut cream with sweet berries.',
      mangrove: 'Healthy coastal wetlands absorb carbon up to four times faster than land forests.',
      shell: 'This special treat drops two bonus shells straight into your mangrove basket!',
    },
    quiz: {
      question: 'Why are mangrove wetlands called "blue carbon" champions?',
      options: [
        'They glow blue at night',
        'They store huge amounts of carbon',
        'They freeze ocean tides',
      ],
      answerIndex: 1,
    },
  },
  {
    id: 'matchaBottle',
    board: 'treats',
    category: 'Sparkling Drinks',
    ecoRole: 'Plastic-Free Canal Pledge',
    en: 'Cloud Honey Milk',
    th: 'นมน้ำผึ้งเมฆขาว',
    priceLabel: '+1 Shell',
    shortDesc: 'Chilled glass milk bottle with whipped mangrove honey foam.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['honey', 'sugar'],
    prepVerb: 'Froth & Pour',
    prepVerbTh: 'ตีฟองนม',
    story: {
      local: 'Served in returnable glass bottles to keep coastal canals plastic-free.',
      mangrove: 'Keeping plastic out of tidal creeks prevents young roots from tangling.',
      shell: 'Reusable bottle orders earn a clean-tide shell for your sapling.',
    },
    quiz: {
      question: 'Why does the cafe serve Cloud Milk in reusable glass bottles?',
      options: [
        'To keep plastic out of mangrove creeks',
        'To make bottles heavier',
        'To warm the drink',
      ],
      answerIndex: 0,
    },
  },
  {
    id: 'palmTart',
    board: 'treats',
    category: 'Bakery & Cakes',
    ecoRole: 'Living Tree Economy',
    en: 'Berry Nipa Tartlet',
    th: 'ทาร์ตลูกจากสตรอว์เบอร์รี',
    priceLabel: '+1 Shell',
    shortDesc: 'Crisp honeyed pastry topped with nipa pearls and strawberries.',
    shellsReward: 1,
    kpReward: 10,
    recipe: ['nipa', 'strawberry'],
    prepVerb: 'Bake & Top',
    prepVerbTh: 'อบและแต่งหน้า',
    story: {
      local: 'Young pastry chefs blend traditional nipa fruit with modern cafe tarts.',
      mangrove: 'Giving mangrove fruits delicious value encourages communities to protect trees.',
      shell: 'Every tart baked supports local youth mangrove-planting workshops.',
    },
    quiz: {
      question: 'How do nipa palm desserts help conserve mangroves?',
      options: [
        'By giving locals sustainable income from living trees',
        'By cutting down old palms',
        'By draining tidal mud',
      ],
      answerIndex: 0,
    },
  },
];

export const SAPLING_STAGES: SaplingStage[] = [
  {
    id: 0,
    atShells: 0,
    en: 'Coastal Seed',
    th: 'เมล็ดโกงกาง',
    rewardText: 'Planted in soft Bang Khun Thian mud! Feed shells to help it sprout.',
  },
  {
    id: 1,
    atShells: 4,
    en: 'Tide Sprout',
    th: 'ต้นอ่อนงอกใหม่',
    rewardText: 'First green leaves unfurled behind your protective shell bio-barrier!',
  },
  {
    id: 2,
    atShells: 9,
    en: 'Rooted Sapling',
    th: 'ต้นกล้าแข็งแรง',
    rewardText: 'Tiny prop roots are anchoring the mudflat against gentle waves.',
  },
  {
    id: 3,
    atShells: 15,
    en: 'Blooming Mangrove',
    th: 'ป่าชายเลนผลิบาน',
    rewardText: 'A thriving young mangrove! Crabs, cockles, prawns, and bees call it home.',
  },
];

export const WARDROBE_ITEMS: WardrobeItem[] = [
  { id: 'hat', en: 'Straw Sun Hat', th: 'หมวกสานบังแดด', kpCost: 10, desc: 'Shades your Tomodachi on bright coastal afternoons.' },
  { id: 'crab', en: 'Little Crab Pal', th: 'น้องปูเพื่อนรัก', kpCost: 20, desc: 'A cheerful mud crab who aerates your roots.' },
  { id: 'can', en: 'Pastel Watering Can', th: 'บัวรดน้ำสีชมพู', kpCost: 30, desc: 'Keeps fresh tidal mist sparkling.' },
  { id: 'chime', en: 'Shell Windchime', th: 'โมบายเปลือกหอย', kpCost: 45, desc: 'Sings gently whenever coastal breezes blow.' },
  { id: 'crown', en: 'Blossom Crown', th: 'มงกุฎดอกไม้', kpCost: 60, desc: 'Attracts mangrove honeybees to your canopy.' },
];

export const SAPLING_TIPS: string[] = [
  'Thank you! Cockle & oyster shells slow waves so my tiny roots hold the mud.',
  'Did you know? Mud crabs burrow tunnels that bring oxygen to my roots!',
  'Coastal bees visit mangrove blossoms to make golden Mangrove Honey.',
  'Sea blite and water mimosa filter canal runoff before it reaches the bay!',
  'Every Bang Khun Thian dish you cook helps protect our living shoreline!',
];

export const AVATAR_COLORS = {
  hair: ['#4A2A3B', '#8C583A', '#F2C063', '#7EA8F8', '#98D8B8', '#FF8FB8'],
  skin: ['#FFE5D0', '#F5CBA7', '#E0A87B', '#B57750', '#7D4E35'],
  apron: ['#7AC6F0', '#6BC497', '#FFD875', '#C2A3F2', '#FF8FB8'],
};

export const AVATAR_STYLES = ['Long Waves', 'Twin Buns', 'Fluffy Curls', 'Sweet Bob'];
export const AVATAR_BOY_STYLES = ['Soft Swoop', 'Curtain Part', 'Fluffy Curls', 'Spiky Crop'];
export const AVATAR_ACCESSORIES = ['None', 'Headphones', 'Bow / Bandana', 'Leaf Sprout', 'Chef Beret'];
