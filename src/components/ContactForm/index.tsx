"use client";

import { toast, Toaster } from 'sonner'
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactFormSchema, ContactFormSchema } from "./schema";
import { Button } from "../Button";
import { GradientHeader } from "../GradientHeader";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { Input } from "../forms/Input";
import { Textarea } from "../forms/Textarea";

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
    <>
      <Toaster position='top-right' richColors />
      <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-0">
        <div className="max-w-[500px] h-full m-auto bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white p-8 flex flex-col justify-center items-center font-bold">
          <h2 className="text-3xl text-center mb-4">
            Let&apos;s Build the Web Together!
          </h2>
          <p className="text-lg mb-4">
            Reach out today and lets turn your vision into reality!
          </p>
          <ul className="w-full list-disc list-inside text-lg grid gap-4">
            <li>Need a nice web page?</li>
            <li>Need translation?</li>
            <li>Need a friend?</li>
          </ul>
            <span className="w-full text-center mt-4 text-xl">I got you covered!</span>
        </div>

        <div className="grid p-8 bg-[#222] w-full max-w-md m-auto lg:ml-auto">
          <GradientHeader text={isLoading ? 'Sending your message...' : 'Send a message'} />

          <form
            onSubmit={handleSubmit(handleContactSubmit)}
            className="grid gap-4"
          >
            <Input label="Name" type="text" required {...register("name")} />
            <Input label="Email" type="email" required {...register("email")} />
            <Input label="Phone" type="text" {...register("phone")} />
            <Textarea
              label="Message"
              required
              className="min-h-[100px] max-h-[200px]"
              {...register("message")}
            />

            <Button type="submit">
              SEND
              <PaperPlaneRight size={22} />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
