"use client";

import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SpeakerHigh } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createAsymmetricDistortionCurve,
  createDistortionCurve,
  createPluckBuffer,
  midiToFrequency,
} from "../audio";

const VIEWBOX_X = -20;
const VIEWBOX_Y = -20;
const VIEWBOX_WIDTH = 1583;
const VIEWBOX_HEIGHT = 503;

/* Shapes taken from reference.svg. */
const BODY_PATH =
  "m 23.93101,33.39339 c 0.36742,11.004992 3.98356,16.850607 7.96067,19.901677 5.76068,3.53758 10.86186,4.31533 16.44214,0.74399 2.02847,-1.58851 7.87759,-5.333753 10.37863,-5.505503 2.83211,-0.194485 8.97824,3.066823 12.685,4.761513 1.59292,0.18319 3.10901,0.19077 4.01753,-1.19038 0.25739,-1.39402 -0.68224,-2.53603 -2.30636,-3.53394 -1.63168,-1.55999 -4.35858,-2.599195 -4.76153,-6.5099 -0.19305,-1.873635 1.45441,-3.036454 3.45955,-4.203532 l 8.22106,-0.334793 v -8.630261 c -0.85817,-0.569501 -1.8919,-1.372716 -1.74837,-3.124748 0.13359,-1.63061 1.73668,-3.38758 6.80749,-5.356714 l 7.14228,-1.785572 c 1.10524,-0.203867 2.44901,-0.492749 2.67835,-1.487974 0.27191,-1.179946 -0.55729,-1.904779 -2.08316,-2.975952 -0.93768,-0.600078 -3.16877,-0.830608 -5.4683,-1.041585 -9.63145,0.881291 -14.25501,5.285775 -22.91483,5.170718 -8.8417,-0.117473 -14.06787,-7.515736 -22.80324,-8.146669 -3.0459,-0.2199972 -6.45107,-0.2009452 -9.82063,2.938753 -2.28576,2.420761 -4.2076,4.48291 -6.10071,8.965055 -0.77427,2.886517 -1.94845,6.467179 -1.78557,11.345817 z";

const NECK_PATH =
  "m 65.160583,28.42034 v 9.485846 L 151.90957,36.232213 V 30.28031 Z";

const HEADSTOCK_PATH =
  "m 151.67165,30.190546 v 6.155124 c 2.5152,-0.365838 4.06336,1.20241 5.47122,3.05126 8.10252,-3.026113 13.41843,-2.49155 19.09667,-2.419964 1.38476,-0.930561 1.87146,-3.657262 1.9991,-7.102065 -6.46876,-0.246972 -12.93316,-0.459073 -19.67535,-2.893436 -1.41896,1.54874 -2.49719,3.283332 -6.89164,3.209081 z";

const PEG_PATHS = [
  "m 161.22219,23.175225 c 0.64573,-0.150565 1.50172,-0.698307 1.93437,-0.446392 0.31859,0.200346 0.29924,0.631918 0.1488,1.153181 -1.05706,0.838542 -1.44754,1.877062 -1.26478,3.08755 l 0.0372,1.413576 -0.89279,0.148799 -0.1116,-1.562375 c -0.6532,-2.023489 -1.39708,-2.112555 -2.12036,-2.641157 -0.31796,-0.337666 -0.39928,-0.691652 0,-1.078783 z",
  "m 171.04094,24.641144 c 0.65369,-0.11104 1.54139,-0.605744 1.95793,-0.327999 0.30582,0.219339 0.26028,0.648937 0.0784,1.160093 -1.10607,0.772746 -1.55895,1.785613 -1.45009,3.004971 l -0.0488,1.413224 -0.90018,0.09426 -0.0164,-1.566269 c -0.529,-2.059449 -1.2661,-2.193562 -1.95591,-2.765146 -0.29685,-0.356367 -0.35651,-0.714641 0.0656,-1.076789 z",
  "m 167.89997,42.102505 c -0.66304,0.0034 -1.61931,0.347337 -1.98521,0.0056 -0.26613,-0.2661 -0.15136,-0.682601 0.11108,-1.157423 1.21689,-0.582828 1.82827,-1.508685 1.91891,-2.729533 l 0.2777,-1.386531 0.90354,0.0532 -0.23823,1.548135 c 0.18742,2.118029 0.89301,2.37008 1.48082,3.046116 0.23502,0.399852 0.2357,0.763058 -0.23963,1.051835 z",
  "m 159.38131,43.62768 c -0.66304,0.0034 -1.61931,0.347337 -1.98521,0.0056 -0.26613,-0.2661 -0.15136,-0.682601 0.11108,-1.157423 1.21689,-0.582828 1.82827,-1.508685 1.91891,-2.729533 l 0.2777,-1.386531 0.90354,0.0532 -0.23823,1.548135 c 0.18742,2.118029 0.89301,2.37008 1.48082,3.046116 0.23502,0.399852 0.2357,0.763058 -0.23963,1.051835 z",
];

type VoiceHandle = {
  stop: (fade?: number) => void;
  onEnded?: () => void;
};

const TUNING = [
  { midi: 28, name: "E1", width: 4.6 },
  { midi: 33, name: "A1", width: 4 },
  { midi: 38, name: "D2", width: 3.4 },
  { midi: 43, name: "G2", width: 2.8 },
];

const SADDLE_X = 93.19;
const NUT_X = 1279.94;
const SCALE_LENGTH = NUT_X - SADDLE_X;
const MAX_FRET = 22;
const BODY_JOINT_X = 412.45;

const SADDLE_Y = [186.74, 216.99, 246.45, 275.64];
const NUT_Y = [214, 226, 238, 250];
const STRING_START_X = 60;

const FRET_X = Array.from({ length: MAX_FRET + 1 }, (_, fret) =>
  NUT_X - SCALE_LENGTH * (1 - Math.pow(2, -fret / 12)),
);

const PEGS = [
  { x: 1371, y: 154 },
  { x: 1469, y: 169 },
  { x: 1442, y: 296 },
  { x: 1357, y: 311 },
];

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const OPEN_STRINGS = [
  { label: "E", string: 0 },
  { label: "A", string: 1 },
  { label: "D", string: 2 },
  { label: "G", string: 3 },
];

const STRING_KEYS: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
};

const COPY = {
  volume: { en: "Volume", pt: "Volume" },
  drive: { en: "Distortion", pt: "Distorção" },
  nowPlaying: { en: "Now playing", pt: "Tocando agora" },
  openStrings: { en: "Open strings", pt: "Cordas soltas" },
  tuning: { en: "Standard tuning", pt: "Afinação padrão" },
  help: {
    en: "Click a string to pluck it, or click along the neck to add frets. Keys 1–4 pluck the open strings. Click the volume knob on the bass — or the Distortion button — for a heavy, fuzzy low end.",
    pt: "Clique numa corda para pulsá-la, ou clique ao longo do braço para adicionar casas. As teclas 1–4 tocam as cordas soltas. Clique no botão de volume do baixo — ou no botão Distorção — para um grave pesado e distorcido.",
  },
  hint: {
    en: "Audio starts after your first interaction, as browsers block sound until then.",
    pt: "O áudio começa após a sua primeira interação, pois os navegadores bloqueiam o som até lá.",
  },
};

const midiToName = (midi: number) =>
  `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;

const neckTopAt = (x: number) => {
  const t = (x - BODY_JOINT_X) / (NUT_X - BODY_JOINT_X);
  return 183.57 + t * (202.17 - 183.57);
};

const neckBottomAt = (x: number) => {
  const t = (x - BODY_JOINT_X) / (NUT_X - BODY_JOINT_X);
  return 278.43 + t * (261.69 - 278.43);
};

const stringYAt = (index: number, x: number) => {
  const t = (x - SADDLE_X) / (NUT_X - SADDLE_X);
  return SADDLE_Y[index] + (NUT_Y[index] - SADDLE_Y[index]) * t;
};

const upperStringPath = (index: number) => {
  const peg = PEGS[index];
  return `M ${STRING_START_X} ${SADDLE_Y[index]} L ${SADDLE_X} ${SADDLE_Y[index]} L ${NUT_X} ${NUT_Y[index]} L ${peg.x} ${peg.y+45}`;
};

const lowerStringPath = (index: number) => {
  const peg = PEGS[index];
  return `M ${STRING_START_X} ${SADDLE_Y[index]} L ${SADDLE_X} ${SADDLE_Y[index]} L ${NUT_X} ${NUT_Y[index]} L ${peg.x} ${peg.y-45}`;
};

const fretForX = (x: number) => {
  if (x < BODY_JOINT_X || x >= NUT_X) return 0;

  for (let fret = 1; fret <= MAX_FRET; fret += 1) {
    if (x >= FRET_X[fret]) return fret;
  }

  return MAX_FRET;
};

export function Bass() {
  const { t } = useLanguage();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const volumeRef = useRef(0.75);
  const driveRef = useRef(false);
  const flashTimersRef = useRef(new Map<number, number>());
  const voicesRef = useRef(new Map<number, VoiceHandle>());

  const [volume, setVolume] = useState(0.75);
  const [drive, setDrive] = useState(false);
  const [plucked, setPlucked] = useState<Set<number>>(new Set());
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const ensureContext = useCallback(() => {
    if (!contextRef.current) {
      const AudioCtor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioCtor) return null;

      const context = new AudioCtor();
      const master = context.createGain();
      master.gain.value = volumeRef.current;

      const compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 20;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.2;

      master.connect(compressor);
      compressor.connect(context.destination);

      contextRef.current = context;
      masterRef.current = master;
    }

    if (contextRef.current.state === "suspended") {
      void contextRef.current.resume();
    }

    return contextRef.current;
  }, []);

  const toggleDrive = useCallback(() => {
    const next = !driveRef.current;
    driveRef.current = next;
    setDrive(next);
    ensureContext();
  }, [ensureContext]);

  const playNote = useCallback(
    (midi: number, velocity = 0.75, delay = 0) => {
      const context = ensureContext();
      const master = masterRef.current;
      if (!context || !master) return null;

      setHasStarted(true);

      const heavy = driveRef.current;
      const source = context.createBufferSource();
      source.buffer = createPluckBuffer(
        context,
        midiToFrequency(midi),
        heavy ? 2 : 1.35,
      );

      const nodes: AudioNode[] = [source];

      const highpass = context.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = heavy ? 45 : 30;
      highpass.Q.value = heavy ? 0.8 : 0.55;
      nodes.push(highpass);

      source.connect(highpass);

      let last: AudioNode = highpass;

      if (heavy) {
        const preGain = context.createGain();
        preGain.gain.value = 40;
        const shaper = context.createWaveShaper();
        shaper.curve = createDistortionCurve(5);
        shaper.oversample = "4x";
        highpass.connect(preGain);
        preGain.connect(shaper);
        nodes.push(preGain, shaper);

        const driveGain = context.createGain();
        driveGain.gain.value = 8;
        const secondStage = context.createWaveShaper();
        secondStage.curve = createAsymmetricDistortionCurve(3, 0.22);
        secondStage.oversample = "4x";
        shaper.connect(driveGain);
        driveGain.connect(secondStage);
        nodes.push(driveGain, secondStage);

        const dcBlock = context.createBiquadFilter();
        dcBlock.type = "highpass";
        dcBlock.frequency.value = 30;
        secondStage.connect(dcBlock);
        nodes.push(dcBlock);

        const tone = context.createBiquadFilter();
        tone.type = "lowpass";
        tone.frequency.value = 3200;
        tone.Q.value = 1.2;
        dcBlock.connect(tone);
        nodes.push(tone);

        const chunk = context.createBiquadFilter();
        chunk.type = "peaking";
        chunk.frequency.value = 120;
        chunk.Q.value = 1;
        chunk.gain.value = 7;
        tone.connect(chunk);
        nodes.push(chunk);

        const presence = context.createBiquadFilter();
        presence.type = "peaking";
        presence.frequency.value = 900;
        presence.Q.value = 1.1;
        presence.gain.value = 4;
        chunk.connect(presence);
        nodes.push(presence);

        last = presence;
      } else {
        // Jazz voice: no clipper, a slower attack to remove the pick click,
        // and a warm low shelf with the highs rolled off.
        const attack = context.createGain();
        const now = context.currentTime;
        attack.gain.setValueAtTime(0, now);
        attack.gain.linearRampToValueAtTime(1, now + 0.035);
        highpass.connect(attack);
        nodes.push(attack);

        const lowShelf = context.createBiquadFilter();
        lowShelf.type = "lowshelf";
        lowShelf.frequency.value = 120;
        lowShelf.gain.value = 4;
        attack.connect(lowShelf);
        nodes.push(lowShelf);

        const body = context.createBiquadFilter();
        body.type = "peaking";
        body.frequency.value = 380;
        body.Q.value = 0.9;
        body.gain.value = 2;
        lowShelf.connect(body);
        nodes.push(body);

        const tone = context.createBiquadFilter();
        tone.type = "lowpass";
        tone.frequency.value = 2600;
        tone.Q.value = 0.55;
        body.connect(tone);
        nodes.push(tone);

        last = tone;
      }

      const gain = context.createGain();
      gain.gain.value = (heavy ? 0.18 : 0.7) * velocity;
      last.connect(gain);
      gain.connect(master);
      nodes.push(gain);

      let stopped = false;

      const voice: VoiceHandle = {
        stop: (fade = 0.06) => {
          if (stopped) return;
          stopped = true;

          const now = context.currentTime;
          const level = gain.gain;

          level.cancelScheduledValues(now);
          level.setValueAtTime(Math.max(level.value, 0.0001), now);
          level.exponentialRampToValueAtTime(0.0001, now + fade);

          try {
            source.stop(now + fade + 0.02);
          } catch {
            // The source may already have ended.
          }
        },
      };

      source.start(context.currentTime + delay);
      source.onended = () => {
        stopped = true;
        nodes.forEach((node) => node.disconnect());
        voice.onEnded?.();
      };

      return voice;
    },
    [ensureContext],
  );

  const flashString = useCallback((index: number) => {
    setPlucked((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });

    const existing = flashTimersRef.current.get(index);
    if (existing) window.clearTimeout(existing);

    const timer = window.setTimeout(() => {
      setPlucked((current) => {
        if (!current.has(index)) return current;
        const next = new Set(current);
        next.delete(index);
        return next;
      });
      flashTimersRef.current.delete(index);
    }, 220);

    flashTimersRef.current.set(index, timer);
  }, []);

  const pluckString = useCallback(
    (stringIndex: number, fret: number, delay = 0, velocity = 0.75) => {
      const previous = voicesRef.current.get(stringIndex);
      if (previous) {
        previous.stop();
        voicesRef.current.delete(stringIndex);
      }

      const safeFret = Math.min(MAX_FRET, Math.max(0, fret));
      const voice = playNote(
        TUNING[stringIndex].midi + safeFret,
        velocity,
        delay,
      );

      if (voice) {
        voice.onEnded = () => {
          if (voicesRef.current.get(stringIndex) === voice) {
            voicesRef.current.delete(stringIndex);
          }
        };
        voicesRef.current.set(stringIndex, voice);
      }

      if (delay > 0) {
        const timer = window.setTimeout(
          () => flashString(stringIndex),
          delay * 1000,
        );
      } else {
        flashString(stringIndex);
      }

      return midiToName(TUNING[stringIndex].midi + safeFret);
    },
    [playNote, flashString],
  );

  const pluckAtPointer = useCallback(
    (stringIndex: number, clientX: number) => {
      const svg = svgRef.current;
      if (!svg) return;

      const bounds = svg.getBoundingClientRect();
      const x =
        VIEWBOX_X +
        ((clientX - bounds.left) / bounds.width) * VIEWBOX_WIDTH;
      const fret = fretForX(x);

      const note = pluckString(stringIndex, fret);
      setLastPlayed(note);
    },
    [pluckString],
  );

  useEffect(() => {
    volumeRef.current = volume;
    const master = masterRef.current;
    const context = contextRef.current;
    if (master && context) {
      master.gain.setTargetAtTime(volume, context.currentTime, 0.02);
    }
  }, [volume]);

  useEffect(() => {
    const isEditable = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditable(event.target)
      ) {
        return;
      }

      const stringIndex = STRING_KEYS[event.key.toLowerCase()];
      if (stringIndex === undefined) return;

      event.preventDefault();
      setLastPlayed(pluckString(stringIndex, 0));
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pluckString]);

  useEffect(() => {
    const flashTimers = flashTimersRef.current;

    return () => {
      flashTimers.forEach((timer) => window.clearTimeout(timer));
      flashTimers.clear();

      const context = contextRef.current;
      if (!context) return;
      void context.close();
      contextRef.current = null;
    };
  }, []);

  return (
    <div className="surface overflow-hidden rounded-3xl">
      <div className="flex flex-col gap-4 border-b border-[var(--border-color)] p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--font-muted)]">{t(COPY.nowPlaying)}</span>
          <span className="min-w-[3.5rem] rounded-full border border-[var(--border-color)] bg-[var(--layer-200)] px-3 py-1 text-center font-mono text-[var(--accent-2)]">
            {lastPlayed ?? "—"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-3 text-sm text-[var(--font-muted)]">
            <SpeakerHigh size={18} className="text-[var(--accent)]" />
            <span className="sr-only">{t(COPY.volume)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label={t(COPY.volume)}
              className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-[var(--layer-300)] accent-[var(--accent)]"
            />
          </label>

          <button
            type="button"
            onClick={toggleDrive}
            aria-pressed={drive}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
              drive
                ? "border-[var(--accent)] bg-[var(--accent-transparent)] text-white"
                : "border-[var(--border-color)] text-[var(--font-muted)] hover:border-[var(--accent)] hover:text-[var(--font-color)]",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                drive ? "bg-[var(--accent)]" : "bg-[var(--layer-300)]",
              )}
            />
            {t(COPY.drive)}
          </button>
        </div>
      </div>

      <div className="bg-[radial-gradient(circle_at_50%_20%,var(--accent-transparent),transparent_65%)] bg-[var(--layer-200)] p-3 md:p-6">
        <svg
          ref={svgRef}
          viewBox={`${VIEWBOX_X} ${VIEWBOX_Y} ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          role="img"
          aria-label={t({
            en: "A four-string bass. Click the strings to play.",
            pt: "Um baixo de quatro cordas. Clique nas cordas para tocar.",
          })}
          className="block h-auto w-full select-none touch-none"
        >
          <defs>
            <linearGradient id="bass-body" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0%" stopColor="hsl(46, 90%, 50%)" />
              <stop offset="100%" stopColor="hsl(46, 90%, 45%)" />
            </linearGradient>
            <linearGradient id="bass-headstock" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0%" stopColor="#222" />
              <stop offset="100%" stopColor="#333" />
            </linearGradient>
            <radialGradient id="bass-sheen" cx="28%" cy="18%" r="80%">
              <stop offset="0%" stopColor="#d8fff2" stopOpacity="0.45" />
              <stop offset="55%" stopColor="#d8fff2" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#d8fff2" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bass-neck" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a3a18" />
              <stop offset="50%" stopColor="#5a240e" />
              <stop offset="100%" stopColor="#3b1406" />
            </linearGradient>
            <linearGradient id="bass-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a4f56" />
              <stop offset="50%" stopColor="#22262b" />
              <stop offset="100%" stopColor="#0d0f12" />
            </linearGradient>
            <linearGradient id="bass-steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0f3f6" />
              <stop offset="50%" stopColor="#bcc4cd" />
              <stop offset="100%" stopColor="#7b848e" />
            </linearGradient>
            <filter id="bass-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="5"
                floodColor="#000"
                floodOpacity="0.35"
              />
            </filter>
            <filter
              id="bass-string-glow"
              x="-50%"
              y="-300%"
              width="200%"
              height="700%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse
            cx="700"
            cy="466"
            rx="560"
            ry="18"
            fill="#000"
            opacity="0.28"
          />

          {/* Body, neck, headstock and hardware — reference.svg */}
          <g filter="url(#bass-shadow)">
            <g transform="scale(10) translate(-23.915711,-10.063429)">
              <path
                d={BODY_PATH}
                fill="url(#bass-body)"
              />
              <path d={BODY_PATH} fill="url(#bass-sheen)" />
              <path
                d={BODY_PATH}
                fill="none"
                stroke="#ddd"
                strokeWidth="0.4"
              />

              {/* Bridge plate and saddles */}
              <rect
                x="28.881733"
                y="26.935242"
                width="7.9437919"
                height="12.888934"
                ry="0.96718436"
                fill="url(#bass-metal)"
                stroke="#07090b"
                strokeWidth="0.04"
              />
              {[
                { x: 32.301247, y: 27.408712 },
                { x: 32.537983, y: 30.433666 },
                { x: 32.774719, y: 33.379707 },
                { x: 32.985149, y: 36.299446 },
              ].map((saddle) => (
                <rect
                  key={`${saddle.x}-${saddle.y}`}
                  x={saddle.x}
                  y={saddle.y}
                  width="1.8675802"
                  height="2.6566987"
                  ry="0.48662311"
                  fill="url(#bass-steel)"
                  stroke="#4a5058"
                  strokeWidth="0.03"
                />
              ))}

              {/* Pickups */}
              <rect
                x="43.717159"
                y="25.777868"
                width="3.1564736"
                height="15.203682"
                ry="0.96718436"
                fill="#070707"
                stroke="#333333"
                strokeWidth="0.04"
              />
              <rect
                x="50.977047"
                y="25.777868"
                width="4.7873182"
                height="9.1537733"
                ry="0.96718436"
                fill="#070707"
                stroke="#333333"
                strokeWidth="0.04"
              />
              <rect
                x="55.711758"
                y="31.880384"
                width="4.7873182"
                height="9.1537733"
                ry="0.96718436"
                fill="#070707"
                stroke="#333333"
                strokeWidth="0.04"
              />

              {/* Neck */}
              <path
                d={NECK_PATH}
                fill="url(#bass-neck)"
                stroke="#2a0e04"
                strokeWidth="0.04"
              />

              {/* Headstock */}
              {PEG_PATHS.map((path, index) => (
                <path
                  key={`peg-${index}`}
                  d={path}
                  fill="#0b0b0b"
                  stroke="#000"
                  strokeWidth="0.02"
                />
              ))}
              <path
                d={HEADSTOCK_PATH}
                fill="url(#bass-headstock)"
                stroke="#ddd"
                strokeWidth="0.3"
              />
            </g>
          </g>

          {/* Pickup pole pieces */}
          {[
            { x: 214, yIndexes: [0, 1, 2, 3] },
            { x: 294, yIndexes: [0, 1] },
            { x: 341, yIndexes: [2, 3] },
          ].map((pickup) =>
            pickup.yIndexes.map((index) => (
              <circle
                key={`pole-${pickup.x}-${index}`}
                cx={pickup.x}
                cy={stringYAt(index, pickup.x)}
                r="4"
                fill="#8f979f"
              />
            )),
          )}

          {/* Frets */}
          {FRET_X.slice(1).map((x, index) => {
            const fret = index + 1;
            return (
              <line
                key={`fret-${fret}`}
                x1={x}
                x2={x}
                y1={neckTopAt(x) + 2}
                y2={neckBottomAt(x) - 2}
                stroke="#c9d0d8"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity="0.85"
              />
            );
          })}

          {/* Fret markers */}
          {[3, 5, 7, 9, 12, 15, 17, 19, 21].map((fret) => {
            const x = (FRET_X[fret] + FRET_X[fret - 1]) / 2;
            const center = (neckTopAt(x) + neckBottomAt(x)) / 2;

            if (fret === 12) {
              return (
                <g key={`marker-${fret}`}>
                  <circle
                    cx={x}
                    cy={center - 20}
                    r="3.4"
                    fill="#f2e7d0"
                    opacity="0.65"
                  />
                  <circle
                    cx={x}
                    cy={center + 20}
                    r="3.4"
                    fill="#f2e7d0"
                    opacity="0.65"
                  />
                </g>
              );
            }

            return (
              <circle
                key={`marker-${fret}`}
                cx={x}
                cy={center}
                r="3.8"
                fill="#f2e7d0"
                opacity="0.6"
              />
            );
          })}

          {/* Nut */}
          <rect
            x={NUT_X - 4}
            y={neckTopAt(NUT_X) - 1}
            width="8"
            height={neckBottomAt(NUT_X) - neckTopAt(NUT_X) + 2}
            rx="2"
            fill="#f6eedb"
            stroke="#b7a780"
            strokeWidth="1"
          />

          {/* Control knobs */}
          {[
            { cx: 70.34, cy: 344.27, interactive: true },
            { cx: 119.44, cy: 399.33, interactive: false },
            { cx: 190.87, cy: 398.95, interactive: false },
          ].map((knob) => (
            <g
              key={`knob-${knob.cx}-${knob.cy}`}
              filter="url(#bass-shadow)"
              role={knob.interactive ? "button" : undefined}
              tabIndex={knob.interactive ? 0 : undefined}
              aria-label={
                knob.interactive
                  ? t({
                      en: "Volume knob — toggle distortion",
                      pt: "Botão de volume — alternar distorção",
                    })
                  : undefined
              }
              aria-pressed={knob.interactive ? drive : undefined}
              className={knob.interactive ? "cursor-pointer outline-none" : ""}
              onClick={knob.interactive ? toggleDrive : undefined}
              onKeyDown={
                knob.interactive
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleDrive();
                      }
                    }
                  : undefined
              }
            >
              {knob.interactive && (
                <title>
                  {t({
                    en: "Click for distortion",
                    pt: "Clique para distorcer",
                  })}
                </title>
              )}
              {knob.interactive && drive && (
                <circle
                  cx={knob.cx}
                  cy={knob.cy}
                  r="23"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  opacity="0.9"
                />
              )}
              <circle
                cx={knob.cx}
                cy={knob.cy}
                r="16"
                fill="#171717"
                stroke={knob.interactive && drive ? "var(--accent)" : "#555"}
                strokeWidth={knob.interactive && drive ? "2.5" : "1.5"}
              />
              <line
                x1={knob.cx}
                y1={knob.cy}
                x2={knob.cx}
                y2={knob.cy - 10}
                stroke={
                  knob.interactive && drive ? "var(--accent)" : "#b9c0c7"
                }
                strokeWidth="2.2"
                strokeLinecap="round"
                transform={`rotate(${
                  knob.interactive && drive ? 35 : 0
                } ${knob.cx} ${knob.cy})`}
              />
            </g>
          ))}

          {/* Strings */}
          {TUNING.map((string, index) => {
            const active = plucked.has(index);
            const d = index < 2 ? upperStringPath(index) : lowerStringPath(index);

            return (
              <g key={`string-${index}`}>
                {active && (
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={string.width + 7}
                    strokeLinecap="round"
                    opacity="0.4"
                    filter="url(#bass-string-glow)"
                  />
                )}
                <path
                  d={d}
                  fill="none"
                  stroke={active ? "#fff2d0" : "#e8e3d8"}
                  strokeWidth={string.width + 1.8}
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <path
                  d={d}
                  fill="none"
                  stroke={active ? "#1c1c1c" : "#3e4a45"}
                  strokeWidth={string.width}
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </g>
            );
          })}

          {/* Invisible hit areas */}
          {TUNING.map((string, index) => (
            <path
              key={`hit-${index}`}
              d={upperStringPath(index)}
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              pointerEvents="stroke"
              className="cursor-pointer"
              aria-label={string.name}
              onPointerDown={(event) => {
                event.preventDefault();
                pluckAtPointer(index, event.clientX);
              }}
              onPointerEnter={(event) => {
                if (event.buttons === 1) pluckAtPointer(index, event.clientX);
              }}
            />
          ))}
        </svg>
      </div>

      <div className="border-t border-[var(--border-color)] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 font-display text-xs uppercase tracking-[0.22em] text-[var(--font-muted)]">
              {t(COPY.openStrings)}
            </p>
            <div className="flex flex-wrap gap-2">
              {OPEN_STRINGS.map(({ label, string }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setLastPlayed(pluckString(string, 0));
                  }}
                  className="group flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--layer-200)] px-4 py-1.5 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <span className="font-semibold">{label}</span>
                  <kbd className="rounded border border-[var(--border-color)] px-1 font-mono text-[0.6rem] uppercase text-[var(--font-muted)]">
                    {string + 1}
                  </kbd>
                </button>
              ))}
            </div>
          </div>

          <div className="text-right text-xs text-[var(--font-muted)]">
            <p className="mb-1">
              <span className="text-[var(--font-color)]">
                {t(COPY.tuning)}:
              </span>{" "}
              <span className="font-mono tracking-wider">E A D G</span>
            </p>
            <p className="mb-0">
              <span className="text-[var(--font-color)]">1–4</span>{" "}
              {t({ en: "open strings", pt: "cordas soltas" })}
            </p>
          </div>
        </div>

        <p className="mb-0 mt-5 text-xs leading-relaxed text-[var(--font-muted)]">
          {t(COPY.help)}
        </p>

        {!hasStarted && (
          <p className="mb-0 mt-2 text-xs text-[var(--accent-2)]">
            {t(COPY.hint)}
          </p>
        )}
      </div>
    </div>
  );
}
