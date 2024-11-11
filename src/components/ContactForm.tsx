"use client";

import { Container } from "@/layouts/Container";
import { ContactFormSchema, contactFormSchema } from "@/schemas/contact-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function ContactForm() {
  const { register, handleSubmit, reset } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  function handleContactSubmit(data: ContactFormSchema) {
    console.log(data);

    reset();
  }

  return (
    <>
      <style jsx>{`
        .contact-form {
          dispolay: grid;
          padding: 2rem;
          background-color: var(--layer-200);
          width: 100%;
          max-width: 500px;
          margin-left: auto;
          transform: translateY(3rem);
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        button {
          padding: 1rem 2rem;
          background: var(--gradient-bg);
          cursor: pointer;
          font-weight: bold;
          width: fit-content;
        }
      `}</style>

      <Container>
        <div className="contact-form">
          <h1 className="gradient-text">Send me a message</h1>

          <form onSubmit={handleSubmit(handleContactSubmit)}>
            <label htmlFor="name">Name</label>
            <input type="text" {...register("name")} required />

            <label htmlFor="email">Email</label>
            <input type="email" {...register("email")} required />

            <label htmlFor="phone">Phone</label>
            <input type="text" {...register("phone")} />

            <label htmlFor="message">Message</label>
            <textarea {...register("message")} required></textarea>

            <button type="submit">SEND</button>
          </form>
        </div>
      </Container>
    </>
  );
}
