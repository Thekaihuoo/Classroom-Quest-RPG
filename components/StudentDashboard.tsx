
import React, { useState, useEffect } from 'react';
import { Student, ShopItem, LogEntry, Quest } from '../types';
import { CLASS_STYLES, DAILY_XP_REWARD, DAILY_GOLD_REWARD } from '../constants';
import { getLogs, addLog } from '../utils';

interface StudentDashboardProps {
  student: Student;
  onUpdate: (updates: Partial<Student>) => void;
  shopItems: ShopItem[];
  quests: Quest[];
  initialTab?: 'QUESTS' | 'LOGS' | 'SHOP' | 'HERO';
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, onUpdate, shopItems, quests, initialTab = 'QUESTS' }) => {
  const [activeTab, setActiveTab] = useState(initialTab === 'HERO' ? 'QUESTS' : initialTab);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    setActiveTab(initialTab === 'HERO' ? 'QUESTS' : initialTab);
  }, [initialTab]);

  useEffect(() => {
    setLogs(getLogs().filter(l => l.studentId === student.id));
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [student]);

  const buyItem = (item: ShopItem) => {
    if (student.gold >= item.price) {
      onUpdate({ gold: student.gold - item.price });
      addLog({ studentId: student.id, studentName: student.name, type: 'ITEM', amount: -item.price, reason: `แลกซื้อ: ${item.name}` });
      alert(`แลกซื้อ ${item.name} สำเร็จ!`);
    } else {
      alert("ทองไม่เพียงพอ!");
    }
  };

  const startQuest = (quest: Quest) => {
    if (student.activeQuest && !student.activeQuest.claimed) {
      alert("คุณมีภารกิจที่กำลังดำเนินการอยู่!");
      return;
    }
    const startTime = Date.now();
    const endTime = startTime + (quest.durationMinutes * 60 * 1000);
    onUpdate({
      activeQuest: {
        questId: quest.id,
        startTime,
        endTime,
        claimed: false
      }
    });
  };

  const claimQuestReward = (quest: Quest) => {
    if (!student.activeQuest || student.activeQuest.claimed) return;
    onUpdate({
      xp: student.xp + quest.rewardXp,
      gold: student.gold + quest.rewardGold,
      activeQuest: undefined
    });
    addLog({
      studentId: student.id,
      studentName: student.name,
      type: 'XP',
      amount: quest.rewardXp,
      reason: `สำเร็จภารกิจ: ${quest.title}`
    });
  };

  const dailyCheckIn = () => {
    const today = new Date().setHours(0,0,0,0);
    if (student.lastDailyClaim === today) return;
    onUpdate({
      xp: student.xp + DAILY_XP_REWARD,
      gold: student.gold + DAILY_GOLD_REWARD,
      lastDailyClaim: today
    });
    addLog({
      studentId: student.id,
      studentName: student.name,
      type: 'XP',
      amount: DAILY_XP_REWARD,
      reason: 'รางวัลรายวัน: เตรียมความพร้อม'
    });
  };

  const getNextResetTime = () => {
    const nextReset = new Date();
    nextReset.setHours(24, 0, 0, 0);
    const diff = nextReset.getTime() - currentTime;
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}ชม. ${mins}น.`;
  };

  const isDailyClaimed = student.lastDailyClaim === new Date().setHours(0,0,0,0);

  const renderQuestCard = (quest: Quest) => {
    const isActive = student.activeQuest?.questId === quest.id;
    const isFinished = isActive && currentTime >= (student.activeQuest?.endTime || 0);
    const progress = isActive ? Math.min(100, Math.max(0, ((currentTime - student.activeQuest!.startTime) / (student.activeQuest!.endTime - student.activeQuest!.startTime)) * 100)) : 0;
    
    return (
      <div key={quest.id} className={`glass p-6 rounded-[3rem] border-2 transition-all duration-500 shadow-xl relative overflow-hidden group ${isActive ? 'border-teal-500 ring-4 ring-teal-500/10' : 'border-white/5 hover:border-white/10'}`}>
        {isActive && <div className="absolute top-0 left-0 h-1 bg-teal-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>}
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${isActive ? 'bg-teal-500 text-white animate-pulse' : 'bg-white/5 text-slate-500'}`}>
            <i className={`fa-solid ${quest.icon}`}></i>
          </div>
          <div className="text-right">
            <span className="block text-[9px] font-black text-slate-600 uppercase tracking-widest">ระยะเวลา</span>
            <span className="font-bold text-white text-sm">{quest.durationMinutes} นาที</span>
          </div>
        </div>
        <h4 className="font-black text-white text-lg leading-tight">{quest.title}</h4>
        <div className="flex gap-2 mt-4">
          <span className="text-[9px] font-black text-teal-400 bg-teal-500/10 px-3 py-1 rounded-xl">+{quest.rewardXp} XP</span>
          <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-xl">+{quest.rewardGold} G</span>
        </div>
        <div className="mt-8">
          {!isActive ? (
            <button onClick={() => startQuest(quest)} disabled={!!student.activeQuest} className={`w-full py-4 rounded-2xl font-black text-xs transition-all ${!!student.activeQuest ? 'bg-white/5 text-slate-600' : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20 hover:scale-[1.02]'}`}>เริ่มภารกิจ</button>
          ) : isFinished ? (
            <button onClick={() => claimQuestReward(quest)} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black text-xs shadow-lg animate-bounce">สำเร็จ! รับรางวัล</button>
          ) : (
            <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5"><span className="text-[9px] font-black text-slate-600 uppercase block mb-1">กำลังดำเนินการ...</span></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <header className="glass p-10 rounded-[4rem] border border-white/10 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
        <div className="relative">
          <img src={student.avatar} className="w-44 h-44 rounded-[3rem] border-4 border-slate-900 shadow-2xl object-cover relative z-10" />
          <div className="absolute -bottom-4 -right-4 w-18 h-18 bg-teal-500 rounded-3xl shadow-2xl flex items-center justify-center font-black text-4xl text-white border-4 border-slate-900 z-20 animate-float">{student.level}</div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-6 relative z-10">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none">{student.name}</h1>
            <p className="text-teal-400 font-bold mt-2 uppercase tracking-widest text-xs">ป.{student.grade}/{student.room} • {student.heroClass}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="glass px-8 py-3 rounded-2xl border border-white/10 shadow-lg text-center">
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Health Points</p>
              <p className="font-black text-white text-2xl">{student.hp} <span className="text-slate-600 text-sm">/ {student.maxHp}</span></p>
            </div>
            <div className="glass px-8 py-3 rounded-2xl border border-white/10 shadow-lg text-center">
              <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Current Gold</p>
              <p className="font-black text-white text-2xl">{student.gold} <span className="text-amber-500 text-sm">G</span></p>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-[600px]">
        {activeTab === 'QUESTS' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-500">
             <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden transition-all duration-700 border border-white/10 ${isDailyClaimed ? 'glass opacity-60' : 'bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600'}`}>
                <div className="space-y-6 relative z-10">
                  <h2 className="text-4xl font-black leading-tight">ของขวัญจากทวยเทพ!</h2>
                  <p className="text-white/80 font-medium">เข้าสู่ระบบทุกวันเพื่อรับ XP และทองสำหรับการเดินทาง</p>
                  {!isDailyClaimed ? (
                    <button onClick={dailyCheckIn} className="px-12 py-5 bg-white text-orange-600 rounded-[2rem] font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all">รับรางวัลรายวัน (+{DAILY_XP_REWARD} XP)</button>
                  ) : (
                    <div className="bg-white/20 backdrop-blur-md px-10 py-5 rounded-[2rem] border border-white/30 text-center w-fit">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">รีเซ็ตใน</p>
                      <p className="text-2xl font-black font-mono">{getNextResetTime()}</p>
                    </div>
                  )}
                </div>
                <div className="hidden md:flex justify-end relative z-10"><i className={`fa-solid ${isDailyClaimed ? 'fa-calendar-check text-white/20' : 'fa-gift text-white/40 animate-float'} text-[12rem]`}></i></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{quests.map(renderQuestCard)}</div>
          </div>
        )}

        {activeTab === 'LOGS' && (
          <div className="glass rounded-[4rem] overflow-hidden border border-white/10 animate-in slide-in-from-bottom-6 duration-500">
            <div className="p-10 border-b border-white/5 font-black text-white text-2xl">บันทึกตำนานล่าสุด</div>
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
              {logs.map(log => (
                <div key={log.id} className="p-8 flex justify-between items-center hover:bg-white/5 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${log.amount > 0 ? 'bg-teal-500/10 text-teal-400' : 'bg-rose-500/10 text-rose-500'}`}><i className={`fa-solid ${log.amount > 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i></div>
                      <div>
                        <p className="font-black text-white text-lg">{log.reason}</p>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{new Date(log.timestamp).toLocaleString('th-TH')}</p>
                      </div>
                   </div>
                   <div className={`font-black text-2xl ${log.amount > 0 ? 'text-teal-400' : 'text-rose-400'}`}>{log.amount > 0 ? '+' : ''}{log.amount} {log.type}</div>
                </div>
              ))}
              {logs.length === 0 && <div className="p-40 text-center text-slate-600 italic font-black uppercase tracking-widest">ยังไม่มีตำนานที่ถูกจารึก...</div>}
            </div>
          </div>
        )}

        {activeTab === 'SHOP' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-6 duration-500">
            {shopItems.map((item) => (
              <div key={item.id} className="glass p-10 rounded-[4rem] border border-white/5 flex flex-col group hover:-translate-y-2 transition-all duration-500 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-4xl text-slate-500 mb-8 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-all shadow-inner relative z-10"><i className={`fa-solid ${item.icon}`}></i></div>
                <h3 className="text-3xl font-black text-white tracking-tighter relative z-10">{item.name}</h3>
                <p className="text-slate-500 text-sm mt-4 flex-1 leading-relaxed font-medium relative z-10">{item.description}</p>
                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                  <span className="flex items-center gap-3 font-black text-amber-500 text-2xl"><i className="fa-solid fa-coins"></i> {item.price}</span>
                  <button onClick={() => buyItem(item)} disabled={student.gold < item.price} className={`px-10 py-4 rounded-2xl font-black text-xs transition-all uppercase tracking-widest ${student.gold >= item.price ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20 hover:scale-110 active:scale-95' : 'bg-white/5 text-slate-700'}`}>แลกซื้อ</button>
                </div>
              </div>
            ))}
            {shopItems.length === 0 && <div className="col-span-full p-40 text-center text-slate-600 italic font-black uppercase tracking-widest">ตลาดมืดกำลังปิดปรับปรุง...</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
