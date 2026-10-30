"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { Button } from "../Button";
import { GradientHeader } from "../GradientHeader";
import { Input } from "../forms/Input";
import { Textarea } from "../forms/Textarea";
import { contactFormSchema, ContactFormSchema } from "./schema";

const perks = [
  "A modern, responsive web page",
  "International-ready products",
  "A developer who cares about the details",
];

export function ContactForm() {
  const { register, handleSubmit, reset } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  const [isLoading, setLoading] = useState(false);

  async function handleContactSubmit(data: ContactFormSchema) {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        }),
      });

      if (res.ok) {
        reset();
        toast.success("your message was sent");
      }
    } catch {
      toast.error("Your message could not be sent :(");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-28">
      <Toaster position="top-right" richColors />

      <div className="mb-10 flex items-center gap-5">
        <GradientHeader text="Get in touch" />
        <span className="hairline min-w-8 flex-1" aria-hidden />
      </div>

      <div className="surface grid overflow-hidden rounded-3xl lg:grid-cols-[1.05fr_1fr]">
        <div className="gradient-surface relative overflow-hidden p-8 text-white md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-black/20 blur-2xl"
          />

          <div className="relative flex h-full flex-col justify-center">
            <span className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Let&apos;s collaborate
            </span>
            <h3 className="max-w-[18ch] font-display text-3xl font-bold leading-tight md:text-4xl">
              Let&apos;s build the web together.
            </h3>
            <p className="mt-5 max-w-[40ch] text-white/90">
              Reach out today and let&apos;s turn your vision into reality.
            </p>

            <ul className="mt-8 grid gap-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm">
                  <CheckCircleIcon size={20} weight="fill" className="shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>

            <span className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              I got you covered!
            </span>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <GradientHeader
            text={isLoading ? "Sending your message..." : "Send a message"}
            className="text-xl md:text-2xl"
          />

          <form
            onSubmit={handleSubmit(handleContactSubmit)}
            className="mt-6 grid gap-5"
          >
            <Input label="Name" type="text" required {...register("name")} />
            <Input
              label="Email"
              type="email"
              required
              {...register("email")}
            />
            <Input label="Phone" type="text" {...register("phone")} />
            <Textarea
              label="Message"
              required
              className="min-h-[110px] max-h-[220px]"
              {...register("message")}
            />

            <Button type="submit" disabled={isLoading} className="w-full justify-center">
              {isLoading ? "SENDING..." : "SEND"}
              <PaperPlaneRightIcon size={20} />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
