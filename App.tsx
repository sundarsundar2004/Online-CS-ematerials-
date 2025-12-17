import React, { useState, useEffect } from 'react';
import { Subject, Topic, QuizQuestion } from './types';
import { SUBJECTS, INITIAL_GREETING } from './constants';
import { geminiService } from './services/geminiService';
import { MarkdownView } from './components/MarkdownView';
import { ChatWidget } from './components/ChatWidget';
import { QuizModal } from './components/QuizModal';
import { BookOpen, ChevronRight, Menu, Code2, Brain, Database, Binary, Globe, GraduationCap, LayoutDashboard, Search } from 'lucide-react';

const Icons: Record<string, React.FC<any>> = {
  'Binary': Binary,
  'Globe': Globe,
  'Brain': Brain,
  'Database': Database,
};

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  // Content State
  const [content, setContent] = useState<string>(INITIAL_GREETING);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Quiz State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setContent(`## ${subject.title}\n\n${subject.description}\n\nSelect a topic from the sidebar to generate a lesson.`);
    setIsSidebarOpen(true);
  };

  const handleTopicSelect = async (topic: Topic) => {
    if (!selectedSubject) return;
    setSelectedTopic(topic);
    setIsLoading(true);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) setIsSidebarOpen(false);

    try {
      const generated = await geminiService.generateLessonContent(topic.title, selectedSubject.title, topic.prompt);
      setContent(generated);
    } catch (err) {
      setContent("## Error\nSorry, we couldn't generate the material right now. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeQuiz = async () => {
    if (!selectedTopic) return;
    setIsQuizOpen(true);
    setQuizLoading(true);
    setQuizQuestions([]);

    try {
      const questions = await geminiService.generateQuiz(selectedTopic.title);
      setQuizQuestions(questions);
    } catch (err) {
      console.error("Quiz gen failed");
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      
      {/* Sidebar - Subject Navigation (Only visible when a subject is selected or on wide screens) */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${!selectedSubject ? 'md:-translate-x-full' : 'md:translate-x-0'}`} // Hide sidebar on desktop if no subject selected
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
           <div 
             className="flex items-center gap-2 font-bold text-xl text-blue-400 cursor-pointer"
             onClick={() => {
                setSelectedSubject(null);
                setSelectedTopic(null);
                setContent(INITIAL_GREETING);
             }}
           >
             <GraduationCap />
             CS OmniLearn
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
             <Menu size={20} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedSubject ? (
            <>
              <div className="mb-6">
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-3 transition-colors"
                >
                  <ChevronRight className="rotate-180" size={14} /> Back to Dashboard
                </button>
                <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                   {React.createElement(Icons[selectedSubject.iconName] || Code2, { size: 20, className: "text-blue-500" })}
                   {selectedSubject.title}
                </h2>
              </div>
              <div className="space-y-1">
                {selectedSubject.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                      selectedTopic?.id === topic.id 
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/30' 
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    {topic.title}
                    {selectedTopic?.id === topic.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-slate-500 text-sm p-4 text-center italic">
              Select a subject from the dashboard.
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col h-full transition-all duration-300 ${
            selectedSubject ? 'md:ml-72' : ''
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
           <div className="flex items-center gap-4">
             {!isSidebarOpen && selectedSubject && (
               <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                 <Menu size={20} />
               </button>
             )}
             <div className="text-sm breadcrumbs text-slate-400">
               <span className="cursor-pointer hover:text-white" onClick={() => setSelectedSubject(null)}>Home</span>
               {selectedSubject && (
                 <>
                   <span className="mx-2">/</span>
                   <span className="text-slate-200">{selectedSubject.title}</span>
                 </>
               )}
             </div>
           </div>
           
           {selectedTopic && !isLoading && (
              <button 
                onClick={handleTakeQuiz}
                className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
              >
                <BookOpen size={16} />
                Take Quiz
              </button>
           )}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 relative scroll-smooth">
          {/* Dashboard View (No Subject Selected) */}
          {!selectedSubject ? (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="text-center mb-16 mt-8">
                <div className="inline-block p-2 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
                   <GraduationCap className="text-blue-400 w-12 h-12" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
                  Master Computer Science
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Select a learning path below to access <span className="text-white font-semibold">AI-generated tutorials</span>, live coding examples, and interactive quizzes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {SUBJECTS.map((subject) => {
                  const Icon = Icons[subject.iconName] || Code2;
                  return (
                    <div 
                      key={subject.id}
                      onClick={() => handleSubjectSelect(subject)}
                      className="group bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/20 transition-all" />
                      
                      <div className="flex items-start gap-4 relative z-10">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                          <Icon className="text-blue-400 group-hover:text-blue-300 transition-colors" size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{subject.title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{subject.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        Start Learning <ChevronRight size={16} className="ml-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Learning View */
            <div className="max-w-4xl mx-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="text-slate-600 animate-pulse" size={20} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Generating Lesson...</h3>
                    <p className="text-slate-400">Crafting a custom tutorial just for you.</p>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                   <MarkdownView content={content} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating Elements */}
      <ChatWidget contextTopic={selectedTopic ? selectedTopic.title : selectedSubject ? selectedSubject.title : ''} />
      
      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        isLoading={quizLoading} 
        questions={quizQuestions} 
      />

    </div>
  );
}
