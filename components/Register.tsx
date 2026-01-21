
import React, { useState } from 'react';
import { HeroClass, Student } from '../types';
import { CLASS_STYLES, GRADES, ROOMS, LOGO_URL, CARTOON_AVATARS } from '../constants';

interface RegisterProps {
  students: Student[];
  onRegister: (student: Student) => void;
  onBack: () => void;
}

const Register: React.FC<RegisterProps> = ({ students, onRegister, onBack }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [room, setRoom] = useState(1);
  const [hClass, setHClass] = useState<HeroClass>(HeroClass.WARRIOR);
  const [avatar, setAvatar] = useState(CARTOON_AVATARS[0]);

  const handleRegister = () => {
    if (!id || !name) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนเพื่อเริ่มต้นการเดินทาง');
      return;
    }
    if (students.find(s => s.id === id)) {
      alert('รหัสประจำตัวนี้ได้ถูกลงทะเบียนเป็นผู้กล้าไปแล้ว!');
      return;
    }

    const maxHp = hClass === HeroClass.WARRIOR ? 120 : (hClass === HeroClass.HEALER ? 90 : 70);
    const newHero: Student = {
      id, name, grade, room, heroClass: hClass,
      level: 1, hp: maxHp, maxHp, xp: 0, gold: 50, avatar
    };
    onRegister(newHero);
  };

  const getClassDescription = (c: HeroClass) => {
    switch(c) {
      case HeroClass.WARRIOR: return "กายาเหล็ก: พลังชีวิตสูงกว่าปกติ ทนทานต่อบทลงโทษ";
      case HeroClass.MAGE: return "พรแห่งโชค: ได้รับทองเพิ่ม 20% จากทุกรางวัล";
      case HeroClass.HEALER: return "รักษาสัมพันธ์: ฟื้นฟูพลังชีวิตเต็มทันทีเมื่อเลเวลอัพ";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate-gradient p-4 md:p-8">
      <div className="bg-white/95 backdrop-blur-2xl p-8 md:p-12 rounded-[4rem] shadow-2xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 border border-white/50 relative overflow-hidden">
        
        {/* Visual Preview Side */}
        <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-tr ${CLASS_STYLES[hClass]} rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse`}></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden bg-slate-50">
              <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{name || "ผู้กล้านิรนาม"}</h3>
            <p className={`text-sm font-black uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r ${CLASS_STYLES[hClass]}`}>
              The {hClass}
            </p>
          </div>

          <div className="w-full max-w-sm space-y-4">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block">เลือกภาพตัวการ์ตูนผู้กล้า</label>
             <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-4 bg-slate-50/50 rounded-[2rem] border border-slate-100 max-h-48 overflow-y-auto custom-scrollbar">
               {CARTOON_AVATARS.map((url, idx) => (
                 <button
                    key={idx}
                    onClick={() => setAvatar(url)}
                    className={`relative rounded-xl overflow-hidden border-4 transition-all duration-300 hover:scale-110 active:scale-95 ${avatar === url ? 'border-[#26A69A] shadow-lg shadow-teal-500/20' : 'border-white hover:border-slate-200'}`}
                 >
                   <img src={url} className="w-full aspect-square object-cover" />
                 </button>
               ))}
             </div>
          </div>

          <div className="w-full max-w-xs p-5 rounded-3xl bg-slate-50 border border-slate-100 italic text-slate-400 text-[10px] text-center leading-relaxed font-bold">
            "{getClassDescription(hClass)}"
          </div>
        </div>

        {/* Input Form Side */}
        <div className="space-y-8 flex flex-col justify-center">
          <header>
            <img src={LOGO_URL} className="w-20 mb-4 drop-shadow-lg" />
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">ลงทะเบียนกิลด์</h2>
            <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Create Your Legend</p>
          </header>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">รหัสประจำตัว (Login ID)</label>
                <input 
                  placeholder="เช่น 1001" 
                  value={id} 
                  onChange={e => setId(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#26A69A] font-bold text-slate-700 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ชื่อผู้กล้า</label>
                <input 
                  placeholder="ชื่อในเกม" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#26A69A] font-bold text-slate-700 transition-all" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ระดับชั้น</label>
                <select 
                  value={grade} 
                  onChange={e => setGrade(Number(e.target.value))} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:border-[#26A69A] transition-all"
                >
                  {GRADES.map(g => <option key={g} value={g}>ป.{g}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ห้อง</label>
                <select 
                  value={room} 
                  onChange={e => setRoom(Number(e.target.value))} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:border-[#26A69A] transition-all"
                >
                  {ROOMS.map(r => <option key={r} value={r}>ห้อง {r}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">เลือกสายอาชีพ (Hero Class)</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(HeroClass).map(c => (
                  <button 
                    key={c} 
                    onClick={() => setHClass(c)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 font-black text-[10px] transition-all duration-300 ${hClass === c ? `border-[#26A69A] bg-teal-50 text-[#26A69A] shadow-lg shadow-teal-50 scale-105` : 'border-slate-50 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-500'}`}
                  >
                    <i className={`fa-solid ${c === HeroClass.WARRIOR ? 'fa-shield-halved' : c === HeroClass.MAGE ? 'fa-wand-sparkles' : 'fa-house-medical-flag'} text-lg mb-1`}></i>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <button 
              onClick={handleRegister} 
              className="w-full py-5 bg-gradient-to-r from-[#26A69A] to-[#AED581] text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-teal-100 transform active:scale-95 transition-all hover:scale-[1.02]"
            >
              <i className="fa-solid fa-scroll mr-2"></i> บันทึกข้อมูล & เริ่มการเดินทาง
            </button>
            <button onClick={onBack} className="w-full py-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-all">
              <i className="fa-solid fa-arrow-left-long mr-2"></i> ย้อนกลับไปหน้าแรก
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCA28]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF8A65]/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
      </div>
    </div>
  );
};

export default Register;
