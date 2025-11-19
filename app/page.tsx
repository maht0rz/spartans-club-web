/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import Container from "../components/Container";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import TrainerCard from "../components/TrainerCard";
import { cn } from "../lib/utils";
import trainersData from "../data/trainers.json";
import sponsorsData from "../data/sponsors.json";
import pricingData from "../data/pricing.json";
 

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...options }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
    };
  }, [options]);
  return { ref, inView } as const;
}

function CountUp({
  to,
  suffix = "",
  durationMs = 1200,
  locale = "en",
  className,
}: {
  to: number;
  suffix?: string;
  durationMs?: number;
  locale?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [value, setValue] = React.useState(0);
  const startTs = React.useRef<number | null>(null);
  const hasAnimated = React.useRef(false);
  React.useEffect(() => {
    if (!inView) return;
    if (hasAnimated.current) {
      setValue(to);
      return;
    }
    let raf = 0;
    function easeOutQuad(t: number) {
      return t * (2 - t);
    }
    function step(ts: number) {
      if (startTs.current === null) startTs.current = ts;
      const progress = Math.min(1, (ts - startTs.current) / durationMs);
      const eased = easeOutQuad(progress);
      setValue(Math.floor(eased * to));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setValue(to);
        hasAnimated.current = true;
      }
    }
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [inView, to, durationMs]);
  const formatted = new Intl.NumberFormat(locale).format(value);
  const finalText = `${new Intl.NumberFormat(locale).format(to)}${suffix}`;
  if (!inView && !hasAnimated.current) {
    return (
      <div ref={ref} className={cn("relative inline-block align-middle", className)}>
        <span className="invisible">{finalText}</span>
        <span className="absolute inset-0 flex items-center">
          <span className="w-full h-[0.6em] rounded bg-black/5 dark:bg-white/10 animate-pulse" />
        </span>
      </div>
    );
  } else {
    return (
      <div ref={ref} className={cn("inline-block align-middle", className)}>
        {formatted}
        {suffix}
      </div>
    );
  }
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const langKey =
    i18n.language && i18n.language.toLowerCase().startsWith("sk") ? "sk" : "en";
  return (
    <main>
      <section id="top" className="py-16 scroll-mt-24 hero">
        <Container className="grid grid-cols-1 md:grid-cols-[1.4fr_.6fr] gap-10 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 text-muted-foreground text-xs px-3 py-2 mb-2">
              {t("hero.eyebrow")}
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] mt-3">
              {t("hero.title")}
            </h1>
            <p
              className="text-muted-foreground text-lg leading-relaxed mt-3"
              dangerouslySetInnerHTML={{
                __html: t("hero.body", {
                  coach: "<strong>Headcoach Vincent Kolek</strong>",
                }),
              }}
            />
            <div className="flex gap-3 flex-wrap mt-5">
              <a href="#sessions">
                <Button>{t("hero.cta.sessions")}</Button>
              </a>
              <a href={`tel:${t("about.phone")}`}>
                <Button variant="outline" className="inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.11 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.67-1.2a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t("hero.cta.call")}</span>
                </Button>
              </a>
            </div>
          </div>
          <div className="hero-image order-1 md:order-2 relative">
            <img
              src="/vincent-768w.png"
              srcSet="/vincent-480w.png 480w, /vincent-768w.png 768w, /vincent-1024w.png 1024w, /vincent-1280w.png 1280w"
              sizes="(min-width: 768px) 40vw, 100vw"
              alt="Headcoach Vincent Kolek"
              className="object-center w-full"
              loading="eager"
              fetchPriority="high"
              width={634}
              height={979}
              decoding="async"
            />
          </div>
        </Container>
      </section>

      
      <section className="py-10">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-sm uppercase tracking-wide text-muted-foreground">
                {t("stats.trainees.label")}
              </div>
              {(() => {
                const raw = t("stats.trainees.value") as string;
                const num = parseInt((raw || "").replace(/[^\d]/g, "") || "0", 10);
                const hasPlus = /\+/.test(raw || "");
                return (
                  <CountUp
                    to={num}
                    suffix={hasPlus ? "+" : ""}
                    locale={i18n.language}
                    className="font-display font-extrabold text-4xl md:text-6xl mt-1 font-goodland"
                  />
                );
              })()}
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm uppercase tracking-wide text-muted-foreground">
                {t("stats.experience.label")}
              </div>
              {(() => {
                const raw = t("stats.experience.value") as string;
                const num = parseInt((raw || "").replace(/[^\d]/g, "") || "0", 10);
                const hasPlus = /\+/.test(raw || "");
                return (
                  <CountUp
                    to={num}
                    suffix={hasPlus ? "+" : ""}
                    locale={i18n.language}
                    className="font-display font-extrabold text-4xl md:text-6xl mt-1 font-goodland"
                  />
                );
              })()}
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm uppercase tracking-wide text-muted-foreground">
                {t("stats.sessions.label")}
              </div>
              {(() => {
                const raw = t("stats.sessions.value") as string;
                const num = parseInt((raw || "").replace(/[^\d]/g, "") || "0", 10);
                const hasPlus = /\+/.test(raw || "");
                return (
                  <CountUp
                    to={num}
                    suffix={hasPlus ? "+" : ""}
                    locale={i18n.language}
                    className="font-display font-extrabold text-4xl md:text-6xl mt-1 font-goodland"
                  />
                );
              })()}
            </div>

            <div className="flex flex-col items-center">
              <div className="text-sm uppercase tracking-wide text-muted-foreground">
                {t("stats.established.label")}
              </div>
              {(() => {
                const raw = t("stats.established.value") as string;
                const num = parseInt((raw || "").replace(/[^\d]/g, "") || "0", 10);
                return (
                  <CountUp
                    to={num}
                    locale={i18n.language}
                    className="font-display font-extrabold text-4xl md:text-6xl mt-1 font-goodland"
                  />
                );
              })()}
            </div>
          </div>
        </Container>
      </section>

      

      <section
        id="sessions"
        className="py-12 md:py-12 scroll-mt-24 section-trainings"
      >
        <Container>
          <h2 className="font-display font-extrabold text-4xl md:text-4xl uppercase">
            {t("sessions.title")}
          </h2>
          <p
            className="text-muted-foreground mt-1"
            dangerouslySetInnerHTML={{
              __html: t("sessions.subtitle", {
                coach: "<strong>Headcoach Vincent Kolek</strong>",
              }),
            }}
          />
          <div className="mt-10"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 auto-rows-fr mt-10">
            <Card className="p-4 flex flex-col h-full group">
              <h3 className="font-display font-extrabold font-goodland text-primary text-3xl md:text-4xl tracking-wide m-0">
                {t("session.vip")}
              </h3>
              <div className="text-base md:text-lg text-muted-foreground">
                07:00, 09:00
              </div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-0.5">
                {t("days.mwf")}
              </div>
              <Badge className="mt-2">{t("session.vip.badge")}</Badge>
              <div className="mt-3 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-foreground/80">
                  {t("heading.why")}
                </div>
                <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>{t("session.vip.reasons.0")}</li>
                  <li>{t("session.vip.reasons.1")}</li>
                  <li>{t("session.vip.reasons.2")}</li>
                </ul>
                <div className="mt-3 text-xs font-semibold text-foreground/80">
                  {t("heading.ideal")}
                </div>
                <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>{t("session.vip.ideal.0")}</li>
                  <li>{t("session.vip.ideal.1")}</li>
                  <li>{t("session.vip.ideal.2")}</li>
                </ul>
                {/* <div className="mt-auto pt-3">
                  <a href="#private-coaching">
                    <Button
                      variant="ghost"
                      className="w-full border border-black/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent"
                      size="md"
                    >
                      {t("cta.startNow")}
                    </Button>
                  </a>
                </div> */}
              </div>
              <div className="-mx-4 mt-4 border-t border-black/10">
                <div className="px-4 py-2 flex items-center justify-between bg-black/5">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("pricing.month12")}
                  </span>
                  <span className="text-sm font-bold text-primary ml-auto text-right whitespace-nowrap">
                    {pricingData.vip.month12}
                  </span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("pricing.session")}
                  </span>
                  <span className="text-sm font-semibold text-foreground ml-auto text-right whitespace-nowrap">
                    {pricingData.vip.session}
                  </span>
                </div>
              </div>
            </Card>
            <Card className="p-4 flex flex-col h-full group">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold font-goodland text-primary text-3xl md:text-4xl tracking-wide m-0">
                  {t("session.kids")}
                </h3>
                <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground text-[12px] leading-5 px-2 py-0.5 shadow">
                  {t("ribbon.parents")}
                </span>
              </div>
              <div className="text-base md:text-lg text-muted-foreground">
                16:00
              </div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-0.5">
                {t("days.mwf")}
              </div>
              <Badge className="mt-2">{t("session.kids.badge")}</Badge>
              <div className="mt-3 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-foreground/80">
                  {t("heading.why")}
                </div>
                <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>{t("session.kids.reasons.0")}</li>
                  <li>{t("session.kids.reasons.1")}</li>
                  <li>{t("session.kids.reasons.2")}</li>
                </ul>
                <div className="mt-3 text-xs font-semibold text-foreground/80">
                  {t("heading.ideal")}
                </div>
                <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>{t("session.kids.ideal.0")}</li>
                  <li>{t("session.kids.ideal.1")}</li>
                  <li>{t("session.kids.ideal.2")}</li>
                </ul>
                {/* <div className="mt-auto pt-3">
                  <a href="#private-coaching">
                    <Button
                      variant="ghost"
                      className="w-full border border-black/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent"
                      size="md"
                    >
                      {t("cta.startNow")}
                    </Button>
                  </a>
                </div> */}
              </div>
              <div className="-mx-4 mt-4 border-t border-black/10">
                <div className="px-4 py-2 flex items-center justify-between bg-black/5">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("pricing.month12")}
                  </span>
                  <span className="text-sm font-bold text-primary ml-auto text-right whitespace-nowrap">
                    {pricingData.kids.month12}
                  </span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("pricing.session")}
                  </span>
                  <span className="text-sm font-semibold text-foreground ml-auto text-right whitespace-nowrap">
                    {pricingData.kids.session}
                  </span>
                </div>
              </div>
            </Card>
            <Card className="p-4 flex flex-col h-full group">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold font-goodland text-primary text-3xl md:text-4xl tracking-wide m-0">
                  {t("session.club")}
                </h3>
                <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground text-[12px] leading-5 px-2 py-0.5 shadow">
                  {t("ribbon.favourite")}
                </span>
              </div>
              <div className="text-base md:text-lg text-muted-foreground">
                18:30
              </div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-0.5">
                {t("days.mwf")}
              </div>
              <Badge className="mt-2">{t("session.club.badge")}</Badge>
              <div className="mt-3 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-foreground/80">
                  {t("heading.why")}
                </div>
                <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>{t("session.club.reasons.0")}</li>
                  <li>{t("session.club.reasons.1")}</li>
                  <li>{t("session.club.reasons.2")}</li>
                </ul>
                <div className="mt-3 text-xs font-semibold text-foreground/80">
                  {t("heading.ideal")}
                </div>
                <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>{t("session.club.ideal.0")}</li>
                  <li>{t("session.club.ideal.1")}</li>
                  <li>{t("session.club.ideal.2")}</li>
                </ul>
                {/* <div className="mt-auto pt-3">
                  <a href="#private-coaching">
                    <Button
                      variant="ghost"
                      className="w-full border border-black/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent"
                      size="md"
                    >
                      {t("cta.startNow")}
                    </Button>
                  </a>
                </div> */}
              </div>
              <div className="-mx-4 mt-4 border-t border-black/10">
                <div className="px-4 py-2 flex items-center justify-between bg-black/5">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("pricing.month12")}
                  </span>
                  <span className="text-sm font-bold text-primary ml-auto text-right whitespace-nowrap">
                    {pricingData.club.month12}
                  </span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("pricing.session")}
                  </span>
                  <span className="text-sm font-semibold text-foreground ml-auto text-right whitespace-nowrap">
                    {pricingData.club.session}
                  </span>
                </div>
              </div>
            </Card>
            <Card className="p-4 flex flex-col h-full group">
              <h3 className="font-display font-bold font-goodland text-primary text-3xl md:text-4xl tracking-wide m-0">
                {t("session.private")}
              </h3>
              <div className="text-base md:text-lg text-muted-foreground">
                {t("session.private.time")}
              </div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-0.5">
                {t("days.all")}
              </div>
              <Badge className="mt-2">{t("session.private.badge")}</Badge>
              <div className="mt-3 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-foreground/80">
                  {t("heading.why")}
                </div>
                <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>{t("session.private.reasons.0")}</li>
                  <li>{t("session.private.reasons.1")}</li>
                  <li>{t("session.private.reasons.2")}</li>
                </ul>
                <div className="mt-3 text-xs font-semibold text-foreground/80">
                  {t("heading.ideal")}
                </div>
                <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>{t("session.private.ideal.0")}</li>
                  <li>{t("session.private.ideal.1")}</li>
                  <li>{t("session.private.ideal.2")}</li>
                </ul>
                {/* <div className="mt-auto pt-3">
                  <a href="#private-coaching">
                    <Button
                      variant="ghost"
                      className="w-full border border-black/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent"
                      size="md"
                    >
                      {t("cta.startNow")}
                    </Button>
                  </a>
                </div> */}
              </div>
              <div className="-mx-4 mt-4 border-t border-black/10">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("pricing.session")}
                  </span>
                  <span className="text-sm font-semibold text-foreground ml-auto text-right whitespace-nowrap">
                    {t("pricing.private.session")}
                  </span>
                </div>
              </div>
            </Card>
          </div>
          <div className="mt-10 rounded-md text-center bg-black/1 p-4 md:p-5">
            <h3 className="text-[15px] md:text-base font-semibold uppercase tracking-wide text-foreground/80 m-0">
              {t("sessions.gear.title")}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">{t("sessions.gear.first")}</p>
            
          </div>
          <div className="mt-6 flex justify-center">
            <a href={`tel:${t("about.phone")}`}>
              <Button className="px-6 py-3 text-base hover:scale-105 transition-all duration-200">
                {t("cta.startNow")}
              </Button>
            </a>
          </div>
        </Container>
      </section>
      
      {/* Reasons to start Muay Thai (accordion) */}
      <section id="way-of-life" className="py-12 scroll-mt-24">
        <Container>
          <div className="mt-4"></div>
          <h2 className="font-display font-extrabold text-4xl md:text-4xl uppercase">
            {t("reasons.title")}
          </h2>
          <p className="text-muted-foreground mt-1">{t("reasons.subtitle")}</p>
          <div className="mt-10"></div>
          {(() => {
            const items = t("reasons.items", { returnObjects: true }) as Array<{ title: string; body: string }>;
            const [showAll, setShowAll] = React.useState(false);
            const visible = showAll ? items : items.slice(0, 3);
            return (
              <>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {visible.map((it, idx) => (
                    <div
                      key={idx}
                      className="rounded-md bg-white dark:bg-black px-0 py-3"
                    >
                      <div className="text-base md:text-lg font-semibold text-left">{it.title}</div>
                      <div className="mt-2 text-[15px] md:text-base leading-relaxed text-muted-foreground text-left">
                        {it.body}
                      </div>
                    </div>
                  ))}
                </div>
                {items.length > 3 && (
                  <div className="mt-3 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAll((v) => !v)}
                      className="inline-flex items-center gap-2 bg-transparent border border-transparent shadow-none"
                    >
                      <span>{showAll ? t("reasons.less") : t("reasons.more")}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Button>
                  </div>
                )}
              </>
            );
          })()}
        </Container>
      </section>
      
      <section id="testimonials" className="py-12 md:py-16 scroll-mt-24">
        <Container>
          <h2 className="font-display font-extrabold text-4xl md:text-4xl uppercase">
            {t("testimonials.title")}
          </h2>
          <p className="text-muted-foreground mt-1">{t("testimonials.subtitle")}</p>
          <div className="mt-10"></div>
          {(() => {
            const testimonials = t("testimonials.items", { returnObjects: true }) as Array<{
              quote: string;
              author: string;
              photo?: string;
              rating?: number;
              tags?: string[];
            }>;
            const Star = ({ filled }: { filled: boolean }) => (
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill={filled ? "currentColor" : "none"}
                className={filled ? "text-primary" : "text-black/30"}
                stroke="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  strokeWidth="1"
                />
              </svg>
            );
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 auto-rows-fr">
                {testimonials.slice(0, 6).map((item, idx) => {
                  const rating = Math.max(0, Math.min(5, item.rating ?? 5));
                  const tags = Array.isArray(item.tags) ? item.tags : [];
                  return (
                    <Card key={idx} className="p-4 h-full">
                      <div className="flex items-center gap-3">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-10 h-10"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="12" fill="currentColor" className="text-black/10 dark:text-white/15" />
                          <path
                            d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
                            fill="white"
                            className="dark:fill-black"
                          />
                        </svg>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">{item.author}</div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <Star key={i} filled={i < rating} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm md:text-base text-foreground leading-relaxed mt-3">“{item.quote}”</p>
                      {tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {tags.map((tag, tIdx) => (
                            <Badge key={tIdx}>{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            );
          })()}
        </Container>
      </section>

      <section id="private-coaching" className="py-10 scroll-mt-24">
        <Container>
          <h2 className="font-display font-extrabold text-4xl md:text-4xl uppercase">
            {t("private.title")}
          </h2>
          <p className="text-muted-foreground mt-1">{t("private.subtitle")}</p>
          <div className="mt-10"></div>
          {(() => {
            const trainers = (trainersData as Array<{
              id: string;
              name: string;
              tags: string[];
              phone: string;
              whatsapp: string;
              instagramUrl?: string;
              instagramHandle?: string;
              image?: string;
            }>).map((tr) => ({
              ...tr,
              bio: t(`trainers.bios.${tr.id}`),
            }));
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 auto-rows-fr">
                {trainers.map((tr, idx) => (
                  <TrainerCard key={idx} trainer={tr} />
                ))}
              </div>
            );
          })()}
        </Container>
      </section>

      <section id="about" className="py-16 scroll-mt-24">
        <Container>
          <h2 className="font-display font-extrabold text-4xl md:text-4xl uppercase">
            {t("about.title")}
          </h2>
          <p className="text-muted-foreground mt-1">{t("about.subtitle")}</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            {(() => {
              const query = t("about.mapQuery");
              const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
              return (
                <div className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-sm">
                  <iframe
                    src={src}
                    className="w-full h-[360px] md:h-[460px] dark:invert dark:hue-rotate-180"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-label={query}
                  />
                </div>
              );
            })()}
            <div className="p-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("about.companyLabel")}</div>
              <div className="text-lg font-semibold">{t("about.companyName")}</div>

              <div className="mt-5 text-xs uppercase tracking-wide text-muted-foreground">{t("about.addressLabel")}</div>
              <div className="text-base">{t("about.address")}</div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("about.phoneLabel")}</div>
                  <a href={`tel:${t("about.phone")}`} className="text-base underline underline-offset-4">
                    {t("about.phone")}
                  </a>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("about.emailLabel")}</div>
                  <a href={`mailto:${t("about.email")}`} className="text-base underline underline-offset-4">
                    {t("about.email")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="gallery" className="py-16 scroll-mt-24 relative">
        <Container>
        <h2 className="font-display font-extrabold text-4xl md:text-4xl uppercase">
            {t("gallery.title")}
          </h2>
          <p className="text-muted-foreground mt-1">
            <Trans
              i18nKey="gallery.subtitle"
              components={{
                a: (
                  <a
                    href="https://instagram.com/spartansclubbratislava"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                  />
                ),
              }}
            />
          </p>
          <div className="mt-10"></div>

        {(() => {
          const images = Array.from({ length: 8 }, (_, i) => `/gallery/${i + 1}.jpg`);
          const [showAllGallery, setShowAllGallery] = React.useState(false);
          const visibleImages = showAllGallery ? images : images.slice(1, 5);
          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white dark:bg-white mt-4 auto-rows-fr">
                {visibleImages.map((src, idx) => (
                  <div key={src} className="w-full overflow-hidden relative">
                    <img
                      src={src.replace(/(\.\w+)$/, "-768w$1")}
                      srcSet={`${src.replace(/(\.\w+)$/, "-480w$1")} 480w, ${src.replace(/(\.\w+)$/, "-768w$1")} 768w, ${src.replace(/(\.\w+)$/, "-1024w$1")} 1024w, ${src.replace(/(\.\w+)$/, "-1536w$1")} 1536w`}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      alt={`Gallery image ${showAllGallery ? idx + 1 : idx + 1}`}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllGallery((v) => !v)}
                  className="inline-flex items-center gap-2 bg-transparent border border-transparent shadow-none"
                >
                  <span>{showAllGallery ? t("reasons.less") : t("reasons.more")}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showAllGallery ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Button>
              </div>
            </>
          );
        })()}
        </Container>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="py-12 scroll-mt-24">
        <Container>
          <h2 className="font-display font-extrabold text-4xl md:text-4xl uppercase">
            {t("sponsors.title")}
          </h2>
          <p className="text-muted-foreground mt-1">{t("sponsors.subtitle")}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-stretch">
            {(sponsorsData as Array<{ image: string; href?: string }>).map((s, i) => (
              <div key={i} className="h-24 sm:h-28 md:h-32">
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noreferrer" className="block w-full h-full" aria-label="Sponsor link">
                    <span
                      role="img"
                      aria-label="Sponsor logo"
                      className="block w-full h-full bg-white dark:bg-black bg-no-repeat bg-center bg-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundImage: `url('${s.image}')` }}
                    />
                  </a>
                ) : (
                  <span
                    role="img"
                    aria-label="Sponsor logo"
                    className="block w-full h-full bg-white dark:bg-black bg-no-repeat bg-center bg-contain opacity-70"
                    style={{ backgroundImage: `url('${s.image}')` }}
                  />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
