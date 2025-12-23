import React, { useState, useRef, useEffect } from 'react';

interface TerminalInputProps {
  prompt: string;
  onCommand: (command: string) => void;
  disabled?: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ 
  prompt, 
  onCommand, 
  disabled = false 
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <span className="text-terminal-green font-mono">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-terminal-text font-mono text-sm"
        autoComplete="off"
        autoFocus
      />
      {!disabled && (
        <span className="w-2 h-4 bg-terminal-green terminal-cursor"></span>
      )}
    </form>
  );
};

