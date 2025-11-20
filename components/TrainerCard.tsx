/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/card";
import { gaEvent } from "../lib/ga";
 

export type Trainer = {
  name: string;
  tags: string[];
  bio: string;
  phone: string;
  whatsapp: string;
  instagramUrl?: string;
  instagramHandle?: string;
  image?: string;
};

export default function TrainerCard({ trainer }: { trainer: Trainer }) {
  const { t } = useTranslation();
  const getInstagramHandle = (url?: string, handleFromData?: string) => {
    if (handleFromData) {
      return handleFromData.startsWith("@") ? handleFromData : `@${handleFromData}`;
    }
    if (!url) return "";
    try {
      const u = new URL(url);
      const handle = u.pathname.replace(/\//g, "");
      return handle ? `@${handle}` : t("contact.instagram");
    } catch {
      const last = (url || "").split("/").filter(Boolean).pop() || "";
      return last ? `@${last.replace(/^@/, "")}` : t("contact.instagram");
    }
  };
  return (
    <Card className="p-4 h-full group flex flex-col min-h-[480px] md:min-h-[530px]">
      <div className="-mx-4 -mt-4 mb-3 h-[400px] md:h-[360px] min-h-[400px] md:min-h-[360px] overflow-hidden bg-primary relative">
        <img
          src={(trainer.image || "/vincent.png").replace(/(\.\w+)$/, "-634w$1")}
          srcSet={`${(trainer.image || "/vincent.png").replace(/(\.\w+)$/, "-634w$1")} 634w, ${(trainer.image || "/vincent.png").replace(/(\.\w+)$/, "-1268w$1")} 1268w`}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          alt="Trainer portrait"
          className="object-cover object-center w-full h-full"
          width={634}
          height={979}
          decoding="async"
          loading="lazy"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-extrabold text-xl md:text-2xl tracking-wide m-0">{trainer.name}</h3>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {(trainer.tags || []).map((tag, idx) => (
            <span key={idx} className="inline-block text-xs border border-black/15 rounded-full px-2.5 py-1 bg-black/5 text-muted-foreground dark:border-white/15 dark:bg-white/10 dark:text-foreground">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{trainer.bio}</p>
      </div>
      <div className="mt-auto pt-3 flex items-center justify-between gap-3 text-sm">
        <a
          className="border-b border-dashed border-black/30"
          href={`tel:${trainer.phone}`}
          onClick={() =>
            gaEvent("cta_click", {
              cta_name: "call_trainer",
              location: "trainer_card",
              trainer_name: trainer.name,
              link_url: `tel:${trainer.phone}`,
            })
          }
        >
          {trainer.phone}
        </a>
        <a
          className="border-b border-dashed border-black/30 ml-auto"
          href={trainer.instagramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            gaEvent("social_click", {
              platform: "instagram",
              location: "trainer_card",
              trainer_name: trainer.name,
              link_url: trainer.instagramUrl || "",
            })
          }
        >
          {getInstagramHandle(trainer.instagramUrl, trainer.instagramHandle)}
        </a>
      </div>
    </Card>
  );
}
