/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/Container";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import TrainerCard from "../components/TrainerCard";
import { cn } from "../lib/utils";

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
  const { t: ts } = useTranslation("shared");
  const langKey =
    i18n.language && i18n.language.toLowerCase().startsWith("sk") ? "sk" : "en";
  return (
    <main>
      <section id="top" className="py-16 scroll-mt-24">
        <Container className="grid grid-cols-1 md:grid-cols-[1.4fr_.6fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 text-muted-foreground text-xs px-3 py-2">
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
              <a href="#private-coaching">
                <Button variant="ghost" className="inline-flex items-center gap-2 hover:bg-transparent">
                  {t("hero.cta.trainers")}
                </Button>
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src="/logo.svg" />
          </div>
        </Container>
      </section>

      
      <section className="py-10">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
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
              <h3 className="font-display font-extrabold font-goodland text-primary text-xl md:text-4xl tracking-wide m-0">
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
                    {ts("pricing.vip.month12")}
                  </span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("pricing.session")}
                  </span>
                  <span className="text-sm font-semibold text-foreground ml-auto text-right whitespace-nowrap">
                    {ts("pricing.vip.session")}
                  </span>
                </div>
              </div>
            </Card>
            <Card className="p-4 flex flex-col h-full group">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold font-goodland text-primary text-xl md:text-4xl tracking-wide m-0">
                  {t("session.kids")}
                </h3>
                <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground text-[10px] leading-5 px-2 py-0.5 shadow">
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
                    {ts("pricing.kids.month12")}
                  </span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("pricing.session")}
                  </span>
                  <span className="text-sm font-semibold text-foreground ml-auto text-right whitespace-nowrap">
                    {ts("pricing.kids.session")}
                  </span>
                </div>
              </div>
            </Card>
            <Card className="p-4 flex flex-col h-full group">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold font-goodland text-primary text-xl md:text-4xl tracking-wide m-0">
                  {t("session.club")}
                </h3>
                <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground text-[10px] leading-5 px-2 py-0.5 shadow">
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
                    {ts("pricing.club.month12")}
                  </span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("pricing.session")}
                  </span>
                  <span className="text-sm font-semibold text-foreground ml-auto text-right whitespace-nowrap">
                    {ts("pricing.club.session")}
                  </span>
                </div>
              </div>
            </Card>
            <Card className="p-4 flex flex-col h-full group">
              <h3 className="font-display font-bold font-goodland text-primary text-xl md:text-4xl tracking-wide m-0">
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
                    {ts("pricing.private.session")}
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
            <a href="#private-coaching">
              <Button className="px-6 py-3 text-base  hover:scale-105 transition-all duration-200">
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
                        <img
                          src={item.photo || "/vincent.png"}
                          alt={`${item.author} profile`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
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
            const trainers = t("trainers.items", {
              returnObjects: true,
            }) as Array<{
              name: string;
              tags: string;
              bio: string;
              phone: string;
              whatsapp: string;
              instagram: string;
            }>;
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 auto-rows-fr">
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
          <p className="text-muted-foreground mt-1">{t("gallery.subtitle")}</p>
          <div className="mt-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 auto-rows-fr">
        <blockquote
          className="instagram-media"
          data-instgrm-captioned=""
          data-instgrm-permalink="https://www.instagram.com/reel/DD7EQhoNMyJ/?utm_source=ig_embed&utm_campaign=loading"
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: 0,
            borderRadius: "3px",
            boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
            margin: "1px",
            maxWidth: 540,
            minWidth: 326,
            padding: 0,
            width: "calc(100% - 2px)",
          }}
        >
          <div style={{ padding: 16 }}>
            <a
              href="https://www.instagram.com/reel/DD7EQhoNMyJ/?utm_source=ig_embed&utm_campaign=loading"
              style={{
                background: "#FFFFFF",
                lineHeight: 0,
                padding: 0,
                textAlign: "center",
                textDecoration: "none",
                width: "100%",
              }}
              target="_blank"
              rel="noreferrer"
            >
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div
                  style={{
                    backgroundColor: "#F4F4F4",
                    borderRadius: "50%",
                    flexGrow: 0,
                    height: 40,
                    marginRight: 14,
                    width: 40,
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderRadius: 4,
                      flexGrow: 0,
                      height: 14,
                      marginBottom: 6,
                      width: 100,
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderRadius: 4,
                      flexGrow: 0,
                      height: 14,
                      width: 60,
                    }}
                  />
                </div>
              </div>
              <div style={{ padding: "19% 0" }} />
              <div style={{ display: "block", height: 50, margin: "0 auto 12px", width: 50 }}>
                <svg
                  width="50px"
                  height="50px"
                  viewBox="0 0 60 60"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                      <g>
                        <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div style={{ paddingTop: 8 }}>
                <div
                  style={{
                    color: "#3897f0",
                    fontFamily: "Arial,sans-serif",
                    fontSize: 14,
                    fontStyle: "normal",
                    fontWeight: 550,
                    lineHeight: "18px",
                  }}
                >
                  View this post on Instagram
                </div>
              </div>
              <div style={{ padding: "12.5% 0" }} />
              <div style={{ display: "flex", flexDirection: "row", marginBottom: 14, alignItems: "center" }}>
                <div>
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderRadius: "50%",
                      height: 12.5,
                      width: 12.5,
                      transform: "translateX(0px) translateY(7px)",
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      height: 12.5,
                      transform: "rotate(-45deg) translateX(3px) translateY(1px)",
                      width: 12.5,
                      flexGrow: 0,
                      marginRight: 14,
                      marginLeft: 2,
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderRadius: "50%",
                      height: 12.5,
                      width: 12.5,
                      transform: "translateX(9px) translateY(-18px)",
                    }}
                  />
                </div>
                <div style={{ marginLeft: 8 }}>
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderRadius: "50%",
                      flexGrow: 0,
                      height: 20,
                      width: 20,
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "2px solid transparent",
                      borderLeft: "6px solid #f4f4f4",
                      borderBottom: "2px solid transparent",
                      transform: "translateX(16px) translateY(-4px) rotate(30deg)",
                    }}
                  />
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <div
                    style={{
                      width: 0,
                      borderTop: "8px solid #F4F4F4",
                      borderRight: "8px solid transparent",
                      transform: "translateY(16px)",
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: "#F4F4F4",
                      flexGrow: 0,
                      height: 12,
                      width: 16,
                      transform: "translateY(-4px)",
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "8px solid #F4F4F4",
                      borderLeft: "8px solid transparent",
                      transform: "translateY(-4px) translateX(8px)",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", marginBottom: 24 }}>
                <div
                  style={{
                    backgroundColor: "#F4F4F4",
                    borderRadius: 4,
                    flexGrow: 0,
                    height: 14,
                    marginBottom: 6,
                    width: 224,
                  }}
                />
                <div
                  style={{
                    backgroundColor: "#F4F4F4",
                    borderRadius: 4,
                    flexGrow: 0,
                    height: 14,
                    width: 144,
                  }}
                />
              </div>
            </a>
            {/* <p
              style={{
                color: "#c9c8cd",
                fontFamily: "Arial,sans-serif",
                fontSize: 14,
                lineHeight: "17px",
                marginBottom: 0,
                marginTop: 8,
                overflow: "hidden",
                padding: "8px 0 7px",
                textAlign: "center",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <a
                href="https://www.instagram.com/reel/DD7EQhoNMyJ/?utm_source=ig_embed&utm_campaign=loading"
                style={{
                  color: "#c9c8cd",
                  fontFamily: "Arial,sans-serif",
                  fontSize: 14,
                  fontStyle: "normal",
                  fontWeight: "normal",
                  lineHeight: "17px",
                  textDecoration: "none",
                }}
                target="_blank"
                rel="noreferrer"
              >
                A post shared by SPARTANS Club Bratislava (@spartansclubbratislava)
              </a>
            </p> */}
          </div>
        </blockquote>
        </div>
        </Container>
        <script async src="https://www.instagram.com/embed.js"></script>
      </section>
    </main>
  );
}
