"use client";

import { cn } from "@/lib/utils";
import {
  Cheese,
  GameController,
  HandWaving,
  Heart,
  MoonStars,
  Sparkle,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type Mood = "idle" | "curious" | "happy" | "eating" | "playing" | "sleeping";
type Reaction = "hello" | "feed" | "play";

const ACTIONS = [
  {
    id: "hello",
    label: "Say hi",
    hint: "Squeak back",
    icon: HandWaving,
  },
  {
    id: "feed",
    label: "Drop food",
    hint: "He is always hungry",
    icon: Cheese,
  },
  {
    id: "play",
    label: "Play",
    hint: "Chase the ball",
    icon: GameController,
  },
  {
    id: "nap",
    label: "Let him nap",
    hint: "Do not disturb",
    icon: MoonStars,
  },
] as const;

type ActionId = (typeof ACTIONS)[number]["id"];

const MESSAGES: Record<Reaction, string[]> = {
  hello: [
    "Squeak. Hello, human.",
    "You came to see me? Bold choice.",
    "Hi. I was chewing on a cable.",
    "You finally noticed me.",
    "Hey, you brought snacks?",
    "Mmm, let me smell your fingers.",
    "Wanna trade secrets?",
    "I can taste your fear.",
    "I know where you sleep.",
    "I'm hungry. Feed me.",
    "Feed me. Feed me. Feed me.",
    "I'm not fat, I'm fluffy.",
    "Oh, you...",
  ],
  feed: [
    "Finally. A snack.",
    "You dropped this. It is mine now.",
    "Didn't you have something stinkier?",
    "Five-second rule? Never heard of it.",
    "Cheese! Or whatever this is.",
    "Mmm, that tastes like some kind of package.",
    "I'm going to steal your Wi-Fi."
  ],
  play: [
    "I will bite. That is the game.",
    "Faster, human.",
    "Time to chase the ball.",
    "Catch me if you can. You cannot.",
  ],
};

const FOODS = ["🧀", "🍕", "🍪", "🍞", "🍟", "🥕"];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function Mascot() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const [mood, setMood] = useState<Mood>("idle");
  const [blink, setBlink] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [bond, setBond] = useState(1);
  const [speech, setSpeech] = useState({
    text: "I'm Lester. Move your cursor — I'll follow. Click me to drop food.",
    id: 0,
  });
  const [particles, setParticles] = useState<
    Array<{ id: number; emoji: string; x: number; rotate: number }>
  >([]);
  const [fallingFood, setFallingFood] = useState<
    Array<{ id: number; emoji: string; x: number }>
  >([]);

  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleId = useRef(0);
  const foodId = useRef(0);
  const speechId = useRef(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const pupilX = useSpring(useTransform(pointerX, [-1, 1], [-6, 6]), {
    stiffness: 180,
    damping: 20,
    mass: 0.4,
  });
  const pupilY = useSpring(useTransform(pointerY, [-1, 1], [-5, 5]), {
    stiffness: 180,
    damping: 20,
    mass: 0.4,
  });
  const lean = useSpring(useTransform(pointerX, [-1, 1], [-2.5, 2.5]), {
    stiffness: 120,
    damping: 18,
  });
  const shift = useSpring(useTransform(pointerX, [-1, 1], [-4, 4]), {
    stiffness: 120,
    damping: 18,
  });

  const say = useCallback((text: string) => {
    speechId.current += 1;
    setSpeech({ text, id: speechId.current });
  }, []);

  const scheduleSleep = useCallback(() => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    sleepTimer.current = setTimeout(() => {
      setSleeping(true);
      setMood("sleeping");
      say("Zzz… wake me when the food lands.");
    }, 30000);
  }, [say]);

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
    },
    []
  );

  const react = (action: Reaction) => {
    const wasAsleep = sleeping;

    setSleeping(false);
    scheduleSleep();

    setMood(
      action === "feed" ? "eating" : action === "play" ? "playing" : "happy"
    );

    if (wasAsleep) {
      say("Oh! I was dreaming about cheese.");
    } else if (bond === 4) {
      say("Five hearts. Fine. You may scratch my one good ear.");
    } else {
      const options = MESSAGES[action];
      say(options[Math.floor(Math.random() * options.length)]);
    }

    setBond((current) => Math.min(5, current + 1));

    if (moodTimer.current) clearTimeout(moodTimer.current);
    moodTimer.current = setTimeout(
      () => setMood("idle"),
      action === "feed" ? 2300 : 1800
    );
  };

  const dropFood = () => {
    foodId.current += 1;
    setFallingFood((current) => [
      ...current,
      {
        id: foodId.current,
        emoji: FOODS[Math.floor(Math.random() * FOODS.length)],
        x: (Math.random() - 0.5) * 140,
      },
    ]);
  };

  const handleFoodLanded = (id: number) => {
    setFallingFood((current) => current.filter((food) => food.id !== id));
    react("feed");
  };

  const nap = () => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    if (moodTimer.current) clearTimeout(moodTimer.current);
    setParticles([]);
    setFallingFood([]);
    setSleeping(true);
    setMood("sleeping");
    say("Wake me when the food lands.");
  };

  const handleAction = (action: ActionId) => {
    if (action === "feed") {
      dropFood();
      return;
    }

    if (action === "nap") {
      nap();
      return;
    }

    react(action);
  };

  const eyesClosed = sleeping || blink;
  const paused = Boolean(reduceMotion);
  const still = paused || sleeping;

  const mascotAnimation = still
    ? { y: 0 }
    : mood === "happy"
      ? { y: [0, -22, 0, -8, 0], scaleY: [1, 1.04, 0.97, 1.02, 1] }
      : mood === "eating"
        ? { y: 0, scaleY: [1, 1.05, 0.96, 1], scaleX: [1, 0.97, 1.03, 1] }
        : mood === "playing"
          ? { y: [0, -12, 0], rotate: [0, -3, 3, 0] }
          : { y: [0, -5, 0] };

  const mascotTransition = still
    ? { duration: 0 }
    : mood === "happy"
      ? { duration: 0.85, ease: "easeOut" as const }
      : mood === "eating"
        ? { duration: 0.45, repeat: 2, repeatType: "reverse" as const }
        : mood === "playing"
          ? { duration: 0.7, ease: "easeOut" as const }
          : { duration: 4, repeat: Infinity, ease: "easeInOut" as const };

  const bodyStyle = sleeping
    ? { transformOrigin: "130px 150px" }
    : {
        rotate: lean,
        x: shift,
        transformOrigin: "130px 150px",
      };

  const status = sleeping
    ? "Asleep — drop food to wake him"
    : mood === "eating"
      ? "Devouring the evidence"
      : mood === "playing"
        ? "Biting everything in sight"
        : mood === "happy"
          ? "Suspiciously pleased"
          : "Watching you (for snacks)";

  return (
    <section className="pt-16 md:pt-24">
      <div className="mb-10 flex items-center gap-5">
        <div className="flex items-center gap-3">
          <h1 className="gradient-text block font-display text-[1.5rem] font-bold md:text-[1.75rem]">
            Meet Lester
          </h1>
        </div>
        <span className="hairline min-w-8 flex-1" aria-hidden />
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div
          ref={stageRef}
          className="relative flex min-h-[470px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[var(--layer-100)] px-6 py-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--font-color) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 72%)",
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

          <div className="pointer-events-none absolute inset-x-4 top-5 z-10 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={speech.id}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="relative max-w-[320px] rounded-2xl border border-[var(--border-color)] bg-[var(--layer-200)] px-4 py-3 text-center text-sm text-[var(--font-color)] shadow-[var(--shadow-card)]"
              >
                {speech.text}
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[var(--border-color)] bg-[var(--layer-200)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <span className="sr-only" role="status" aria-live="polite">
            {speech.text}
          </span>

          <div className="relative mt-10">
            {sleeping && (
              <span
                aria-hidden
                className="absolute -right-2 top-0 select-none font-display text-lg font-bold tracking-widest text-[var(--font-muted)]"
              >
                z z z
              </span>
            )}

            <motion.button
              type="button"
              onClick={dropFood}
              aria-label="Drop food for Lester, the mascot"
              className="relative block w-[248px] cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-8 focus-visible:ring-offset-[var(--layer-100)] sm:w-[292px]"
              whileTap={paused ? undefined : { scale: 0.97 }}
            >
              <motion.svg
                viewBox="0 0 260 260"
                role="img"
                aria-hidden
                className="w-full overflow-visible drop-shadow-[0_26px_36px_rgba(0,0,0,0.35)]"
              >
                <defs>
                  <linearGradient
                    id="lester-fur"
                    x1="58"
                    y1="48"
                    x2="206"
                    y2="216"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#a89b8b" />
                    <stop offset="1" stopColor="#6b6155" />
                  </linearGradient>
                  <linearGradient
                    id="lester-ear"
                    x1="70"
                    y1="40"
                    x2="190"
                    y2="100"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#e4a5a8" />
                    <stop offset="1" stopColor="#c97f86" />
                  </linearGradient>
                  <linearGradient
                    id="lester-belly"
                    x1="92"
                    y1="140"
                    x2="168"
                    y2="214"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#d8cdbc" />
                    <stop offset="1" stopColor="#bcb09f" />
                  </linearGradient>
                </defs>

                <ellipse
                  cx="130"
                  cy="232"
                  rx="58"
                  ry="9"
                  fill="#000"
                  opacity="0.32"
                />

                <motion.g
                  animate={mascotAnimation}
                  transition={mascotTransition}
                  style={{ transformOrigin: "130px 150px" }}
                >
                  <motion.g style={bodyStyle}>
                    {/* tail */}
                    <motion.g
                      animate={still ? { rotate: 0 } : { rotate: [-2, 2, -2] }}
                      transition={
                        still
                          ? { duration: 0 }
                          : {
                              duration: 3.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      style={{ transformOrigin: "188px 198px" }}
                    >
                      <path
                        d="M188 198 C 224 202 240 178 226 158 C 216 144 198 148 200 162"
                        fill="none"
                        stroke="#d98a8f"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    {/* feet */}
                    <ellipse cx="103" cy="218" rx="18" ry="8" fill="#d98a8f" />
                    <ellipse cx="157" cy="218" rx="18" ry="8" fill="#d98a8f" />
                    <path
                      d="M94 222 v4 M103 223 v5 M112 222 v4 M148 222 v4 M157 223 v5 M166 222 v4"
                      stroke="#b56e75"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    {/* body */}
                    <path
                      d="M130 92 C 172 92 196 124 196 158 C 196 192 168 214 130 214 C 92 214 64 192 64 158 C 64 124 88 92 130 92 Z"
                      fill="url(#lester-fur)"
                    />
                    <ellipse
                      cx="130"
                      cy="177"
                      rx="45"
                      ry="34"
                      fill="url(#lester-belly)"
                      opacity="0.9"
                    />

                    {/* scruffy body tufts */}
                    <path
                      d="M65 143 L48 135 L63 152 L46 157 L65 164 Z"
                      fill="#7c7164"
                    />
                    <path
                      d="M195 148 L212 140 L197 156 L214 162 L195 168 Z"
                      fill="#7c7164"
                    />
                    <path
                      d="M76 188 L62 194 L78 198 Z"
                      fill="#7c7164"
                    />
                    <path
                      d="M184 188 L198 194 L182 198 Z"
                      fill="#7c7164"
                    />

                    {/* arms */}
                    <path
                      d="M78 158 Q60 164 64 178"
                      fill="none"
                      stroke="url(#lester-fur)"
                      strokeWidth="13"
                      strokeLinecap="round"
                    />
                    <ellipse cx="64" cy="181" rx="10" ry="8" fill="#c9bdac" />
                    <path
                      d="M57 184 l-4 5 M62 187 l-2 6 M68 187 l1 6"
                      stroke="#8a7e6e"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    <motion.g
                      animate={
                        still
                          ? { rotate: 0 }
                          : mood === "happy" || mood === "playing"
                            ? { rotate: [0, -24, 10, -24, 0] }
                            : { rotate: 0 }
                      }
                      transition={
                        still
                          ? { duration: 0 }
                          : { duration: 0.9, ease: "easeInOut" }
                      }
                      style={{ transformOrigin: "182px 158px" }}
                    >
                      <path
                        d="M182 158 Q200 164 196 178"
                        fill="none"
                        stroke="url(#lester-fur)"
                        strokeWidth="13"
                        strokeLinecap="round"
                      />
                      <ellipse
                        cx="196"
                        cy="181"
                        rx="10"
                        ry="8"
                        fill="#c9bdac"
                      />
                      <path
                        d="M189 184 l4 5 M194 187 l2 6 M200 187 l-1 6"
                        stroke="#8a7e6e"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    {/* ears */}
                    <g>
                      <circle cx="82" cy="65" r="28" fill="url(#lester-fur)" />
                      <ellipse
                        cx="82"
                        cy="65"
                        rx="17"
                        ry="16"
                        fill="url(#lester-ear)"
                      />
                      <path
                        d="M74 58 q6 -5 12 0 M72 70 q5 -4 10 0"
                        fill="none"
                        stroke="#b56e75"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.7"
                      />
                    </g>
                    <motion.g
                      animate={
                        still
                          ? { rotate: 8 }
                          : mood === "happy" || mood === "playing"
                            ? { rotate: [8, 2, 14, 8] }
                            : { rotate: 8 }
                      }
                      transition={
                        still
                          ? { duration: 0 }
                          : { duration: 1.4, ease: "easeInOut" }
                      }
                      style={{ transformOrigin: "160px 84px" }}
                    >
                      <ellipse
                        cx="181"
                        cy="61"
                        rx="33"
                        ry="30"
                        fill="url(#lester-fur)"
                      />
                      <ellipse
                        cx="181"
                        cy="61"
                        rx="21"
                        ry="18"
                        fill="url(#lester-ear)"
                      />
                      <path
                        d="M166 50 q8 -6 16 0 M164 66 q9 -6 18 0"
                        fill="none"
                        stroke="#b56e75"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.7"
                      />
                    </motion.g>

                    {/* head */}
                    <path
                      d="M78 98 C 78 66 100 46 130 46 C 160 46 182 66 182 98 C 182 120 171 136 157 144 L 153 160 C 149 177 141 187 130 187 C 119 187 111 177 107 160 L 103 144 C 89 136 78 120 78 98 Z"
                      fill="url(#lester-fur)"
                    />

                    {/* scruffy head tufts */}
                    <path
                      d="M116 48 C 111 38 115 30 123 25 M130 47 C 130 36 134 30 141 27 M143 49 C 151 40 151 32 147 26"
                      fill="none"
                      stroke="#6b6155"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* muzzle */}
                    <ellipse
                      cx="130"
                      cy="150"
                      rx="33"
                      ry="31"
                      fill="#c9bdac"
                    />

                    {/* eye patch */}
                    <path
                      d="M86 92 C 94 78 112 74 122 84 C 128 92 124 104 116 110 C 106 118 90 112 86 102 Z"
                      fill="#5f564a"
                      opacity="0.45"
                    />

                    {/* eyes */}
                    <motion.g
                      animate={{ scaleY: eyesClosed ? 0.08 : 1 }}
                      transition={{ duration: 0.12 }}
                      style={{ transformOrigin: "104px 104px" }}
                    >
                      <ellipse
                        cx="104"
                        cy="104"
                        rx="12"
                        ry="14"
                        fill="#f3ead6"
                      />
                      <motion.g
                        style={
                          sleeping ? { x: 0, y: 0 } : { x: pupilX, y: pupilY }
                        }
                      >
                        <circle cx="104" cy="104" r="6" fill="#1b1512" />
                        <circle cx="102" cy="102" r="2" fill="#fff" />
                      </motion.g>
                    </motion.g>
                    <motion.g
                      animate={{ scaleY: eyesClosed ? 0.08 : 1 }}
                      transition={{ duration: 0.12 }}
                      style={{ transformOrigin: "156px 109px" }}
                    >
                      <ellipse
                        cx="156"
                        cy="109"
                        rx="14"
                        ry="16"
                        fill="#f3ead6"
                      />
                      <motion.g
                        style={
                          sleeping ? { x: 0, y: 0 } : { x: pupilX, y: pupilY }
                        }
                      >
                        <circle cx="156" cy="109" r="6.5" fill="#1b1512" />
                        <circle cx="153.5" cy="106.5" r="2" fill="#fff" />
                      </motion.g>
                    </motion.g>

                    {/* brows */}
                    <path
                      d="M88 85 Q102 76 117 82"
                      fill="none"
                      stroke="#4a4137"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M143 88 Q156 80 171 88"
                      fill="none"
                      stroke="#4a4137"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />

                    {/* nose */}
                    <ellipse cx="130" cy="158" rx="9" ry="7" fill="#d9848b" />
                    <ellipse cx="127" cy="156" rx="2.5" ry="1.6" fill="#9e5860" />
                    <ellipse cx="133" cy="156" rx="2.5" ry="1.6" fill="#9e5860" />
                    <ellipse cx="126.5" cy="154.5" rx="1.5" ry="1" fill="#fff" opacity="0.7" />

                    {/* buck teeth */}
                    <g>
                      <rect
                        x="120"
                        y="166"
                        width="8.5"
                        height="15"
                        rx="2.5"
                        fill="#f1e6c9"
                        stroke="#cbb98f"
                        strokeWidth="1.2"
                        transform="rotate(-3 124 173)"
                      />
                      <rect
                        x="132"
                        y="166"
                        width="8.5"
                        height="15"
                        rx="2.5"
                        fill="#f1e6c9"
                        stroke="#cbb98f"
                        strokeWidth="1.2"
                        transform="rotate(4 136 173)"
                      />
                      <path
                        d="M135 168 l-2 6"
                        stroke="#cbb98f"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* whiskers */}
                    <g
                      fill="none"
                      stroke="#ddd2c0"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      opacity="0.75"
                    >
                      <path d="M103 148 Q86 144 68 136" />
                      <path d="M102 156 Q84 156 64 154" />
                      <path d="M104 163 Q88 168 70 176" />
                      <path d="M157 148 Q174 144 192 136" />
                      <path d="M158 156 Q176 156 196 154" />
                      <path d="M156 163 Q172 168 190 176" />
                    </g>

                    {/* cheek tufts */}
                    <path d="M79 133 L62 126 L78 141 Z" fill="#7c7164" />
                    <path d="M181 133 L198 126 L182 141 Z" fill="#7c7164" />
                  </motion.g>
                </motion.g>
              </motion.svg>
            </motion.button>

            <div className="pointer-events-none absolute inset-0 z-10">
              {fallingFood.map((food) => (
                <motion.span
                  key={food.id}
                  aria-hidden
                  initial={{ y: -70, opacity: 0, rotate: -25 }}
                  animate={{ y: 178, opacity: [0, 1, 1], rotate: 18 }}
                  transition={{ duration: 0.55, ease: "easeIn" }}
                  onAnimationComplete={() => handleFoodLanded(food.id)}
                  className="absolute left-1/2 top-0 select-none text-3xl"
                  style={{ marginLeft: food.x }}
                >
                  {food.emoji}
                </motion.span>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0">
              <AnimatePresence>
                {particles.map((particle) => (
                  <motion.span
                    key={particle.id}
                    aria-hidden
                    initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: -100,
                      x: particle.x,
                      scale: [0.6, 1.1, 0.9],
                      rotate: particle.rotate,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.15, ease: "easeOut" }}
                    onAnimationComplete={() =>
                      setParticles((current) =>
                        current.filter((item) => item.id !== particle.id)
                      )
                    }
                    className="absolute left-1/2 top-[42%] select-none text-2xl"
                  >
                    {particle.emoji}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-[var(--font-muted)]">
            <Sparkle size={14} className="text-[var(--accent)]" />
            Click Lester to drop some food
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="surface flex flex-1 flex-col rounded-[2rem] p-6 md:p-7">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Interactive mascot
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight md:text-3xl">
              An ugly rat with a big appetite.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--font-muted)]">
              Lester is not pretty. He is not polite. He is, however, always
              hungry. Click him to drop food from above and he will handle the
              rest. His eyes follow your cursor — unless he is asleep, in which
              case he does absolutely nothing.
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
                      sleeping
                        ? "bg-[var(--font-muted)]"
                        : "bg-[var(--accent)]"
                    )}
                  />
                </span>
                <span className="text-sm text-[var(--font-color)]">
                  {status}
                </span>
              </div>

              <div
                className="flex items-center gap-1"
                aria-label={`Bond: ${bond} out of 5 hearts`}
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

          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleAction(action.id)}
                  className="group flex min-h-[104px] flex-col items-start justify-between gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--layer-100)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--layer-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--layer-000)]"
                >
                  <Icon
                    size={24}
                    weight="duotone"
                    className="text-[var(--accent)] transition-transform duration-200 group-hover:scale-110"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[var(--font-color)]">
                      {action.label}
                    </span>
                    <span className="block text-xs text-[var(--font-muted)]">
                      {action.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="px-2 text-xs leading-relaxed text-[var(--font-muted)]">
            Lester is mostly fur, bad decisions, and an unfillable stomach. His
            bond meter is yours to fill.
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--layer-100)] px-5 py-4 text-sm text-[var(--font-muted)]">
        <MoonStars
          size={20}
          weight="duotone"
          className="shrink-0 text-[var(--accent-2)]"
        />
        <span>
          Lester naps after 30 seconds of quiet, or when you ask him to. While
          he sleeps, he does not move a single whisker.
        </span>
      </div>
    </section>
  );
}
