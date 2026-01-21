
import React, { useState, useEffect } from 'react';
import { View, UserSession, Student, HeroClass, ShopItem, Quest } from './types';
import { getStudents, saveStudents, getShopItems, saveShopItems, getQuests, saveQuests } from './utils';
import Login from './components/Login';
import Register from './components/Register';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Leaderboard from './components/Leaderboard';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [view, setView] = useState<View>('LOGIN');
  const [session, setSession] = useState<UserSession | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    setStudents(getStudents());
    setShopItems(getShopItems());
    setQuests(getQuests());
  }, []);

  const handleUpdateStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
  };

  const handleUpdateShopItems = (updatedItems: ShopItem[]) => {
    setShopItems(updatedItems);
    saveShopItems(updatedItems);
  };

  const handleUpdateQuests = (updatedQuests: Quest[]) => {
    setQuests(updatedQuests);
    saveQuests(updatedQuests);
  };

  const logout = () => {
    setSession(null);
    setView('LOGIN');
  };

  const handleRegisterSuccess = (newHero: Student) => {
    const updated = [...students, newHero];
    handleUpdateStudents(updated);
    setSession({ role: 'STUDENT', studentId: newHero.id });
    setView('STUDENT_HERO');
  };

  if (view === 'LOGIN') {
    return (
      <Login 
        students={students} 
        onLogin={(s) => { 
          setSession(s); 
          setView(s.role === 'TEACHER' ? 'TEACHER_ARENA' : 'STUDENT_HERO'); 
        }} 
        onGoToRegister={() => setView('REGISTER')}
      />
    );
  }

  if (view === 'REGISTER') {
    return <Register students={students} onRegister={handleRegisterSuccess} onBack={() => setView('LOGIN')} />;
  }

  // Helper to determine active tab for dashboards based on the global view
  const getTeacherTab = () => {
    if (view.startsWith('TEACHER_')) return view.replace('TEACHER_', '') as any;
    return 'ARENA';
  };

  const getStudentTab = () => {
    if (view === 'STUDENT_HERO') return 'QUESTS'; // We'll map HERO to the main profile/quest view
    if (view.startsWith('STUDENT_')) return view.replace('STUDENT_', '') as any;
    return 'QUESTS';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative z-10">
      <Sidebar view={view} setView={setView} role={session?.role || 'STUDENT'} onLogout={logout} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative custom-scrollbar">
        <div className="max-w-7xl mx-auto pb-24">
          {view.startsWith('TEACHER_') && (
            <TeacherDashboard 
              students={students} 
              onUpdate={handleUpdateStudents} 
              shopItems={shopItems}
              onUpdateShopItems={handleUpdateShopItems}
              quests={quests}
              onUpdateQuests={handleUpdateQuests}
              initialTab={getTeacherTab()}
            />
          )}
          {view.startsWith('STUDENT_') && session?.studentId && (
            <StudentDashboard 
              student={students.find(s => s.id === session.studentId)!} 
              onUpdate={(updates) => handleUpdateStudents(
                students.map(s => s.id === session.studentId ? { ...s, ...updates } : s)
              )}
              shopItems={shopItems}
              quests={quests}
              initialTab={getStudentTab()}
            />
          )}
          {view === 'LEADERBOARD' && (
            <Leaderboard students={students} />
          )}
        </div>
        
        <footer className="fixed bottom-0 left-0 w-full md:left-64 md:w-[calc(100%-16rem)] p-4 text-center glass border-t border-white/5 z-50">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
            Freeman @ Copy Right Krukai ฝากแชร์ ฝากติดตามด้วยนะครับ
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
