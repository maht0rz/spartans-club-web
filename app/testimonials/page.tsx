"use client";
import React from "react";
import HomePage from "../page";

export default function TestimonialsPage() {
  React.useEffect(() => {
    const el = document.getElementById("testimonials");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return <HomePage />;
}


