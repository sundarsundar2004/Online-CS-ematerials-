import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { X, CheckCircle, XCircle, Award } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  questions: QuizQuestion[];
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, isLoading, questions }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === questions[currentIdx].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="text-yellow-500" size={24} />
            Knowledge Check
          </h2>
          <button onClick={reset} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 animate-pulse">Generating questions with Gemini...</p>
            </div>
          ) : showResults ? (
            <div className="text-center py-8">
              <Award size={64} className="mx-auto text-yellow-500 mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h3>
              <p className="text-slate-300 text-lg mb-8">You scored <span className="text-blue-400 font-bold">{score}</span> out of <span className="text-blue-400 font-bold">{questions.length}</span></p>
              <button 
                onClick={reset}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : questions.length > 0 ? (
            <div>
              <div className="mb-6 flex justify-between items-end">
                 <span className="text-slate-400 text-sm">Question {currentIdx + 1} of {questions.length}</span>
                 <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-500">AI Generated</span>
              </div>
              
              <h3 className="text-xl text-white font-medium mb-6">{questions[currentIdx].question}</h3>
              
              <div className="space-y-3">
                {questions[currentIdx].options.map((option, idx) => {
                  let btnClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ";
                  
                  if (isAnswered) {
                    if (idx === questions[currentIdx].correctAnswerIndex) {
                       btnClass += "bg-green-900/30 border-green-500 text-green-200";
                    } else if (idx === selectedOption) {
                       btnClass += "bg-red-900/30 border-red-500 text-red-200";
                    } else {
                       btnClass += "bg-slate-800/50 border-slate-700 text-slate-500 opacity-50";
                    }
                  } else {
                    btnClass += "bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-750 text-slate-200";
                  }

                  return (
                    <button 
                      key={idx} 
                      onClick={() => handleOptionClick(idx)}
                      disabled={isAnswered}
                      className={btnClass}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === questions[currentIdx].correctAnswerIndex && <CheckCircle size={20} className="text-green-500" />}
                      {isAnswered && idx === selectedOption && idx !== questions[currentIdx].correctAnswerIndex && <XCircle size={20} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-6 bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <p className="text-blue-200 text-sm"><span className="font-bold">Explanation:</span> {questions[currentIdx].explanation}</p>
                </div>
              )}

              {isAnswered && (
                <div className="mt-6 flex justify-end">
                   <button 
                     onClick={handleNext}
                     className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                   >
                     {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}
                   </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500">
                Failed to load questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
