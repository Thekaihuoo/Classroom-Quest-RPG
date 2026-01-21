
import { HeroClass, Student, ShopItem, Quest } from './types';

export const COLORS = {
  TEAL: '#26A69A',
  GREEN: '#AED581',
  YELLOW: '#FFCA28',
  ORANGE: '#FF8A65',
  RED: '#EF5350',
  BLUE: '#42A5F5'
};

export const CLASS_STYLES: Record<HeroClass, string> = {
  [HeroClass.WARRIOR]: 'from-[#EF5350] to-[#E53935]',
  [HeroClass.MAGE]: 'from-[#26A69A] to-[#00897B]',
  [HeroClass.HEALER]: 'from-[#AED581] to-[#7CB342]'
};

export const GRADES = [1, 2, 3, 4, 5, 6];
export const ROOMS = [1, 2, 3, 4];

export const ATTENDANCE_XP_REWARD = 20;

export const CARTOON_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=ffeb3b",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=8bc34a",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=00bcd4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow&backgroundColor=f48fb1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=ffccbc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha&backgroundColor=e1bee7",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Finn&backgroundColor=bbdefb"
];

export const MASTER_QUESTS: Quest[] = [
  { id: 'q1', title: 'สมาธิตั้งมั่น', rewardXp: 25, rewardGold: 10, description: 'นั่งสมาธิหรือจดจ่อกับการเรียนโดยไม่วอกแวก', durationMinutes: 10, icon: 'fa-brain' },
  { id: 'q2', title: 'นักอ่านนิรนาม', rewardXp: 40, rewardGold: 15, description: 'อ่านหนังสือเงียบๆ ในมุมอ่านหนังสือ', durationMinutes: 20, icon: 'fa-book-open' },
  { id: 'q3', title: 'ผู้ช่วยงานศิลป์', rewardXp: 30, rewardGold: 10, description: 'ช่วยจัดบอร์ดหรือตกแต่งห้องเรียน', durationMinutes: 15, icon: 'fa-palette' },
  { id: 'q4', title: 'จอมขยันประจักษ์', rewardXp: 60, rewardGold: 25, description: 'ทำงานกลุ่มหรืองานที่ได้รับมอบหมายจนเสร็จ', durationMinutes: 40, icon: 'fa-scroll' },
  { id: 'q5', title: 'สำรวจโลกกว้าง', rewardXp: 20, rewardGold: 5, description: 'สำรวจและบันทึกสิ่งที่พบนอกห้องเรียน (ช่วงพัก)', durationMinutes: 5, icon: 'fa-compass' }
];

export const DAILY_XP_REWARD = 10;
export const DAILY_GOLD_REWARD = 5;

export const SHOP_ITEMS: ShopItem[] = [
  { id: '1', name: 'บัตรข้ามการบ้าน', price: 150, description: 'ใช้ยกเว้นการส่งการบ้านได้ 1 ครั้ง', icon: 'fa-file-circle-xmark' },
  { id: '2', name: 'บัตรเปลี่ยนที่นั่ง', price: 100, description: 'ย้ายไปนั่งโต๊ะที่ต้องการได้ 1 วัน', icon: 'fa-chair' },
  { id: '3', name: 'ดีเจประจำห้อง', price: 80, description: 'เลือกเปิดเพลงระหว่างทำงานส่วนตัวได้', icon: 'fa-music' },
  { id: '4', name: 'ยาเพิ่มพลังชีวิต', price: 50, description: 'ฟื้นฟูพลังชีวิต 50 HP ทันที', icon: 'fa-flask' }
];

export const INITIAL_STUDENTS: Student[] = [
  { id: '101', name: 'อาร์เธอร์ ปากกาเหล็ก', heroClass: HeroClass.WARRIOR, grade: 1, room: 1, level: 1, hp: 100, maxHp: 100, xp: 0, gold: 50, avatar: CARTOON_AVATARS[0] },
  { id: '102', name: 'เมอร์ลิน จอมปราชญ์', heroClass: HeroClass.MAGE, grade: 1, room: 1, level: 1, hp: 70, maxHp: 70, xp: 0, gold: 50, avatar: CARTOON_AVATARS[7] }
];

export const LOGO_URL = "https://img5.pic.in.th/file/secure-sv1/-668e94e3b2fda05e3.png";
