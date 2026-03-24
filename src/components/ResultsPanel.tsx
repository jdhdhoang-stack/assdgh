
import React from 'react';
import type { ChunkJob, ProcessingState } from '../types';
import { ChunkCard } from './ChunkCard';

interface ResultsPanelProps {
    chunks: ChunkJob[];
    processingState: ProcessingState;
    mergedAudioUrl: string | null;
    onCancel: () => void;
    removeChunk: (chunkId: string) => void;
    onClearQueue: () => void;
    onDownloadAll: () => void;
    onRetryChunk: (chunkId: string) => void;
    onRetryAllFailed: () => void;
    successfulChunksCount: number;
    failedChunksCount: number;
    remainingChunksCount: number;
    totalChunksCount: number;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
    chunks, processingState, mergedAudioUrl, onCancel, removeChunk, onClearQueue, onDownloadAll,
    onRetryChunk, onRetryAllFailed, successfulChunksCount, failedChunksCount, remainingChunksCount, totalChunksCount
}) => {
    
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
             <div className="p-8 border-b border-slate-800">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">Hàng chờ & Phân đoạn</h2>
                            {totalChunksCount > 0 && (
                                <div className="flex items-center gap-x-4 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
                                    <span className="text-slate-500">Tổng: {totalChunksCount}</span>
                                    <span className="text-emerald-500">Xong: {successfulChunksCount}</span>
                                    {failedChunksCount > 0 && <span className="text-red-500">Lỗi: {failedChunksCount}</span>}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {processingState === 'idle' && chunks.length > 0 && !mergedAudioUrl && (
                             <button
                                onClick={onClearQueue}
                                className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-700"
                                title="Xóa Hàng chờ"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        )}
                        {processingState === 'processing' && (
                             <button
                                onClick={onCancel}
                                className="flex items-center gap-3 py-2 px-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-900/10"
                            >
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Hủy bỏ
                            </button>
                        )}
                    </div>
                 </div>
             </div>
            
             {mergedAudioUrl && (
                <div className="m-8 p-8 bg-blue-600/10 rounded-3xl border border-blue-500/20 relative overflow-hidden group animate-in zoom-in duration-500 shadow-inner">
                    <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                Sẵn sàng Sản xuất (Bản đầy đủ)
                            </h3>
                        </div>
                        <audio controls src={mergedAudioUrl} className="w-full h-12 filter invert brightness-200">
                            Trình duyệt không hỗ trợ.
                        </audio>
                        <button
                            onClick={onDownloadAll}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-xs font-black text-white bg-blue-600 hover:bg-blue-500 transition-all active:scale-[0.97] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Tải xuống Bản Master
                        </button>
                    </div>
                </div>
            )}

             <div className="flex-grow overflow-y-auto p-8 pt-0 space-y-4 custom-scrollbar">
                {chunks.map((chunk, index) => (
                    <ChunkCard 
                        key={chunk.id} 
                        chunk={chunk} 
                        index={index} 
                        onRemove={removeChunk}
                        onRetry={onRetryChunk}
                    />
                ))}
                
                {chunks.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-800 space-y-6 py-24">
                        <div className="p-8 rounded-full bg-slate-950/50 border border-slate-800">
                            <svg className="w-20 h-20 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <div className="space-y-2">
                             <p className="font-black text-2xl text-slate-700 tracking-tighter">Hàng chờ Trống</p>
                             <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-800">Thêm nội dung để bắt đầu tổng hợp</p>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};
