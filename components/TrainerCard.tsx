"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/card";

export type Trainer = {
  name: string;
  tags: string;
  bio: string;
  phone: string;
  whatsapp: string;
  instagram: string;
};

export default function TrainerCard({ trainer }: { trainer: Trainer }) {
  const { t } = useTranslation();
  const getInstagramHandle = (url: string) => {
    try {
      const u = new URL(url);
      const handle = u.pathname.replace(/\//g, "");
      return handle ? `@${handle}` : t("contact.instagram");
    } catch {
      const last = url.split("/").filter(Boolean).pop() || "";
      return last ? `@${last.replace(/^@/, "")}` : t("contact.instagram");
    }
  };
  return (
    <Card className="p-4 h-full group flex flex-col">
      <div className="-mx-4 -mt-4 mb-3 h-[220px] md:h-[260px] flex items-center justify-center overflow-hidden">
        <img src="/vincent.png" alt="Trainer portrait" className="w-full h-full object-cover object-center" />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-extrabold text-xl md:text-2xl tracking-wide m-0">{trainer.name}</h3>
      <div className="mt-1">
        <span className="inline-block text-xs border border-black/15 rounded-full px-2.5 py-1 bg-black/5 text-muted-foreground dark:border-white/15 dark:bg-white/10 dark:text-foreground">
            {trainer.tags}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{trainer.bio}</p>
        <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
          {t("trainers.availability")}
        </div>
      </div>
      <div className="mt-auto pt-3 flex items-center justify-between gap-3 text-sm">
        <a className="border-b border-dashed border-black/30" href={`tel:${trainer.phone}`}>{trainer.phone}</a>
        <a className="border-b border-dashed border-black/30 ml-auto" href={trainer.instagram} target="_blank" rel="noreferrer">
          {getInstagramHandle(trainer.instagram)}
        </a>
      </div>
    </Card>
  );
}

