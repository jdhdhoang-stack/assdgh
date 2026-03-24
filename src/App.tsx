
import React, { useState } from 'react';
import { Logo } from './components/Logo';
import { Settings } from './components/Settings';
import { TextToSpeech } from './components/TextToSpeech';
import { TextFilter } from './components/TextFilter';
import { Toaster } from 'sonner';

const TabButton: React.FC<{ 
    name: string; 
    active: boolean; 
    onClick: () => void; 
    icon: React.ReactNode;
}> = ({ name, active, onClick, icon }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-xl ${
                active 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
        >
            <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
            <span>{name}</span>
        </button>
    );
};

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'tts' | 'filter' | 'settings'>('tts');
    
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
            <Toaster position="top-right" richColors theme="dark" />
            <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Logo className="h-10 w-10 text-blue-500" />
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter text-white leading-none">VOCALIS</h1>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1 block">Audio Engine</span>
                        </div>
                    </div>

                    <nav className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800">
                        <TabButton 
                            name="Tổng hợp" 
                            active={activeTab === 'tts'} 
                            onClick={() => setActiveTab('tts')} 
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>}
                        />
                        <TabButton 
                            name="Lọc văn bản" 
                            active={activeTab === 'filter'} 
                            onClick={() => setActiveTab('filter')} 
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>}
                        />
                        <div className="w-px h-6 bg-slate-800 mx-1"></div>
                        <TabButton 
                            name="Cài đặt" 
                            active={activeTab === 'settings'} 
                            onClick={() => setActiveTab('settings')} 
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>}
                        />
                    </nav>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-6 md:p-12">
                 {activeTab === 'tts' && <TextToSpeech />}
                 {activeTab === 'filter' && <TextFilter />}
                 {activeTab === 'settings' && <Settings />}
            </main>

            <footer className="py-12 bg-slate-900 border-t border-slate-800">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                            VOCALIS AUDIO ENGINE • v1.4.0
                        </p>
                        <p className="text-[10px] text-slate-600 font-medium">© 2026 Vocalis Labs. All rights reserved.</p>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-widest">Tài liệu</a>
                        <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-widest">Hỗ trợ</a>
                        <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-widest">Bảo mật</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
