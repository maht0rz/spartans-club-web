"use client";
import React from "react";
import { createPortal } from "react-dom";

type Props = {
  triggerLabel: string;
  phoneLabel: string;
  whatsappLabel: string;
  instagramLabel: string;
  phone: string;
  whatsapp: string;
  instagram: string;
};

export default function ContactMenu({
  triggerLabel,
  phoneLabel,
  whatsappLabel,
  instagramLabel,
  phone,
  whatsapp,
  instagram
}: Props) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [mounted, setMounted] = React.useState(false);
  const menuId = React.useId();

  function updatePosition() {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const width = 176; // w-44
    setPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX - width
    });
  }

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!btnRef.current || !menuRef.current) return;
      if (btnRef.current.contains(target) || menuRef.current.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("keyup", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("keyup", onKey, true);
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center rounded-full bg-transparent px-3 py-2 text-sm hover:bg-black/5"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        {triggerLabel}
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="ml-2" aria-hidden="true">
          <path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              className="fixed w-44 rounded-md border border-black/10 bg-white shadow-elevation overflow-hidden z-[1000]"
              style={{ top: pos.top, left: pos.left }}
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
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

