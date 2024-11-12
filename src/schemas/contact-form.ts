import { Phone } from '@phosphor-icons/react/dist/ssr'
import { z } from 'zod'

export const contactFormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional().transform(value => value?.replace(/\D/g, '')),
    message: z.string()
})

export type ContactFormSchema = z.infer<typeof contactFormSchema>
