import { ContactFormSchema } from "@/schemas/contact-form";

export async function postContactForm(data: ContactFormSchema) {
    try {
        console.log('data', data)

        await fetch('/api/v1/mail', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    } catch { }
}