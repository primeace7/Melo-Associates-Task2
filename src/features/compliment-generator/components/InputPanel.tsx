import { useRef, type ChangeEvent } from 'react';

interface InputPanelProps {
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
}

/**
 * A textarea that grows with the user's input up to a screen-appropriate
 * maximum height (set in CSS via `max-h-*`), beyond which it scrolls.
 */
export function InputPanel({ value, onChange, disabled }: InputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder="Type a job title or description here"
      aria-label="Job title or description"
      rows={3}
      className="max-h-[40vh] min-h-[6rem] w-full resize-none rounded-2xl border border-stage-border bg-white px-4 py-3.5 font-body text-base text-stage-ink placeholder:text-stage-inkSoft/70 shadow-sm transition-shadow focus:shadow-md disabled:cursor-not-allowed disabled:opacity-70 sm:max-h-64"
    />
  );
}
