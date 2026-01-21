
import React, { useState } from 'react';
import { UserSession, Student } from '../types';
import { LOGO_URL } from '../constants';

interface LoginProps {
  students: Student[];
  onLogin: (session: UserSession) => void;
  onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ students, onLogin, onGoToRegister }) => {
  const [studentId, setStudentId] = useState('');
  const [showTeacherAuth, setShowTeacherAuth] = useState(false);
  const [teacherPin, setTeacherPin] = useState('');
  const [error, setError] = useState('');

  const handleTeacherLogin = () => {
    if (teacherPin === '0000') {
      onLogin({ role: 'TEACHER' });
    } else {
      setError('รหัสผ่านไม่ถูกต้อง');
      setTeacherPin('');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleStudentLogin = () => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      onLogin({ role: 'STUDENT', studentId });
    } else {
      setError('ไม่พบรหัสผู้กล้านี้ กรุณาลงทะเบียนใหม่');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate-gradient p-4">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/50">
        <div className="flex flex-col items-center mb-8">
          <img src={LOGO_URL} className="w-24 h-24 mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#26A69A] to-[#FF8A65]">
            เควสต์ห้องเรียน
          </h1>
        </div>

        <div className="space-y-6">
          {!showTeacherAuth ? (
            <>
              <button onClick={() => setShowTeacherAuth(true)} className="w-full py-4 border-2 border-[#26A69A] text-[#26A69A] rounded-2xl font-bold hover:bg-[#26A69A] hover:text-white transition-all">
                <i className="fa-solid fa-chalkboard-user mr-2"></i> ระบบสำหรับคุณครู
              </button>

              <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300"></span></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500 uppercase font-black text-[10px]">ทางเข้าผู้กล้า</span></div></div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="กรอกรหัสผู้กล้า" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-[#AED581] outline-none transition-all font-medium text-slate-700 bg-slate-50/50"
                />
                <button 
                  onClick={handleStudentLogin}
                  className="w-full py-4 bg-gradient-to-r from-[#FF8A65] to-[#FFCA28] text-white rounded-2xl font-bold shadow-lg transform active:scale-95 transition-all"
                >
                  เข้าสู่การผจญภัย
                </button>
                <button onClick={onGoToRegister} className="w-full py-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-all">
                  ยังไม่มีตัวละคร? ลงทะเบียนที่นี่
                </button>
                {error && <p className="text-rose-500 text-xs text-center font-bold">{error}</p>}
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-center font-bold text-slate-800">ยืนยันตัวตนคุณครู (0000)</h2>
              <input 
                type="password" 
                placeholder="PIN" 
                value={teacherPin}
                onChange={(e) => setTeacherPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTeacherLogin()}
                className="w-full p-4 text-center text-2xl tracking-[1em] rounded-xl border-2 border-slate-100"
              />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowTeacherAuth(false)} className="py-3 text-slate-400 font-bold">ย้อนกลับ</button>
                <button onClick={handleTeacherLogin} className="py-3 bg-[#26A69A] text-white rounded-xl font-bold shadow-lg">ยืนยัน</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
