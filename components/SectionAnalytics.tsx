"use client";
import React from "react";
import { gaEvent } from "../lib/ga";
import { usePathname } from "next/navigation";

const SECTION_IDS = ["top","way-of-life","sessions","testimonials","private-coaching","about","gallery"] as const;

export default function SectionAnalytics() {
  const pathname = usePathname();
  const seenRef = React.useRef<Set<string>>(new Set());
  const obsRef = React.useRef<IntersectionObserver | null>(null);

  function attach() {
    if (obsRef.current) {
      obsRef.current.disconnect();
      obsRef.current = null;
    }
    seenRef.current = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id || "";
            if (id && !seenRef.current.has(id)) {
              seenRef.current.add(id);
              gaEvent("section_view", { section_id: id, path: pathname || "/" });
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    obsRef.current = io;
  }

  React.useEffect(() => {
    // attach initially and on path change
    const t = setTimeout(attach, 0);
    return () => {
      clearTimeout(t);
      if (obsRef.current) {
        obsRef.current.disconnect();
        obsRef.current = null;
      }
    };
  }, [pathname]);

  // Re-attach when consent is granted
  React.useEffect(() => {
    const onConsent = () => attach();
    window.addEventListener("ga-consent", onConsent);
    return () => window.removeEventListener("ga-consent", onConsent);
  }, []);

  return null;
}


