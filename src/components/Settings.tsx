
import React, { useState, useEffect } from 'react';
import { keyManager } from '../services/keyManager';

export const Settings: React.FC = () => {
    const [keysInput, setKeysInput] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => { setKeysInput(keyManager.getKeysRaw()); }, []);

    const handleSave = () => {
        keyManager.saveKeys(keysInput);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto bg-slate-900 p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-8 border-b border-slate-800 pb-10 mb-10">
                <div className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/20 text-blue-500 shadow-lg shadow-blue-900/20">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Cấu hình Hệ thống</h2>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Quản lý API & Truy cập Engine</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-10">
                    <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800 space-y-6 shadow-inner">
                        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Hướng dẫn Cấu hình</h3>
                        <ul className="text-sm text-slate-400 space-y-4 font-bold">
                            <li className="flex items-start gap-4">
                                <span className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                <div>
                                    <span className="text-slate-200">Dòng 1:</span> Engine TTS (Capcut Token)
                                </div>
                            </li>
                        </ul>
                        <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-[11px] text-amber-500/80 leading-relaxed font-bold">
                            <strong className="text-amber-500 block mb-1 uppercase tracking-wider">Lưu ý Bảo mật:</strong> Các khóa được lưu trữ cục bộ trong bộ nhớ mã hóa của trình duyệt. Không bao giờ chia sẻ chuỗi cấu hình của bạn.
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave} 
                        className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-[0.98] ${saved ? 'bg-emerald-500 text-white shadow-emerald-900/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}`}
                    >
                        {saved ? 'Đã Lưu Cài đặt Thành công' : 'Lưu Cấu hình'}
                    </button>
                    
                    <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
                         <span>Vocalis Engine v1.4.0</span>
                         <span>Mã hóa AES-256</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Khóa Truy cập (Mỗi dòng một khóa)</label>
                    <textarea
                        value={keysInput} onChange={(e) => setKeysInput(e.target.value)}
                        placeholder="Dán các khóa API của bạn tại đây..."
                        className="w-full h-96 bg-slate-950 border border-slate-800 rounded-[2rem] p-8 font-mono text-xs text-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-inner leading-relaxed placeholder-slate-800"
                    />
                </div>
            </div>
        </div>
    );
};
