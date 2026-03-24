
import React from 'react';
import type { ChunkJob } from '../types';

interface ChunkCardProps {
    chunk: ChunkJob;
    index: number;
    onRemove: (id: string) => void;
    onRetry: (id: string) => void;
}

export const ChunkCard: React.FC<ChunkCardProps> = ({ chunk, index, onRemove, onRetry }) => {
    const getStatusStyles = () => {
        switch (chunk.status) {
            case 'finished': return 'border-emerald-500/20 bg-emerald-500/5';
            case 'error': return 'border-red-500/20 bg-red-500/5';
            case 'processing': return 'border-blue-500/20 bg-blue-500/5';
            default: return 'border-slate-800 bg-slate-950/50';
        }
    };

    const getStatusIconColor = () => {
        switch (chunk.status) {
            case 'finished': return 'text-emerald-400';
            case 'error': return 'text-red-400';
            case 'processing': return 'text-blue-400';
            default: return 'text-slate-600';
        }
    };

    return (
        <div className={`p-6 rounded-2xl border transition-all duration-300 group relative ${getStatusStyles()} hover:border-slate-700`}>
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${getStatusIconColor()}`}>
                        {chunk.status === 'finished' ? 'Hoàn thành' : 
                         chunk.status === 'error' ? 'Lỗi' : 
                         chunk.status === 'processing' ? 'Đang xử lý' : 'Chờ'}
                    </span>
                    {chunk.timestamp && (
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                            • {chunk.timestamp}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {chunk.status === 'error' && (
                        <button 
                            onClick={() => onRetry(chunk.id)}
                            className="p-2 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                            title="Thử lại"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </button>
                    )}
                    <button 
                        onClick={() => onRemove(chunk.id)}
                        className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-700"
                        title="Xóa"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed font-bold line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                {chunk.text}
            </p>

            {chunk.status === 'finished' && chunk.audioUrl && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-4">
                    <audio src={chunk.audioUrl} controls className="h-10 flex-grow filter invert brightness-200" />
                    <a 
                        href={chunk.audioUrl} 
                        download={`chunk_${index + 1}.mp3`}
                        className="p-3 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </a>
                </div>
            )}

            {chunk.status === 'error' && chunk.error && (
                <div className="mt-4 text-[10px] font-black text-red-400 bg-red-500/10 p-4 rounded-2xl border border-red-500/20 uppercase tracking-widest">
                    Lỗi: {chunk.error}
                </div>
            )}

            {chunk.status === 'processing' && (
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                    </div>
                </div>
            )}
        </div>
    );
};
