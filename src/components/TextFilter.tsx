import React, { useState, useEffect, useCallback } from 'react';
import { FileUpload } from './FileUpload';
import { Filter, Trash2, Copy, Check, Plus, X, Type, FileText, Settings2, Sparkles, Hash, Eraser, Languages, BookOpen, CheckCircle2, Scissors } from 'lucide-react';
import { TextFilterService, PhoneticEntry, FilterOptions } from '../services/textFilterService';
import { toast } from 'sonner';

export const TextFilter: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [junkKeywords, setJunkKeywords] = useState<string[]>(['comment', '0 comment', 'Vote', 'SEND GIFT', 'bình luận', '0 bình luận', 'bỏ phiếu', 'gửi quà tặng', 'gửI quà tặng', 'P@treon', 'PinkSnake', 'chương phía trước', 'vui lòng theo dõi tôi', 'p@treon.com/PinkSnake', 'nhận xét', 'còn lại', 'SUY NGHĨ CỦA NGƯỜI SÁNG TẠO', 'Rắn hồng', 'discord.gg', 'https://discord.gg/7mNvAaTtkf', 'Power Stones', 'Đánh giá', 'Bonus', '1 left', '2 left', '3 left', '4 left', '5 left', '6 left', '7 left', '8 left', '9 left', 'discord.com/invite']);
    const [newJunk, setNewJunk] = useState('');
    const [phoneticDict, setPhoneticDict] = useState<PhoneticEntry[]>(() => {
        const saved = localStorage.getItem('puch_phonetic_dict');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load phonetic dict", e);
            }
        }
        return [
            { id: '1', original: 'pokemon master', phonetic: 'pô kê mon mát tơ' },
            { id: '2', original: 'ronaldo', phonetic: 'rô nan đô' },
            { id: '3', original: 'madrid', phonetic: 'ma rít' },
            { id: '4', original: 'tottenham', phonetic: 'tốt ten ham' }
        ];
    });
    const [newOriginal, setNewOriginal] = useState('');
    const [newPhonetic, setNewPhonetic] = useState('');
    const [options, setOptions] = useState<FilterOptions>({
        removeJunkBlocks: true,
        removeChapterHeader: true,
        removeEndNumbers: true,
        convertLargeNumbers: true,
        removeNumbers: false,
        removeWhitespace: true,
        manualPhonetic: true
    });

    useEffect(() => {
        localStorage.setItem('puch_phonetic_dict', JSON.stringify(phoneticDict));
    }, [phoneticDict]);

    const handleFileProcessed = useCallback((content: string) => {
        setInputText(content);
    }, []);

    const addPhoneticEntry = useCallback(() => {
        if (!newOriginal.trim() || !newPhonetic.trim()) return;
        const newEntry: PhoneticEntry = {
            id: Date.now().toString(),
            original: newOriginal.trim(),
            phonetic: newPhonetic.trim()
        };
        setPhoneticDict(prev => [...prev, newEntry]);
        setNewOriginal('');
        setNewPhonetic('');
    }, [newOriginal, newPhonetic]);

    const removePhoneticEntry = useCallback((id: string) => {
        setPhoneticDict(prev => prev.filter(item => item.id !== id));
    }, []);

    const addJunkKeyword = useCallback(() => {
        if (!newJunk.trim()) return;
        const keywords = newJunk.split(',').map(k => k.trim()).filter(k => k && !junkKeywords.includes(k));
        if (keywords.length > 0) {
            setJunkKeywords(prev => [...prev, ...keywords]);
            setNewJunk('');
        }
    }, [newJunk, junkKeywords]);

    const removeJunkKeyword = useCallback((keyword: string) => {
        setJunkKeywords(prev => prev.filter(k => k !== keyword));
    }, []);

    const handleProcess = useCallback(() => {
        if (!inputText.trim()) return;
        setIsProcessing(true);
        
        setTimeout(() => {
            try {
                const result = TextFilterService.process(inputText, options, junkKeywords.join(','), phoneticDict);
                setOutputText(result);
            } catch (error) {
                console.error("Lỗi xử lý văn bản:", error);
                toast.error("Đã xảy ra lỗi khi xử lý văn bản.");
            } finally {
                setIsProcessing(false);
            }
        }, 100);
    }, [inputText, options, junkKeywords, phoneticDict]);

    const handleCopy = useCallback(() => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [outputText]);

    const handleClear = useCallback(() => {
        setInputText('');
        setOutputText('');
    }, []);

    const handleOptionChange = useCallback((key: keyof FilterOptions) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Input & Options */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-slate-900/50 backdrop-blur-md rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h2 className="font-black text-white tracking-tight">Văn bản Nguồn</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Source Material</p>
                                </div>
                            </div>
                            <FileUpload onFileProcessed={handleFileProcessed} />
                        </div>
                        <div className="p-6">
                            <textarea
                                className="w-full h-96 p-6 bg-slate-950/50 border border-slate-800 rounded-3xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-slate-200 leading-relaxed font-bold placeholder-slate-800 shadow-inner"
                                placeholder="Dán văn bản của bạn tại đây hoặc tải lên tệp (.docx, .txt)..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <div className="mt-6 flex justify-between items-center">
                                <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
                                    {inputText.length.toLocaleString()} ký tự
                                </span>
                                <button
                                    onClick={handleClear}
                                    className="flex items-center gap-3 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
                                >
                                    <Trash2 size={14} />
                                    Xóa Tất cả
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20">
                                <Settings2 size={20} />
                            </div>
                            <div>
                                <h2 className="font-black text-white tracking-tight">Cài đặt Lọc & Chuyển đổi</h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Filter & Transform Settings</p>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${options.removeJunkBlocks ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}>
                                        <div className={`p-3 rounded-xl transition-colors ${options.removeJunkBlocks ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                                            <Sparkles size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-xs font-black uppercase tracking-wider ${options.removeJunkBlocks ? 'text-emerald-400' : 'text-slate-400'}`}>Bộ lọc Rác Thông minh</div>
                                            <div className="text-[10px] text-slate-500 font-bold mt-1">Tự động xóa quảng cáo và bình luận rác</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={options.removeJunkBlocks}
                                            onChange={() => handleOptionChange('removeJunkBlocks')}
                                            className="hidden"
                                        />
                                    </label>

                                    <label className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${options.removeChapterHeader ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}>
                                        <div className={`p-3 rounded-xl transition-colors ${options.removeChapterHeader ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                                            <Type size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-xs font-black uppercase tracking-wider ${options.removeChapterHeader ? 'text-emerald-400' : 'text-slate-400'}`}>Xóa Tiêu đề Chương</div>
                                            <div className="text-[10px] text-slate-500 font-bold mt-1">Xóa "Chapter X", "Chương X"</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={options.removeChapterHeader}
                                            onChange={() => handleOptionChange('removeChapterHeader')}
                                            className="hidden"
                                        />
                                    </label>

                                    <label className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${options.removeEndNumbers ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}>
                                        <div className={`p-3 rounded-xl transition-colors ${options.removeEndNumbers ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                                            <Hash size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-xs font-black uppercase tracking-wider ${options.removeEndNumbers ? 'text-emerald-400' : 'text-slate-400'}`}>Xóa Số ở Cuối dòng</div>
                                            <div className="text-[10px] text-slate-500 font-bold mt-1">Xóa các số thứ tự ở cuối mỗi dòng</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={options.removeEndNumbers}
                                            onChange={() => handleOptionChange('removeEndNumbers')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <label className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${options.convertLargeNumbers ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}>
                                        <div className={`p-3 rounded-xl transition-colors ${options.convertLargeNumbers ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                                            <Languages size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-xs font-black uppercase tracking-wider ${options.convertLargeNumbers ? 'text-emerald-400' : 'text-slate-400'}`}>Số thành Chữ</div>
                                            <div className="text-[10px] text-slate-500 font-bold mt-1">Chuyển 1000 &rarr; một nghìn</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={options.convertLargeNumbers}
                                            onChange={() => handleOptionChange('convertLargeNumbers')}
                                            className="hidden"
                                        />
                                    </label>

                                    <label className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${options.removeNumbers ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}>
                                        <div className={`p-3 rounded-xl transition-colors ${options.removeNumbers ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                                            <Eraser size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-xs font-black uppercase tracking-wider ${options.removeNumbers ? 'text-emerald-400' : 'text-slate-400'}`}>Xóa Tất cả Số</div>
                                            <div className="text-[10px] text-slate-500 font-bold mt-1">Loại bỏ hoàn toàn các ký tự số</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={options.removeNumbers}
                                            onChange={() => handleOptionChange('removeNumbers')}
                                            className="hidden"
                                        />
                                    </label>

                                    <label className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${options.removeWhitespace ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}>
                                        <div className={`p-3 rounded-xl transition-colors ${options.removeWhitespace ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                                            <Scissors size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-xs font-black uppercase tracking-wider ${options.removeWhitespace ? 'text-emerald-400' : 'text-slate-400'}`}>Chuẩn hóa Khoảng trắng</div>
                                            <div className="text-[10px] text-slate-500 font-bold mt-1">Xóa dòng trống và khoảng trắng thừa</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={options.removeWhitespace}
                                            onChange={() => handleOptionChange('removeWhitespace')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-800 rounded-xl text-slate-400">
                                            <Filter size={16} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-wider text-white">Từ khóa Rác</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{junkKeywords.length} từ khóa</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-4 max-h-40 overflow-y-auto p-4 bg-slate-950/50 border border-slate-800 rounded-2xl custom-scrollbar">
                                    {junkKeywords.map((keyword, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-[10px] font-bold group hover:border-red-500/30 hover:bg-red-500/5 transition-all"
                                        >
                                            {keyword}
                                            <button 
                                                onClick={() => removeJunkKeyword(keyword)}
                                                className="text-slate-500 hover:text-red-500 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {junkKeywords.length === 0 && (
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest py-2">Chưa có từ khóa nào</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs font-bold text-slate-200 placeholder-slate-800"
                                        placeholder="Thêm từ khóa mới (phân cách bằng dấu phẩy)..."
                                        value={newJunk}
                                        onChange={(e) => setNewJunk(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addJunkKeyword()}
                                    />
                                    <button
                                        onClick={addJunkKeyword}
                                        className="p-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Phonetic & Output */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-slate-900/50 backdrop-blur-md rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h2 className="font-black text-white tracking-tight">Từ điển Phiên âm</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Phonetic Dictionary</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs font-bold text-slate-200 placeholder-slate-800"
                                        placeholder="Từ gốc..."
                                        value={newOriginal}
                                        onChange={(e) => setNewOriginal(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-xs font-bold text-slate-200 placeholder-slate-800"
                                        placeholder="Phiên âm..."
                                        value={newPhonetic}
                                        onChange={(e) => setNewPhonetic(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={addPhoneticEntry}
                                    className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3"
                                >
                                    <Plus size={16} />
                                    Thêm vào Từ điển
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {phoneticDict.map((entry) => (
                                    <div 
                                        key={entry.id} 
                                        className="flex items-center justify-between p-4 bg-slate-950/30 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Gốc</span>
                                                <span className="text-xs font-black text-white">{entry.original}</span>
                                            </div>
                                            <div className="h-8 w-px bg-slate-800" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Phiên âm</span>
                                                <span className="text-xs font-black text-blue-400">{entry.phonetic}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removePhoneticEntry(entry.id)}
                                            className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                {phoneticDict.length === 0 && (
                                    <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-800 rounded-[2rem]">
                                        <div className="p-4 bg-slate-900 rounded-full w-fit mx-auto mb-4 text-slate-700">
                                            <BookOpen size={24} />
                                        </div>
                                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Từ điển trống</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h2 className="font-black text-white tracking-tight">Kết quả</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Processed Output</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    disabled={!outputText}
                                    className={`p-3 rounded-2xl transition-all border ${
                                        copied 
                                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title="Sao chép"
                                >
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <textarea
                                className="w-full h-80 p-6 bg-slate-950/50 border border-slate-800 rounded-3xl outline-none resize-none text-slate-200 leading-relaxed font-bold shadow-inner"
                                readOnly
                                placeholder="Kết quả sau khi xử lý sẽ xuất hiện ở đây..."
                                value={outputText}
                            />
                            <button
                                onClick={handleProcess}
                                disabled={isProcessing || !inputText.trim()}
                                className="w-full mt-6 py-5 bg-blue-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                        Xử lý Văn bản
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
