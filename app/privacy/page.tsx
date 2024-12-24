'use client';

import { useEffect, useState } from 'react';

export default function PrivacyPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/privacy.md')
      .then(response => response.text())
      .then(text => setContent(text));
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article className="prose prose-slate max-w-none">
          {content.split('\n').map((line, index) => {
            const key = `line-${line.slice(0, 20)}-${index}`;
            
            if (line.startsWith('###')) {
              return (
                <h3 key={key} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                  {line.replace('###', '').trim()}
                </h3>
              );
            }
            if (line.startsWith('##')) {
              return (
                <h2 key={key} className="text-2xl font-bold text-gray-900 mt-10 mb-6">
                  {line.replace('##', '').trim()}
                </h2>
              );
            }
            if (line.startsWith('-')) {
              return (
                <p key={key} className="text-gray-600 ml-4 mb-2">
                  {line.trim()}
                </p>
              );
            }
            if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
              return (
                <p key={key} className="text-gray-600 ml-4 mb-2">
                  {line.trim()}
                </p>
              );
            }
            return (
              <p key={key} className="text-gray-600 mb-4">
                {line}
              </p>
            );
          })}
        </article>
      </div>
    </main>
  );
}
