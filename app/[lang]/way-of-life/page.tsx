"use client";
import React from "react";
import HomePage from "../../page";

export default function LocalizedWayOfLifePage() {
  React.useEffect(() => {
    const el = document.getElementById("way-of-life");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return <HomePage />;
}


