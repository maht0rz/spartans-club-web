"use client";
import React from "react";
import HomePage from "../../page";

export default function LocalizedGalleryPage() {
  React.useEffect(() => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return <HomePage />;
}


