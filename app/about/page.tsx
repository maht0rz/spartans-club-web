"use client";
import React from "react";
import HomePage from "../page";

export default function AboutPage() {
  React.useEffect(() => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return <HomePage />;
}


