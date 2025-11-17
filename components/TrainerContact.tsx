"use client";
import React from "react";

type Props = {
  triggerLabel: string;
  phoneLabel: string;
  whatsappLabel: string;
  instagramLabel: string;
  phone: string;
  whatsapp: string;
  instagram: string;
};

export default function TrainerContact({
  triggerLabel,
  phoneLabel,
  whatsappLabel,
  instagramLabel,
  phone,
  whatsapp,
  instagram
}: Props) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!rootRef.current) return;
      if (rootRef.current.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick, true);
    return () => document.removeEventListener("mousedown", onDocClick, true);
  }, []);

  return (
    <div ref={rootRef} className="relative -mx-4 -mb-4">
      <div className="flex">
        <a
          href={`tel:${phone}`}
          className="flex-1 inline-flex items-center justify-center h-10 text-sm border border-black/20 border-r-0 rounded-none bg-transparent hover:bg-black/5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-colors"
        >
          {phoneLabel}
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center h-10 w-12 border border-l-0 border-black/20 rounded-none bg-transparent hover:bg-black/5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-colors"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={triggerLabel}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-md border border-black/10 bg-white shadow-elevation overflow-hidden z-50"
        >
          <a className="block px-3 py-2 text-sm hover:bg-black/5" href={`tel:${phone}`} role="menuitem">
            {phoneLabel}
          </a>
          <a className="block px-3 py-2 text-sm hover:bg-black/5" href={whatsapp} target="_blank" rel="noreferrer" role="menuitem">
            {whatsappLabel}
          </a>
          <a className="block px-3 py-2 text-sm hover:bg-black/5" href={instagram} target="_blank" rel="noreferrer" role="menuitem">
            {instagramLabel}
          </a>
        </div>
      )}
    </div>
  );
}

