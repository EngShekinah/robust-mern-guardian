
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript', className }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={cn("relative bg-gray-900 rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300">{language}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="h-6 px-2 text-gray-300 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
