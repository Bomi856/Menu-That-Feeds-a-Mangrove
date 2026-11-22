export type AppLang = 'en' | 'th' | 'my';
export type PronounId = 'he' | 'she' | 'they' | 'none';

export const LANG_OPTIONS: { id: AppLang; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'th', label: 'ไทย', short: 'ไทย' },
  { id: 'my', label: 'မြန်မာ', short: 'မြန်မာ' },
];

export const PRONOUN_OPTIONS: {
  id: PronounId;
  labels: Record<AppLang, string>;
  badge: Record<AppLang, string>;
}[] = [
  {
    id: 'he',
    labels: { en: 'He / Him', th: 'เขา (He/Him)', my: 'သူ (He/Him)' },
    badge: { en: 'he/him', th: 'he/him', my: 'he/him' },
  },
  {
    id: 'she',
    labels: { en: 'She / Her', th: 'เธอ (She/Her)', my: 'သူမ (She/Her)' },
    badge: { en: 'she/her', th: 'she/her', my: 'she/her' },
  },
  {
    id: 'they',
    labels: { en: 'They / Them', th: 'พวกเขา (They/Them)', my: 'သူတို့ (They/Them)' },
    badge: { en: 'they/them', th: 'they/them', my: 'they/them' },
  },
  {
    id: 'none',
    labels: {
      en: 'Prefer not to say',
      th: 'ไม่ระบุสรรพนาม',
      my: 'မဖော်ပြလိုပါ',
    },
    badge: { en: '', th: '', my: '' },
  },
];

export interface UIStrings {
  appTitle: string;
  navMenus: string;
  navMap: string;
  navGuide: string;
  navWardrobe: string;
  navHowTo: string;
  heroTitle: string;
  heroSteps: string;
  themeLabel: string;
  switchBtn: string;
  themeSongs: string;
  playing: string;
  paused: string;
  tapTomodachi: string;
  loadingLabel: string;
  loadingInstructionsTitle: string;
  skipLoading: string;
  loadingFacts: [string, string, string, string];
  welcomeTitle: string;
  welcomeSub: string;
  welcomeReadAll: string;
  welcomeTapCards: string;
  welcomeReadNext: string;
  welcomeOkay: string;
  welcomeLocked: string;
  welcomeSteps: { tag: string; title: string; body: string }[];
  stepRead: string;
  stepUnread: string;
  customTitle: string;
  customOpeningBadge: string;
  avatarStyleLabel: string;
  girlVersion: string;
  boyVersion: string;
  whatCallYou: string;
  pronounsLabel: string;
  hairstyleLabel: string;
  headpieceLabel: string;
  hairColorLabel: string;
  skinToneLabel: string;
  apronColorLabel: string;
  saveChef: string;
  startAdventure: string;
  cancel: string;
  coastalMenuTitle: string;
  coastalMenuSub: string;
  sweetsMenuTitle: string;
  sweetsMenuSub: string;
  cookDishBtn: string;
  storyBtn: string;
  quizBtn: string;
  tomodachiTitle: string;
  moodCelebrating: string;
  moodHappy: string;
  moodSad: string;
  moodContent: string;
  renameBtn: string;
  saveBtn: string;
  sedimentLabel: string;
  shellBasket: string;
  tapShellFeed: string;
  dailyCheckIn: string;
  dailyClaimed: string;
  streakLabel: string;
  customizeBtn: string;
  signInBtn: string;
  signOutBtn: string;
  saveAcrossDevices: string;
  todaysQuests: string;
  questCook: string;
  questQuiz: string;
  questFeed: string;
  resetProgressBtn: string;
  resetModalTitle: string;
  resetModalDesc: string;
  resetKeepChefOption: string;
  resetConfirmBtn: string;
  mapTitle: string;
  mapSubtitle: string;
  mapActiveBadge: string;
  mapUnlockedBadge: string;
  mapLockedBadge: string;
  mapTravelHere: string;
  mapCurrentStop: string;
  mapSignatureDishes: string;
  mapCookHere: string;
  mapStopLabel: string;
  mapAllUnlocked: string;
  mapActiveKitchenLabel: string;
  mapFilterStop: string;
  mapShowAll: string;
  mapViewMapBtn: string;
}

export function getChefGreeting(lang: AppLang, name: string): string {
  const safeName = name.trim() || 'Coastal Chef';
  const hour = new Date().getHours();
  if (lang === 'th') {
    if (hour >= 5 && hour < 12) return `สวัสดีตอนเช้า, ${safeName}!`;
    if (hour >= 12 && hour < 17) return `สวัสดีตอนบ่าย, ${safeName}!`;
    return `สวัสดีตอนเย็น, ${safeName}!`;
  }
  if (lang === 'my') {
    if (hour >= 5 && hour < 12) return `မင်္ဂလာနံနက်ခင်းပါ, ${safeName}!`;
    if (hour >= 12 && hour < 17) return `မင်္ဂလာနေ့လယ်ခင်းပါ, ${safeName}!`;
    return `မင်္ဂလာညနေခင်းပါ, ${safeName}!`;
  }
  if (hour >= 5 && hour < 12) return `Good morning, ${safeName}!`;
  if (hour >= 12 && hour < 17) return `Good afternoon, ${safeName}!`;
  return `Good evening, ${safeName}!`;
}

export const UI_TEXT: Record<AppLang, UIStrings> = {
  en: {
    appTitle: 'Menu That Feeds a Mangrove',
    navMenus: 'Cafe Menus',
    navMap: 'Coastal Map',
    navGuide: 'Field Guide',
    navWardrobe: 'Wardrobe',
    navHowTo: 'How to Play',
    heroTitle: 'Cook real coastal dishes, earn shells, and care for your mangrove Tomodachi.',
    heroSteps:
      '1. Cook from Bang Khun Thian’s Pink Kitchen & Blue Sweets menus · 2. Solve eco-quizzes · 3. Keep your living Tomodachi happy & sign in to save your progress!',
    themeLabel: 'Theme',
    switchBtn: 'Switch',
    themeSongs: 'Theme Songs',
    playing: '♪ Playing',
    paused: 'Paused',
    tapTomodachi: 'Tap!',
    loadingLabel: 'LOADING KITCHEN & SANCTUARY...',
    loadingInstructionsTitle: 'HOW TO PLAY · QUICK INSTRUCTIONS',
    skipLoading: 'Skip loading →',
    loadingFacts: [
      'Mangrove prop roots trap coastal mud and shelter baby river prawns!',
      'Discarded cockle & oyster shells build wave-breaking reefs for saplings.',
      'Mud crabs aerate mangrove soil by digging cozy burrows near tree roots.',
      'Sea blite and water mimosa grow along Bang Khun Thian’s brackish canals!',
    ],
    welcomeTitle: 'Welcome to Bang Khun Thian! Let’s learn about the environment',
    welcomeSub: 'Coastal Eco-Cafe · Learn & Protect Mangroves',
    welcomeReadAll: 'All instructions read! Ready to customize your chef ♪',
    welcomeTapCards: 'Tap each instruction card below to read through:',
    welcomeReadNext: 'Read Next',
    welcomeOkay: 'Okay! Customize Chef & Start ♪',
    welcomeLocked: 'Okay (Read all 4 steps first)',
    welcomeSteps: [
      {
        tag: 'STEP 1 · MENUS',
        title: 'Cook Real Bang Khun Thian Dishes & Sweets',
        body: 'Choose dishes from the Pink Coastal Kitchen (cockles, mud crabs, river prawns, oyster omelettes) or the Blue Mangrove Sweets menu and cook them in the mini-kitchen.',
      },
      {
        tag: 'STEP 2 · ENVIRONMENT',
        title: 'Learn Every Dish’s Mangrove Story & Eco-Quiz',
        body: 'Open each dish’s story and solve its eco-quiz to earn extra shells and Knowledge Points (KP). Discover how shell reefs stop waves and mud crabs keep roots healthy!',
      },
      {
        tag: 'STEP 3 · TOMODACHI',
        title: 'Feed & Cheer Up Your Living Mangrove Sapling',
        body: 'Feed shells from your basket to grow your sapling through 4 coastal stages. Pat it anytime—it blinks, dances when you succeed, and gets sad if left alone or when mistakes happen!',
      },
      {
        tag: 'STEP 4 · SAVE & DRESS UP',
        title: 'Sign In to Save Progress & Customize Your Chef',
        body: 'Sign in with Google in the Sanctuary card to keep your shells, sapling name, avatar, and unlocked wardrobe accessories saved across devices.',
      },
    ],
    stepRead: '✓ Read',
    stepUnread: 'Tap to read',
    customTitle: 'Customize Your Coastal Chef',
    customOpeningBadge: 'WELCOME! CREATE YOUR COASTAL CHEF',
    avatarStyleLabel: 'Avatar Style',
    girlVersion: 'Fem',
    boyVersion: 'Masc',
    whatCallYou: 'What should we call you?',
    pronounsLabel: 'Pronouns',
    hairstyleLabel: 'Hairstyle',
    headpieceLabel: 'Headgear',
    hairColorLabel: 'Hair Color',
    skinToneLabel: 'Skin Tone',
    apronColorLabel: 'Outfit Color',
    saveChef: 'Save Chef',
    startAdventure: 'Start Cooking! ♪',
    cancel: 'Cancel',
    coastalMenuTitle: 'Coastal Kitchen Menu',
    coastalMenuSub: '14 real Bang Khun Thian dishes',
    sweetsMenuTitle: 'Mangrove Sweets & Drinks',
    sweetsMenuSub: '6 coastal gelatos, cakes & drinks',
    cookDishBtn: 'Cook Dish',
    storyBtn: 'Mangrove Story',
    quizBtn: 'Eco-Quiz',
    tomodachiTitle: 'Mangrove Tomodachi',
    moodCelebrating: 'Celebrating!',
    moodHappy: 'Happy',
    moodSad: 'Feeling lonely / sad',
    moodContent: 'Content',
    renameBtn: 'Rename',
    saveBtn: 'Save',
    sedimentLabel: 'Sediment',
    shellBasket: 'Shell Basket',
    tapShellFeed: 'Tap shell to feed!',
    dailyCheckIn: 'Daily Check-In +1 Shell',
    dailyClaimed: 'Daily Shell Claimed',
    streakLabel: 'Streak',
    customizeBtn: 'Customize',
    signInBtn: 'Sign in',
    signOutBtn: 'Sign out',
    saveAcrossDevices: 'Save your progress across devices:',
    todaysQuests: 'Today’s Quests',
    questCook: 'Cook 2 menu dishes',
    questQuiz: 'Answer 1 eco-quiz',
    questFeed: 'Feed 3 shells to Tomodachi',
    resetProgressBtn: 'Reset Progress',
    resetModalTitle: 'Reset Game Progress?',
    resetModalDesc:
      'This will reset your shells, mangrove growth, sapling name, cooked dishes, eco-quizzes, wardrobe unlocks, and daily streak back to the beginning.',
    resetKeepChefOption: 'Also reset chef name, avatar & re-open setup',
    resetConfirmBtn: 'Yes, Reset Progress',
    mapTitle: 'Bang Khun Thian Coastal Trail',
    mapSubtitle:
      'Every mangrove Tomodachi growth level unlocks a real Bang Khun Thian seafood stop from the upper canal out to the Bay of Bangkok!',
    mapActiveBadge: 'Current Stop',
    mapUnlockedBadge: 'Unlocked',
    mapLockedBadge: 'Locked',
    mapTravelHere: 'Advance to This Restaurant',
    mapCurrentStop: 'Dining & Cooking Here ★',
    mapSignatureDishes: 'Signature Dishes at This Stop',
    mapCookHere: 'Cook Signature Dishes →',
    mapStopLabel: 'Stop',
    mapAllUnlocked: 'All 4 Bang Khun Thian restaurants unlocked!',
    mapActiveKitchenLabel: 'Active Stop',
    mapFilterStop: 'Filter Here (5)',
    mapShowAll: 'All Dishes',
    mapViewMapBtn: 'Coastal Map →',
  },
  th: {
    appTitle: 'เมนูที่เลี้ยงป่าชายเลน',
    navMenus: 'เมนูคาเฟ่',
    navMap: 'แผนที่ร้าน',
    navGuide: 'คู่มือป่าชายเลน',
    navWardrobe: 'ตู้เสื้อผ้า',
    navHowTo: 'วิธีเล่น',
    heroTitle: 'ปรุงอาหารทะเลบางขุนเทียน สะสมเปลือกหอย และดูแลน้องโกงกางทามาก็อตจิของคุณ',
    heroSteps:
      '1. ทำอาหารจากเมนูครัวชายฝั่งสีชมพู & ขนมสีฟ้า · 2. ตอบคำถามสิ่งแวดล้อม · 3. ดูแลน้องโกงกางให้มีความสุข & ลงชื่อเข้าใช้เพื่อบันทึกความก้าวหน้า!',
    themeLabel: 'ธีมสี',
    switchBtn: 'เปลี่ยน',
    themeSongs: 'เพลงประกอบ',
    playing: '♪ กำลังเล่น',
    paused: 'หยุดชั่วคราว',
    tapTomodachi: 'แตะทักทาย!',
    loadingLabel: 'กำลังเตรียมครัวและป่าชายเลน...',
    loadingInstructionsTitle: 'วิธีเล่น · คำแนะนำเบื้องต้น',
    skipLoading: 'ข้ามหน้าโหลด →',
    loadingFacts: [
      'รากค้ำจุนของต้นโกงกางช่วยกักตะกอนดินและเป็นที่หลบภัยของลูกกุ้งแม่น้ำ!',
      'เปลือกหอยแครงและหอยนางรมใช้สร้างแนวกันคลื่นให้ต้นกล้าโกงกางเติบโตได้',
      'ปูทะเลช่วยพรวนดินและเพิ่มออกซิเจนให้รากต้นโกงกางตามธรรมชาติ',
      'ใบชะครามและผักกระเฉดน้ำกร่อยเติบโตตามลำคลองบางขุนเทียน!',
    ],
    welcomeTitle: 'ยินดีต้อนรับสู่บางขุนเทียน! มาเรียนรู้เรื่องสิ่งแวดล้อมกันเถอะ',
    welcomeSub: 'คาเฟ่รักษ์ป่าชายเลน · เรียนรู้และอนุรักษ์ชายฝั่ง',
    welcomeReadAll: 'อ่านครบทุกขั้นตอนแล้ว! พร้อมแต่งตัวเชฟแล้ว ♪',
    welcomeTapCards: 'แตะการ์ดคำแนะนำด้านล่างทีละข้อเพื่ออ่านให้ครบ:',
    welcomeReadNext: 'อ่านข้อถัดไป',
    welcomeOkay: 'โอเค! แต่งตัวเชฟและเริ่มเลย ♪',
    welcomeLocked: 'โอเค (อ่านให้ครบ 4 ข้อก่อนนะ)',
    welcomeSteps: [
      {
        tag: 'ขั้นตอน 1 · เมนูอาหาร',
        title: 'ทำอาหารและขนมบางขุนเทียนของจริง',
        body: 'เลือกเมนูจากครัวชายฝั่งสีชมพู (ยำหอยแครง ปูไข่หลน กุ้งแม่น้ำ ไข่เจียวหอยนางรม) หรือเมนูขนมป่าชายเลนสีฟ้า แล้วลงมือปรุงในมินิคิทเช่น',
      },
      {
        tag: 'ขั้นตอน 2 · สิ่งแวดล้อม',
        title: 'เรียนรู้เรื่องราวระบบนิเวศและตอบคำถาม',
        body: 'เปิดอ่านเรื่องราวของแต่ละจานและตอบควิซสิ่งแวดล้อมเพื่อรับเปลือกหอยและแต้มความรู้ (KP) เพิ่มเติม',
      },
      {
        tag: 'ขั้นตอน 3 · ทามาก็อตจิ',
        title: 'ป้อนเปลือกหอยและดูแลน้องต้นกล้าโกงกาง',
        body: 'แตะเปลือกหอยเพื่อเลี้ยงน้องโกงกางให้เติบโต 4 ระยะ แตะลูบหัวน้องได้เสมอ—น้องกะพริบตา เต้นดีใจ และแอบเศร้าถ้าถูกทิ้งไว้นานหรือทำผิดพลาด!',
      },
      {
        tag: 'ขั้นตอน 4 · บันทึกความก้าวหน้า',
        title: 'ลงชื่อเข้าใช้ด้วย Google เพื่อบันทึกข้อมูล',
        body: 'เข้าสู่ระบบด้วย Google ในการ์ดด้านขวาเพื่อเก็บเปลือกหอย ชื่อน้องต้นกล้า อวาตาร์ และของตกแต่งข้ามอุปกรณ์',
      },
    ],
    stepRead: '✓ อ่านแล้ว',
    stepUnread: 'แตะเพื่ออ่าน',
    customTitle: 'สร้างตัวละครเชฟชายฝั่งของคุณ',
    customOpeningBadge: 'ยินดีต้อนรับ! สร้างเชฟชายฝั่งของคุณ',
    avatarStyleLabel: 'รูปแบบตัวละคร',
    girlVersion: 'เวอร์ชัน Fem',
    boyVersion: 'เวอร์ชัน Masc',
    whatCallYou: 'ให้เราเรียกคุณว่าอะไรดี?',
    pronounsLabel: 'สรรพนาม (Pronouns)',
    hairstyleLabel: 'ทรงผม',
    headpieceLabel: 'หมวกและเครื่องประดับ',
    hairColorLabel: 'สีผม',
    skinToneLabel: 'สีผิว',
    apronColorLabel: 'สีชุดเชฟ',
    saveChef: 'บันทึกตัวละคร',
    startAdventure: 'เริ่มทำอาหารกันเลย! ♪',
    cancel: 'ยกเลิก',
    coastalMenuTitle: 'เมนูครัวชายฝั่ง',
    coastalMenuSub: '14 เมนูเด็ดร้านดังบางขุนเทียน',
    sweetsMenuTitle: 'ขนมหวานและเครื่องดื่ม',
    sweetsMenuSub: '6 เมนูเจลาโต้ เค้ก & เครื่องดื่ม',
    cookDishBtn: 'ลงมือปรุง',
    storyBtn: 'เรื่องราวป่าชายเลน',
    quizBtn: 'ควิซสิ่งแวดล้อม',
    tomodachiTitle: 'โกงกางทามาก็อตจิ',
    moodCelebrating: 'ดีใจสุดๆ!',
    moodHappy: 'อารมณ์ดี',
    moodSad: 'แอบเหงา / เศร้า',
    moodContent: 'สบายใจ',
    renameBtn: 'เปลี่ยนชื่อ',
    saveBtn: 'บันทึก',
    sedimentLabel: 'ความอุดมสมบูรณ์',
    shellBasket: 'ตะกร้าเปลือกหอย',
    tapShellFeed: 'แตะเปลือกหอยเพื่อป้อน!',
    dailyCheckIn: 'เช็คอินรายวัน +1 เปลือกหอย',
    dailyClaimed: 'รับโบนัสวันนี้แล้ว',
    streakLabel: 'ต่อเนื่อง',
    customizeBtn: 'แต่งตัวเชฟ',
    signInBtn: 'เข้าสู่ระบบ',
    signOutBtn: 'ออกจากระบบ',
    saveAcrossDevices: 'บันทึกความก้าวหน้าข้ามอุปกรณ์:',
    todaysQuests: 'ภารกิจวันนี้',
    questCook: 'ปรุงอาหาร 2 เมนู',
    questQuiz: 'ตอบควิซสิ่งแวดล้อม 1 ข้อ',
    questFeed: 'ป้อนเปลือกหอย 3 ชิ้น',
    resetProgressBtn: 'รีเซ็ตความก้าวหน้า',
    resetModalTitle: 'รีเซ็ตความก้าวหน้าในเกมไหม?',
    resetModalDesc:
      'การรีเซ็ตจะล้างเปลือกหอย การเติบโตของต้นกล้า ชื่อต้นกล้า เมนูที่ปรุงแล้ว ควิซ ไอเท็มตู้เสื้อผ้า และสถิติรายวันกลับเป็นเริ่มต้น',
    resetKeepChefOption: 'รีเซ็ตชื่อ อวาตาร์เชฟ และเปิดหน้าสร้างตัวละครใหม่ด้วย',
    resetConfirmBtn: 'ยืนยันรีเซ็ต',
    mapTitle: 'แผนที่เส้นทางร้านอาหารบางขุนเทียน',
    mapSubtitle:
      'ทุกครั้งที่ต้นกล้าโกงกางเติบโตขึ้น 1 ระดับ จะปลดล็อกร้านอาหารทะเลจริงในย่านบางขุนเทียนไล่จากลำคลองสู่ชายทะเล!',
    mapActiveBadge: 'ร้านปัจจุบัน',
    mapUnlockedBadge: 'ปลดล็อกแล้ว',
    mapLockedBadge: 'ยังไม่ปลดล็อก',
    mapTravelHere: 'ย้ายมาปรุงที่ร้านนี้',
    mapCurrentStop: 'กำลังเปิดครัวที่ร้านนี้ ★',
    mapSignatureDishes: 'เมนูซิกเนเจอร์ประจำร้าน',
    mapCookHere: 'ไปทำเมนูร้านนี้เลย →',
    mapStopLabel: 'จุดที่',
    mapAllUnlocked: 'ปลดล็อกครบทั้ง 4 ร้านดังบางขุนเทียนแล้ว!',
    mapActiveKitchenLabel: 'ร้านที่กำลังอยู่',
    mapFilterStop: 'เฉพาะร้านนี้ (5)',
    mapShowAll: 'ทุกเมนู',
    mapViewMapBtn: 'ดูแผนที่ →',
  },
  my: {
    appTitle: 'ဒီရေတောကို ကျွေးမွေးတဲ့ မီနူး',
    navMenus: 'ကဖေးမီနူးများ',
    navMap: 'ကမ်းရိုးတန်းမြေပုံ',
    navGuide: 'သဘာဝလမ်းညွှန်',
    navWardrobe: 'အဝတ်အစား',
    navHowTo: 'ကစားနည်း',
    heroTitle: 'ဘန်ခွန်ထီယန် ပင်လယ်စာများ ချက်ပြုတ်ပြီး ဒီရေတော Tomodachi လေးကို စောင့်ရှောက်ပါ။',
    heroSteps:
      '၁။ ပန်းရောင်ပင်လယ်စာမီနူးနှင့် အပြာရောင်အချိုပွဲမီနူးမှ ချက်ပြုတ်ပါ · ၂။ သဘာဝပတ်ဝန်းကျင်မေးခွန်းများ ဖြေဆိုပါ · ၃။ Tomodachi လေးကို ပျော်ရွှင်အောင်ထားပြီး Google ဖြင့် သိမ်းဆည်းပါ!',
    themeLabel: 'အရောင်',
    switchBtn: 'ပြောင်းရန်',
    themeSongs: 'နောက်ခံသီချင်း',
    playing: '♪ ဖွင့်နေသည်',
    paused: 'ရပ်ထားသည်',
    tapTomodachi: 'နှိပ်ပါ!',
    loadingLabel: 'မီးဖိုချောင်နှင့် ဒီရေတောကို ပြင်ဆင်နေသည်...',
    loadingInstructionsTitle: 'ကစားနည်း · လမ်းညွှန်ချက်များ',
    skipLoading: 'ကျော်သွားရန် →',
    loadingFacts: [
      'ဒီရေတောအမြစ်များသည် ရွှံ့နွံများကို ထိန်းသိမ်းပေးပြီး ပုစွန်သားပေါက်များကို ကာကွယ်ပေးသည်!',
      'စွန့်ပစ်ခရုခွံများနှင့် ကမာခွံများသည် ပင်လယ်လှိုင်းကာ အတားအဆီးများ တည်ဆောက်ရန် အသုံးဝင်သည်။',
      'ရွှံ့ကဏန်းများသည် အပင်အမြစ်များအနီး မြေဆီလွှာကို လေဝင်လေထွက်ကောင်းအောင် ကူညီပေးသည်။',
      'ဘန်ခွန်ထီယန် ရေချိုရေငန်စပ် တူးမြောင်းများတစ်လျှောက် ပင်လယ်ရွက်ပင်များ ပေါက်ရောက်ကြသည်!',
    ],
    welcomeTitle: 'ဘန်ခွန်ထီယန်မှ ကြိုဆိုပါတယ်! သဘာဝပတ်ဝန်းကျင်အကြောင်း လေ့လာကြရအောင်',
    welcomeSub: 'ကမ်းရိုးတန်း Eco-Cafe · ဒီရေတောထိန်းသိမ်းရေး',
    welcomeReadAll: 'လမ်းညွှန်အားလုံး ဖတ်ပြီးပါပြီ! စတင်ဖန်တီးနိုင်ပါပြီ ♪',
    welcomeTapCards: 'အောက်ပါလမ်းညွှန်ကတ်များကို တစ်ခုချင်း နှိပ်၍ ဖတ်ရှုပါ-',
    welcomeReadNext: 'နောက်တစ်ခုဖတ်ရန်',
    welcomeOkay: 'အိုကေ! ဇာတ်ကောင်ပြင်ဆင်ပြီး စတင်မည် ♪',
    welcomeLocked: 'အိုကေ (အဆင့် ၄ ခုလုံး အရင်ဖတ်ပါ)',
    welcomeSteps: [
      {
        tag: 'အဆင့် ၁ · မီနူးများ',
        title: 'ဘန်ခွန်ထီယန် ဟင်းလျာနှင့် အချိုပွဲများ ချက်ပြုတ်ပါ',
        body: 'ပန်းရောင်ပင်လယ်စာမီနူး (ဂုံးသုပ်၊ ကဏန်းချက်၊ မြစ်ပုစွန်၊ ကမာဥကြော်) သို့မဟုတ် အပြာရောင်အချိုပွဲမီနူးမှ ရွေးချယ်ချက်ပြုတ်ပါ။',
      },
      {
        tag: 'အဆင့် ၂ · ပတ်ဝန်းကျင်',
        title: 'ဟင်းလျာတိုင်း၏ ဒီရေတောဇာတ်လမ်းနှင့် ဉာဏ်စမ်းမေးခွန်း',
        body: 'ဟင်းလျာတိုင်း၏ ဇာတ်လမ်းကိုဖတ်ပြီး ဉာဏ်စမ်းမေးခွန်းဖြေဆိုကာ ခရုခွံနှင့် KP အမှတ်များ စုဆောင်းပါ။',
      },
      {
        tag: 'အဆင့် ၃ · TOMODACHI',
        title: 'သက်ဝင်လှုပ်ရှားနေသော ဒီရေတောပျိုးပင်လေးကို ကျွေးမွေးပါ',
        body: 'ခြင်းထဲမှ ခရုခွံများကျွေး၍ ပျိုးပင်လေးကို အဆင့် ၄ ဆင့်ထိ ကြီးထွားစေပါ။ အမြဲနှိပ်၍ နှုတ်ဆက်နိုင်သည်—တစ်ယောက်တည်းထားလျှင် ဝမ်းနည်းတတ်သည်!',
      },
      {
        tag: 'အဆင့် ၄ · သိမ်းဆည်းခြင်း',
        title: 'Google ဖြင့် ဝင်ရောက်ပြီး တိုးတက်မှုကို သိမ်းဆည်းပါ',
        body: 'Sanctuary ကတ်ထဲတွင် Google ဖြင့် Sign In လုပ်ပြီး ခရုခွံများ၊ ပျိုးပင်အမည်နှင့် ဖန်တီးထားသော ဇာတ်ကောင်ကို သိမ်းဆည်းထားပါ။',
      },
    ],
    stepRead: '✓ ဖတ်ပြီး',
    stepUnread: 'ဖတ်ရန်နှိပ်ပါ',
    customTitle: 'သင့်ကမ်းရိုးတန်း စားဖိုမှူးဇာတ်ကောင် ပြင်ဆင်ပါ',
    customOpeningBadge: 'ကြိုဆိုပါတယ်! သင့်စားဖိုမှူးဇာတ်ကောင် ဖန်တီးပါ',
    avatarStyleLabel: 'ဇာတ်ကောင်ပုံစံ',
    girlVersion: 'Fem ပုံစံ',
    boyVersion: 'Masc ပုံစံ',
    whatCallYou: 'သင့်ကို ဘယ်လိုခေါ်ရမလဲ?',
    pronounsLabel: 'နာမ်စား (Pronouns)',
    hairstyleLabel: 'ဆံပင်ပုံစံ',
    headpieceLabel: 'ဦးထုပ်နှင့် အဆင်တန်ဆာ',
    hairColorLabel: 'ဆံပင်အရောင်',
    skinToneLabel: 'အသားအရောင်',
    apronColorLabel: 'ဝတ်စုံအရောင်',
    saveChef: 'သိမ်းဆည်းမည်',
    startAdventure: 'ချက်ပြုတ်ကြရအောင်! ♪',
    cancel: 'မလုပ်တော့ပါ',
    coastalMenuTitle: 'ပင်လယ်စာ မီနူး',
    coastalMenuSub: 'ဘန်ခွန်ထီယန် နာမည်ကြီးဟင်း ၁၄ မျိုး',
    sweetsMenuTitle: 'ဒီရေတော အချိုပွဲနှင့် အအေး',
    sweetsMenuSub: 'ရေခဲမုန့်၊ ကိတ်နှင့် အအေး ၆ မျိုး',
    cookDishBtn: 'ချက်ပြုတ်ရန်',
    storyBtn: 'ဒီရေတောဇာတ်လမ်း',
    quizBtn: 'ဉာဏ်စမ်းမေးခွန်း',
    tomodachiTitle: 'ဒီရေတော Tomodachi',
    moodCelebrating: 'ပျော်ရွှင်နေသည်!',
    moodHappy: 'ပျော်နေသည်',
    moodSad: 'အထီးကျန် / ဝမ်းနည်းနေသည်',
    moodContent: 'အေးချမ်းနေသည်',
    renameBtn: 'အမည်ပြောင်း',
    saveBtn: 'သိမ်းမည်',
    sedimentLabel: 'မြေဆီလွှာတည်ဆောက်မှု',
    shellBasket: 'ခရုခွံခြင်းတောင်း',
    tapShellFeed: 'ကျွေးရန် ခရုခွံကိုနှိပ်ပါ!',
    dailyCheckIn: 'နေ့စဉ်လက်ဆောင် +1 ခရုခွံ',
    dailyClaimed: 'ယနေ့အတွက် ယူပြီးပါပြီ',
    streakLabel: 'ဆက်တိုက်',
    customizeBtn: 'ပြင်ဆင်ရန်',
    signInBtn: 'Sign in',
    signOutBtn: 'Sign out',
    saveAcrossDevices: 'စက်ပစ္စည်းများကြား သိမ်းဆည်းရန်-',
    todaysQuests: 'ယနေ့တာဝန်များ',
    questCook: 'ဟင်းလျာ ၂ မျိုး ချက်ပြုတ်ပါ',
    questQuiz: 'ဉာဏ်စမ်းမေးခွန်း ၁ ခု ဖြေဆိုပါ',
    questFeed: 'Tomodachi ကို ခရုခွံ ၃ ခု ကျွေးပါ',
    resetProgressBtn: 'တိုးတက်မှု ပြန်စမည်',
    resetModalTitle: 'ကစားထားသော တိုးတက်မှုများကို ပြန်စမလား?',
    resetModalDesc:
      'ခရုခွံများ၊ ပျိုးပင်ကြီးထွားမှု၊ ပျိုးပင်အမည်၊ ချက်ပြီးသားဟင်းများ၊ ဉာဏ်စမ်းမေးခွန်း၊ အဝတ်အစားများနှင့် နေ့စဉ်မှတ်တမ်းများကို အစမှ ပြန်စပါမည်။',
    resetKeepChefOption: 'စားဖိုမှူးအမည်၊ ရုပ်ပုံနှင့် စတင်ပြင်ဆင်မှုကိုပါ ပြန်စမည်',
    resetConfirmBtn: 'ဟုတ်ကဲ့၊ ပြန်စမည်',
    mapTitle: 'ဘန်ခွန်ထီယန် ကမ်းရိုးတန်း စားသောက်ဆိုင်မြေပုံ',
    mapSubtitle:
      'Tomodachi အပင်လေး အဆင့်တက်တိုင်း ဘန်ခွန်ထီယန်တူးမြောင်းမှ ပင်လယ်ဝအထိ စားသောက်ဆိုင်အသစ်များ ပွင့်လာပါမည်!',
    mapActiveBadge: 'လက်ရှိဆိုင်',
    mapUnlockedBadge: 'ဖွင့်ပြီး',
    mapLockedBadge: 'ပိတ်ထားသည်',
    mapTravelHere: 'ဤဆိုင်သို့ ပြောင်းမည်',
    mapCurrentStop: 'ဤဆိုင်တွင် ချက်ပြုတ်နေသည် ★',
    mapSignatureDishes: 'ဤဆိုင်၏ အထူးဟင်းလျာများ',
    mapCookHere: 'ဤဆိုင်ဟင်းလျာများ ချက်မည် →',
    mapStopLabel: 'မှတ်တိုင်',
    mapAllUnlocked: 'ဘန်ခွန်ထီယန် စားသောက်ဆိုင် ၄ ဆိုင်လုံး ဖွင့်ပြီးပါပြီ!',
    mapActiveKitchenLabel: 'လက်ရှိဆိုင်',
    mapFilterStop: 'ဤဆိုင် (5)',
    mapShowAll: 'အားလုံးပြမည်',
    mapViewMapBtn: 'မြေပုံကြည့်ရန် →',
  },
};
