import FadeIn from "@/components/animations/FadeIn";
import { Section } from "@/components/Section";
import { T, type LocalizedText } from "@/lib/i18n";

function Theme({ text }: { text: LocalizedText }) {
  return (
    <span className="mb-2 flex items-center gap-3 font-display text-lg font-bold text-[var(--accent)]">
      <T {...text} />
    </span>
  );
}

function Content({ text }: { text: LocalizedText }) {
  return (
    <span className="block pb-4 text-[var(--font-muted)]">
      <T {...text} />
    </span>
  );
}

export const metadata = {
  title: "Manifesto",
};

export default function Values() {
  return (
    <Section
      title={{ en: "ZDev — Manifesto", pt: "ZDev — Manifesto" }}
      className="pt-16 md:pt-24"
    >
      <>
        <FadeIn>
          <>
            <Theme
              text={{
                en: "I choose depth over noise",
                pt: "Escolho profundidade em vez de ruído"
              }}
            />
            <Content
              text={{
                en: "While there is fast content and shallow attention, I value what's real. I'd rather feel one melody than skim ten songs. I'd rather understand one truth than pretend to know a thousand.",
                pt: "Enquanto existem conteúdos rápidos e atenção superficial, eu valorizo o que é real. Prefiro sentir uma melodia do que passar por dez músicas. Prefiro entender uma verdade do que fingir saber mil."
              }}
            />
          </>
        </FadeIn>

        <FadeIn>
          <>
            <Theme
              text={{
                en: "I respect the unknown.",
                pt: "Respeito o desconhecido."
              }}
            />
            <Content
              text={{
                en: "From deep space to singularities, I know the world is far bigger than my perception. That humbles me, and drives me to discover more.",
                pt: "Do espaço profundo às singularidades, sei que o mundo é muito maior do que a minha percepção. Isso me deixa humilde e me impulsiona a descobrir mais."
              }}
            />
          </>
        </FadeIn>

        <FadeIn>
          <>
            <Theme
              text={{
                en: "I value simplicity",
                pt: "Valorizo a simplicidade"
              }}
            />
            <Content
              text={{
                en: "Simplicity is clarity - whether in code, communication, or life. Spaghetti code breaks. Bureaucracy is a mess. I laugh at it, and try to fix what I can.",
                pt: "Simplicidade é clareza — seja no código, na comunicação ou na vida. Código espaguete quebra. Burocracia é uma bagunça. Eu rio disso e tento consertar o que posso."
              }}
            />
          </>
        </FadeIn>

        <FadeIn>
          <>
            <Theme
              text={{
                en: "I value authenticity above all.",
                pt: "Valorizo a autenticidade acima de tudo."
              }}
            />
            <Content
              text={{
                en: "No false signals. No masks. I show up as I am, whether I'm speaking my mind, playing guitar, writing code, or living the life that makes sense to me.",
                pt: "Sem sinais falsos. Sem máscaras. Eu apareço como sou, seja falando o que penso, tocando guitarra, escrevendo código ou vivendo a vida que faz sentido para mim."
              }}
            />
          </>
        </FadeIn>

        <FadeIn>
          <>
            <Theme
              text={{
                en: "I choose people first.",
                pt: "Escolho as pessoas primeiro."
              }}
            />
            <Content
              text={{
                en: "No system, method, company or goal is more important than humanity. I code with empathy, I listen before I speak, and I believe every life matters.",
                pt: "Nenhum sistema, método, empresa ou objetivo é mais importante que a humanidade. Codifico com empatia, escuto antes de falar e acredito que toda vida importa."
              }}
            />
          </>
        </FadeIn>

        <FadeIn>
          <>
            <Theme
              text={{
                en: "I embrace imperfection.",
                pt: "Abraço a imperfeição."
              }}
            />
            <Content
              text={{
                en: "Flaws aren't failures. I don't chase perfection; I chase progress. I allow myself to evolve. I make mistakes, and try to learn from them.",
                pt: "Falhas não são fracassos. Não busco a perfeição; busco o progresso. Me permito evoluir. Cometo erros e tento aprender com eles."
              }}
            />
          </>
        </FadeIn>

        <FadeIn>
          <>
            <Theme
              text={{
                en: "I respect the human pace.",
                pt: "Respeito o ritmo humano."
              }}
            />
            <Content
              text={{
                en: "Speed isn't necessarily progress. I believe in sustainable effort, mindful breaks, and know when to push or rest. We are not machines, and that's a feature, not a bug.",
                pt: "Velocidade não é necessariamente progresso. Acredito em esforço sustentável, pausas conscientes e sei quando avançar ou descansar. Não somos máquinas, e isso é uma funcionalidade, não um bug."
              }}
            />
          </>
        </FadeIn>

        <FadeIn>
          <>
            <Theme
              text={{
                en: "I am a work in progress.",
                pt: "Sou uma obra em progresso."
              }}
            />
            <Content
              text={{
                en: "This is not a finished product. I iterate. I improve. I debug my beliefs just as I debug my code. Progress isn't perfect, but it's non-negotiable.",
                pt: "Este não é um produto finalizado. Eu itero. Eu melhoro. Depuro minhas crenças assim como depuro meu código. O progresso não é perfeito, mas é inegociável."
              }}
            />
          </>
        </FadeIn>
      </>
    </Section>
  );
}
