import type { TextareaHTMLAttributes } from "react";

export function ConfigTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full rounded-small px-2.5 py-1.5 text-xs font-body outline-none transition-colors bg-[#0A0E14] border border-accent text-neon focus:border-neon/40 resize-none leading-relaxed"
      {...props}
    />
  );
}
