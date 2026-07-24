"use client";

import { useState } from "react";

export const dynamic = "force-static";

export default function ContactPage() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-light mb-2">Contact</h1>
      <p className="text-black/60 dark:text-white/60 mb-10">
        Interested in a print, a booking, or just want to say hi? Send a message
        below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-black/60 dark:text-white/60 mb-1">
            Name
          </label>
          <input
            name="name"
            required
            className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded px-4 py-2 focus:outline-none focus:border-black/60 dark:focus:border-white/60"
          />
        </div>
        <div>
          <label className="block text-sm text-black/60 dark:text-white/60 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded px-4 py-2 focus:outline-none focus:border-black/60 dark:focus:border-white/60"
          />
        </div>
        <div>
          <label className="block text-sm text-black/60 dark:text-white/60 mb-1">
            Message
          </label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded px-4 py-2 focus:outline-none focus:border-black/60 dark:focus:border-white/60"
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="border border-black/30 dark:border-white/30 px-6 py-2 text-sm uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50"
        >
          {status === "sending"
            ? "Sending..."
            : status === "sent"
              ? "Sent!"
              : "Send message"}
        </button>
        {status === "sent" && (
          <p className="text-sm text-green-400">
            Thanks — I'll get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}
