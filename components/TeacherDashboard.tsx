
import React, { useState, useMemo, useEffect } from 'react';
import { Student, HeroClass, Quest, ShopItem, LogEntry } from '../types';
import { CLASS_STYLES, MASTER_QUESTS, SHOP_ITEMS, GRADES, ROOMS, CARTOON_AVATARS, ATTENDANCE_XP_REWARD } from '../constants';
import { updateStudentStats, addLog, getLogs } from '../utils';

interface TeacherDashboardProps {
  students: Student[];
  onUpdate: (students: Student[]) => void;
  shopItems: ShopItem[];
  onUpdateShopItems: (items: ShopItem[]) => void;
  quests: Quest[];
  onUpdateQuests: (quests: Quest[]) => void;
  initialTab?: 'ARENA' | 'CHRONICLES' | 'TREASURY' | 'INSIGHTS' | 'EVENTS' | 'MANAGEMENT' | 'ATTENDANCE';
}

type SortKey = 'name' | 'grade' | 'room' | 'heroClass' | 'level' | 'xp' | 'gold';

// Extended Icon List for Shop Items
const ICON_LIST = [
  'fa-star', 'fa-coins', 'fa-shield-halved', 'fa-wand-magic-sparkles', 'fa-hand-holding-heart',
  'fa-file-circle-xmark', 'fa-chair', 'fa-music', 'fa-flask', 'fa-scroll', 'fa-gem', 'fa-crown',
  'fa-brain', 'fa-book-open', 'fa-palette', 'fa-compass', 'fa-hammer', 'fa-map', 'fa-gift',
  'fa-rocket', 'fa-ghost', 'fa-dragon', 'fa-khanda', 'fa-clapperboard', 'fa-microphone'
];

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  students, onUpdate, shopItems, onUpdateShopItems, quests, onUpdateQuests, initialTab = 'ARENA' 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filterGrade, setFilterGrade] = useState(1);
  const [filterRoom, setFilterRoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Treasury State
  const [editingShopItem, setEditingShopItem] = useState<ShopItem | null>(null);
  const [isManagingShop, setIsManagingShop] = useState(false);
  const [shopForm, setShopForm] = useState<Partial<ShopItem>>({ icon: 'fa-gem', price: 100 });

  // Sorting and Selection
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Form State for Add/Edit Student
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formGrade, setFormGrade] = useState(1);
  const [formRoom, setFormRoom] = useState(1);
  const [formClass, setFormClass] = useState<HeroClass>(HeroClass.WARRIOR);
  const [formAvatar, setFormAvatar] = useState(CARTOON_AVATARS[0]);

  // Sync tab with props from Sidebar
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const allFilteredStudents = useMemo(() => {
    return students.filter(s => 
      s.grade === filterGrade && 
      s.room === filterRoom &&
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, filterGrade, filterRoom, searchTerm]);

  const sortedStudents = useMemo(() => {
    const items = [...allFilteredStudents];
    if (sortConfig !== null) {
      items.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [allFilteredStudents, sortConfig]);

  const stats = useMemo(() => {
    if (allFilteredStudents.length === 0) return { avgLevel: 0, totalGold: 0, topHero: 'N/A', faintedCount: 0 };
    const totalGold = allFilteredStudents.reduce((acc, s) => acc + s.gold, 0);
    const avgLevel = (allFilteredStudents.reduce((acc, s) => acc + s.level, 0) / allFilteredStudents.length).toFixed(1);
    const topHero = [...allFilteredStudents].sort((a, b) => b.level - a.level)[0]?.name;
    const faintedCount = allFilteredStudents.filter(s => s.hp <= 0).length;
    return { avgLevel, totalGold, topHero, faintedCount };
  }, [allFilteredStudents]);

  const behaviorPresets = [
    { label: 'ส่งงานครบถ้วน', type: 'XP' as const, amount: 25, icon: 'fa-file-signature', color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'ช่วยเพื่อน / จิตอาสา', type: 'XP' as const, amount: 15, icon: 'fa-handshake-angle', color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'ตอบคำถามถูกต้อง', type: 'GOLD' as const, amount: 5, icon: 'fa-lightbulb', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'มาสาย / เข้าห้องช้า', type: 'HP' as const, amount: -15, icon: 'fa-clock', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'คุยเก่ง / รบกวนผู้อื่น', type: 'HP' as const, amount: -10, icon: 'fa-comments', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'ไม่ส่งการบ้าน', type: 'HP' as const, amount: -20, icon: 'fa-book-skull', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const resetForm = () => {
    setIsAdding(false);
    setEditingStudent(null);
    setFormId('');
    setFormName('');
    setFormGrade(filterGrade);
    setFormRoom(filterRoom);
    setFormClass(HeroClass.WARRIOR);
    setFormAvatar(CARTOON_AVATARS[0]);
  };

  const startEdit = (s: Student) => {
    setEditingStudent(s);
    setFormId(s.id);
    setFormName(s.name);
    setFormGrade(s.grade);
    setFormRoom(s.room);
    setFormClass(s.heroClass);
    setFormAvatar(s.avatar);
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');

    if (editingStudent) {
      const updated = students.map(s => s.id === editingStudent.id ? {
        ...s,
        id: formId,
        name: formName,
        grade: formGrade,
        room: formRoom,
        heroClass: formClass,
        avatar: formAvatar
      } : s);
      onUpdate(updated);
    } else {
      if (students.find(s => s.id === formId)) return alert('รหัสผู้กล้านี้มีอยู่ในระบบแล้ว');
      const maxHp = formClass === HeroClass.WARRIOR ? 120 : (formClass === HeroClass.HEALER ? 90 : 70);
      const newStudent: Student = {
        id: formId,
        name: formName,
        grade: formGrade,
        room: formRoom,
        heroClass: formClass,
        avatar: formAvatar,
        level: 1,
        hp: maxHp,
        maxHp: maxHp,
        xp: 0,
        gold: 50
      };
      onUpdate([...students, newStudent]);
      addLog({ studentId: formId, studentName: formName, type: 'XP', amount: 0, reason: 'เข้าร่วมกิลด์ผู้กล้า' });
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้กล้านี้?')) return;
    onUpdate(students.filter(s => s.id !== id));
  };

  const handleMassAction = (type: 'XP' | 'GOLD', amount: number, reason: string) => {
    const targetIds = selectedIds.size > 0 ? Array.from(selectedIds) : allFilteredStudents.map(s => s.id);
    if (targetIds.length === 0) return alert('ไม่พบผู้กล้าที่ต้องการดำเนินการ');
    if (!window.confirm(`ยืนยันการมอบ ${amount} ${type} ให้ผู้กล้า ${targetIds.length} ท่าน?`)) return;
    
    let newStudents = [...students];
    targetIds.forEach(id => {
      const student = newStudents.find(s => s.id === id);
      if (student) {
        newStudents = updateStudentStats(newStudents, id, { [type.toLowerCase()]: (student as any)[type.toLowerCase()] + amount });
        addLog({ studentId: id, studentName: student.name, type, amount, reason: `[รางวัลกลุ่ม] ${reason}` });
      }
    });
    onUpdate(newStudents);
  };

  const handleManualAction = (studentId: string, type: 'XP' | 'GOLD' | 'HP', amount: number, reason: string) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    const updatedStudents = updateStudentStats(students, studentId, { 
      [type.toLowerCase()]: (target as any)[type.toLowerCase()] + amount 
    });
    onUpdate(updatedStudents);
    addLog({ studentId, studentName: target.name, type, amount, reason });
    
    const updated = updatedStudents.find(s => s.id === studentId);
    if (updated) setSelectedStudent(updated);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === allFilteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allFilteredStudents.map(s => s.id)));
    }
  };

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return <i className="fa-solid fa-sort ml-1 opacity-20"></i>;
    return sortConfig.direction === 'asc' 
      ? <i className="fa-solid fa-sort-up ml-1 text-teal-400"></i> 
      : <i className="fa-solid fa-sort-down ml-1 text-teal-400"></i>;
  };

  // Treasury Management (Shop Items)
  const handleSaveShopItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopForm.name || !shopForm.price) return alert('กรุณากรอกข้อมูลไอเทมให้ครบถ้วน');

    if (editingShopItem) {
      onUpdateShopItems(shopItems.map(item => item.id === editingShopItem.id ? { ...item, ...shopForm } as ShopItem : item));
    } else {
      const newItem: ShopItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: shopForm.name!,
        price: Number(shopForm.price!),
        description: shopForm.description || '',
        icon: shopForm.icon || 'fa-gem'
      };
      onUpdateShopItems([...shopItems, newItem]);
    }
    setIsManagingShop(false);
    setEditingShopItem(null);
    setShopForm({ icon: 'fa-gem', price: 100 });
  };

  const deleteShopItem = (id: string) => {
    if (!window.confirm('คุณต้องการลบไอเทมนี้ออกจากคลังสมบัติใช่หรือไม่?')) return;
    onUpdateShopItems(shopItems.filter(i => i.id !== id));
  };

  const startEditShopItem = (item: ShopItem) => {
    setEditingShopItem(item);
    setShopForm(item);
    setIsManagingShop(true);
  };

  // Attendance Management
  const todayDate = new Date().toISOString().split('T')[0];

  const handleAttendance = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    if (student.lastAttendance === todayDate) return;

    const updatedStudents = updateStudentStats(students, id, { 
      xp: student.xp + ATTENDANCE_XP_REWARD,
      lastAttendance: todayDate
    });
    onUpdate(updatedStudents);
    addLog({ studentId: id, studentName: student.name, type: 'ATTENDANCE', amount: ATTENDANCE_XP_REWARD, reason: 'ลงชื่อเข้าอาณาจักร (เช็คชื่อ)' });
  };

  const handleAttendanceAll = () => {
    const targetStudents = allFilteredStudents.filter(s => s.lastAttendance !== todayDate);
    if (targetStudents.length === 0) return alert('ผู้กล้าทุกคนถูกเช็คชื่อเรียบร้อยแล้ว');
    if (!window.confirm(`ยืนยันการเช็คชื่อผู้กล้าทั้ง ${targetStudents.length} ท่าน?`)) return;

    let updatedStudents = [...students];
    targetStudents.forEach(s => {
      updatedStudents = updateStudentStats(updatedStudents, s.id, { 
        xp: s.xp + ATTENDANCE_XP_REWARD,
        lastAttendance: todayDate
      });
      addLog({ studentId: s.id, studentName: s.name, type: 'ATTENDANCE', amount: ATTENDANCE_XP_REWARD, reason: 'มาเรียนตรงเวลา (เช็คชื่อยกกิลด์)' });
    });
    onUpdate(updatedStudents);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 👑 Master Header - Bento Grid Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 glass p-8 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 space-y-4">
            <span className="bg-teal-500/30 text-teal-300 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-500/20">Guild Master Board</span>
            <h1 className="text-4xl font-black leading-tight">ยินดีต้อนรับ,<br/><span className="text-teal-400">มาสเตอร์กิลด์</span></h1>
          </div>
          <div className="relative z-10 flex gap-3 mt-6">
            <button onClick={() => handleMassAction('XP', 10, 'ตั้งใจเรียน')} className="bg-white/10 hover:bg-teal-500/30 px-6 py-3 rounded-2xl text-xs font-black transition-all border border-white/10 flex items-center gap-2">
              <i className="fa-solid fa-star text-teal-400"></i> +10 XP
            </button>
            <button onClick={() => handleMassAction('GOLD', 5, 'ผลงานยอดเยี่ยม')} className="bg-white/10 hover:bg-amber-500/30 px-6 py-3 rounded-2xl text-xs font-black transition-all border border-white/10 flex items-center gap-2">
              <i className="fa-solid fa-coins text-amber-400"></i> +5 G
            </button>
          </div>
        </div>

        <div className="glass p-6 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-2 card-lift border border-white/10">
          <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400 mb-2 shadow-inner">
            <i className="fa-solid fa-chart-line text-xl"></i>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">เลเวลเฉลี่ยกิลด์</p>
          <p className="text-5xl font-black text-white">{stats.avgLevel}</p>
        </div>

        <div className="glass p-6 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-2 card-lift border border-white/10">
          <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 mb-2 shadow-inner">
            <i className="fa-solid fa-heart-pulse text-xl"></i>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ผู้กล้าบาดเจ็บ</p>
          <p className="text-5xl font-black text-rose-500">{stats.faintedCount}</p>
        </div>
      </section>

      {/* 🧭 Tabs Navigation */}
      <nav className="flex flex-wrap glass p-2 rounded-[2.5rem] w-fit shadow-xl border border-white/5 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'ARENA', label: 'สนามฝึกซ้อม', icon: 'fa-swords' },
          { id: 'ATTENDANCE', label: 'เช็คชื่อผู้กล้า', icon: 'fa-calendar-check' },
          { id: 'MANAGEMENT', label: 'จัดการผู้กล้า', icon: 'fa-users-gear' },
          { id: 'CHRONICLES', label: 'บันทึกตำนาน', icon: 'fa-scroll' },
          { id: 'TREASURY', label: 'คลังสมบัติ', icon: 'fa-vault' },
          { id: 'INSIGHTS', label: 'วิเคราะห์กิลด์', icon: 'fa-chart-pie' },
          { id: 'EVENTS', label: 'ประกาศศักดา', icon: 'fa-bullhorn' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </nav>

      <div className="min-h-[600px]">
        {/* 🏟️ ARENA VIEW */}
        {activeTab === 'ARENA' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-wrap gap-4 items-center glass p-4 rounded-[2rem] border border-white/10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">สำรวจชั้นเรียน:</span>
                <div className="flex gap-2">
                  <select value={filterGrade} onChange={e => setFilterGrade(Number(e.target.value))} className="bg-slate-900 border border-white/10 rounded-xl p-2 px-6 font-bold text-teal-400 outline-none hover:border-teal-500/50 transition-all">
                    {GRADES.map(g => <option key={g} value={g}>ป.{g}</option>)}
                  </select>
                  <select value={filterRoom} onChange={e => setFilterRoom(Number(e.target.value))} className="bg-slate-900 border border-white/10 rounded-xl p-2 px-6 font-bold text-teal-400 outline-none hover:border-teal-500/50 transition-all">
                    {ROOMS.map(r => <option key={r} value={r}>ห้อง {r}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <input 
                    type="text" 
                    placeholder="ค้นหาชื่อผู้กล้า..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2 px-6 text-sm font-bold text-white outline-none focus:border-teal-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedStudents.map(hero => (
                  <div 
                    key={hero.id} 
                    onClick={() => setSelectedStudent(hero)}
                    className="glass rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-teal-500/10 transition-all cursor-pointer border border-white/5 group card-lift"
                  >
                    <div className={`h-24 bg-gradient-to-br ${CLASS_STYLES[hero.heroClass]} p-6 flex justify-between items-start opacity-90 group-hover:opacity-100 transition-opacity`}>
                       <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-white uppercase border border-white/30">Lv.{hero.level}</div>
                       <i className={`fa-solid ${hero.heroClass === HeroClass.WARRIOR ? 'fa-shield-halved' : hero.heroClass === HeroClass.MAGE ? 'fa-wand-magic-sparkles' : 'fa-hand-holding-heart'} text-white/40 text-2xl`}></i>
                    </div>
                    <div className="p-6 relative -mt-10">
                       <img src={hero.avatar} className="w-20 h-20 rounded-[2rem] border-4 border-slate-900 shadow-2xl object-cover relative" />
                       <div className="mt-4">
                         <h3 className="font-black text-lg text-white truncate">{hero.name}</h3>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{hero.heroClass}</p>
                       </div>
                       <div className="mt-4 space-y-3">
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${(hero.hp/hero.maxHp)*100}%` }}></div>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-400 transition-all duration-1000" style={{ width: `${hero.xp}%` }}></div>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        )}

        {/* 📅 ATTENDANCE VIEW */}
        {activeTab === 'ATTENDANCE' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-wrap gap-4 items-center glass p-6 rounded-[3rem] border border-white/10 shadow-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">เลือกกิลด์:</span>
                  <div className="flex gap-2">
                    <select value={filterGrade} onChange={e => setFilterGrade(Number(e.target.value))} className="bg-slate-900 border border-white/10 rounded-xl p-2 px-6 font-bold text-teal-400 outline-none">
                      {GRADES.map(g => <option key={g} value={g}>ป.{g}</option>)}
                    </select>
                    <select value={filterRoom} onChange={e => setFilterRoom(Number(e.target.value))} className="bg-slate-900 border border-white/10 rounded-xl p-2 px-6 font-bold text-teal-400 outline-none">
                      {ROOMS.map(r => <option key={r} value={r}>ห้อง {r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex-1"></div>
                <div className="text-center p-4 glass rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase">วันที่ปัจจุบัน</p>
                  <p className="font-black text-teal-400 text-lg">{new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <button 
                  onClick={handleAttendanceAll}
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-black text-xs shadow-xl hover:scale-[1.05] transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check-double"></i> เช็คชื่อทั้งกิลด์ (+{ATTENDANCE_XP_REWARD} XP)
                </button>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allFilteredStudents.map(hero => {
                  const isPresent = hero.lastAttendance === todayDate;
                  return (
                    <div 
                      key={hero.id} 
                      onClick={() => !isPresent && handleAttendance(hero.id)}
                      className={`glass rounded-[2.5rem] overflow-hidden shadow-lg transition-all border-2 relative group ${isPresent ? 'border-teal-500/50 bg-teal-500/5' : 'border-white/5 hover:border-white/10 cursor-pointer card-lift'}`}
                    >
                      {isPresent && (
                        <div className="absolute top-4 right-4 z-20 bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                          <i className="fa-solid fa-check"></i>
                        </div>
                      )}
                      <div className={`h-20 bg-gradient-to-br ${CLASS_STYLES[hero.heroClass]} p-6 opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                      <div className="p-6 relative -mt-10 flex flex-col items-center text-center">
                         <img src={hero.avatar} className={`w-20 h-20 rounded-[2rem] border-4 border-slate-900 shadow-2xl object-cover mb-4 ${isPresent ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'} transition-all`} />
                         <h3 className="font-black text-lg text-white truncate w-full">{hero.name}</h3>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">ป.{hero.grade}/{hero.room}</p>
                         
                         {!isPresent ? (
                           <span className="text-[10px] font-black text-teal-400 group-hover:animate-pulse">คลิกเพื่อลงชื่อมาเรียน</span>
                         ) : (
                           <span className="text-[10px] font-black text-teal-600">ลงชื่อเข้าเรียนแล้ว</span>
                         )}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {/* 🛠️ MANAGEMENT VIEW */}
        {activeTab === 'MANAGEMENT' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-wrap gap-4 items-center glass p-6 rounded-[3rem] border border-white/10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">สำรวจชั้นเรียน:</span>
                  <div className="flex gap-2">
                    <select value={filterGrade} onChange={e => setFilterGrade(Number(e.target.value))} className="bg-slate-900 border border-white/10 rounded-xl p-2 px-6 font-bold text-teal-400 outline-none hover:border-teal-500/50 transition-all">
                      {GRADES.map(g => <option key={g} value={g}>ป.{g}</option>)}
                    </select>
                    <select value={filterRoom} onChange={e => setFilterRoom(Number(e.target.value))} className="bg-slate-900 border border-white/10 rounded-xl p-2 px-6 font-bold text-teal-400 outline-none hover:border-teal-500/50 transition-all">
                      {ROOMS.map(r => <option key={r} value={r}>ห้อง {r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">ค้นหาด้วยชื่อ:</span>
                  <input 
                    type="text" 
                    placeholder="ค้นหาชื่อ..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2 px-6 text-sm font-bold text-white outline-none focus:border-teal-500/50 transition-all"
                  />
                </div>
                <div className="flex items-end h-full">
                   <button 
                     onClick={() => setIsAdding(true)}
                     className="px-8 py-3 bg-teal-500 text-white rounded-2xl font-black text-xs shadow-lg hover:scale-[1.05] transition-all"
                   >
                     + เพิ่มผู้กล้าใหม่
                   </button>
                </div>
             </div>

             {/* Bulk Action Controls */}
             {selectedIds.size > 0 && (
               <div className="glass p-4 rounded-2xl border border-teal-500/30 flex items-center justify-between animate-in slide-in-from-top-2">
                 <p className="text-sm font-bold text-white ml-4">เลือกผู้กล้าแล้ว {selectedIds.size} ท่าน</p>
                 <div className="flex gap-2">
                   <button onClick={() => handleMassAction('XP', 20, 'รางวัลพิเศษ')} className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-xl text-[10px] font-black uppercase hover:bg-teal-500 hover:text-white transition-all">Award 20 XP</button>
                   <button onClick={() => handleMassAction('GOLD', 10, 'รางวัลพิเศษ')} className="px-4 py-2 bg-amber-500/20 text-amber-500 rounded-xl text-[10px] font-black uppercase hover:bg-amber-500 hover:text-white transition-all">Award 10 G</button>
                   <button onClick={() => setSelectedIds(new Set())} className="px-4 py-2 text-slate-500 font-bold text-[10px] uppercase hover:text-white">ยกเลิกทั้งหมด</button>
                 </div>
               </div>
             )}

             <div className="glass rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                       <tr>
                         <th className="px-8 py-6">
                            <input 
                              type="checkbox" 
                              className="accent-teal-500 w-4 h-4" 
                              checked={selectedIds.size === sortedStudents.length && sortedStudents.length > 0} 
                              onChange={toggleSelectAll}
                            />
                         </th>
                         <th className="px-8 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('name')}>ผู้กล้า {renderSortIcon('name')}</th>
                         <th className="px-8 py-6 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('heroClass')}>คลาส {renderSortIcon('heroClass')}</th>
                         <th className="px-8 py-6 cursor-pointer hover:text-white transition-colors text-center" onClick={() => requestSort('level')}>เลเวล {renderSortIcon('level')}</th>
                         <th className="px-8 py-6 cursor-pointer hover:text-white transition-colors text-center" onClick={() => requestSort('xp')}>XP {renderSortIcon('xp')}</th>
                         <th className="px-8 py-6 cursor-pointer hover:text-white transition-colors text-right" onClick={() => requestSort('gold')}>ทรัพย์สิน {renderSortIcon('gold')}</th>
                         <th className="px-8 py-6 text-right">จัดการ</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       {sortedStudents.map(s => (
                         <tr key={s.id} className={`hover:bg-white/5 transition-colors ${selectedIds.has(s.id) ? 'bg-teal-500/5' : ''}`}>
                           <td className="px-8 py-6">
                              <input 
                                type="checkbox" 
                                className="accent-teal-500 w-4 h-4" 
                                checked={selectedIds.has(s.id)} 
                                onChange={() => toggleSelect(s.id)}
                              />
                           </td>
                           <td className="px-8 py-6 flex items-center gap-4">
                              <img src={s.avatar} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                              <span className="font-bold text-white">{s.name}</span>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black text-white bg-gradient-to-r ${CLASS_STYLES[s.heroClass]}`}>{s.heroClass}</span>
                           </td>
                           <td className="px-8 py-6 text-center font-black text-white text-lg">{s.level}</td>
                           <td className="px-8 py-6 text-center text-xs text-slate-500 font-bold">{s.xp}%</td>
                           <td className="px-8 py-6 text-right font-black text-amber-500">{s.gold} G</td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                 <button onClick={() => startEdit(s)} className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white transition-all"><i className="fa-solid fa-pen"></i></button>
                                 <button onClick={() => handleDelete(s.id)} className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><i className="fa-solid fa-trash"></i></button>
                              </div>
                           </td>
                       </tr>
                       ))}
                       {sortedStudents.length === 0 && (
                         <tr><td colSpan={7} className="p-32 text-center text-slate-600 italic font-black uppercase">ไม่พบข้อมูลผู้กล้า</td></tr>
                       )}
                     </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* 📜 CHRONICLES VIEW */}
        {activeTab === 'CHRONICLES' && (
          <div className="glass rounded-[4rem] overflow-hidden border border-white/5 animate-in slide-in-from-bottom-6 duration-500">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-black text-white">บันทึกตำนานล่าสุด</h2>
              <button onClick={() => window.print()} className="px-6 py-2 glass text-[10px] font-black text-teal-400 hover:text-white border border-teal-500/20 rounded-xl transition-all">ส่งออกรายงาน</button>
            </div>
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
              {getLogs().map((log) => (
                <div key={log.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-inner ${
                        log.type === 'XP' ? 'bg-teal-500/10 text-teal-400' : 
                        log.type === 'GOLD' ? 'bg-amber-500/10 text-amber-500' : 
                        log.type === 'ATTENDANCE' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                         <i className={`fa-solid ${log.type === 'XP' ? 'fa-arrow-up-long' : log.type === 'GOLD' ? 'fa-coins' : log.type === 'ATTENDANCE' ? 'fa-calendar-check' : 'fa-bolt'}`}></i>
                      </div>
                      <div>
                        <p className="font-black text-white">{log.studentName}</p>
                        <p className="text-xs text-slate-500 font-medium">{log.reason}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`font-black text-lg ${log.amount > 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                        {log.amount > 0 ? '+' : ''}{log.amount} {log.type === 'ATTENDANCE' ? 'XP' : log.type}
                      </p>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 💰 TREASURY VIEW (Managed Shop Items) */}
        {activeTab === 'TREASURY' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in slide-in-from-bottom-6 duration-500">
             {/* Quests Sidebar-like section */}
             <div className="lg:col-span-2 glass p-8 rounded-[4rem] space-y-6 border border-white/5 shadow-2xl h-fit">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-white">ภารกิจกิลด์</h3>
                   <span className="text-[10px] font-black text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full uppercase">Master List</span>
                </div>
                <div className="space-y-4">
                   {quests.map(q => (
                     <div key={q.id} className="p-5 glass rounded-3xl flex justify-between items-center group border border-white/5 hover:border-teal-500/30 transition-all">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-teal-400 transition-colors shadow-inner">
                              <i className={`fa-solid ${q.icon} text-xl`}></i>
                           </div>
                           <div>
                              <p className="font-black text-slate-200 text-sm tracking-tight">{q.title}</p>
                              <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">+{q.rewardXp} XP / +{q.rewardGold} G</p>
                           </div>
                        </div>
                        <button className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-600 hover:text-white transition-all flex items-center justify-center">
                           <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                     </div>
                   ))}
                </div>
             </div>
             
             {/* Shop Items Main Section */}
             <div className="lg:col-span-3 glass p-10 rounded-[4rem] space-y-8 border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center">
                   <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter">รายการไอเทมในร้านค้า</h3>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Marketplace Inventory</p>
                   </div>
                   <button 
                     onClick={() => { setShopForm({ icon: 'fa-gem', price: 100 }); setEditingShopItem(null); setIsManagingShop(true); }}
                     className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-xs shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                   >
                     <i className="fa-solid fa-plus-circle text-lg"></i> เพิ่มไอเทมใหม่
                   </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {shopItems.map(item => (
                     <div key={item.id} className="p-6 glass rounded-[3rem] border border-white/5 hover:border-amber-500/30 transition-all group relative overflow-hidden flex flex-col justify-between h-56">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
                        <div>
                           <div className="flex justify-between items-start mb-4">
                              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-3xl text-slate-500 group-hover:text-amber-500 transition-all shadow-inner border border-white/5">
                                 <i className={`fa-solid ${item.icon}`}></i>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => startEditShopItem(item)} className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white transition-all flex items-center justify-center shadow-lg"><i className="fa-solid fa-pen"></i></button>
                                 <button onClick={() => deleteShopItem(item.id)} className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-lg"><i className="fa-solid fa-trash-can"></i></button>
                              </div>
                           </div>
                           <h4 className="font-black text-white text-xl tracking-tight leading-none mb-2">{item.name}</h4>
                           <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>
                        <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-4">
                           <span className="font-black text-amber-500 text-2xl flex items-center gap-2"><i className="fa-solid fa-coins text-sm"></i> {item.price}</span>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">ID: {item.id}</span>
                        </div>
                     </div>
                   ))}
                </div>
                {shopItems.length === 0 && (
                   <div className="py-20 text-center glass rounded-[3rem] border-dashed border-2 border-white/5">
                      <i className="fa-solid fa-box-open text-6xl text-slate-700 mb-6"></i>
                      <p className="text-slate-500 font-black uppercase tracking-widest italic">ยังไม่มีไอเทมในคลังสมบัติ...</p>
                   </div>
                )}
             </div>
          </div>
        )}

        {/* Insights & Events Views */}
        {activeTab === 'INSIGHTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-500">
             <div className="glass p-8 rounded-[3rem] space-y-6 border border-white/10">
                <h3 className="text-xl font-black text-white">สัดส่วนประชากรกิลด์</h3>
                <div className="space-y-6">
                   {Object.values(HeroClass).map(c => {
                      const count = allFilteredStudents.filter(s => s.heroClass === c).length;
                      const percent = allFilteredStudents.length ? (count / allFilteredStudents.length) * 100 : 0;
                      return (
                        <div key={c} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>{c}</span>
                            <span className="text-white">{count} ท่าน ({percent.toFixed(0)}%)</span>
                          </div>
                          <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div className={`h-full bg-gradient-to-r ${CLASS_STYLES[c]}`} style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      )
                   })}
                </div>
             </div>
             <div className="glass p-8 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4 border border-white/10">
                <div className="w-32 h-32 glass rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl border border-white/10 animate-float">👑</div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">ราชาวีรบุรุษปัจจุบัน</h3>
                  <p className="text-3xl font-black text-white mt-2">{stats.topHero}</p>
                </div>
             </div>
             <div className="glass p-8 rounded-[3rem] space-y-6 border border-white/10">
                <h3 className="text-xl font-black text-white">สุขภาพกิลด์โดยรวม</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 glass rounded-[2rem] text-center border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase">เลเวลสูงสุด</p>
                      <p className="text-4xl font-black text-teal-400 mt-1">{Math.max(...(allFilteredStudents.map(s => s.level) || [0]))}</p>
                   </div>
                   <div className="p-6 glass rounded-[2rem] text-center border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase">เฉลี่ยทอง</p>
                      <p className="text-4xl font-black text-amber-500 mt-1">{allFilteredStudents.length ? (stats.totalGold / allFilteredStudents.length).toFixed(0) : 0}</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'EVENTS' && (
           <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-500">
              <div className="glass p-12 rounded-[4rem] text-center space-y-6 relative overflow-hidden group border border-white/10 shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center text-4xl text-teal-400 mx-auto shadow-inner animate-float">
                    <i className="fa-solid fa-bullhorn"></i>
                 </div>
                 <h2 className="text-3xl font-black text-white">ประกาศศักดาแห่งกิลด์</h2>
                 <p className="text-slate-400 font-medium">ส่งข้อความประกาศถึงหน้าจอของผู้กล้าทุกคนในอาณาจักรโดยตรง</p>
                 <textarea 
                    placeholder="พิมพ์ประกาศสำคัญที่นี่..."
                    className="w-full h-32 glass rounded-[2.5rem] border border-white/10 p-8 text-white placeholder:text-slate-600 focus:border-teal-500/50 outline-none transition-all resize-none shadow-inner"
                 />
                 <button className="w-full py-5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                    ส่งประกาศด่วน (Global Broadcast)
                 </button>
              </div>
           </div>
        )}
      </div>

      {/* 🛠️ Shop Management Modal */}
      {isManagingShop && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <form onSubmit={handleSaveShopItem} className="glass rounded-[4rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-gradient-to-br from-amber-500 to-orange-600 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
               <div className="relative z-10">
                  <h2 className="text-3xl font-black tracking-tight">{editingShopItem ? 'แก้ไขไอเทม' : 'อัญเชิญไอเทมใหม่'}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mt-1">Marketplace Creation</p>
               </div>
               <button type="button" onClick={() => setIsManagingShop(false)} className="w-14 h-14 flex items-center justify-center hover:bg-white/20 rounded-2xl transition-all relative z-10 border border-white/20">
                  <i className="fa-solid fa-xmark text-2xl"></i>
               </button>
            </div>
            
            <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Visual Preview */}
                 <div className="space-y-4 text-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">ไอเทมพรีวิว</label>
                    <div className="w-full aspect-square glass rounded-[2.5rem] flex flex-col items-center justify-center p-6 border-2 border-amber-500/20 shadow-2xl">
                       <i className={`fa-solid ${shopForm.icon || 'fa-gem'} text-7xl text-amber-500 mb-4 animate-float`}></i>
                       <p className="font-black text-white truncate w-full">{shopForm.name || 'ชื่อไอเทม'}</p>
                       <span className="font-black text-amber-500 text-xl">{shopForm.price} G</span>
                    </div>
                 </div>
                 
                 {/* Form Fields */}
                 <div className="md:col-span-2 space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ชื่อไอเทม</label>
                      <input 
                        value={shopForm.name || ''} 
                        onChange={e => setShopForm({ ...shopForm, name: e.target.value })} 
                        placeholder="เช่น บัตรข้ามการบ้าน" 
                        className="w-full p-4 glass rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-amber-500/50 bg-white/5 transition-all" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ราคา (ทอง)</label>
                        <input 
                          type="number"
                          value={shopForm.price || ''} 
                          onChange={e => setShopForm({ ...shopForm, price: Number(e.target.value) })} 
                          placeholder="100" 
                          className="w-full p-4 glass rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-amber-500/50 bg-white/5 transition-all" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">เลือกไอคอนไอเทม</label>
                        <div className="relative group">
                          <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/10 text-white cursor-pointer hover:border-amber-500/30 transition-all bg-white/5">
                             <i className={`fa-solid ${shopForm.icon || 'fa-gem'} text-lg text-amber-500`}></i>
                             <span className="text-[10px] font-black uppercase tracking-widest">คลิกเพื่อเลือก</span>
                             <i className="fa-solid fa-chevron-down ml-auto opacity-30"></i>
                          </div>
                          {/* Dropdown for Icons */}
                          <div className="absolute top-full left-0 mt-3 p-4 glass rounded-[2.5rem] border border-white/10 hidden group-hover:grid grid-cols-6 gap-3 z-[130] w-full max-h-60 overflow-y-auto shadow-2xl animate-in slide-in-from-top-2">
                            {ICON_LIST.map(icon => (
                              <button key={icon} type="button" onClick={() => setShopForm({ ...shopForm, icon })} className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border ${shopForm.icon === icon ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'text-slate-400 border-white/5 hover:bg-white/5'}`}>
                                <i className={`fa-solid ${icon}`}></i>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">คำอธิบายพลังของไอเทม</label>
                      <textarea 
                        value={shopForm.description || ''} 
                        onChange={e => setShopForm({ ...shopForm, description: e.target.value })} 
                        placeholder="ระบุความสามารถของไอเทมนี้..." 
                        className="w-full p-4 glass rounded-2xl border border-white/10 text-white font-bold h-28 resize-none outline-none focus:border-amber-500/50 bg-white/5 transition-all" 
                      />
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="p-10 border-t border-white/5 bg-white/5 flex gap-4">
               <button type="button" onClick={() => setIsManagingShop(false)} className="flex-1 py-4 glass rounded-2xl text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.2em] border border-white/5">ยกเลิก</button>
               <button type="submit" className="flex-[2] py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em]">บันทึกไอเทมเข้าคลัง</button>
            </div>
          </form>
        </div>
      )}

      {/* Hero Modal (Arena Action) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="glass rounded-[5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10 animate-in zoom-in-95 duration-300">
            <div className={`p-12 bg-gradient-to-br ${CLASS_STYLES[selectedStudent.heroClass]} text-white flex justify-between items-center relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
              <div className="flex items-center gap-8 relative z-10">
                <img src={selectedStudent.avatar} className="w-28 h-28 rounded-[3rem] border-4 border-white shadow-2xl object-cover" />
                <div>
                  <h2 className="text-4xl font-black tracking-tighter">{selectedStudent.name}</h2>
                  <p className="text-white/80 font-bold uppercase tracking-widest text-[11px] mt-1">ป.{selectedStudent.grade}/{selectedStudent.room} • {selectedStudent.heroClass}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="w-16 h-16 flex items-center justify-center hover:bg-white/20 rounded-3xl transition-all relative z-10 border border-white/20 shadow-lg">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            
            <div className="p-12 overflow-y-auto space-y-12 custom-scrollbar">
               <section className="space-y-6">
                  <h4 className="text-slate-500 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-3">
                     <i className="fa-solid fa-bolt-lightning text-teal-400"></i> บันทึกพฤติกรรมผู้กล้า
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                     {behaviorPresets.map((preset, idx) => (
                       <button 
                         key={idx} 
                         onClick={() => handleManualAction(selectedStudent.id, preset.type, preset.amount, preset.label)}
                         className={`p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all flex items-center gap-4 group ${preset.bg}`}
                       >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner bg-black/10 ${preset.color}`}>
                            <i className={`fa-solid ${preset.icon}`}></i>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white text-sm">{preset.label}</p>
                            <p className={`text-[10px] font-black uppercase ${preset.amount > 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                              {preset.amount > 0 ? '+' : ''}{preset.amount} {preset.type}
                            </p>
                          </div>
                       </button>
                     ))}
                  </div>
               </section>
            </div>
            <div className="p-8 border-t border-white/5 bg-black/20 text-center">
               <button onClick={() => setSelectedStudent(null)} className="px-12 py-3 glass rounded-[1.5rem] text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest border border-white/5">
                  ปิดหน้าต่างการจัดการ
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Hero Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="glass rounded-[4rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10 animate-in zoom-in-95 duration-300">
            <div className={`p-10 bg-gradient-to-br ${CLASS_STYLES[formClass]} text-white flex justify-between items-center relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <h2 className="text-3xl font-black relative z-10">{editingStudent ? 'แก้ไขข้อมูลผู้กล้า' : 'อัญเชิญผู้กล้าใหม่'}</h2>
              <button type="button" onClick={resetForm} className="w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all relative z-10">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-10 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ชื่อผู้กล้า</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="ระบุชื่อ..." className="w-full p-4 glass rounded-2xl border border-white/10 outline-none focus:border-teal-500/50 font-bold text-white transition-all bg-white/5" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">รหัส ID (สำหรับเข้าเกม)</label>
                  <input value={formId} onChange={e => setFormId(e.target.value)} disabled={!!editingStudent} placeholder="รหัสประจำตัว" className="w-full p-4 glass rounded-2xl border border-white/10 outline-none focus:border-teal-500/50 font-bold text-white transition-all bg-white/5 disabled:opacity-50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ชั้น</label>
                    <select value={formGrade} onChange={e => setFormGrade(Number(e.target.value))} className="w-full p-4 glass rounded-2xl border border-white/10 outline-none font-bold text-teal-400 bg-slate-900">
                      {GRADES.map(g => <option key={g} value={g}>ป.{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ห้อง</label>
                    <select value={formRoom} onChange={e => setFormRoom(Number(e.target.value))} className="w-full p-4 glass rounded-2xl border border-white/10 outline-none font-bold text-teal-400 bg-slate-900">
                      {ROOMS.map(r => <option key={r} value={r}>ห้อง {r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">สายอาชีพ</label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.values(HeroClass).map(c => (
                      <button type="button" key={c} onClick={() => setFormClass(c)} className={`p-4 rounded-2xl border-2 font-black text-[10px] transition-all ${formClass === c ? 'border-teal-500 bg-teal-500/10 text-teal-400' : 'border-white/5 text-slate-500 hover:border-white/10'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block">เลือกภาพตัวละคร</label>
                <div className="p-4 glass rounded-[2rem] border border-white/5">
                  <img src={formAvatar} className="w-32 h-32 mx-auto rounded-3xl border-4 border-white/10 shadow-2xl mb-6 object-cover" />
                  <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-2">
                    {CARTOON_AVATARS.map((url, idx) => (
                      <button key={idx} type="button" onClick={() => setFormAvatar(url)} className={`rounded-lg overflow-hidden border-2 transition-all ${formAvatar === url ? 'border-teal-500' : 'border-transparent'}`}>
                        <img src={url} className="w-full aspect-square object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-white/5 bg-white/5 flex gap-4">
              <button type="button" onClick={resetForm} className="flex-1 py-4 glass rounded-2xl text-xs font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">ยกเลิก</button>
              <button type="submit" className="flex-[2] py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition-all uppercase tracking-widest">
                {editingStudent ? 'บันทึกการเปลี่ยนแปลง' : 'ยืนยันการอัญเชิญ'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
