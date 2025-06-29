import FadeIn from "@/components/animations/FadeIn";
import { Section } from "@/components/Section";

function Theme(p: {text: string}) {
  return <span className="font-bold text-lg text-orange-500">{p.text}</span>
}

function Content(p: {text: string}) {
  return <span className="block pb-4">{p.text}</span>
}

export const metadata = {
  title: 'Diogo Lara - Manifesto'
}

export default function Values() {
  return <Section title="ZDev - Manifesto">
    <>
      <FadeIn>
        <>
          <Theme text="I choose depth over noise" />
          <Content text="While there is fast content and shallow attention, I value what's real. I'd rather feel one melody than skim ten songs. I'd rather understand one truth than pretend to know a thousand." />
        </>
      </FadeIn>

      <FadeIn>
        <>
          <Theme text="I respect the unknown." />
          <Content text="From deep space to singularities, I know the world is far bigger than my perception. That humbles me, and drives me to discover more." />
        </>
      </FadeIn>

      <FadeIn>
        <>
          <Theme text="I value simplicity" />
          <Content text="Simplicity is clarity - whether in code, communication, or life. Spaghetti code breaks. Bureaucracy is a mess. I laugh at it, and try to fix what I can." />
        </>
      </FadeIn>

      <FadeIn>
        <>
          <Theme text="I value authenticity above all." />
          <Content text="No false signals. No masks. I show up as I am, whether I'm speaking my mind, playing guitar, writing code, or living the life that makes sense to me." />
        </>
      </FadeIn>

      <FadeIn>
        <>
          <Theme text="I choose people first." />
          <Content text="No system, method, company or goal is more important than humanity. I code with empathy, I listen before I speak, and I beliefe every life matter." />
        </>
      </FadeIn>

      <FadeIn>
        <>
          <Theme text="I embrace imperfection." />
          <Content text="Flaws aren't failures. I don't chase perfection; I chase progress. I allow myself to evolve. I make mistakes, and try to learn from them." />
        </>
      </FadeIn>

      <FadeIn>
        <>
          <Theme text="I respect the human pace." />
          <Content text="Speed isn't necessarily progress. I believe in sustainable effort, mindful breaks, and know when to push or rest. We are not machines, and that's a feature, not a bug." />
        </>
      </FadeIn>

      <FadeIn>
        <>
          <Theme text="I am a work in progress." />
          <Content text="This is not a finished product. I iterate. I improve. I debug my beliefs just as I debug my code. Progress isn't perfect, but it's non-negotiable." />
        </>
      </FadeIn>
    </>
  </Section>
}
