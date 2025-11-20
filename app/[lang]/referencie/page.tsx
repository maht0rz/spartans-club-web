"use client";
import React from "react";
import HomePage from "../../page";

export default function ReferenciePage() {
  React.useEffect(() => {
    const el = document.getElementById("testimonials");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return <HomePage />;
}


