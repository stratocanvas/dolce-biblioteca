'use client';

import { useEffect, useState } from 'react';

export default function PrivacyPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/privacy.md')
      .then(response => response.text())
      .then(text => setContent(text));
  }, []);

  const renderLine = (line: string, index: number) => {
    const key = `line-${line.slice(0, 20)}-${index}`;
    
    // Calculate indentation level based on spaces
    const getIndentLevel = (line: string): number => {
      const leadingSpaces = line.match(/^ */)?.[0] || '';
      return Math.floor(leadingSpaces.length / 2);
    };

    const indentLevel = getIndentLevel(line);
    const trimmedLine = line.replace(/^ +/, ''); // Remove leading spaces
    const indentStyle = indentLevel > 0 ? { marginLeft: `${indentLevel * 1}rem` } : undefined;

    // Handle Markdown links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const hasLinks = linkRegex.test(line);
    
    if (hasLinks) {
      let lastIndex = 0;
      const parts: (string | JSX.Element)[] = [];
      const newLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match = newLinkRegex.exec(line);
      
      while (match !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }
        
        // Add the link
        parts.push(
          <a
            key={`${key}-link-${match.index}`}
            href={match[2]}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {match[1]}
          </a>
        );
        
        lastIndex = match.index + match[0].length;
        match = newLinkRegex.exec(line);
      }
      
      // Add any remaining text
      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }
      
      return (
        <p key={key} className="text-gray-600 mb-2" style={indentStyle}>
          {parts}
        </p>
      );
    }
    
    // Handle headings
    if (trimmedLine.startsWith('###')) {
      return (
        <h3 key={key} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          {trimmedLine.replace('###', '').trim()}
        </h3>
      );
    }
    if (trimmedLine.startsWith('##')) {
      return (
        <h2 key={key} className="text-2xl font-bold text-gray-900 mt-10 mb-6">
          {trimmedLine.replace('##', '').trim()}
        </h2>
      );
    }

    return (
      <p key={key} className="text-gray-600 mb-2" style={indentStyle}>
        {trimmedLine}
      </p>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article className="prose prose-slate max-w-none">
          {content.split('\n').map((line, index) => renderLine(line, index))}
        </article>
      </div>
    </main>
  );
}
