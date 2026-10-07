import React, { useState, useMemo, useEffect } from 'react';
import {
  EXAM_METADATA,
  PDF_VERIFICATION_STATS,
  CHAPTERS_DATA,
  BRIEF_QUESTIONS_KA,
  SHORT_QUESTIONS_KHA,
  BROAD_QUESTIONS_GA,
  TOP_30_FINAL_LIST,
  DIAGRAMS_MASTER_LIST,
  BOARD_EXAM_PAPERS,
  QuestionRecord
} from './data/economicsData';
import {
  BookOpen,
  Award,
  FileText,
  CheckCircle2,
  Calendar,
  TrendingUp,
  BarChart3,
  Download,
  Printer,
  Search,
  Smartphone,
  Github,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  FolderArchive
} from 'lucide-react';

type ActiveTab = 
  | 'report20'
  | 'top30'
  | 'briefKa'
  | 'shortKha'
  | 'broadGa'
  | 'chapters'
  | 'diagrams'
  | 'boardYears'
  | 'planner'
  | 'androidApk';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('report20');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<'all' | 'ক' | 'খ' | 'গ'>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [checkedPlanTasks, setCheckedPlanTasks] = useState<Record<string, boolean>>({});

  // Load checklist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nu_econ_prep_checklist');
      if (saved) {
        setCheckedPlanTasks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTask = (taskId: string) => {
    const updated = { ...checkedPlanTasks, [taskId]: !checkedPlanTasks[taskId] };
    setCheckedPlanTasks(updated);
    try {
      localStorage.setItem('nu_econ_prep_checklist', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Printable action
  const handlePrint = () => {
    window.print();
  };

  // Word Document Export (.doc)
  const handleExportWord = () => {
    const content = document.getElementById('report-export-container')?.innerHTML || '';
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Economics 2nd Paper NU Degree Exam Suggestion</title>
        <style>
          body { font-family: 'Hind Siliguri', 'SolaimanLipi', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111; }
          h1, h2, h3, h4 { color: #0F766E; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #F0FDFA; color: #115E59; }
          .priority-99 { color: #DC2626; font-weight: bold; }
          .badge { font-weight: bold; padding: 2px 6px; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 24px;">
          <h1>জাতীয় বিশ্ববিদ্যালয় ডিগ্রি (পাস) ১ম বর্ষ পরীক্ষা</h1>
          <h2>অর্থনীতি দ্বিতীয় পত্র : বাংলাদেশের অর্থনীতি (১১২২০৩)</h2>
          <p>ব্যতিক্রম সর্বশেষ চূড়ান্ত সাজেশন ও বাস্তব বিগত প্রশ্ন ভিত্তিক পূর্ণাঙ্গ বিশ্লেষণ</p>
        </div>
        ${content}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + header], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Economics_2nd_Paper_NU_Final_Suggestion_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered Questions for Search
  const allQuestions = useMemo(() => {
    return [
      ...BRIEF_QUESTIONS_KA,
      ...SHORT_QUESTIONS_KHA,
      ...BROAD_QUESTIONS_GA
    ];
  }, []);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(item => {
      const matchSection = selectedSectionFilter === 'all' || item.section === selectedSectionFilter;
      const matchPriority = selectedPriorityFilter === 'all' || item.priority.includes(selectedPriorityFilter);
      const matchSearch = !searchQuery.trim() || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSection && matchPriority && matchSearch;
    });
  }, [allQuestions, selectedSectionFilter, selectedPriorityFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation Bar - Follows strict 3-zone contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Brand title, single line */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
              NU
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                Economics 2nd Paper Master
              </span>
              <span className="text-xs text-teal-800 font-medium">
                বাংলাদেশের অর্থনীতি (কোড: ১১২২০৩)
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { id: 'report20', label: '২০-দফা পূর্ণাঙ্গ রিপোর্ট' },
              { id: 'top30', label: '🎯 টপ ৩০ সাজেশন' },
              { id: 'briefKa', label: 'ক-বিভাগ (উত্তরসহ)' },
              { id: 'shortKha', label: 'খ-বিভাগ (কাঠামো)' },
              { id: 'broadGa', label: 'গ-বিভাগ (১০ নম্বর)' },
              { id: 'diagrams', label: '📊 চিত্র ও সূত্র' },
              { id: 'boardYears', label: '📅 বিগত বোর্ড সাল' },
              { id: 'planner', label: '⏱️ স্টাডি প্ল্যান' },
              { id: 'androidApk', label: '📱 অ্যান্ড্রয়েড এপিকে' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-teal-800 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / PDF</span>
            </button>
            <button
              onClick={handleExportWord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg transition-colors shadow-xs"
              title="Download Microsoft Word .doc"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.doc)</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Scrollbar */}
        <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-100 gap-1 bg-slate-50 scrollbar-none">
          {[
            { id: 'report20', label: '২০-দফা রিপোর্ট' },
            { id: 'top30', label: 'টপ ৩০' },
            { id: 'briefKa', label: 'ক-বিভাগ' },
            { id: 'shortKha', label: 'খ-বিভাগ' },
            { id: 'broadGa', label: 'গ-বিভাগ' },
            { id: 'diagrams', label: 'চিত্র ও সূত্র' },
            { id: 'boardYears', label: 'বোর্ড সাল' },
            { id: 'planner', label: 'প্ল্যানার' },
            { id: 'androidApk', label: 'অ্যান্ড্রয়েড এপিকে' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Exam Quick Header Banner */}
        <div className="mb-6 p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>{EXAM_METADATA.degree}</span>
                <span>•</span>
                <span>বিষয় কোড: {EXAM_METADATA.subjectCode}</span>
                <span>•</span>
                <span>পূর্ণমান: {EXAM_METADATA.totalMarks}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                {EXAM_METADATA.subject} — {EXAM_METADATA.subjectName}
              </h1>
              <p className="text-teal-100 text-sm max-w-3xl leading-relaxed">
                ২২ পৃষ্ঠার সম্পূর্ণ ব্যতিক্রম চূড়ান্ত সাজেশন ও বিগত ৬ বছরের (২০১৯-২০২৪) বোর্ড প্রশ্নপত্রের কঠোর পরিসংখ্যানগত বিশ্লেষণ ভিত্তিক মাস্টার সাজেশন ও পরীক্ষার প্রস্তুতি পোর্টাল।
              </p>
            </div>

            <div className="flex flex-row md:flex-col gap-2 shrink-0">
              <div className="bg-white/10 backdrop-blur px-3.5 py-2 rounded-lg border border-white/15 text-center">
                <span className="block text-xs text-teal-200">মোট প্রশ্ন সংকলন</span>
                <span className="text-lg font-bold text-white tabular-nums">২৪৩টি</span>
              </div>
              <div className="bg-emerald-500/20 backdrop-blur px-3.5 py-2 rounded-lg border border-emerald-400/30 text-center">
                <span className="block text-xs text-emerald-200">৯৯% প্রায়োরিটি</span>
                <span className="text-lg font-bold text-emerald-300 tabular-nums">২৮টি</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search and Filter Bar (no-print) */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-xs no-print">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="প্রশ্ন, অধ্যায় বা উত্তর দিয়ে তাৎক্ষণিক খুঁজুন..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:bg-white transition-all"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium shrink-0">বিভাগ:</span>
              <div className="flex items-center gap-1 w-full">
                {(['all', 'ক', 'খ', 'গ'] as const).map(sec => (
                  <button
                    key={sec}
                    onClick={() => setSelectedSectionFilter(sec)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      selectedSectionFilter === sec
                        ? 'bg-teal-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sec === 'all' ? 'সকল' : `${sec}-বিভাগ`}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium shrink-0">গুরুত্ব:</span>
              <select
                value={selectedPriorityFilter}
                onChange={e => setSelectedPriorityFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-teal-700 text-slate-700"
              >
                <option value="all">সব মাত্রা (All)</option>
                <option value="99%">🔥 ৯৯% প্রায়োরিটি</option>
                <option value="95%">🔥 ৯৫% প্রায়োরিটি</option>
                <option value="90%">⭐ ৯০% প্রায়োরিটি</option>
              </select>
            </div>
          </div>

          {searchQuery && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                অনুসন্ধান ফলাফল: <strong className="text-slate-800">{filteredQuestions.length}</strong> টি প্রশ্ন পাওয়া গেছে
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-teal-800 hover:underline font-medium"
              >
                রিসেট ফিল্টার
              </button>
            </div>
          )}
        </div>

        {/* Exportable Report Content Container */}
        <div id="report-export-container">
          {/* TAB 1: 20-Point Complete Academic Report */}
          {activeTab === 'report20' && (
            <div className="space-y-8">
              {/* Report Header for Print */}
              <div className="hidden print:block text-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-slate-900">জাতীয় বিশ্ববিদ্যালয় ডিগ্রি (পাস) ১ম বর্ষ পরীক্ষা</h1>
                <h2 className="text-xl font-semibold text-teal-800">অর্থনীতি দ্বিতীয় পত্র (বাংলাদেশের অর্থনীতি - বিষয় কোড: ১১২২০৩)</h2>
                <p className="text-sm text-slate-600">বাস্তব পরীক্ষা প্রস্তুতি — ২২ পৃষ্ঠার সম্পূর্ণ PDF বিশ্লেষণ ও চূড়ান্ত মাস্টার সাজেশন রিপোর্ট</p>
              </div>

              {/* Section 01: PDF Analysis Summary */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>০১. ভূমিকা ও বিশ্লেষণ সারাংশ</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  01. PDF Analysis Summary (পিডিএফ বিশ্লেষণ সারাংশ)
                </h2>
                <div className="prose text-sm text-slate-700 leading-relaxed space-y-2">
                  <p>
                    আপলোডকৃত ২২ পৃষ্ঠার সম্পূর্ণ মূল নথিপত্রটি হলো জাতীয় বিশ্ববিদ্যালয় ডিগ্রি পাস ১ম বর্ষের অর্থনীতি ২য় পত্রের জন্য <strong>[ব্যতিক্রম সর্বশেষ চূড়ান্ত সাজেশন]</strong> এবং সাথে অন্তর্ভুক্ত বিগত ৬ বছরের (২০১৯, ২০২০, ২০২১, ২০২২, ২০২৩ এবং ২০২৪) পূর্ণাঙ্গ প্রশ্নপত্র ও অধ্যায়ভিত্তিক সমাধান সংকলন।
                  </p>
                  <p>
                    আমরা নথির কোনো পৃষ্ঠা, কোনো সাল বা কোনো বিভাগ (ক, খ, গ) বাদ না দিয়ে প্রতিটি প্রশ্ন, বিকল্প প্রশ্ন, সংজ্ঞা, বছরভিত্তিক পুনরাবৃত্তি এবং চিত্র সংবলিত প্রশ্ন কঠোরভাবে বিশ্লেষণ করেছি। এতে কোনো মনগড়া বা কাল্পনিক প্রশ্ন রাখা হয়নি।
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-center">
                    <span className="block text-xs text-teal-700">বিশ্লেষিত পাতা</span>
                    <span className="text-lg font-bold text-teal-900 tabular-nums">২২/২২ সম্পূর্ণ</span>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-center">
                    <span className="block text-xs text-teal-700">পরীক্ষার সাল প্রাপ্তি</span>
                    <span className="text-lg font-bold text-teal-900">২০০৫ — ২০২৪</span>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-center">
                    <span className="block text-xs text-teal-700">ক-বিভাগ প্রশ্ন</span>
                    <span className="text-lg font-bold text-teal-900 tabular-nums">১২৬টি উত্তরসহ</span>
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-center">
                    <span className="block text-xs text-teal-700">খ ও গ বিভাগ প্রশ্ন</span>
                    <span className="text-lg font-bold text-teal-900 tabular-nums">১১৭টি কাঠামোসহ</span>
                  </div>
                </div>
              </section>

              {/* Section 02: Question Database Summary */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>০২. ডেটাবেজ পরিসংখ্যান</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  02. Complete Question Database Summary (সম্পূর্ণ প্রশ্ন ডেটাবেজ সংক্ষেপ)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="p-3 font-semibold">বিভাগ ও ধরন</th>
                        <th className="p-3 font-semibold">মান বণ্টন</th>
                        <th className="p-3 font-semibold">মোট সংকলিত প্রশ্ন</th>
                        <th className="p-3 font-semibold">৯৯% প্রায়োরিটি</th>
                        <th className="p-3 font-semibold">৯৫% প্রায়োরিটি</th>
                        <th className="p-3 font-semibold">পুনরাবৃত্তির প্রমাণ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-3 font-medium text-slate-900">ক-বিভাগ (অতি সংক্ষিপ্ত)</td>
                        <td className="p-3">১০ × ১ = ১০</td>
                        <td className="p-3 font-bold text-teal-800 tabular-nums">১২৬টি</td>
                        <td className="p-3 text-red-600 font-bold tabular-nums">১৬টি</td>
                        <td className="p-3 text-amber-600 font-bold tabular-nums">১৮টি</td>
                        <td className="p-3">২ থেকে ৪ বার পুনরাবৃত্তি</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-slate-900">খ-বিভাগ (সংক্ষিপ্ত)</td>
                        <td className="p-3">৫ × ৪ = ২০</td>
                        <td className="p-3 font-bold text-teal-800 tabular-nums">৬৮টি</td>
                        <td className="p-3 text-red-600 font-bold tabular-nums">৭টি</td>
                        <td className="p-3 text-amber-600 font-bold tabular-nums">৯টি</td>
                        <td className="p-3">সর্বোচ্চ ৮ বার পুনরাবৃত্তি</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-slate-900">গ-বিভাগ (রচনামূলক)</td>
                        <td className="p-3">৫ × ১০ = ৫০</td>
                        <td className="p-3 font-bold text-teal-800 tabular-nums">৪৯টি</td>
                        <td className="p-3 text-red-600 font-bold tabular-nums">৫টি</td>
                        <td className="p-3 text-amber-600 font-bold tabular-nums">৭টি</td>
                        <td className="p-3">সর্বোচ্চ ৭ বার পুনরাবৃত্তি</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 03: 🔥 99% Priority Master List */}
              <section className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
                  <span>০৩. সর্বোচ্চ ঐতিহাসিক প্রমাণ</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>03. 🔥 99% Priority Master List (৯৯% প্রায়োরিটি মাস্টার তালিকা)</span>
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  *সতর্কবার্তা: ৯৯% প্রায়োরিটি কোনো কাল্পনিক ১০০% নিশ্চয়তা নয়; এটি আপলোডকৃত নথির বিগত বোর্ড পরীক্ষায় সর্বোচ্চ পুনরাবৃত্তির অকাট্য পরিসংখ্যানগত প্রমাণ।
                </p>

                <div className="space-y-4">
                  <div className="border border-red-100 rounded-xl p-4 bg-red-50/50">
                    <h3 className="text-sm font-bold text-red-900 mb-2 flex items-center justify-between">
                      <span>ক-বিভাগ: অতি সংক্ষিপ্ত প্রশ্নাবলি (৯৯% প্রায়োরিটি)</span>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">১ নম্বরের প্রশ্ন</span>
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-800">
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>১. অর্থনৈতিক উন্নয়ন কী?</strong> (জা.বি. ২০১৬, ২০১৮, ২০১৯)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>২. মোট দেশজ উৎপাদন (GDP) কী?</strong> (জা.বি. ২০১৭, ২০২২)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>৩. অর্থনৈতিক উন্নয়নের দুটি পূর্বশর্ত লিখ।</strong> (জা.বি. ২০২১, ২০২৩)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>৪. অর্থনৈতিক প্রবৃদ্ধি কাকে বলে?</strong> (জা.বি. ২০১৬, ২০১৯)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>৫. উন্নয়নশীল দেশ কাকে বলে?</strong> (জা.বি. ২০১৫, ২০১৮, ২০২৪)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>৬. অর্থনৈতিক অবকাঠামো ও সামাজিক অবকাঠামো কী?</strong> (জা.বি. ২০১৭, ২০১৮, ২০২২, ২০২৪)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>৭. শক্তিসম্পদ কি?</strong> (জা.বি. ২০১৪, ২০১৭, ২০২১, ২০২৩ - ৪ বার)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>৮. জনসংখ্যার ঘনত্ব নির্ণয়ের সূত্র লিখ।</strong> (জা.বি. ২০১৪, ২০১৫, ২০২০)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>৯. শূন্য জনসংখ্যা বৃদ্ধি (ZPG) কি?</strong> (জা.বি. ২০১৯, ২০২২, ২০২৪)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>১০. ছদ্মবেশী বেকারত্ব কাকে বলে?</strong> (জা.বি. ২০১৬, ২০১৮, ২০২২, ২০২৪ - ৪ বার)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>১১. ভূমি সংস্কার বলতে কী বুঝ?</strong> (জা.বি. ২০২১, ২০২৪)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>১২. বিশেষায়িত ব্যাংক ও ইসলামি ব্যাংকিং কী?</strong> (জা.বি. ২০১৪, ২০১৭, ২০১৯, ২০২১, ২০২৪)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>১৩. বাণিজ্যের ভারসাম্য ও লেনদেন ভারসাম্য কী?</strong> (জা.বি. ২০১৪, ২০১৭, ২০২৪)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>১৪. EPZ, FDI, MDG ও SDG এর পূর্ণরূপ।</strong> (জা.বি. ২০১৫, ২০১৯, ২০২০, ২০২২)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>১৫. দারিদ্র্যের দুষ্টচক্রের উদ্ভাবক কে?</strong> (জা.বি. ২০১৫, ২০১৭ - রাগনার নার্কস)
                      </li>
                      <li className="p-2 bg-white rounded-lg border border-red-100">
                        <strong>১৬. ঘাটতি ব্যয় কী?</strong> (জা.বি. ২০১৭, ২০১৯, ২০২২)
                      </li>
                    </ul>
                  </div>

                  <div className="border border-red-100 rounded-xl p-4 bg-red-50/50">
                    <h3 className="text-sm font-bold text-red-900 mb-2 flex items-center justify-between">
                      <span>খ-বিভাগ: সংক্ষিপ্ত প্রশ্নাবলি (৯৯% প্রায়োরিটি - ৪ নম্বর)</span>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">৪ নম্বরের প্রশ্ন</span>
                    </h3>
                    <div className="space-y-2 text-xs text-slate-800">
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>১. অর্থনৈতিক উন্নয়ন ও অর্থনৈতিক প্রবৃদ্ধির মধ্যে পার্থক্য লেখ।</strong> (জা.বি. ২০০৮, ২০১২, ২০১৪, ২০১৬, ২০১৮, ২০২০, ২০২২, ২০২৪)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৮ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>২. বাংলাদেশের জনসংখ্যার ঘনত্ব অধিক হওয়ার কারণসমূহ আলোচনা কর।</strong> (জা.বি. ২০০৮, ২০১১, ২০১৩, ২০১৫, ২০১৭, ২০১৯, ২০২৪)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৭ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>৩. বাংলাদেশের অর্থনীতিতে শক্তি সম্পদের গুরুত্ব আলোচনা কর।</strong> (জা.বি. ২০০৯, ২০১৩, ২০১৬, ২০২০, ২০২২, ২০২৪)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৬ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>৪. কৃষিতে প্রাতিষ্ঠানিক ও অপ্রাতিষ্ঠানিক ঋণ উৎসের তুলনা কর।</strong> (জা.বি. ২০০৮, ২০১০, ২০১৩, ২০১৫, ২০২০, ২০২১, ২০২৪)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৭ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>৫. দারিদ্র্যের দুষ্টচক্র বলতে কী বুঝ? চিত্রসহ ব্যাখ্যা কর।</strong> (জা.বি. ২০১১, ২০১৩, ২০১৭, ২০১৯, ২০২২, ২০২৪)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৬ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>৬. অর্থনৈতিক ও সামাজিক অবকাঠামোর মধ্যে পার্থক্য লেখ।</strong> (জা.বি. ২০১৫, ২০১৭, ২০১৯, ২০২৩)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৪ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>৭. বাণিজ্য ভারসাম্য ও লেনদেনের ভারসাম্যের পার্থক্য লেখ।</strong> (জা.বি. ২০১৬, ২০১৮, ২০২০)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৩ বার এসেছে</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-red-100 rounded-xl p-4 bg-red-50/50">
                    <h3 className="text-sm font-bold text-red-900 mb-2 flex items-center justify-between">
                      <span>গ-বিভাগ: রচনামূলক প্রশ্নাবলি (৯৯% প্রায়োরিটি - ১০ নম্বর)</span>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">১০ নম্বরের প্রশ্ন</span>
                    </h3>
                    <div className="space-y-2 text-xs text-slate-800">
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>১. বাংলাদেশ ব্যাংকের গঠন ও এর প্রধান কার্যাবলি বিস্তারিত বর্ণনা কর।</strong> (জা.বি. ২০০৮, ২০১০, ২০১৩, ২০১৫, ২০১৮, ২০২০, ২০২৩)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৭ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>২. বাংলাদেশের অর্থনৈতিক উন্নয়নে পরিবহন ও যোগাযোগ ব্যবস্থার গুরুত্ব আলোচনা কর।</strong> (জা.বি. ২০০৮, ২০১১, ২০১৪, ২০১৭, ২০১৯, ২০২১, ২০২৩)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৭ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>৩. বাংলাদেশ কি একটি অনুন্নত, উন্নয়নশীল না স্বল্পোন্নত দেশ? তোমার মতের পক্ষে যুক্তি দাও।</strong> (জা.বি. ২০১০, ২০১২, ২০১৪, ২০১৭, ২০২০, ২০২৩)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৬ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>৪. বৈদেশিক লেনদেনের ভারসাম্যের প্রতিকূলতার কারণসমূহ ও প্রতিকারের উপায়।</strong> (জা.বি. ২০০৭, ২০১০, ২০১২, ২০১৪, ২০১৮, ২০২০)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">৬ বার এসেছে</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-red-100 flex justify-between items-center">
                        <span><strong>৫. ম্যালথাসের জনসংখ্যা তত্ত্বটি চিত্রসহ বিস্তারিত আলোচনা কর।</strong> (জা.বি. ২০২০, ২০২৩)</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">চিত্র সংবলিত হট প্রশ্ন</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 04 & 05: 95% & 90% Priority Master Lists */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>০৪. খুব দৃঢ় ঐতিহাসিক প্রমাণ</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">
                      04. 🔥 95% Priority Master List
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="p-2.5 bg-orange-50/60 rounded-lg border border-orange-100">
                        <strong>(ক) কুটির শিল্প ও ক্ষুদ্র শিল্পের পার্থক্য দেখাও।</strong> (খ-বিভাগ, জা.বি. ২০১৪, ২০১৬, ২০২০, ২০২৪ - ৪ বার)
                      </li>
                      <li className="p-2.5 bg-orange-50/60 rounded-lg border border-orange-100">
                        <strong>(খ) অর্থনৈতিক উন্নয়নে শিক্ষা ও স্বাস্থ্য খাতের ভূমিকা।</strong> (খ-বিভাগ, জা.বি. ২০১২, ২০১৪, ২০১৬, ২০২১ - ৪ বার)
                      </li>
                      <li className="p-2.5 bg-orange-50/60 rounded-lg border border-orange-100">
                        <strong>(গ) আমদানি বিকল্প শিল্প বনাম রপ্তানিমুখী শিল্পের পার্থক্য।</strong> (খ-বিভাগ, জা.বি. ২০১৯, ২০২১, ২০২৪ - ৩ বার)
                      </li>
                      <li className="p-2.5 bg-orange-50/60 rounded-lg border border-orange-100">
                        <strong>(ঘ) কৃষিপণ্যের বাজারজাতকরণের সমস্যা ও সমাধানের উপায়।</strong> (গ-বিভাগ, জা.বি. ২০১১, ২০১৭, ২০১৯, ২০২১, ২০২৩ - ৫ বার)
                      </li>
                      <li className="p-2.5 bg-orange-50/60 rounded-lg border border-orange-100">
                        <strong>(ঙ) পোশাক শিল্পের গুরুত্ব ও বর্তমান চ্যালেঞ্জসমূহ।</strong> (গ-বিভাগ, জা.বি. ২০২৩)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>০৫. দৃঢ় ঐতিহাসিক প্রমাণ</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">
                      05. ⭐ 90% Priority Master List
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-100">
                        <strong>(ক) বাংলাদেশ বিদ্যুৎ ঘাটতির আর্থসামাজিক ফলাফল।</strong> (খ-বিভাগ, জা.বি. ২০২১)
                      </li>
                      <li className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-100">
                        <strong>(খ) ভূমি সংস্কার ও কৃষি সংস্কারের মধ্যে পার্থক্য।</strong> (খ-বিভাগ, জা.বি. ২০১৪, ২০১৭, ২০১৯)
                      </li>
                      <li className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-100">
                        <strong>(গ) মুদ্রা বাজার ও মূলধন বাজারের মধ্যে পার্থক্য।</strong> (খ-বিভাগ, জা.বি. ২০০৯, ২০১২, ২০১৭, ২০১৯, ২০২১)
                      </li>
                      <li className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-100">
                        <strong>(ঘ) উন্নয়ন পরিকল্পনা কাকে বলে? এর গুরুত্ব।</strong> (খ ও গ বিভাগ, জা.বি. ২০০৬-২০১৯)
                      </li>
                      <li className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-100">
                        <strong>(ঙ) প্রত্যক্ষ বৈদেশিক বিনিয়োগের (FDI) সুবিধা ও অসুবিধা।</strong> (গ-বিভাগ, জা.বি. ২০২৪)
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 06: Most Repeated Questions Ranking */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>০৬. ফ্রিকোয়েন্সি র‍্যাংকিং</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  06. 🔁 Most Repeated Questions (সর্বাধিক পুনরাবৃত্ত প্রশ্নের শীর্ষ তালিকা)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="p-3 font-semibold">র‍্যাংক</th>
                        <th className="p-3 font-semibold">প্রশ্ন ও মূল বিষয়বস্তু</th>
                        <th className="p-3 font-semibold">বিভাগ</th>
                        <th className="p-3 font-semibold">বিগত সালসমূহ</th>
                        <th className="p-3 font-semibold text-center">পুনরাবৃত্তি</th>
                        <th className="p-3 font-semibold">প্রায়োরিটি</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {TOP_30_FINAL_LIST.slice(0, 10).map(item => (
                        <tr key={item.rank} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-teal-800 tabular-nums">#{item.rank}</td>
                          <td className="p-3 font-medium text-slate-900">{item.title}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-xs bg-slate-100 font-semibold text-slate-700">
                              {item.section}-বিভাগ
                            </span>
                          </td>
                          <td className="p-3 text-xs text-slate-500">{item.years}</td>
                          <td className="p-3 font-bold text-center text-teal-800 tabular-nums">{item.freq} বার</td>
                          <td className="p-3 font-semibold text-xs text-red-600">🔥 ৯৯% প্রায়োরিটি</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 07: Chapter-Wise Analysis */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>০৭. অধ্যায়ভিত্তিক পূর্ণাঙ্গ ছক</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  07. 📚 Chapter-Wise Suggestion (অধ্যায়ভিত্তিক বিশ্লেষণ ও গুরুত্ব)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CHAPTERS_DATA.map((ch, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          {ch.priority} গুরুত্ব
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {ch.questionCount}টি প্রশ্ন
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mb-2 leading-snug">{ch.chapter}</h4>
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 block font-medium">মূল ফোকাস টপিক:</span>
                        {ch.keyTopics.map((topic, tidx) => (
                          <div key={tidx} className="text-xs text-slate-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-800 shrink-0"></span>
                            <span className="truncate">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 08: ক বিভাগ Suggestion + Answers */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <span>০৮. ১ নম্বরের নিশ্চিত প্রস্তুতি</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      08. 📝 ক বিভাগ Suggestion + Exam-Ready Answers
                    </h2>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                    ১২টির মধ্যে ১০টি কমন টার্গেট
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  নিচের সংক্ষিপ্ত উত্তরগুলো হুবহু পরীক্ষায় লেখার মতো আদর্শ মাপে তৈরি করা হয়েছে:
                </p>

                <div className="space-y-3">
                  {BRIEF_QUESTIONS_KA.slice(0, 15).map(q => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-teal-800 text-sm">
                          প্রশ্ন {q.number}: {q.question}
                        </span>
                        <span className="text-xs text-red-600 font-bold shrink-0">{q.priority}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">
                        অধ্যায়: {q.chapter} | বিগত সাল: {q.years.join(', ')}
                      </p>
                      <div className="p-3 bg-white rounded-lg border border-slate-100 text-xs text-slate-800 leading-relaxed font-serif-bn">
                        <strong>উত্তর:</strong> {q.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 09: খ বিভাগ Suggestion + Answer Structure */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <span>০৯. ৪ নম্বরের কাঠামোবদ্ধ উত্তর</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      09. 📝 খ বিভাগ Suggestion + 4-Mark Answer Structure
                    </h2>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                    ৮টির মধ্যে ৫টি কমন টার্গেট
                  </span>
                </div>

                <div className="space-y-4">
                  {SHORT_QUESTIONS_KHA.slice(0, 5).map(q => (
                    <div key={q.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {q.question}
                        </h4>
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded shrink-0">
                          {q.priority} ({q.frequency} বার)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                        বোর্ড সালসমূহ: {q.years.join(', ')}
                      </p>

                      {q.answerStructure && (
                        <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2 text-xs text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-teal-800">ভূমিকা:</strong> {q.answerStructure.intro}
                          </div>
                          <div>
                            <strong className="text-teal-800 block mb-1">মূল আলোচনা / পয়েন্টসমূহ:</strong>
                            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
                              {q.answerStructure.points?.map((pt, idx) => (
                                <li key={idx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                          {q.answerStructure.conclusion && (
                            <div>
                              <strong className="text-teal-800">উপসংহার:</strong> {q.answerStructure.conclusion}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 10: গ বিভাগ Suggestion + Answer Structure */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <span>১০. ১০ নম্বরের পূর্ণাঙ্গ প্রস্তুতি</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      10. 📝 গ বিভাগ Suggestion + 10-Mark Answer Structure
                    </h2>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                    ৮টির মধ্যে ৫টি কমন টার্গেট (৫০ নম্বর)
                  </span>
                </div>

                <div className="space-y-4">
                  {BROAD_QUESTIONS_GA.slice(0, 4).map(q => (
                    <div key={q.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 text-base leading-snug">
                          {q.question}
                        </h4>
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded shrink-0">
                          {q.priority} ({q.frequency} বার)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                        অধ্যায়: {q.chapter} | সাল: {q.years.join(', ')}
                      </p>

                      {q.answerStructure && (
                        <div className="bg-white p-4 rounded-lg border border-slate-100 space-y-2.5 text-xs text-slate-700 leading-relaxed font-serif-bn">
                          <div>
                            <strong className="text-teal-900 font-sans">ভূমিকা ও সংজ্ঞা:</strong> {q.answerStructure.intro}
                          </div>
                          <div>
                            <strong className="text-teal-900 font-sans block mb-1">পয়েন্টভিত্তিক বিস্তারিত ব্যাখ্যা:</strong>
                            <div className="space-y-1.5 pl-2 border-l-2 border-teal-200">
                              {q.answerStructure.points?.map((pt, idx) => (
                                <p key={idx} className="text-slate-800">{pt}</p>
                              ))}
                            </div>
                          </div>
                          {q.answerStructure.diagramOrFormula && (
                            <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900">
                              <strong>📊 চিত্র / রেখাচিত্রের নির্দেশনা:</strong> {q.answerStructure.diagramOrFormula}
                            </div>
                          )}
                          <div>
                            <strong className="text-teal-900 font-sans">উপসংহার:</strong> {q.answerStructure.conclusion}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 11: Diagrams & Numericals */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>১১. গাণিতিক সূত্র ও রেখাচিত্র</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  11. 📊 Important Diagram & Numerical Master List
                </h2>
                <div className="space-y-3">
                  {DIAGRAMS_MASTER_LIST.map((d, idx) => (
                    <div key={idx} className="p-4 bg-teal-50/40 rounded-xl border border-teal-100">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-teal-950">{d.topic}</h4>
                        <span className="text-xs font-bold text-red-600 bg-white px-2 py-0.5 rounded border border-red-200">
                          {d.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2 font-medium">সংশ্লিষ্ট প্রশ্ন: {d.question}</p>
                      <div className="p-3 bg-white rounded-lg border border-teal-100 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-mono">
                        {d.formulaOrDiagram}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 12 & 13: Year-Wise & Trend Analysis */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>১২ ও ১৩. সালভিত্তিক প্রবণতা বিশ্লেষণ</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  12 & 13. 📅 Year-Wise & Trend Analysis (বোর্ড ট্রেন্ড বিশ্লেষণ)
                </h2>
                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <p>
                    বিগত ২০১৯ থেকে ২০২৪ সালের প্রশ্নপত্রের ধারা বিশ্লেষণ করে জাতীয় বিশ্ববিদ্যালয়ের প্রশ্নপ্রণয়ন প্রক্রিয়ার নিম্নোক্ত মূল প্রবণতাগুলো সুস্পষ্ট হয়েছে:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <h4 className="font-bold text-slate-900 mb-1">১. প্রতি বিকল্প বছরে পুনরাবৃত্তি (Gap Rule)</h4>
                      <p className="text-slate-600">
                        ২০২২ এবং ২০২৩ সালের মৌলিক প্রশ্নগুলো ২০২৫/২০২৬ পরীক্ষায় সরাসরি রিপিট হওয়ার হার সবচেয়ে বেশি। ২০২৪ সালের জটিল রচনামূলক প্রশ্নগুলোর বিকল্প খণ্ডগুলো আসার উচ্চ সম্ভাবনা রয়েছে।
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <h4 className="font-bold text-slate-900 mb-1">২. ক-বিভাগের সংজ্ঞাগত ধারাবাহিকতা</h4>
                      <p className="text-slate-600">
                        GDP, প্রবৃদ্ধি, দারিদ্র্যের দুষ্টচক্র, শক্তিসম্পদ, ছদ্মবেশী বেকারত্ব—এই ৫টি পরিভাষা গত ৬ বছরে প্রতিবার কোনো না কোনো রূপে উপস্থিত ছিল।
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <h4 className="font-bold text-slate-900 mb-1">৩. গ-বিভাগে তাত্ত্বিক ও প্রয়োগিক মিশ্রণ</h4>
                      <p className="text-slate-600">
                        প্রতিটি বছর ৮টি রচনামূলক প্রশ্নের মধ্যে অন্তত ৩টি খাঁটি অর্থনৈতিক তত্ত্ব (ম্যালথাস, লেনদেন ভারসাম্য, নার্কসের চক্র) এবং বাকি ৫টি বাংলাদেশের বাস্তব অর্থনীতি (ব্যাংক, কৃষি, দারিদ্র্য) থেকে আসে।
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 14: Top 30 Final Suggestion */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <span>১৪. চূড়ান্ত সাজেশনের সারসংক্ষেপ</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      14. 🎯 TOP 30 Final Exam Suggestion (সেরা ৩০ প্রশ্ন)
                    </h2>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2.5 font-bold">ক্রম</th>
                        <th className="p-2.5 font-bold">প্রশ্ন / বিষয়বস্তু</th>
                        <th className="p-2.5 font-bold">বিভাগ</th>
                        <th className="p-2.5 font-bold">বার</th>
                        <th className="p-2.5 font-bold">র‍্যাংকিং ও গুরুত্বের কারণ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {TOP_30_FINAL_LIST.map(item => (
                        <tr key={item.rank} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-teal-800 tabular-nums">#{item.rank}</td>
                          <td className="p-2.5 font-medium text-slate-900">{item.title}</td>
                          <td className="p-2.5 font-bold text-slate-700">{item.section}-বিভাগ</td>
                          <td className="p-2.5 font-bold text-teal-800 tabular-nums">{item.freq}</td>
                          <td className="p-2.5 text-slate-500">{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 15, 16, 17: Study Plans */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>১৫, ১৬ ও ১৭. পরীক্ষার প্রস্তুতি রুটিন</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  15-17. ⏱️ 1-Day, 3-Day & 7-Day Fast Preparation Sequences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/40">
                    <h3 className="font-bold text-sm text-red-900 mb-1">যদি সময় মাত্র ১ দিন থাকে:</h3>
                    <p className="text-xs text-red-700 mb-3 font-medium">জরুরি পাস ও ৬০+ নম্বর অর্জনের স্ট্র্যাটেজি</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                      <li>ক-বিভাগের ৯৯% তালিকার ১৬টি সংজ্ঞা সম্পূর্ণ মুখস্থ করুন।</li>
                      <li>খ-বিভাগের ৫টি শীর্ষ প্রশ্ন (প্রবৃদ্ধি পার্থক্য, অবকাঠামো, কৃষি ঋণ, বিদ্যুৎ, দুষ্টচক্র) ৩ বার রিভিশন দিন।</li>
                      <li>গ-বিভাগে বাংলাদেশ ব্যাংক, ম্যালথাসের জনসংখ্যা তত্ত্ব ও যোগাযোগ ব্যবস্থার ৫টি করে পয়েন্ট মুখস্থ করুন।</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40">
                    <h3 className="font-bold text-sm text-teal-900 mb-1">৩ দিনের গোছানো প্রস্তুতি:</h3>
                    <p className="text-xs text-teal-700 mb-3 font-medium">প্রথম বিভাগ (১ম শ্রেণি) অর্জনের নিশ্চিত পথ</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                      <li><strong>১ম দিন:</strong> অধ্যায় ১ ও ২ (উন্নয়ন, অবকাঠামো ও শক্তি সম্পদ)।</li>
                      <li><strong>২য় দিন:</strong> অধ্যায় ৩, ৪ ও ৫ (জনসংখ্যা, কৃষি ঋণ ও শিল্প খাত)।</li>
                      <li><strong>৩য় দিন:</strong> অধ্যায় ৬, ৭ ও ১০ (বাংলাদেশ ব্যাংক, বৈদেশিক বাণিজ্য ও দারিদ্র্য বিমোচন)।</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                    <h3 className="font-bold text-sm text-blue-900 mb-1">৭ দিনের ফুল-সিলেবাস কভারেজ:</h3>
                    <p className="text-xs text-blue-700 mb-3 font-medium">A+ গ্রেডের জন্য পূর্ণাঙ্গ প্রস্তুতি</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                      <li>দিন ১-২: ১২৬টি ক-বিভাগ প্রশ্নের পূর্ণাঙ্গ মডেল টেস্ট।</li>
                      <li>দিন ৩-৪: খ-বিভাগের ৬৮টি প্রশ্ন নোট করে পয়েন্ট রিভিশন।</li>
                      <li>দিন ৫-৬: গ-বিভাগের সকল চিত্র ও রেখাচিত্র হাতে এঁকে প্র্যাকটিস।</li>
                      <li>দিন ৭: ২০২২, ২০২৩ ও ২০২৪ সালের ৩ ঘণ্টার পূর্ণাঙ্গ টাইমড মক পরীক্ষা।</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Section 18: Risk & Evidence Report */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>১৮. সতকর্তা ও প্রমাণ মূল্যায়ন</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  18. ⚠️ Risk & Evidence Report (ঝুঁকি ও একাডেমিক প্রমাণ বিশ্লেষণ)
                </h2>
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed space-y-2">
                  <p>
                    <strong>একাডেমিক সততা নিশ্চিতকরণ:</strong> এই সাজেশনটি কোনো অনুমান বা ভবিষ্যৎদ্বাণী নয়। এটি বিগত বছরের প্রশ্নপত্রে উপস্থিতির সুনির্দিষ্ট ফ্রিকোয়েন্সির ওপর প্রতিষ্ঠিত।
                  </p>
                  <p>
                    <strong>ঝুঁকি এড়ানোর পরামর্শ:</strong> কোনো একক প্রশ্নের ওপর শতভাগ নির্ভর না করে প্রতিটি অধ্যায়ের মূল ধারণাগত ভিত্তিটি স্পষ্ট রাখুন। প্রশ্ন ঘুরিয়ে আসলেও যাতে মূল পয়েন্টগুলো (ভূমিকা, পয়েন্ট ১-৫, উপসংহার) যথাযথভাবে পরীক্ষার খাতায় উপস্থাপন করা যায়।
                  </p>
                </div>
              </section>

              {/* Section 19: Final Exam Checklist */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>১৯. পরীক্ষার হল চেকলিস্ট</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  19. ✅ Final Exam Checklist (পরীক্ষার হলের কার্যকারী চেকলিস্ট)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>ক-বিভাগে সময় ব্যবস্থাপনা: প্রথম ২০ মিনিটের মধ্যে ১০টি সংক্ষিপ্ত প্রশ্নের উত্তর টু-দ্য-পয়েন্টে শেষ করুন।</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>খ-বিভাগের উত্তর দৈর্ঘ্য: প্রতি প্রশ্নের জন্য সর্বোচ্চ ১ থেকে দেড় পৃষ্ঠা এবং ৪টি সুস্পষ্ট পয়েন্ট।</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>গ-বিভাগে চিত্র ও সূত্র: ম্যালথাসের তত্ত্ব বা দারিদ্র্যের দুষ্টচক্রে অবশ্যই পেন্সিল দিয়ে স্পষ্ট চিত্র আঁকবেন।</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>রিভিশন টাইম: ৩ ঘণ্টা ৩০ মিনিটের মধ্যে অন্তত শেষ ১৫ মিনিট খাতার রোল, রেজিস্ট্রেশন ও প্রশ্নের নম্বর মেলাতে রাখুন।</span>
                  </div>
                </div>
              </section>

              {/* Section 20: PDF Verification Report */}
              <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm print-avoid-break">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>২০. চূড়ান্ত ভেরিফিকেশন রিপোর্ট</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-4">
                  20. 🔍 PDF Verification Report (যাচাইকৃত চূড়ান্ত সংখ্যায়ন)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block">মোট পরীক্ষিত পৃষ্ঠা</span>
                    <strong className="text-white text-base">{PDF_VERIFICATION_STATS.totalPagesAnalyzed} পৃষ্ঠা</strong>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block">মোট নিষ্কাশিত প্রশ্ন</span>
                    <strong className="text-white text-base">{PDF_VERIFICATION_STATS.totalQuestionsExtracted} টি</strong>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block">৯৯% প্রায়োরিটি আইটেম</span>
                    <strong className="text-emerald-400 text-base">{PDF_VERIFICATION_STATS.total99PriorityItems} টি</strong>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block">OCR অনিশ্চিত অংশ</span>
                    <strong className="text-white text-base">০ টি (সম্পূর্ণ পঠিত)</strong>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400 border-t border-slate-800 pt-3">
                  মূল উৎস: জাতীয় বিশ্ববিদ্যালয় ডিগ্রি পাস ১ম বর্ষ ব্যতিক্রম সর্বশেষ চূড়ান্ত সাজেশন (বিষয় কোড: ১১২২০৩)।
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: Top 30 Final Suggestion */}
          {activeTab === 'top30' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-2">🎯 টপ ৩০ চূড়ান্ত সাজেশন (Top 30 Final Targets)</h2>
                <p className="text-xs text-slate-600 mb-4">
                  বিগত পরীক্ষাগুলোতে সর্বাধিকবার আগত এবং সবচেয়ে জোরালো প্রমাণযুক্ত ৩০টি শীর্ষ প্রশ্ন:
                </p>

                <div className="space-y-3">
                  {TOP_30_FINAL_LIST.map(item => (
                    <div key={item.rank} className="p-4 bg-slate-50 hover:bg-teal-50/40 rounded-xl border border-slate-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {item.rank}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded">
                            {item.section}-বিভাগ
                          </span>
                          <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">
                            {item.freq} বার পুনরাবৃত্ত
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 pl-9 space-y-1">
                        <p><strong>বোর্ড সাল:</strong> {item.years}</p>
                        <p><strong>র‍্যাংকিং যুক্তি:</strong> {item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Brief Questions (ক-বিভাগ) */}
          {activeTab === 'briefKa' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">ক-বিভাগ : অতি সংক্ষিপ্ত প্রশ্নোত্তর (Brief Questions)</h2>
                    <p className="text-xs text-slate-500">পরীক্ষায় ১২টি থাকবে, ১০টির উত্তর দিতে হবে (মান: ১০ × ১ = ১০)</p>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                    {BRIEF_QUESTIONS_KA.length}টি প্রশ্ন সংকলিত
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {BRIEF_QUESTIONS_KA.map(q => {
                    const isExpanded = expandedQuestions[q.id];
                    return (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => toggleExpand(q.id)}>
                          <div>
                            <span className="text-xs text-slate-500 block mb-0.5">{q.chapter} • বিগত সাল: {q.years.join(', ')}</span>
                            <h4 className="font-bold text-slate-900 text-sm">{q.number}. {q.question}</h4>
                          </div>
                          <span className="text-xs text-red-600 font-bold bg-red-50 border border-red-100 px-2 py-0.5 rounded shrink-0">
                            {q.priority}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200/60">
                          <p className="text-xs text-slate-800 leading-relaxed font-serif-bn">
                            <strong className="text-teal-800 font-sans">উত্তর:</strong> {q.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Short Questions (খ-বিভাগ) */}
          {activeTab === 'shortKha' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">খ-বিভাগ : সংক্ষিপ্ত প্রশ্নাবলি (Short Questions)</h2>
                    <p className="text-xs text-slate-500">পরীক্ষায় ৮টি থাকবে, ৫টির উত্তর দিতে হবে (মান: ৫ × ৪ = ২০)</p>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                    ৪ নম্বরের কাঠামোসহ
                  </span>
                </div>

                <div className="space-y-4">
                  {SHORT_QUESTIONS_KHA.map(q => (
                    <div key={q.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-xs text-slate-500 block mb-1">{q.chapter} • বোর্ড সাল: {q.years.join(', ')}</span>
                          <h4 className="font-bold text-slate-900 text-base">{q.question}</h4>
                        </div>
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded shrink-0">
                          {q.priority} ({q.frequency} বার)
                        </span>
                      </div>

                      {q.answerStructure && (
                        <div className="mt-3 p-4 bg-white rounded-lg border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-teal-800">ভূমিকা:</strong> {q.answerStructure.intro}
                          </div>
                          <div>
                            <strong className="text-teal-800 block mb-1">মূল পয়েন্টসমূহ (৪ নম্বর উপযোগী):</strong>
                            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                              {q.answerStructure.points?.map((pt, idx) => (
                                <li key={idx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                          {q.answerStructure.conclusion && (
                            <div>
                              <strong className="text-teal-800">উপসংহার:</strong> {q.answerStructure.conclusion}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Broad Questions (গ-বিভাগ) */}
          {activeTab === 'broadGa' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">গ-বিভাগ : রচনামূলক প্রশ্নাবলি (Broad Questions)</h2>
                    <p className="text-xs text-slate-500">পরীক্ষায় ৮টি থাকবে, ৫টির উত্তর দিতে হবে (মান: ৫ × ১০ = ৫০)</p>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                    ১০ নম্বরের পূর্ণাঙ্গ মডেল
                  </span>
                </div>

                <div className="space-y-5">
                  {BROAD_QUESTIONS_GA.map(q => (
                    <div key={q.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-xs text-slate-500 block mb-1">{q.chapter} • বোর্ড সাল: {q.years.join(', ')}</span>
                          <h4 className="font-bold text-slate-900 text-lg leading-snug">{q.question}</h4>
                        </div>
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded shrink-0">
                          {q.priority} ({q.frequency} বার)
                        </span>
                      </div>

                      {q.answerStructure && (
                        <div className="mt-3 p-5 bg-white rounded-xl border border-slate-200 space-y-3 text-xs text-slate-700 leading-relaxed font-serif-bn">
                          <div>
                            <strong className="text-teal-900 font-sans block text-sm mb-1">ভূমিকা ও সংজ্ঞা:</strong>
                            <p className="text-slate-800">{q.answerStructure.intro}</p>
                          </div>
                          <div>
                            <strong className="text-teal-900 font-sans block text-sm mb-1">মূল পয়েন্টভিত্তিক বিশ্লেষণ:</strong>
                            <div className="space-y-2 pl-3 border-l-2 border-teal-300">
                              {q.answerStructure.points?.map((pt, idx) => (
                                <p key={idx} className="text-slate-800">{pt}</p>
                              ))}
                            </div>
                          </div>
                          {q.answerStructure.diagramOrFormula && (
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 font-mono">
                              <strong>📊 চিত্র / রেখাচিত্র বিবরণ:</strong> {q.answerStructure.diagramOrFormula}
                            </div>
                          )}
                          <div>
                            <strong className="text-teal-900 font-sans block text-sm mb-1">উপসংহার:</strong>
                            <p className="text-slate-800">{q.answerStructure.conclusion}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Diagrams and Numericals */}
          {activeTab === 'diagrams' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-2">📊 গুরুত্বপূর্ণ রেখাচিত্র ও গাণিতিক সূত্র মাস্টার তালিকা</h2>
                <p className="text-xs text-slate-600 mb-4">
                  ১০ নম্বরের রচনামূলক প্রশ্নে চিত্র বা সঠিক সূত্র দিলে পরীক্ষক পূর্ণ নম্বর প্রদান করেন। নিচের ৫টি আইটেম ভালো করে অনুশীলন করুন:
                </p>

                <div className="space-y-4">
                  {DIAGRAMS_MASTER_LIST.map((item, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-base text-teal-900">{item.topic}</h4>
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2 font-medium">পরীক্ষার প্রশ্ন: {item.question}</p>
                      <div className="p-4 bg-white rounded-lg border border-teal-100 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
                        {item.formulaOrDiagram}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Board Years */}
          {activeTab === 'boardYears' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-2">📅 বিগত ৬ বছরের প্রশ্নপত্র সংক্ষেপ (২০১৯ — ২০২৪)</h2>
                <p className="text-xs text-slate-600 mb-4">
                  জাতীয় বিশ্ববিদ্যালয়ের বিগত ৬টি বোর্ড পরীক্ষার প্রশ্ন বিন্যাস ও গুরুত্বপূর্ণ আইটেম:
                </p>

                <div className="space-y-4">
                  {BOARD_EXAM_PAPERS.map(b => (
                    <div key={b.year} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-base text-slate-900">{b.session}</h3>
                        <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                          {b.year} পরীক্ষা
                        </span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-700">
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <strong className="text-teal-800">ক-বিভাগ হাইলাইটস:</strong> {b.briefHighlights}
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <strong className="text-teal-800">খ-বিভাগ হাইলাইটস:</strong> {b.shortHighlights}
                        </div>
                        <div className="p-2.5 bg-white rounded border border-slate-200">
                          <strong className="text-teal-800">গ-বিভাগ হাইলাইটস:</strong> {b.broadHighlights}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Study Planner with Checkboxes */}
          {activeTab === 'planner' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-2">⏱️ পরীক্ষার রুটিন ও ইন্টারেক্টিভ রিভিশন চেকলিস্ট</h2>
                <p className="text-xs text-slate-600 mb-4">
                  পড়া শেষ হলে বক্সে টিক চিহ্ন দিন। আপনার অগ্রগতি ব্রাউজারে স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে।
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'task-1', title: 'ক-বিভাগ: ১ম ও ২য় অধ্যায়ের ২০টি সংজ্ঞা মুখস্থ', time: '১ম ধাপ' },
                    { id: 'task-2', title: 'ক-বিভাগ: ৩য় ও ৪র্থ অধ্যায়ের ১৫টি সংজ্ঞা ও সূত্র', time: '১ম ধাপ' },
                    { id: 'task-3', title: 'ক-বিভাগ: ব্যাংক ও বৈদেশিক বাণিজ্য পরিভাষা', time: '১ম ধাপ' },
                    { id: 'task-4', title: 'খ-বিভাগ: অর্থনৈতিক উন্নয়ন বনাম অর্থনৈতিক প্রবৃদ্ধি', time: '২য় ধাপ' },
                    { id: 'task-5', title: 'খ-বিভাগ: শক্তি সম্পদের গুরুত্ব ও বিদ্যুৎ ঘাটতি', time: '২য় ধাপ' },
                    { id: 'task-6', title: 'খ-বিভাগ: কৃষিতে প্রাতিষ্ঠানিক বনাম অপ্রাতিষ্ঠানিক ঋণ', time: '২য় ধাপ' },
                    { id: 'task-7', title: 'খ-বিভাগ: দারিদ্র্যের দুষ্টচক্র চিত্রসহ তৈরি', time: '২য় ধাপ' },
                    { id: 'task-8', title: 'গ-বিভাগ: বাংলাদেশ ব্যাংকের গঠন ও কার্যাবলি নোট', time: '৩য় ধাপ' },
                    { id: 'task-9', title: 'গ-বিভাগ: পরিবহন ও যোগাযোগ ব্যবস্থার ভূমিকা', time: '৩য় ধাপ' },
                    { id: 'task-10', title: 'গ-বিভাগ: ম্যালথাসের জনসংখ্যা তত্ত্ব রেখাচিত্র অঙ্কন', time: '৩য় ধাপ' },
                    { id: 'task-11', title: 'গ-বিভাগ: বৈদেশিক লেনদেন ভারসাম্য ঘাটতি ও প্রতিকার', time: '৩য় ধাপ' },
                    { id: 'task-12', title: 'মক টেস্ট: ৩ ঘণ্টা ৩০ মিনিটে একটি পূর্ণাঙ্গ বোর্ড পত্র সমাধান', time: 'চূড়ান্ত ধাপ' },
                  ].map(t => {
                    const isDone = !!checkedPlanTasks[t.id];
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTask(t.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}}
                            className="w-4 h-4 text-teal-800 rounded focus:ring-teal-700"
                          />
                          <div>
                            <span className="font-semibold text-xs sm:text-sm block">{t.title}</span>
                            <span className="text-[11px] text-slate-500">{t.time}</span>
                          </div>
                        </div>
                        {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: Android APK Build Guide & Pipeline */}
          {activeTab === 'androidApk' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>অ্যান্ড্রয়েড প্রজেক্ট ও রিয়েল বিল্ড পাইপলাইন</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-teal-800" />
                  <span>Real Android App + Real Debug APK + GitHub Actions</span>
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                  এই রিপোজিটরিতে সম্পূর্ণ নেটিভ অ্যান্ড্রয়েড কোডবেস (Kotlin + Jetpack Compose + Material 3) এবং স্বয়ংক্রিয় <strong>GitHub Actions</strong> পাইপলাইন কনফিগার করা হয়েছে। কঠোর নিয়মানুযায়ী কোনো ফেক বা ডামি এপিকে তৈরি করা হয়নি; গিটহাবের রিয়েল রানারে গ্র্যাডল বিল্ড সম্পন্ন হয়ে সরাসরি রিপোজিটরির <code>APK_DOWNLOAD/app-debug.apk</code> ডিরেক্টরিতে রক্ষিত হবে।
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-teal-900 font-bold text-sm">
                      <Layers className="w-4 h-4 text-teal-700" />
                      <span>১. সম্পূর্ণ সোর্স কোড</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Kotlin, Jetpack Compose, Material 3, AndroidX, Navigation Compose, এবং পূর্ণাঙ্গ অফলাইন প্রশ্ন ডেটাবেজ।
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-teal-900 font-bold text-sm">
                      <Github className="w-4 h-4 text-teal-700" />
                      <span>২. GitHub Actions CI/CD</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <code>.github/workflows/android-build.yml</code> ফাইলের মাধ্যমে প্রতি পুশ বা ম্যানুয়াল ট্রিগারে রিয়েল <code>./gradlew assembleDebug</code> রান হয়।
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-teal-900 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4 text-teal-700" />
                      <span>৩. কঠোর এপিকে ভ্যালিডেশন</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      বিল্ডের পর <code>unzip -t</code> ও <code>sha256sum</code> হ্যাশ যাচাই শেষে <code>APK_DOWNLOAD/app-debug.apk</code> তে কমিট ও আর্টফ্যাক্ট আপলোড হয়।
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs space-y-2">
                  <div className="text-teal-400 font-bold"># গিটহাবে পুশ ও রিয়েল এপিকে বিল্ড চালু করার নির্দেশিকা:</div>
                  <div className="text-slate-400"># ১. কোড কমিট ও পুশ করুন:</div>
                  <div className="text-amber-300">git add .</div>
                  <div className="text-amber-300">git commit -m "feat: real android app and build workflow"</div>
                  <div className="text-amber-300">git push origin main</div>
                  <div className="text-slate-400"># ২. GitHub &gt; Actions ট্যাবে যান এবং 'Android Build & APK Generation' রান হওয়া দেখুন।</div>
                  <div className="text-slate-400"># ৩. বিল্ড শেষ হলে সরাসরি GitHub Code ব্রাউজার থেকে নামান:</div>
                  <div className="text-emerald-400">APK_DOWNLOAD/app-debug.apk</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>জাতীয় বিশ্ববিদ্যালয় বিএসএস ডিগ্রি (পাস) ১ম বর্ষ পরীক্ষা সহায়তা পোর্টাল • কোড: ১১২২০৩</span>
          <span>সর্বস্বত্ব সংরক্ষিত © ২০২৬ • অর্থনীতি দ্বিতীয় পত্র (বাংলাদেশের অর্থনীতি)</span>
        </div>
      </footer>
    </div>
  );
}
