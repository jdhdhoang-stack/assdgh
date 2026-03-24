
import React, { useState, memo } from 'react';
import type { SpeakerGroup } from '../types';
import { FileUpload } from './FileUpload';

interface ConfigurationProps {
    speaker: string;
    setSpeaker: (speakerId: string) => void;
    selectedCountry: string;
    onCountryChange: (country: string) => void;
    speakerGroups: SpeakerGroup[];
    isProcessing: boolean;
    onProcessQueue: () => void;
    onAddContent: (content: string | Array<{ text: string; timestamp: string }>) => void;
    pendingChunksCount: number;
    maxChars: number;
    setMaxChars: (value: number) => void;
    minCharsToMerge: number;
    setMinCharsToMerge: (value: number) => void;
    concurrentThreads: number;
    setConcurrentThreads: (value: number) => void;
    requestDelay: number;
    setRequestDelay: (value: number) => void;
}

export const Configuration: React.FC<ConfigurationProps> = memo(({
    speaker, setSpeaker, selectedCountry, onCountryChange, speakerGroups, isProcessing,
    onProcessQueue, onAddContent, pendingChunksCount,
    maxChars, setMaxChars, minCharsToMerge, setMinCharsToMerge,
    concurrentThreads, setConcurrentThreads, requestDelay, setRequestDelay
}) => {
    const [textToAdd, setTextToAdd] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleAddTextJob = () => {
        if (!textToAdd.trim()) return;
        onAddContent(textToAdd.trim());
        setTextToAdd('');
    };

    const handleFileAdded = (content: string | Array<{ text: string; timestamp: string }>) => {
        onAddContent(content);
    };
    
    const availableSpeakers = speakerGroups.find(g => g.country === selectedCountry)?.speakers || [];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl h-fit flex flex-col overflow-hidden">
            <div className="p-8 space-y-8">
                <div className="border-b border-slate-800 pb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">Cấu hình Tổng hợp</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Neural Voice Parameters</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Ngôn ngữ</label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => onCountryChange(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-900"
                        >
                            {speakerGroups.map(group => (
                                <option key={group.country} value={group.country}>{group.country}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Hồ sơ Giọng nói</label>
                        <select
                            value={speaker}
                            onChange={(e) => setSpeaker(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-900 disabled:opacity-50"
                            disabled={availableSpeakers.length === 0}
                        >
                            {availableSpeakers.map(spk => (
                                <option key={spk.id} value={spk.id}>{spk.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <button 
                        onClick={() => setShowAdvanced(!showAdvanced)} 
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:bg-slate-950 transition-all group"
                    >
                        <span className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                            Tham số Nâng cao
                        </span>
                        <svg className={`h-4 w-4 text-slate-600 transition-transform duration-500 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    
                    {showAdvanced && (
                        <div className="mt-6 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Luồng</label>
                                <input 
                                    type="number" value={concurrentThreads} 
                                    onChange={e => setConcurrentThreads(Math.min(10, parseInt(e.target.value, 10)))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Độ trễ (ms)</label>
                                <input 
                                    type="number" value={requestDelay} 
                                    onChange={e => setRequestDelay(parseInt(e.target.value, 10))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Ký tự tối đa</label>
                                <input 
                                    type="number" value={maxChars} 
                                    onChange={e => setMaxChars(parseInt(e.target.value, 10))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Gộp tối thiểu</label>
                                <input 
                                    type="number" value={minCharsToMerge} 
                                    onChange={e => setMinCharsToMerge(parseInt(e.target.value, 10))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-800">
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden focus-within:border-blue-500/50 transition-all relative shadow-inner">
                        <textarea
                            value={textToAdd}
                            onChange={(e) => setTextToAdd(e.target.value)}
                            placeholder="Nhập hoặc dán nội dung văn bản tại đây..."
                            rows={8}
                            className="w-full border-0 resize-none p-6 text-sm bg-transparent text-slate-200 placeholder-slate-700 focus:ring-0 leading-relaxed font-bold"
                        />
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 border-t border-slate-800">
                            <FileUpload onFileProcessed={handleFileAdded} />
                            <button
                                onClick={handleAddTextJob}
                                disabled={!textToAdd.trim()}
                                className="flex items-center gap-3 py-3 px-8 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 transition-all disabled:opacity-20 active:scale-95 shadow-lg shadow-blue-900/20"
                            >
                                Thêm vào Hàng chờ
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onProcessQueue}
                    disabled={isProcessing || pendingChunksCount === 0}
                    className="w-full py-5 rounded-3xl text-sm font-black uppercase tracking-[0.2em] text-white bg-blue-600 hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-10 shadow-2xl shadow-blue-900/20"
                >
                    {isProcessing ? 'Đang xử lý...' : `Bắt đầu Tổng hợp (${pendingChunksCount})`}
                </button>
            </div>
        </div>
    );
});

Configuration.displayName = 'Configuration';

