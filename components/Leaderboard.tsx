
import React from 'react';
import { Student } from '../types';
import { CLASS_STYLES } from '../constants';

interface LeaderboardProps {
  students: Student[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ students }) => {
  const topStudents = [...students].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.xp - a.xp;
  }).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-800">หอเกียรติยศ (Hall of Fame)</h1>
        <p className="text-slate-500">เหล่าผู้กล้าที่มีชื่อเสียงที่สุดในห้องเรียน</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-[#26A69A] to-[#AED581] text-white">
                <th className="px-8 py-6 font-black uppercase tracking-widest text-xs">อันดับ</th>
                <th className="px-8 py-6 font-black uppercase tracking-widest text-xs">ผู้กล้า</th>
                <th className="px-8 py-6 font-black uppercase tracking-widest text-xs">อาชีพ</th>
                <th className="px-8 py-6 font-black uppercase tracking-widest text-xs text-center">เลเวล</th>
                <th className="px-8 py-6 font-black uppercase tracking-widest text-xs text-right">ทรัพย์สิน</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((hero, index) => (
                <tr key={hero.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                      {index === 0 ? '👑' : index + 1}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={hero.avatar} className="w-12 h-12 rounded-2xl shadow-md border-2 border-white object-cover" />
                      <span className="font-bold text-slate-700 text-lg">{hero.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${CLASS_STYLES[hero.heroClass]}`}>
                      {hero.heroClass}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="font-black text-2xl text-slate-800 opacity-80">{hero.level}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 font-black text-amber-500">
                      <i className="fa-solid fa-coins text-sm"></i>
                      {hero.gold}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {topStudents.length === 0 && (
          <div className="p-20 text-center text-slate-400 italic">
            ยังไม่มีผู้กล้าคนใดเริ่มต้นการเดินทาง...
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
