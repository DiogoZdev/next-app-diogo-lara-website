"use client";

import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SpeakerHigh } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createAsymmetricDistortionCurve, createDistortionCurve, createPluckBuffer, midiToFrequency } from "../audio";

const VIEWBOX_X = -10;
const VIEWBOX_Y = -12;
const VIEWBOX_WIDTH = 1340;
const VIEWBOX_HEIGHT = 464;

const BODY_PATH =
  "m 96.146053,95.785499 c 0,0 0.73805,-5.986461 -6.56515,-6.574173 -5.34151,-0.429847 -8.63774,3.789053 -14.14325,3.789051 -3.87338,-10e-7 -10.98911,-6.133267 -20.59725,-6.117204 -6.91297,0.01156 -11.77151,3.731797 -11.77151,21.332227 0,13.39178 1.73142,21.18713 12.03565,21.48473 7.29411,0.21067 17.52153,-6.23051 20.9459,-6.13944 6.99348,0.186 8.49049,3.41551 12.91722,3.37831 3.12463,-0.0263 4.63664,-0.56634 4.43991,-3.74033 -0.23247,-3.75071 -7.38168,-2.6497 -6.75869,-7.74876 0.29751,-2.43509 1.26259,-3.55104 1.26259,-3.55104 h 4.97145 v -7.78596 c 0,0 3.60652,-5.528247 3.26313,-8.327411 z";

const SHIELD_PATH =
  "m 69.727273,97.590844 v 27.081166 c 1.28841,-1.03975 4.46111,-2.02204 7.92347,-1.97157 4.58021,0.0668 7.41217,3.38514 11.8294,3.38514 1.8155,0 3.17914,-0.0912 3.16196,-2.64116 -0.0213,-3.15805 -6.39233,-1.93724 -6.7331,-7.32827 -0.096,-1.51846 1.15319,-4.16633 1.15319,-4.16633 l 0.22319,-7.58868 4.68713,-0.0744 c -2.74329,-4.434454 -6.93142,-5.79861 -11.23422,-6.919091 -3.33439,-0.709485 -7.08367,-0.450888 -11.01102,0.223195 z";

const NECK_PATH =
  "m 86.764583,104.06491 c -0.90267,2.19591 -1.12376,4.70163 0.1488,7.88628 l 64.875757,-1.63678 v -5.50551 z";

const HEADSTOCK_PATH =
  "m 151.63157,104.75385 0.10521,5.62904 c 3.49419,0.42879 6.48009,0.85604 9.83769,2.10432 l 6.20773,-1.20998 c -0.0694,0.99297 1.27488,2.26214 2.99865,2.26214 1.47847,0 2.62049,-0.86672 2.683,-2.15693 0.0613,-1.26427 0.40003,-2.3801 -2.36736,-3.20908 l -17.15017,-5.20818 c -0.6662,0.61964 -0.52479,1.41875 -2.31475,1.78867 z";

type VoiceHandle = {
  stop: (fade?: number) => void;
  onEnded?: () => void;
};

const TUNING = [
  { midi: 40, name: "E2", width: 3.2 },
  { midi: 45, name: "A2", width: 2.8 },
  { midi: 50, name: "D3", width: 2.4 },
  { midi: 55, name: "G3", width: 2 },
  { midi: 59, name: "B3", width: 1.6 },
  { midi: 64, name: "E4", width: 1.2 },
];

const SADDLE_X = 167;
const NUT_X = 1085;
const SCALE_LENGTH = 918;
const MAX_FRET = 21;
const BODY_JOINT_X = 426;

const SADDLE_Y = [172.5, 189.5, 206.5, 223.5, 240.5, 257.5];
const NUT_Y = [185, 195, 205, 215, 225, 235];

const STRING_START_X = 130;

const FRET_X = Array.from({ length: MAX_FRET + 1 }, (_, fret) =>
  NUT_X - SCALE_LENGTH * (1 - Math.pow(2, -fret / 12)),
);

const PEGS = [
  { x: 1130, y: 190 },
  { x: 1160, y: 200 },
  { x: 1190, y: 210 },
  { x: 1220, y: 220 },
  { x: 1250, y: 230 },
  { x: 1280, y: 240 },
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

const CHORDS: Array<{ name: string; key: string; frets: number[] }> = [
  { name: "A",  key: "a", frets: [-1, 0, 2, 2, 2, 0] },
  { name: "Am", key: "s", frets: [-1, 0, 2, 2, 1, 0] },
  { name: "B",  key: "b", frets: [2, 2, 4, 4, 4, 2] },
  { name: "Bm", key: "n", frets: [2, 2, 4, 4, 3, 2] },
  { name: "C",  key: "c", frets: [-1, 3, 2, 0, 1, 0] },
  { name: "Cm", key: "v", frets: [-1, 1, 3, 3, 2, 1] },
  { name: "D",  key: "d", frets: [-1, -1, 0, 2, 3, 2] },
  { name: "Dm", key: "x", frets: [-1, -1, 0, 2, 3, 1] },
  { name: "E",  key: "e", frets: [0, 2, 2, 1, 0, 0] },
  { name: "Em", key: "r", frets: [0, 2, 2, 0, 0, 0] },
  { name: "F",  key: "f", frets: [1, 3, 3, 2, 1, 1] },
  { name: "Fm", key: "t", frets: [1, 3, 3, 1, 1, 1] },
  { name: "G",  key: "g", frets: [3, 5, 5, 4, 3, 3] },
  { name: "Gm", key: "h", frets: [3, 5, 5, 3, 3, 3] },
];

const STRING_KEYS: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
};

const COPY = {
  volume: { en: "Volume", pt: "Volume" },
  drive: { en: "Distortion", pt: "Distorção" },
  nowPlaying: { en: "Now playing", pt: "Tocando agora" },
  chords: { en: "Strum a chord", pt: "Toque um acorde" },
  tuning: { en: "Standard tuning", pt: "Afinação padrão" },
  help: {
    en: "Click a string to pluck it, or click along the neck to add frets. Keys 1–6 pluck the open strings; E A D G C M N strum chords. Click the volume knob on the guitar — or the Distortion button — for a heavy, fuzzy overdrive.",
    pt: "Clique numa corda para pulsá-la, ou clique ao longo do braço para adicionar casas. As teclas 1–6 tocam as cordas soltas; E A D G C M N tocam acordes. Clique no botão de volume da guitarra — ou no botão Distorção — para um overdrive pesado e ruidoso.",
  },
  hint: {
    en: "Audio starts after your first interaction, as browsers block sound until then.",
    pt: "O áudio começa após a sua primeira interação, pois os navegadores bloqueiam o som até lá.",
  },
};


const midiToName = (midi: number) =>
  `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;

const neckTopAt = (x: number) => {
  const t = (x - 426) / (NUT_X - 426);
  return 175 + t * (182.44 - 175);
};

const neckBottomAt = (x: number) => {
  const t = (x - 426) / (NUT_X - 426);
  return 253.86 + t * (237.495 - 253.86);
};

const stringYAt = (index: number, x: number) => {
  const t = (x - SADDLE_X) / (NUT_X - SADDLE_X);
  return SADDLE_Y[index] + (NUT_Y[index] - SADDLE_Y[index]) * t;
};

const stringPath = (index: number) => {
  const peg = PEGS[index];
  return `M ${STRING_START_X} ${SADDLE_Y[index]} L ${SADDLE_X} ${SADDLE_Y[index]} L ${NUT_X} ${NUT_Y[index]} L ${peg.x} ${peg.y}`;
};

const fretForX = (x: number) => {
  if (x < BODY_JOINT_X || x >= NUT_X) return 0;

  for (let fret = 1; fret <= MAX_FRET; fret += 1) {
    if (x >= FRET_X[fret]) return fret;
  }

  return MAX_FRET;
};

export function Guitar() {
  const { t } = useLanguage();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const volumeRef = useRef(0.75);
  const driveRef = useRef(false);
  const flashTimersRef = useRef(new Map<number, number>());
  const delayedTimersRef = useRef<number[]>([]);
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
      compressor.knee.value = 24;
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
      if (!context || !master) return;

      setHasStarted(true);

      const heavy = driveRef.current;

      const source = context.createBufferSource();
      source.buffer = createPluckBuffer(
        context,
        midiToFrequency(midi),
        heavy ? 1.5 : 1,
      );

      const nodes: AudioNode[] = [source];

      const highpass = context.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = heavy ? 100 : 70;
      highpass.Q.value = heavy ? 0.9 : 0.7;
      nodes.push(highpass);

      const preGain = context.createGain();
      preGain.gain.value = heavy ? 40 : 1;
      nodes.push(preGain);

      const shaper = context.createWaveShaper();
      shaper.curve = createDistortionCurve(heavy ? 5 : 2);
      shaper.oversample = "4x";
      nodes.push(shaper);

      source.connect(highpass);
      highpass.connect(preGain);
      preGain.connect(shaper);

      let last: AudioNode = shaper;

      if (heavy) {
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
        dcBlock.frequency.value = 40;
        secondStage.connect(dcBlock);
        nodes.push(dcBlock);

        const tone = context.createBiquadFilter();
        tone.type = "lowpass";
        tone.frequency.value = 4200;
        tone.Q.value = 1.3;
        dcBlock.connect(tone);
        nodes.push(tone);

        const chunk = context.createBiquadFilter();
        chunk.type = "peaking";
        chunk.frequency.value = 220;
        chunk.Q.value = 1;
        chunk.gain.value = 6;
        tone.connect(chunk);
        nodes.push(chunk);

        const presence = context.createBiquadFilter();
        presence.type = "peaking";
        presence.frequency.value = 1200;
        presence.Q.value = 1.1;
        presence.gain.value = 5;
        chunk.connect(presence);
        nodes.push(presence);

        last = presence;
      } else {
        const tone = context.createBiquadFilter();
        tone.type = "lowpass";
        tone.frequency.value = 4600;
        tone.Q.value = 0.7;
        shaper.connect(tone);
        nodes.push(tone);

        last = tone;
      }

      const gain = context.createGain();
      gain.gain.value = (heavy ? 0.16 : 0.75) * velocity;
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
      // Retriggering the same string should replace its previous note, not
      // stack a second one on top of it.
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
        delayedTimersRef.current.push(timer);
      } else {
        flashString(stringIndex);
      }

      return midiToName(TUNING[stringIndex].midi + safeFret);
    },
    [playNote, flashString],
  );

  const stopAllVoices = useCallback(() => {
    voicesRef.current.forEach((voice) => voice.stop());
    voicesRef.current.clear();

    // Cancel any chord notes that were still waiting to be strummed.
    delayedTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    delayedTimersRef.current = [];
  }, []);

  const strumChord = useCallback(
    (chord: (typeof CHORDS)[number]) => {
      ensureContext();
      stopAllVoices();

      let order = 0;
      chord.frets.forEach((fret, stringIndex) => {
        if (fret < 0) return;
        pluckString(stringIndex, fret, order * 0.055, 0.55);
        order += 1;
      });

      setLastPlayed(chord.name);
    },
    [ensureContext, pluckString, stopAllVoices],
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

      const key = event.key.toLowerCase();

      const stringIndex = STRING_KEYS[key];
      if (stringIndex !== undefined) {
        event.preventDefault();
        setLastPlayed(pluckString(stringIndex, 0));
        return;
      }

      const chord = CHORDS.find((candidate) => candidate.key === key);
      if (chord) {
        event.preventDefault();
        strumChord(chord);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pluckString, strumChord]);

  useEffect(() => {
    const flashTimers = flashTimersRef.current;
    const delayedTimers = delayedTimersRef.current;

    return () => {
      flashTimers.forEach((timer) => window.clearTimeout(timer));
      flashTimers.clear();
      delayedTimers.forEach((timer) => window.clearTimeout(timer));

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
            en: "A Telecaster electric guitar. Click the strings to play.",
            pt: "Uma guitarra elétrica Telecaster. Clique nas cordas para tocar.",
          })}
          className="block h-auto w-full select-none touch-none"
        >
          <defs>
            <linearGradient id="tele-body" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f4f2ed" />
              <stop offset="100%" stopColor="#d9d5cc" />
            </linearGradient>
            <radialGradient id="tele-sheen" cx="30%" cy="16%" r="78%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="tele-shield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#242424" />
              <stop offset="100%" stopColor="#070707" />
            </linearGradient>
            <linearGradient id="tele-headstock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#584732" />
              <stop offset="55%" stopColor="#413323" />
              <stop offset="100%" stopColor="#30261a" />
            </linearGradient>
            <linearGradient id="tele-neck" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2d7a6" />
              <stop offset="55%" stopColor="#e2bd82" />
              <stop offset="100%" stopColor="#bf8f51" />
            </linearGradient>
            <linearGradient id="tele-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eef1f4" />
              <stop offset="45%" stopColor="#c3c8cf" />
              <stop offset="100%" stopColor="#8e959e" />
            </linearGradient>
            <linearGradient id="tele-bridge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111" />
              <stop offset="50%" stopColor="#333" />
              <stop offset="100%" stopColor="#555" />
            </linearGradient>
            <filter id="tele-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="5"
                floodColor="#000"
                floodOpacity="0.35"
              />
            </filter>
            <filter
              id="string-glow"
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
            cx="560"
            cy="404"
            rx="470"
            ry="18"
            fill="#000"
            opacity="0.28"
          />

          {/* Body */}
          <g filter="url(#tele-shadow)">
            <g transform="scale(10) translate(-43.068892,-86.883139)">
              <path
                d={BODY_PATH}
                fill="url(#tele-body)"
                stroke="#a8a49b"
                strokeWidth="0.09"
              />
              <path d={BODY_PATH} fill="url(#tele-sheen)" />
              <path
                d={BODY_PATH}
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.7"
                strokeWidth="0.03"
              />
            </g>
          </g>

          {/* Pickguard */}
          <g filter="url(#tele-shadow)">
            <g transform="scale(10) translate(26.5,10) translate(-69.72727,-96.945027)">
              <path
                d={SHIELD_PATH}
                fill="url(#tele-shield)"
                stroke="#000000"
                strokeWidth="0.06"
              />
              <path
                d={SHIELD_PATH}
                fill="none"
                stroke="#5c5c5c"
                strokeOpacity="0.55"
                strokeWidth="0.02"
              />
            </g>
          </g>

          {/* Neck and headstock */}
          <g filter="url(#tele-shadow)">
            <g transform="scale(10) translate(43,17.5) translate(-86.023044,-104.06491)">
              <path
                d={NECK_PATH}
                fill="url(#tele-headstock)"
                stroke="#41301d"
                strokeWidth="0.04"
              />
            </g>
          </g>
          <g filter="url(#tele-shadow)">
            <g transform="scale(10) translate(108.55,16.45) translate(-151.63158,-102.96518)">
              <path
                d={HEADSTOCK_PATH}
                fill="url(#tele-neck)"
                stroke="#8a5f2d"
                strokeWidth="0.04"
              />
            </g>
          </g>

          {/* Frets */}
          {FRET_X.slice(1).map((x, index) => {
            const fret = index + 1;
            const top = neckTopAt(x) + 1.2;
            const bottom = neckBottomAt(x) - 1.2;

            return (
              <line
                key={`fret-${fret}`}
                x1={x}
                x2={x}
                y1={top}
                y2={bottom}
                stroke="#c7ced6"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.9"
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
                    cy={center - 18.5}
                    r="3"
                    fill="#fff"
                    opacity="0.65"
                  />
                  <circle
                    cx={x}
                    cy={center + 18.5}
                    r="3"
                    fill="#fff"
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
                r="3"
                fill="#fff"
                opacity="0.6"
              />
            );
          })}

          {/* Nut */}
          <rect
            x={NUT_X - 3.5}
            y={neckTopAt(NUT_X) - 1}
            width="7"
            height={neckBottomAt(NUT_X) - neckTopAt(NUT_X) + 2}
            rx="2"
            fill="#f6eedb"
            stroke="#b7a780"
            strokeWidth="1"
          />

          {/* Bridge and bridge pickup */}
          <g filter="url(#tele-shadow)">
            {/* Bridge */}
            <rect
              x="215"
              y="154"
              width="75"
              height="120"
              rx="5"
              fill="#333"
              stroke="#5f666f"
              strokeWidth="2"
            />

           
            <rect
              key={`saddle-${150}`}
              x={160}
              y={150}
              width="25"
              height="126"
              rx="5"
              fill="url(#tele-bridge)"
              stroke="#000"
              strokeWidth="1.5"
            />
          
            {/* Ferrules */}
            {SADDLE_Y.map((y) => (
              <circle
                key={`ferrule-${y}`}
                cx="132"
                cy={y}
                r="2.6"
                fill="#000"
                stroke="#222"
                strokeWidth="0.8"
              />
            ))}
            {/* Bridge Pickup */}
            <rect
              x="226"
              y="166"
              width="55"
              height="97"
              rx="4"
              fill="#141414"
              stroke="#4a4a4a"
              strokeWidth="1.5"
            />
          </g>

          {/* Neck pickup */}
          <g filter="url(#tele-shadow)">
            <rect
              x="370"
              y="170"
              width="45"
              height="88"
              rx="5"
              fill="#333"
              stroke="#4a4a4a"
              strokeWidth="1.5"
            />

            {/* Volume Knob — click to toggle the overdrive */}
            <g
              role="button"
              tabIndex={0}
              aria-label={t({
                en: "Volume knob — toggle distortion",
                pt: "Botão de volume — alternar distorção",
              })}
              aria-pressed={drive}
              className="cursor-pointer outline-none"
              onClick={toggleDrive}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleDrive();
                }
              }}
            >
              <title>
                {t({
                  en: "Click for distortion",
                  pt: "Clique para distorcer",
                })}
              </title>
              {drive && (
                <circle
                  cx={230}
                  cy={310}
                  r={24}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  opacity="0.85"
                />
              )}
              <circle
                cx={230}
                cy={310}
                r="17"
                fill="#222"
                stroke={drive ? "var(--accent)" : "#555"}
                strokeWidth={drive ? "2.5" : "1.5"}
              />
              <line
                x1={230}
                y1={310}
                x2={230}
                y2={296}
                stroke={drive ? "var(--accent)" : "#cfd5dc"}
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${drive ? 35 : 0} 230 310)`}
              />
              <circle
                cx={230}
                cy={310}
                r="5"
                fill="#111"
                stroke="#666"
                strokeWidth="1"
              />
            </g>
          </g>

          {PEGS.map((tuner, index) => (
            <g key={`tuner-${index}`}>
              <circle
                cx={tuner.x + 10}
                cy={tuner.y - 30}
                r="7.5"
                fill="url(#tele-metal)"
                stroke="#69707a"
                strokeWidth="1.2"
              />
            </g>
          ))}

          {/* Tuning pegs */}
          {PEGS.map((peg, index) => (
            <g key={`peg-${index}`}>
              <line
                x1={peg.x}
                y1={peg.y}
                x2={peg.x}
                y2={peg.y - 8}
                stroke="#9aa1aa"
                strokeWidth="2.5"
              />
              <circle
                cx={peg.x}
                cy={peg.y - 8}
                r="5.5"
                fill="url(#tele-metal)"
                stroke="#69707a"
                strokeWidth="1.2"
              />
            </g>
          ))}          

          {/* Strings */}
          {TUNING.map((string, index) => {
            const active = plucked.has(index);
            const d = stringPath(index);

            return (
              <g key={`string-${index}`}>
                {active && (
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={string.width + 6}
                    strokeLinecap="round"
                    opacity="0.4"
                    filter="url(#string-glow)"
                  />
                )}
                {/* Light halo keeps the strings visible over the black guard. */}
                <path
                  d={d}
                  fill="none"
                  stroke={active ? "#fff2d0" : "#e6e9ec"}
                  strokeWidth={string.width + 1.6}
                  strokeLinecap="round"
                  opacity="0.7"
                />
                {/* Dark core keeps them visible over the white body. */}
                <path
                  d={d}
                  fill="none"
                  stroke={active ? "#1c1c1c" : "#5f666d"}
                  strokeWidth={string.width}
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </g>
            );
          })}

          {/* Invisible hit areas that follow each string */}
          {TUNING.map((string, index) => (
            <path
              key={`hit-${index}`}
              d={stringPath(index)}
              fill="none"
              stroke="transparent"
              strokeWidth="13"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:justify-between">
          <div>
            <p className="mb-2 font-display text-xs uppercase tracking-[0.22em] text-[var(--font-muted)]">
              {t(COPY.chords)}
            </p>
            <div className="flex flex-wrap gap-2">
              {CHORDS.map((chord) => (
                <button
                  key={chord.name}
                  type="button"
                  onClick={() => strumChord(chord)}
                  className={cn(
                    "group flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--layer-200)] px-3.5 py-1.5 text-sm transition-colors",
                    "hover:border-[var(--accent)] hover:text-[var(--accent)]",
                  )}
                >
                  <span className="font-semibold">{chord.name}</span>
                  <kbd className="rounded border border-[var(--border-color)] px-1 font-mono text-[0.6rem] uppercase text-[var(--font-muted)]">
                    {chord.key}
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
              <span className="font-mono tracking-wider">E A D G B E</span>
            </p>
            <p className="mb-0">
              <span className="text-[var(--font-color)]">1–6</span>{" "}
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
