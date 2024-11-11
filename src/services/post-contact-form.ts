import { ContactFormSchema } from "@/schemas/contact-form";

export async function postContactForm(data: ContactFormSchema) {

    try {
        console.log('form data', data)
    } catch { }
}