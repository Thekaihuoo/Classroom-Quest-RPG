
import React from 'react';
import { View } from '../types';
import { LOGO_URL as LOGO } from '../constants';

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  role: 'TEACHER' | 'STUDENT';
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, role, onLogout }) => {
  const teacherMenu = [
    { id: 'TEACHER_ARENA', label: 'สนามฝึกซ้อม', icon: 'fa-swords' },
    { id: 'TEACHER_ATTENDANCE', label: 'เช็คชื่อผู้กล้า', icon: 'fa-calendar-check' },
    { id: 'TEACHER_MANAGEMENT', label: 'จัดการผู้กล้า', icon: 'fa-users-gear' },
    { id: 'TEACHER_CHRONICLES', label: 'บันทึกตำนาน', icon: 'fa-scroll' },
    { id: 'TEACHER_TREASURY', label: 'คลังสมบัติ', icon: 'fa-vault' },
    { id: 'TEACHER_INSIGHTS', label: 'วิเคราะห์กิลด์', icon: 'fa-chart-pie' },
    { id: 'TEACHER_EVENTS', label: 'ประกาศศักดา', icon: 'fa-bullhorn' },
    { id: 'LEADERBOARD', label: 'หอเกียรติยศ', icon: 'fa-trophy' },
  ];

  const studentMenu = [
    { id: 'STUDENT_HERO', label: 'ข้อมูลผู้กล้า', icon: 'fa-shield-halved' },
    { id: 'STUDENT_QUESTS', label: 'กระดานภารกิจ', icon: 'fa-map-location-dot' },
    { id: 'STUDENT_SHOP', label: 'ตลาดมืด', icon: 'fa-shop' },
    { id: 'STUDENT_LOGS', label: 'บันทึกการเดินทาง', icon: 'fa-book-journal-whills' },
    { id: 'LEADERBOARD', label: 'หอเกียรติยศ', icon: 'fa-trophy' },
  ];

  const menuItems = role === 'TEACHER' ? teacherMenu : studentMenu;

  return (
    <aside className="w-full md:w-64 glass border-r border-white/10 flex flex-col h-auto md:h-screen sticky top-0 z-50">
      <div className="p-8 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-teal-500 blur-2xl opacity-20 animate-pulse"></div>
          <img src={LOGO} alt="Logo" className="w-20 h-20 drop-shadow-2xl relative z-10" />
        </div>
        <div className="text-center">
          <span className="font-black text-xl text-white tracking-tighter block">เควสต์ห้องเรียน</span>
          <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em]">{role} EDITION</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">เมนูการผจญภัย</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-xs transition-all duration-300 group ${
              view === item.id 
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${view === item.id ? 'bg-white/20' : 'bg-slate-800/50 group-hover:bg-teal-500/20 group-hover:text-teal-400'}`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-[10px] text-rose-500 hover:bg-rose-500/10 transition-all uppercase tracking-[0.2em]"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <i className="fa-solid fa-right-from-bracket"></i>
          </div>
          ออกจากเกม
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
