
import { Student, HeroClass, LogEntry, ShopItem, Quest } from './types';
import { INITIAL_STUDENTS as DATA, SHOP_ITEMS as INITIAL_SHOP, MASTER_QUESTS as INITIAL_QUESTS } from './constants';

const STORAGE_KEY = 'classroom_quest_data';
const LOGS_KEY = 'classroom_quest_logs';
const SHOP_KEY = 'classroom_quest_shop';
const QUESTS_KEY = 'classroom_quest_quests';

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
    return DATA;
  }
  return JSON.parse(data);
};

export const saveStudents = (students: Student[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const getShopItems = (): ShopItem[] => {
  const data = localStorage.getItem(SHOP_KEY);
  if (!data) {
    localStorage.setItem(SHOP_KEY, JSON.stringify(INITIAL_SHOP));
    return INITIAL_SHOP;
  }
  return JSON.parse(data);
};

export const saveShopItems = (items: ShopItem[]) => {
  localStorage.setItem(SHOP_KEY, JSON.stringify(items));
};

export const getQuests = (): Quest[] => {
  const data = localStorage.getItem(QUESTS_KEY);
  if (!data) {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(INITIAL_QUESTS));
    return INITIAL_QUESTS;
  }
  return JSON.parse(data);
};

export const saveQuests = (quests: Quest[]) => {
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
};

export const getLogs = (): LogEntry[] => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
  const logs = getLogs();
  const newLog: LogEntry = {
    ...log,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now()
  };
  localStorage.setItem(LOGS_KEY, JSON.stringify([newLog, ...logs].slice(0, 50)));
};

export const updateStudentStats = (students: Student[], studentId: string, updates: Partial<Student>): Student[] => {
  return students.map(s => {
    if (s.id !== studentId) return s;
    
    let newStudent = { ...s, ...updates };

    // Passive Skill: Mage gets 20% more gold
    if (updates.gold && updates.gold > s.gold && s.heroClass === HeroClass.MAGE) {
      const diff = updates.gold - s.gold;
      newStudent.gold = s.gold + Math.ceil(diff * 1.2);
    }

    // Game Logic: Level Up
    const XP_THRESHOLD = 100;
    while (newStudent.xp >= XP_THRESHOLD) {
      newStudent.xp -= XP_THRESHOLD;
      newStudent.level += 1;
      newStudent.maxHp += 10;
      
      // Passive Skill: Healer restores full HP on level up
      if (s.heroClass === HeroClass.HEALER) {
        newStudent.hp = newStudent.maxHp;
      } else {
        newStudent.hp = Math.min(newStudent.maxHp, newStudent.hp + 20);
      }
    }

    // Passive Skill: Warrior is tough (takes 20% less damage/penalty)
    if (updates.hp && updates.hp < s.hp && s.heroClass === HeroClass.WARRIOR) {
      const damage = s.hp - updates.hp;
      newStudent.hp = s.hp - Math.floor(damage * 0.8);
    }

    // Bounds checking
    newStudent.hp = Math.min(newStudent.maxHp, Math.max(0, newStudent.hp));
    newStudent.xp = Math.max(0, newStudent.xp);
    newStudent.gold = Math.max(0, newStudent.gold);

    return newStudent;
  });
};
