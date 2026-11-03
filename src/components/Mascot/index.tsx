"use client";

import { cn } from "@/lib/utils";
import { useLanguage, type LocalizedText } from "@/lib/i18n";
import { Grains, HandWaving, Heart, MoonStars, Sparkle } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type Mood = "idle" | "curious" | "happy" | "eating" | "drinking" | "sleeping";
type Reaction = "hello";
type RatPhase = "idle" | "toSnack" | "eating" | "toWater" | "drinking" | "home";

const DRINK_INTERVAL_MIN = 120_000;
const DRINK_INTERVAL_MAX = 180_000;
const SLEEP_WAIT = 50_000;

const SCRATCH_INTERVAL_MIN = 10_000;
const SCRATCH_INTERVAL_MAX = 40_000;
const SCRATCH_DURATION = 1_600;

const ACTIONS = [
  {
    id: "hello",
    label: { en: "Say hi", pt: "Diga oi" },
    hint: { en: "Squeak back", pt: "Guinche de volta" },
    icon: HandWaving
  },
  {
    id: "feed",
    label: { en: "Drop seed", pt: "Solte uma semente" },
    hint: { en: "She will walk for it", pt: "Ela vai até ela" },
    icon: Grains
  },
  {
    id: "nap",
    label: { en: "Let her nap", pt: "Deixe-a dormir" },
    hint: { en: "Do not disturb", pt: "Não perturbe" },
    icon: MoonStars
  }
] as const;

type ActionId = (typeof ACTIONS)[number]["id"];

const MESSAGES: Record<Reaction, LocalizedText[]> = {
  hello: [
    { en: "Squeak. Hello, human.", pt: "Guincho. Olá, humano." },
    { en: "You came to see me? Bold choice.", pt: "Veio me ver? Escolha ousada." },
    { en: "Hi. I was chewing on a cable.", pt: "Oi. Eu estava mastigando um cabo." },
    { en: "You finally noticed me.", pt: "Finalmente você me notou." },
    { en: "Hey, you brought snacks?", pt: "Ei, você trouxe petiscos?" },
    { en: "Mmm, let me smell your fingers.", pt: "Hmm, deixa eu cheirar seus dedos." },
    { en: "Wanna trade secrets?", pt: "Quer trocar segredos?" },
    { en: "I can taste your fear.", pt: "Consigo sentir o gosto do seu medo." },
    { en: "I know where you sleep.", pt: "Eu sei onde você dorme." },
    { en: "I'm hungry. Feed me.", pt: "Estou com fome. Me alimente." },
    { en: "Feed me. Feed me. Feed me.", pt: "Me alimente. Me alimente. Me alimente." },
    { en: "I'm not fat, I'm fluffy.", pt: "Não sou gorda, sou fofinha." },
    { en: "Oh, you...", pt: "Ah, você..." },
    { en: "I will bite. That is the game.", pt: "Eu vou morder. Esse é o jogo." },
    { en: "I'm going to steal your Wi-Fi.", pt: "Vou roubar seu Wi-Fi." }
  ]
};

const COPY = {
  title: { en: "Meet Tuneba", pt: "Conheça Tuneba" },
  initialSpeech: {
    en: "I'm Tuneba. Move your cursor — I'll follow. Click anywhere and I'll come running.",
    pt: "Eu sou a Tuneba. Mova o cursor — eu sigo. Clique em qualquer lugar e eu venho correndo."
  },
  wakeUp: {
    en: "Oh! I was dreaming about sunflower seeds.",
    pt: "Ah! Eu estava sonhando com sementes de girassol."
  },
  maxBond: {
    en: "Five hearts. Fine. You may scratch my one good ear.",
    pt: "Cinco corações. Tudo bem. Você pode coçar minha única orelha boa."
  },
  asleepMessage: {
    en: "Zzz… wake me when the food lands.",
    pt: "Zzz… me acorde quando a comida chegar."
  },
  status: {
    asleep: { en: "Asleep — drop a sunflower seed to wake her", pt: "Dormindo — solte uma semente para acordá-la" },
    toSnack: { en: "Walking to the seed", pt: "Indo até a semente" },
    eating: { en: "Eating the sunflower seed", pt: "Comendo a semente de girassol" },
    toWater: { en: "Heading to the water pipe", pt: "Indo até o bebedouro" },
    drinking: { en: "Drinking water", pt: "Bebendo água" },
    home: { en: "Waddling back home", pt: "Voltando para casa" },
    scratching: { en: "Scratching her head", pt: "Coçando a cabeça" },
    happy: { en: "Suspiciously pleased", pt: "Suspeitosamente satisfeita" },
    idle: { en: "Watching you (for snacks)", pt: "Observando você (em busca de petiscos)" }
  },
  hint: {
    en: "Click anywhere to drop a sunflower seed",
    pt: "Clique em qualquer lugar para soltar uma semente"
  },
  panel: {
    eyebrow: { en: "Interactive mascot", pt: "Mascote interativa" },
    heading: {
      en: "A small gray hamster with a big appetite.",
      pt: "Uma pequena hamster cinza com um apetite enorme."
    },
    body: {
      en: "Tuneba is cute. She is not polite. She is, however, always hungry. Click anywhere in the cage to drop a sunflower seed. She is always watching you, unless she is asleep, in which case she does absolutely nothing.",
      pt: "Tuneba é uma fofa, não é educada, mas está sempre com fome. Clique em qualquer lugar próximo para soltar uma semente de girassol. Ela está sempre te observando, a menos que esteja dormindo — nesse caso, ela não faz absolutamente nada."
    },
    footnote: {
      en: "Tuneba is mostly fur, bad decisions, and an unfillable stomach.",
      pt: "Tuneba é basicamente pelo, decisões ruins e um estômago sem fundo."
    }
  }
};

const SNACK_SIZE = 44;

type Snack = {
  id: number;
  x: number;
  spawnY: number;
  groundY: number;
};

type StageBounds = {
  width: number;
  groundY: number;
  ratWidth: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const foodWalkDuration = (distance: number, still: boolean) =>
  still ? 0 : clamp(distance / 260, 0.35, 1.6);

export function Mascot() {
  const reduceMotion = useReducedMotion();
  const { t } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const ratRef = useRef<HTMLDivElement>(null);
  const pipeRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<SVGGElement>(null);

  const [mood, setMood] = useState<Mood>("idle");
  const [bottleTop, setBottleTop] = useState<number | null>(null);
  const [blink, setBlink] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [bond, setBond] = useState(1);
  const [snack, setSnack] = useState<Snack | null>(null);
  const [ratPhase, setRatPhase] = useState<RatPhase>("idle");
  const [scratching, setScratching] = useState(false);
  const [walkX, setWalkX] = useState(0);
  const [speech, setSpeech] = useState<{
    text: LocalizedText;
    id: number;
  } | null>({
    text: COPY.initialSpeech,
    id: 0
  });
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scratchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scratchEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startWaterTripRef = useRef<() => void>(() => {});
  const startScratchRef = useRef<() => void>(() => {});
  const snackId = useRef(0);
  const walkedDistance = useRef(0);
  const speechId = useRef(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const pupilX = useSpring(useTransform(pointerX, [-1, 1], [-6, 6]), {
    stiffness: 180,
    damping: 20,
    mass: 0.4
  });
  const pupilY = useSpring(useTransform(pointerY, [-1, 1], [-5, 5]), {
    stiffness: 180,
    damping: 20,
    mass: 0.4
  });
  const eyeX = useTransform(pupilX, (value) => value * 0.3);
  const eyeY = useTransform(pupilY, (value) => value * 0.3);
  const say = useCallback((text: LocalizedText) => {
    speechId.current += 1;
    setSpeech({ text, id: speechId.current });
  }, []);

  const clearSpeech = useCallback(() => {
    speechId.current += 1;
    setSpeech(null);
  }, []);

  const stopScratching = useCallback(() => {
    if (scratchEndTimer.current) clearTimeout(scratchEndTimer.current);
    setScratching(false);
  }, []);

  const scheduleSleep = useCallback(() => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    sleepTimer.current = setTimeout(() => {
      setSleeping(true);
      setMood("sleeping");
    }, SLEEP_WAIT);
  }, []);

  useEffect(() => {
    scheduleSleep();
    return () => {
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
    };
  }, [scheduleSleep]);

  useEffect(() => {
    if (sleeping) {
      setBlink(false);
      pointerX.set(0);
      pointerY.set(0);
    }
  }, [sleeping, pointerX, pointerY]);

  useEffect(() => {
    const measureBottle = () => {
      const stage = stageRef.current;
      const mouth = mouthRef.current;
      if (!stage || !mouth) return;

      const stageRect = stage.getBoundingClientRect();
      const mouthRect = mouth.getBoundingClientRect();

      setBottleTop(mouthRect.top + mouthRect.height / 2 - stageRect.top - 140);
    };

    const frame = requestAnimationFrame(measureBottle);
    window.addEventListener("resize", measureBottle);
    const observer = new ResizeObserver(measureBottle);
    if (stageRef.current) observer.observe(stageRef.current);
    if (ratRef.current) observer.observe(ratRef.current);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measureBottle);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || sleeping) return;

    let timeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      timeout = setTimeout(
        () => {
          setBlink(true);
          timeout = setTimeout(() => {
            setBlink(false);
            scheduleBlink();
          }, 130);
        },
        2200 + Math.random() * 2600
      );
    };

    scheduleBlink();
    return () => clearTimeout(timeout);
  }, [reduceMotion, sleeping]);

  useEffect(() => {
    if (reduceMotion) return;

    const handleMove = (event: PointerEvent) => {
      if (sleeping) return;

      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      pointerX.set(clamp(x, -1, 1));
      pointerY.set(clamp(y, -1, 1));
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [pointerX, pointerY, reduceMotion, sleeping]);

  useEffect(
    () => () => {
      if (moodTimer.current) clearTimeout(moodTimer.current);
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
      if (scratchTimer.current) clearTimeout(scratchTimer.current);
      if (scratchEndTimer.current) clearTimeout(scratchEndTimer.current);
    },
    []
  );

  const maybeIncreaseBond = useCallback(() => {
    setBond((current) => (Math.random() < 0.3 ? Math.min(5, current + 1) : current));
  }, []);

  const react = (action: Reaction) => {
    const wasAsleep = sleeping;

    setSleeping(false);
    scheduleSleep();

    setMood("happy");

    if (wasAsleep) {
      say(COPY.wakeUp);
    } else if (bond === 4) {
      say(COPY.maxBond);
    } else {
      const options = MESSAGES[action];
      say(options[Math.floor(Math.random() * options.length)]);
    }

    maybeIncreaseBond();

    if (moodTimer.current) clearTimeout(moodTimer.current);
    moodTimer.current = setTimeout(() => setMood("idle"), 1800);
  };

  const measureStage = useCallback((): StageBounds | null => {
    const stage = stageRef.current;
    const rat = ratRef.current;
    if (!stage || !rat) return null;

    const stageRect = stage.getBoundingClientRect();
    const ratRect = rat.getBoundingClientRect();

    return {
      width: stageRect.width,
      groundY: Math.min(
        stageRect.height - SNACK_SIZE - 8,
        ratRect.top - stageRect.top + ratRect.height * 0.93
      ),
      ratWidth: ratRect.width
    };
  }, []);

  const beginSnackWalk = useCallback(
    (target: Snack) => {
      const bounds = measureStage();
      if (!bounds) return;

      const maxOffset = Math.max(0, bounds.width / 2 - bounds.ratWidth / 2 - 8);
      const targetX = clamp(target.x - bounds.width / 2, -maxOffset, maxOffset);

      stopScratching();
      walkedDistance.current = Math.abs(targetX);
      setWalkX(targetX);
      setRatPhase("toSnack");
    },
    [measureStage, stopScratching]
  );

  const scheduleNextDrink = useCallback((delay?: number) => {
    if (waterTimer.current) clearTimeout(waterTimer.current);

    waterTimer.current = setTimeout(
      () => startWaterTripRef.current(),
      delay ??
        DRINK_INTERVAL_MIN + Math.random() * (DRINK_INTERVAL_MAX - DRINK_INTERVAL_MIN)
    );
  }, []);

  const startWaterTrip = useCallback(() => {
    if (ratPhase !== "idle" || snack || scratching) {
      scheduleNextDrink(15_000);
      return;
    }

    const stage = stageRef.current;
    const pipe = pipeRef.current;
    const bounds = measureStage();
    if (!stage || !pipe || !bounds) {
      scheduleNextDrink(15_000);
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();
    const maxOffset = Math.max(0, bounds.width / 2 - bounds.ratWidth / 2 - 8);
    const spoutX = pipeRect.left - stageRect.left + pipeRect.width * 0.82;
    const targetX = clamp(spoutX - bounds.width / 2, -maxOffset, maxOffset);

    setSleeping(false);
    scheduleSleep();
    clearSpeech();
    if (moodTimer.current) clearTimeout(moodTimer.current);
    setMood("idle");

    walkedDistance.current = Math.abs(targetX);
    setWalkX(targetX);
    setRatPhase("toWater");
  }, [clearSpeech, measureStage, ratPhase, scheduleNextDrink, scheduleSleep, snack, scratching]);

  startWaterTripRef.current = startWaterTrip;

  useEffect(() => {
    scheduleNextDrink();

    return () => {
      if (waterTimer.current) clearTimeout(waterTimer.current);
    };
  }, [scheduleNextDrink]);

  const scheduleNextScratch = useCallback((delay?: number) => {
    if (scratchTimer.current) clearTimeout(scratchTimer.current);

    scratchTimer.current = setTimeout(
      () => startScratchRef.current(),
      delay ??
        SCRATCH_INTERVAL_MIN + Math.random() * (SCRATCH_INTERVAL_MAX - SCRATCH_INTERVAL_MIN)
    );
  }, []);

  const startScratch = useCallback(() => {
    if (sleeping || ratPhase !== "idle" || snack || scratching) {
      scheduleNextScratch();
      return;
    }

    setScratching(true);
    scratchEndTimer.current = setTimeout(() => {
      setScratching(false);
      scheduleNextScratch();
    }, SCRATCH_DURATION);
  }, [ratPhase, scheduleNextScratch, scratching, sleeping, snack]);

  startScratchRef.current = startScratch;

  useEffect(() => {
    scheduleNextScratch();

    return () => {
      if (scratchTimer.current) clearTimeout(scratchTimer.current);
      if (scratchEndTimer.current) clearTimeout(scratchEndTimer.current);
    };
  }, [scheduleNextScratch]);

  const dropSnackAt = (x: number, y: number) => {
    if (snack || ratPhase !== "idle") return;

    const bounds = measureStage();
    if (!bounds) return;

    setSleeping(false);
    scheduleSleep();
    clearSpeech();
    if (moodTimer.current) clearTimeout(moodTimer.current);
    setMood("idle");

    snackId.current += 1;
    setSnack({
      id: snackId.current,
      x: clamp(x, SNACK_SIZE / 2 + 6, bounds.width - SNACK_SIZE / 2 - 6),
      spawnY: clamp(y, 8, bounds.groundY - SNACK_SIZE),
      groundY: bounds.groundY
    });
  };

  const dropSnackRandomly = () => {
    const bounds = measureStage();
    if (!bounds) return;

    dropSnackAt(bounds.width * (0.2 + Math.random() * 0.6), bounds.groundY * 0.25);
  };

  const handleStagePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    dropSnackAt(event.clientX - rect.left, event.clientY - rect.top);
  };

  const handleSnackLanded = () => {
    if (!snack) return;
    beginSnackWalk(snack);
  };

  useEffect(() => {
    if (ratPhase === "toSnack") {
      const timer = setTimeout(
        () => {
          setRatPhase("eating");
          setMood("eating");
          maybeIncreaseBond();
          if (moodTimer.current) clearTimeout(moodTimer.current);
        },
        foodWalkDuration(walkedDistance.current, Boolean(reduceMotion)) * 1000 + 80
      );

      return () => clearTimeout(timer);
    }

    if (ratPhase === "eating") {
      const timer = setTimeout(() => {
        setSnack(null);
        setMood("idle");
        setRatPhase("home");
        setWalkX(0);
      }, 900);

      return () => clearTimeout(timer);
    }

    if (ratPhase === "toWater") {
      const timer = setTimeout(
        () => {
          setRatPhase("drinking");
          setMood("drinking");
          if (moodTimer.current) clearTimeout(moodTimer.current);
        },
        foodWalkDuration(walkedDistance.current, Boolean(reduceMotion)) * 1000 + 80
      );

      return () => clearTimeout(timer);
    }

    if (ratPhase === "drinking") {
      const timer = setTimeout(() => {
        setMood("idle");
        setRatPhase("home");
        setWalkX(0);
        scheduleNextDrink();
      }, 2600);

      return () => clearTimeout(timer);
    }

    if (ratPhase === "home") {
      const timer = setTimeout(
        () => {
          setRatPhase("idle");
          walkedDistance.current = 0;
        },
        foodWalkDuration(walkedDistance.current, Boolean(reduceMotion)) * 1000 + 80
      );

      return () => clearTimeout(timer);
    }
  }, [maybeIncreaseBond, ratPhase, reduceMotion, scheduleNextDrink]);

  const nap = () => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    if (moodTimer.current) clearTimeout(moodTimer.current);
    stopScratching();
    setSnack(null);
    setRatPhase("idle");
    setWalkX(0);
    walkedDistance.current = 0;
    setSleeping(true);
    setMood("sleeping");
    clearSpeech();
  };

  const handleAction = (action: ActionId) => {
    if (action === "feed") {
      dropSnackRandomly();
      return;
    }

    if (action === "nap") {
      nap();
      return;
    }

    react(action);
  };

  const eyesClosed = sleeping || blink || scratching;
  const still = Boolean(reduceMotion) || sleeping;
  const walking = ratPhase === "toSnack" || ratPhase === "toWater" || ratPhase === "home";
  const drinking = ratPhase === "drinking";

  const noseAnimation = still
    ? { x: 0, y: 0, scaleX: 1 }
    : mood === "happy"
      ? {
          x: [0, -1.5, 1.5, -1, 0],
          y: [0, -0.8, 0.8, 0],
          scaleX: [1, 1.04, 0.98, 1]
        }
      : mood === "eating"
        ? {
            x: [0, -2, 2, -2, 0],
            y: [0, 0.6, -0.6, 0],
            scaleX: [1, 1.08, 0.96, 1.04, 1]
          }
        : walking
          ? {
              x: [0, -1, 1, 0],
              y: [0, -0.7, 0.3, 0],
              scaleX: [1, 1.03, 0.98, 1]
            }
          : { x: 0, y: [0, -0.8, 0], scaleX: 1 };

  const noseTransition = still
    ? { duration: 0 }
    : mood === "happy"
      ? { duration: 0.55, repeat: 2, ease: "easeInOut" as const }
      : mood === "eating"
        ? { duration: 0.4, repeat: 3, ease: "easeInOut" as const }
        : walking
          ? { duration: 0.64, repeat: Infinity, ease: "easeInOut" as const }
          : { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const };

  // The feet alternate while he waddles, and do a small happy shuffle on a greeting.
  const leftLegAnimation = still
    ? { y: 0, rotate: 0 }
    : walking
      ? { y: [0, -4, 0, 0], rotate: [0, -7, 4, 0] }
      : mood === "happy"
        ? { y: [0, -2, 0], rotate: [0, -3, 2, 0] }
        : { y: 0, rotate: 0 };

  const rightLegAnimation = still
    ? { y: 0, rotate: 0 }
    : walking
      ? { y: [0, 0, -4, 0], rotate: [0, 0, -4, 7] }
      : mood === "happy"
        ? { y: [0, -2, 0], rotate: [0, 3, -2, 0] }
        : { y: 0, rotate: 0 };

  const legTransition = still
    ? { duration: 0 }
    : walking
      ? { duration: 0.64, repeat: Infinity, ease: "easeInOut" as const }
      : mood === "happy"
        ? { duration: 0.6, repeat: 2, ease: "easeInOut" as const }
        : { duration: 0.3 };

  const pawAnimation = still
    ? { y: 0, rotate: 0 }
    : mood === "happy"
      ? { y: [0, -3, 0], rotate: [0, -6, 0] }
      : mood === "eating"
        ? { y: [0, -1.5, 0], rotate: [0, -3, 0] }
        : { y: 0, rotate: 0 };

  const pawTransition = still
    ? { duration: 0 }
    : mood === "happy"
      ? { duration: 0.6, repeat: 2, ease: "easeInOut" as const }
      : mood === "eating"
        ? { duration: 0.4, repeat: 3, ease: "easeInOut" as const }
        : { duration: 0.3 };

  // Both paws lift to the ears and scritch while she is scratching.
  const scratchTransition = {
    duration: SCRATCH_DURATION / 1000,
    ease: "easeInOut" as const
  };

  const leftPawAnimation =
    scratching && !still
      ? { x: [0, 14, 9, 14, 0], y: [0, -62, -58, -62, 0], rotate: [0, 24, 12, 24, 0] }
      : pawAnimation;

  const leftPawTransition = scratching && !still ? scratchTransition : pawTransition;

  const rightPawAnimation =
    scratching && !still
      ? { x: [0, -14, -9, -14, 0], y: [0, -62, -58, -62, 0], rotate: [0, -24, -12, -24, 0] }
      : pawAnimation;

  const rightPawTransition = scratching && !still ? scratchTransition : pawTransition;

  const walkDuration =
    ratPhase === "home"
      ? foodWalkDuration(walkedDistance.current, Boolean(reduceMotion))
      : foodWalkDuration(Math.abs(walkX), Boolean(reduceMotion));

  const status = sleeping
    ? t(COPY.status.asleep)
    : ratPhase === "toSnack"
      ? t(COPY.status.toSnack)
      : ratPhase === "eating"
        ? t(COPY.status.eating)
        : ratPhase === "toWater"
          ? t(COPY.status.toWater)
          : ratPhase === "drinking"
            ? t(COPY.status.drinking)
            : ratPhase === "home"
              ? t(COPY.status.home)
              : scratching
                ? t(COPY.status.scratching)
                : mood === "happy"
                  ? t(COPY.status.happy)
                  : t(COPY.status.idle);

  // State-driven messages replace the sticky speech bubble while he is busy.
  const message = sleeping
    ? { text: COPY.asleepMessage, id: -1 }
    : ratPhase !== "idle"
      ? null
      : speech;

  return (
    <section className="pt-16 md:pt-24">
      <div className="mb-10 flex items-center gap-5">
        <div className="flex items-center gap-3">
          <h1 className="gradient-text block font-display text-[1.5rem] font-bold md:text-[1.75rem]">
            {t(COPY.title)}
          </h1>
        </div>
        <span className="hairline min-w-8 flex-1" aria-hidden />
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div
          ref={stageRef}
          onPointerDown={handleStagePointerDown}
          className="relative flex min-h-[470px] cursor-crosshair flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[var(--layer-100)] px-6 py-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--font-color) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 72%)"
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-[0.16] blur-[90px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[12%] right-[10%] h-[190px] w-[190px] rounded-full bg-[var(--accent-2)] opacity-[0.12] blur-[80px]"
          />

          <div className="pointer-events-none absolute inset-x-4 top-5 z-10 flex h-[84px] justify-center">
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="relative flex h-[84px] w-full max-w-[320px] items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--layer-200)] px-4 py-3 text-center text-sm leading-snug text-[var(--font-color)] shadow-[var(--shadow-card)]"
                >
                  {t(message.text)}
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[var(--border-color)] bg-[var(--layer-200)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="sr-only" role="status" aria-live="polite">
            {message ? t(message.text) : ""}
          </span>

          <div
            ref={pipeRef}
            aria-hidden
            className="pointer-events-none absolute left-[8%] z-10 h-[155px] w-[120px]"
            style={{ top: bottleTop ?? "23%" }}
          >
            <svg
              viewBox="0 0 120 155"
              className="h-full w-full drop-shadow-[0_10px_14px_rgba(0,0,0,0.25)]"
            >
              <defs>
                <linearGradient
                  id="tuneba-bottle"
                  x1="28"
                  y1="0"
                  x2="76"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#d9eef7" />
                  <stop offset="0.5" stopColor="#9ed0e2" />
                  <stop offset="1" stopColor="#6aa8c0" />
                </linearGradient>
                <linearGradient
                  id="tuneba-bottle-water"
                  x1="0"
                  y1="58"
                  x2="0"
                  y2="118"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7cc7e1" />
                  <stop offset="1" stopColor="#3d8cad" />
                </linearGradient>
                <linearGradient
                  id="tuneba-bottle-tube"
                  x1="50"
                  y1="108"
                  x2="100"
                  y2="140"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#d4dde1" />
                  <stop offset="0.55" stopColor="#8e9ba2" />
                  <stop offset="1" stopColor="#5f6b71" />
                </linearGradient>
              </defs>

              {/* wall mount and bottle band */}
              <rect
                x="0"
                y="18"
                width="9"
                height="40"
                rx="4.5"
                fill="#a7b1b7"
                opacity="0.55"
              />
              <rect
                x="0"
                y="18"
                width="9"
                height="40"
                rx="4.5"
                fill="none"
                stroke="#707a80"
                strokeWidth="1"
                opacity="0.5"
              />
              <rect
                x="2"
                y="30"
                width="26"
                height="7"
                rx="3.5"
                fill="#8d989e"
                stroke="#606a70"
                strokeWidth="1"
              />
              <rect
                x="24"
                y="26"
                width="56"
                height="9"
                rx="4.5"
                fill="#9aa5ab"
                stroke="#606a70"
                strokeWidth="1"
              />

              {/* bottle body */}
              <rect
                x="28"
                y="10"
                width="48"
                height="90"
                rx="16"
                fill="url(#tuneba-bottle)"
                stroke="#4b7f96"
                strokeWidth="1.4"
              />
              <path
                d="M31 56 q10 -5 21 0 t21 0 v36 a13 13 0 0 1 -13 13 h-16 a13 13 0 0 1 -13 -13 Z"
                fill="url(#tuneba-bottle-water)"
                opacity="0.85"
              />
              <rect
                x="35"
                y="16"
                width="7"
                height="64"
                rx="3.5"
                fill="#fff"
                opacity="0.3"
              />

              {/* cap and metal sipper tube */}
              <rect
                x="32"
                y="94"
                width="40"
                height="16"
                rx="5"
                fill="#4f7d92"
                stroke="#355b6b"
                strokeWidth="1.2"
              />
              <path
                d="M52 110 C 52 128, 74 132, 96 138"
                fill="none"
                stroke="url(#tuneba-bottle-tube)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle
                cx="99"
                cy="140"
                r="6"
                fill="#c3cdd2"
                stroke="#6f7c83"
                strokeWidth="1.2"
              />

              {drinking && (
                <>
                  <motion.circle
                    cx="99"
                    cy="148"
                    r="2.2"
                    fill="#8fd8ef"
                    animate={{ cy: [148, 160], opacity: [0, 1, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeIn"
                    }}
                  />
                  <motion.circle
                    cx="96"
                    cy="146"
                    r="1.4"
                    fill="#8fd8ef"
                    animate={{ cy: [146, 158], opacity: [0, 1, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeIn",
                      delay: 0.2
                    }}
                  />
                </>
              )}
            </svg>
          </div>

          <motion.div
            className="relative z-[8] mt-10"
            animate={{
              x: walkX,
              y: drinking ? [0, 2, 0] : walking ? [0, -3, 0] : 0,
              rotate: drinking ? (walkX < 0 ? -7 : 7) : walking ? [0, -1, 1, 0] : 0
            }}
            transition={{
              x: { duration: walkDuration, ease: "easeInOut" },
              y: drinking
                ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                : walking
                  ? { duration: 0.32, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 },
              rotate: drinking
                ? { duration: 0.35, ease: "easeOut" }
                : walking
                  ? { duration: 0.64, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
            }}
          >
            {sleeping && (
              <span
                aria-hidden
                className="absolute -right-2 top-0 select-none font-display text-lg font-bold tracking-widest text-[var(--font-muted)]"
              >
                z z z
              </span>
            )}

            <div
              ref={ratRef}
              className="relative block w-[248px] select-none sm:w-[292px]"
            >
              <motion.svg
                viewBox="0 0 260 260"
                role="img"
                aria-hidden
                className="w-full overflow-visible drop-shadow-[0_26px_36px_rgba(0,0,0,0.35)]"
              >
                <defs>
                  <linearGradient
                    id="tuneba-fur"
                    x1="84"
                    y1="48"
                    x2="188"
                    y2="220"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#d8d7d1" />
                    <stop offset="0.55" stopColor="#c3c2bb" />
                    <stop offset="1" stopColor="#a6a59e" />
                  </linearGradient>
                  <linearGradient
                    id="tuneba-ear"
                    x1="90"
                    y1="52"
                    x2="170"
                    y2="86"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#fdcdce" />
                    <stop offset="1" stopColor="#f2aaac" />
                  </linearGradient>
                  <radialGradient id="tuneba-belly" cx="0.5" cy="0.35" r="0.7">
                    <stop stopColor="#eeebe2" stopOpacity="0.78" />
                    <stop offset="0.62" stopColor="#e2ded4" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#e2ded4" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="tuneba-muzzle" cx="0.5" cy="0.5" r="0.55">
                    <stop stopColor="#f0ece3" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#f0ece3" stopOpacity="0" />
                  </radialGradient>
                  <pattern
                    id="tuneba-fur-texture"
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M2 11 q3 -3 6 -2"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.4"
                      opacity="0.35"
                    />
                    <path
                      d="M8 3 q2 3 3 6"
                      fill="none"
                      stroke="#34342f"
                      strokeWidth="0.4"
                      opacity="0.25"
                    />
                    <path
                      d="M4 5 q1 2 2 3"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.35"
                      opacity="0.2"
                    />
                    <path
                      d="M10 10 q1 1 2 2"
                      fill="none"
                      stroke="#5f5e58"
                      strokeWidth="0.35"
                      opacity="0.2"
                    />
                  </pattern>
                </defs>

                <ellipse cx="130" cy="232" rx="54" ry="8" fill="#000" opacity="0.3" />

                <g transform="translate(0 232) scale(1 0.88) translate(0 -232)">
                  <g>
                    {/* ears */}
                    <g>
                      <ellipse
                        cx="78"
                        cy="64"
                        rx="24.84"
                        ry="28.52"
                        fill="url(#tuneba-fur)"
                        stroke="#33332f"
                        strokeWidth="4"
                      />
                      <ellipse
                        cx="78"
                        cy="68"
                        rx="15.64"
                        ry="19.32"
                        fill="url(#tuneba-ear)"
                        stroke="#c9908e"
                        strokeWidth="1.5"
                      />
                      <ellipse
                        cx="182"
                        cy="64"
                        rx="24.84"
                        ry="28.52"
                        fill="url(#tuneba-fur)"
                        stroke="#33332f"
                        strokeWidth="4"
                      />
                      <ellipse
                        cx="182"
                        cy="68"
                        rx="15.64"
                        ry="19.32"
                        fill="url(#tuneba-ear)"
                        stroke="#c9908e"
                        strokeWidth="1.5"
                      />
                    </g>

                    {/* body — a separate pear-shaped part behind the head */}
                    <path
                      d="M130 118 C 160 118 184 132 197 158 C 210 184 205 209 182 220 C 166 228 94 228 78 220 C 55 209 50 184 63 158 C 76 132 100 118 130 118 Z"
                      fill="url(#tuneba-fur)"
                      stroke="#33332f"
                      strokeWidth="4"
                    />
                    <path
                      d="M130 118 C 160 118 184 132 197 158 C 176 142 154 136 130 136 C 106 136 84 142 63 158 C 76 132 100 118 130 118 Z"
                      fill="#b3b2ab"
                      opacity="0.45"
                    />
                    <path
                      d="M130 148 C 150 148 164 170 163 192 C 162 211 149 221 130 222 C 111 221 98 211 97 192 C 96 170 110 148 130 148 Z"
                      fill="url(#tuneba-belly)"
                    />
                    <path
                      d="M130 118 C 160 118 184 132 197 158 C 210 184 205 209 182 220 C 166 228 94 228 78 220 C 55 209 50 184 63 158 C 76 132 100 118 130 118 Z"
                      fill="url(#tuneba-fur-texture)"
                      opacity="0.3"
                    />
                    <path
                      d="M96 152 C 108 176 152 176 164 152 C 160 180 148 190 130 190 C 112 190 100 180 96 152 Z"
                      fill="#918f87"
                      opacity="0.22"
                    />

                    {/* soft side shading */}
                    <path
                      d="M56 164 C 54 187 61 207 80 219 C 68 206 65 187 69 167 Z"
                      fill="#807f78"
                      opacity="0.18"
                    />
                    <path
                      d="M204 164 C 206 187 199 207 180 219 C 192 206 195 187 191 167 Z"
                      fill="#807f78"
                      opacity="0.18"
                    />

                    {/* hind feet */}
                    <motion.g
                      animate={leftLegAnimation}
                      transition={legTransition}
                      style={{ transformOrigin: "104px 220px" }}
                    >
                      <ellipse
                        cx="104"
                        cy="220"
                        rx="13"
                        ry="8.5"
                        fill="#f7c4c5"
                        stroke="#be8584"
                        strokeWidth="2.4"
                      />
                      <path
                        d="M98 223 l-1 3 M103 224 l0 3 M108 223 l1 3"
                        fill="none"
                        stroke="#c98d8c"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                      />
                    </motion.g>
                    <motion.g
                      animate={rightLegAnimation}
                      transition={legTransition}
                      style={{ transformOrigin: "156px 220px" }}
                    >
                      <ellipse
                        cx="156"
                        cy="220"
                        rx="13"
                        ry="8.5"
                        fill="#f7c4c5"
                        stroke="#be8584"
                        strokeWidth="2.4"
                      />
                      <path
                        d="M150 223 l-1 3 M155 224 l0 3 M160 223 l1 3"
                        fill="none"
                        stroke="#c98d8c"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    {/* head — its own rounded, cheek-heavy shape sitting on the body */}
                    <path
                      d="M130 58 C 154 58 176 67 188 84 C 200 101 202 121 196 138 C 189 155 169 166 130 167 C 91 166 71 155 64 138 C 58 121 60 101 72 84 C 84 67 106 58 130 58 Z"
                      fill="url(#tuneba-fur)"
                      stroke="#33332f"
                      strokeWidth="4"
                    />
                    <path
                      d="M112 61 C 119 56 141 56 148 61 C 146 76 143 90 139 102 C 135 96 125 96 121 102 C 117 90 114 76 112 61 Z"
                      fill="#a9a8a1"
                      opacity="0.38"
                    />
                    <path
                      d="M102 64 C 91 69 82 78 76 89 C 70 100 68 114 71 126 C 66 112 67 97 74 84 C 82 70 93 63 102 64 Z"
                      fill="#8f8e87"
                      opacity="0.18"
                    />
                    <path
                      d="M158 64 C 169 69 178 78 184 89 C 190 100 192 114 189 126 C 194 112 193 97 186 84 C 178 70 167 63 158 64 Z"
                      fill="#8f8e87"
                      opacity="0.18"
                    />
                    <path
                      d="M130 58 C 154 58 176 67 188 84 C 200 101 202 121 196 138 C 189 155 169 166 130 167 C 91 166 71 155 64 138 C 58 121 60 101 72 84 C 84 67 106 58 130 58 Z"
                      fill="url(#tuneba-fur-texture)"
                      opacity="0.28"
                    />
                    <path
                      d="M103 162 C 114 174 146 174 157 162"
                      fill="none"
                      stroke="#8b8a83"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.32"
                    />

                    {/* cheeks */}
                    <ellipse cx="91" cy="150" rx="17" ry="11" fill="#f4b9b9" opacity="0.26" />
                    <ellipse cx="169" cy="150" rx="17" ry="11" fill="#f4b9b9" opacity="0.26" />

                    {/* muzzle */}
                    <ellipse cx="130" cy="144" rx="33" ry="24" fill="url(#tuneba-muzzle)" />

                    {/* eyes */}
                    <motion.g
                      animate={{ scaleY: eyesClosed ? 0.1 : 1 }}
                      transition={{ duration: 0.12 }}
                      style={{ transformOrigin: "99px 112px" }}
                    >
                      <ellipse
                        cx="99"
                        cy="112"
                        rx="15"
                        ry="17"
                        fill="#5a5952"
                        opacity="0.18"
                      />
                      <motion.g style={sleeping ? { x: 0, y: 0 } : { x: eyeX, y: eyeY }}>
                        <ellipse cx="99" cy="112" rx="13" ry="15" fill="#171512" />
                        <circle cx="95" cy="106" r="2.4" fill="#fff" opacity="0.8" />
                        <circle cx="103" cy="117" r="1.2" fill="#fff" opacity="0.22" />
                      </motion.g>
                    </motion.g>
                    <motion.g
                      animate={{ scaleY: eyesClosed ? 0.1 : 1 }}
                      transition={{ duration: 0.12 }}
                      style={{ transformOrigin: "161px 112px" }}
                    >
                      <ellipse
                        cx="161"
                        cy="112"
                        rx="15"
                        ry="17"
                        fill="#5a5952"
                        opacity="0.18"
                      />
                      <motion.g style={sleeping ? { x: 0, y: 0 } : { x: eyeX, y: eyeY }}>
                        <ellipse cx="161" cy="112" rx="13" ry="15" fill="#171512" />
                        <circle cx="157" cy="106" r="2.4" fill="#fff" opacity="0.8" />
                        <circle cx="165" cy="117" r="1.2" fill="#fff" opacity="0.22" />
                      </motion.g>
                    </motion.g>

                    {/* nose and mouth */}
                    <motion.g
                      ref={mouthRef}
                      animate={noseAnimation}
                      transition={noseTransition}
                      style={{ transformOrigin: "130px 147px" }}
                    >
                      <path
                        d="M123.4 143 C 125 139.4 135 139.4 136.6 143 C 135.6 148 132.7 150 130 150 C 127.3 150 124.4 148 123.4 143 Z"
                        fill="#38332f"
                      />
                      <ellipse cx="127" cy="142.4" rx="1.3" ry="0.8" fill="#fff" opacity="0.35" />
                      <path
                        d="M130 150.2 v3.2 M130 153.4 q-6 3.4 -10 0.4 M130 153.4 q6 3.4 10 0.4"
                        fill="none"
                        stroke="#38332f"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    {/* whiskers */}
                    <g
                      fill="none"
                      stroke="#8b897f"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.6"
                    >
                      <path d="M104 147 Q88 143 76 140" />
                      <path d="M104 153 Q86 154 74 157" />
                      <path d="M107 159 Q91 165 81 171" />
                      <path d="M156 147 Q172 143 184 140" />
                      <path d="M156 153 Q174 154 186 157" />
                      <path d="M153 159 Q169 165 179 171" />
                    </g>

                    {/* face fur detail */}
                    <g
                      fill="none"
                      stroke="#8b897f"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      opacity="0.28"
                    >
                      <path d="M70 128 q-5 12 -3 26" />
                      <path d="M78 120 q-6 16 -4 32" />
                      <path d="M190 128 q5 12 3 26" />
                      <path d="M182 120 q6 16 4 32" />
                      <path d="M106 86 q-8 4 -14 10" />
                      <path d="M154 86 q8 4 14 10" />
                    </g>
                    <g
                      fill="none"
                      stroke="#f7f5ef"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      opacity="0.18"
                    >
                      <path d="M86 108 q-8 16 -7 34" />
                      <path d="M96 92 q-10 12 -13 30" />
                      <path d="M174 108 q8 16 7 34" />
                      <path d="M164 92 q10 12 13 30" />
                    </g>

                    {/* front paws — rendered last so they sit above the head when scratching */}
                    <motion.g
                      animate={leftPawAnimation}
                      transition={leftPawTransition}
                      style={{ transformOrigin: "73px 177px" }}
                    >
                      <ellipse
                        cx="73"
                        cy="177"
                        rx="9"
                        ry="6.5"
                        transform="rotate(-14 73 177)"
                        fill="#f7c4c5"
                        stroke="#be8584"
                        strokeWidth="2.2"
                      />
                      <path
                        d="M68 181 l-1 3 M73 182 l0 3 M78 181 l1 3"
                        fill="none"
                        stroke="#c98d8c"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                      />
                    </motion.g>
                    <motion.g
                      animate={rightPawAnimation}
                      transition={rightPawTransition}
                      style={{ transformOrigin: "187px 177px" }}
                    >
                      <ellipse
                        cx="187"
                        cy="177"
                        rx="9"
                        ry="6.5"
                        transform="rotate(14 187 177)"
                        fill="#f7c4c5"
                        stroke="#be8584"
                        strokeWidth="2.2"
                      />
                      <path
                        d="M182 181 l-1 3 M187 182 l0 3 M192 181 l1 3"
                        fill="none"
                        stroke="#c98d8c"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                      />
                    </motion.g>
                  </g>
                </g>
              </motion.svg>
            </div>
          </motion.div>

          {snack && (
            <div
              aria-hidden
              className="pointer-events-none absolute z-20 -translate-x-1/2 select-none"
              style={{ left: snack.x, top: snack.groundY }}
            >
              <motion.div
                key={snack.id}
                initial={{
                  y: snack.spawnY - snack.groundY,
                  opacity: 0,
                  rotate: -18,
                  scale: 0.9
                }}
                animate={{ y: -SNACK_SIZE, opacity: 1, rotate: 0, scale: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  ease: "easeIn"
                }}
                onAnimationComplete={handleSnackLanded}
              >
                <svg
                  viewBox="0 0 44 44"
                  width={SNACK_SIZE}
                  height={SNACK_SIZE}
                  className="drop-shadow-[0_8px_10px_rgba(0,0,0,0.32)]"
                >
                  <defs>
                    <linearGradient
                      id="tuneba-seed"
                      x1="12"
                      y1="6"
                      x2="33"
                      y2="40"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#564a3c" />
                      <stop offset="0.5" stopColor="#332b23" />
                      <stop offset="1" stopColor="#191510" />
                    </linearGradient>
                    <clipPath id="tuneba-seed-clip">
                      <path d="M22 4 C 27 8 32 14 34 22 C 36 30 32 37 26 40 C 24 41 20 41 18 40 C 12 37 8 30 10 22 C 12 14 17 8 22 4 Z" />
                    </clipPath>
                  </defs>
                  <g transform="rotate(18 22 22)">
                    <path
                      d="M22 4 C 27 8 32 14 34 22 C 36 30 32 37 26 40 C 24 41 20 41 18 40 C 12 37 8 30 10 22 C 12 14 17 8 22 4 Z"
                      fill="url(#tuneba-seed)"
                      stroke="#2d241b"
                      strokeWidth="1.3"
                    />
                    <g
                      clipPath="url(#tuneba-seed-clip)"
                      fill="none"
                      stroke="#e8dfcf"
                      strokeWidth="1.8"
                      opacity="0.72"
                    >
                      <path d="M16 10 C 12 18 12 30 18 39" />
                      <path d="M22 5 C 19 16 19 29 22 40" />
                      <path d="M28 10 C 32 19 32 30 26 39" />
                    </g>
                    <ellipse
                      cx="16"
                      cy="14"
                      rx="2.6"
                      ry="4.5"
                      fill="#fff"
                      opacity="0.14"
                      transform="rotate(-22 16 14)"
                    />
                  </g>
                </svg>
              </motion.div>
            </div>
          )}

          <p className="mt-6 flex items-center gap-2 text-xs text-[var(--font-muted)]">
            <Sparkle size={14} className="text-[var(--accent)]" />
            {t(COPY.hint)}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="surface flex flex-1 flex-col rounded-[2rem] p-6 md:p-7">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              {t(COPY.panel.eyebrow)}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight md:text-3xl">
              {t(COPY.panel.heading)}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--font-muted)]">
              {t(COPY.panel.body)}
            </p>

            <div className="my-6 hairline" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  {!sleeping && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-2.5 w-2.5 rounded-full",
                      sleeping ? "bg-[var(--font-muted)]" : "bg-[var(--accent)]"
                    )}
                  />
                </span>
                <span className="text-sm text-[var(--font-color)]">{status}</span>
              </div>

              <div
                className="flex items-center gap-1"
                aria-label={t({
                  en: `Bond: ${bond} out of 5 hearts`,
                  pt: `Vínculo: ${bond} de 5 corações`
                })}
              >
                {[0, 1, 2, 3, 4].map((index) => (
                  <Heart
                    key={index}
                    size={18}
                    weight={index < bond ? "fill" : "regular"}
                    className={cn(
                      "transition-colors duration-300",
                      index < bond
                        ? "text-[var(--accent)]"
                        : "text-[var(--border-strong)]"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="order-first grid grid-cols-3 gap-3 lg:order-none">
            {ACTIONS.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleAction(action.id)}
                  className="group flex min-h-[120px] flex-col items-start justify-between gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--layer-100)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--layer-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--layer-000)]"
                >
                  <Icon
                    size={24}
                    weight="duotone"
                    className="text-[var(--accent)] transition-transform duration-200 group-hover:scale-110"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[var(--font-color)]">
                      {t(action.label)}
                    </span>
                    <span className="block text-xs text-[var(--font-muted)]">
                      {t(action.hint)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="px-2 text-xs leading-relaxed text-[var(--font-muted)]">
            {t(COPY.panel.footnote)}
          </p>
        </div>
      </div>
    </section>
  );
}
