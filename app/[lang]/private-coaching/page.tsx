"use client";
import React from "react";
import HomePage from "../../page";

export default function LocalizedPrivateCoachingPage() {
  React.useEffect(() => {
    const el = document.getElementById("private-coaching");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return <HomePage />;
}


