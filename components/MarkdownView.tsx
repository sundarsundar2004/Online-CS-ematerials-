import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-slate max-w-none">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            return isInline ? (
              <code className="bg-slate-800 text-pink-400 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <div className="relative group my-4">
                <div className="absolute -top-3 right-2 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {match?.[1]}
                </div>
                <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-800">
                  <code className={`language-${match?.[1]} text-sm font-mono text-slate-200`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6 border-b border-slate-700 pb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold text-blue-400 mt-8 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-medium text-emerald-400 mt-6 mb-3">{children}</h3>,
          p: ({ children }) => <p className="mb-4 text-slate-300 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-slate-300 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-slate-300 space-y-2">{children}</ol>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic bg-slate-800/50 rounded-r my-4">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
