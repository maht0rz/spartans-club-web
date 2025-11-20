"use client";
import React from "react";
import HomePage from "../../page";

export default function RozvrhPage() {
  React.useEffect(() => {
    const el = document.getElementById("sessions");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return <HomePage />;
}


