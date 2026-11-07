"use client";

import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ArrowCounterClockwise, SpeakerHigh } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

type NoteDef = {
  id: string;
  midi: number;
  key: string;
};

type BlackNoteDef = NoteDef & {
  /** Index of the white key this black key sits after. */
  after: number;
};

type Voice = {
  gain: GainNode;
  oscillators: OscillatorNode[];
  peak: number;
};

const WHITE_NOTES: NoteDef[] = [
  { id: "C4", midi: 60, key: "z" },
  { id: "D4", midi: 62, key: "x" },
  { id: "E4", midi: 64, key: "c" },
  { id: "F4", midi: 65, key: "v" },
  { id: "G4", midi: 67, key: "b" },
  { id: "A4", midi: 69, key: "n" },
  { id: "B4", midi: 71, key: "m" },
  { id: "C5", midi: 72, key: "q" },
  { id: "D5", midi: 74, key: "w" },
  { id: "E5", midi: 76, key: "e" },
  { id: "F5", midi: 77, key: "r" },
  { id: "G5", midi: 79, key: "t" },
  { id: "A5", midi: 81, key: "y" },
  { id: "B5", midi: 83, key: "u" },
  { id: "C6", midi: 84, key: "i" },
];

const BLACK_NOTES: BlackNoteDef[] = [
  { id: "C#4", midi: 61, key: "s", after: 0 },
  { id: "D#4", midi: 63, key: "d", after: 1 },
  { id: "F#4", midi: 66, key: "g", after: 3 },
  { id: "G#4", midi: 68, key: "h", after: 4 },
  { id: "A#4", midi: 70, key: "j", after: 5 },
  { id: "C#5", midi: 73, key: "2", after: 7 },
  { id: "D#5", midi: 75, key: "3", after: 8 },
  { id: "F#5", midi: 78, key: "5", after: 10 },
  { id: "G#5", midi: 80, key: "6", after: 11 },
  { id: "A#5", midi: 82, key: "7", after: 12 },
];

const WHITE_COUNT = WHITE_NOTES.length;
const WHITE_WIDTH_PCT = 100 / WHITE_COUNT;
const BLACK_WIDTH_PCT = WHITE_WIDTH_PCT * 0.62;

const KEY_MAP = [...WHITE_NOTES, ...BLACK_NOTES].reduce<Record<string, NoteDef>>(
  (map, note) => {
    map[note.key] = note;
    return map;
  },
  {},
);

const midiToFrequency = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

/**
 * Every note keeps decaying even while its key is held or the sustain pedal is
 * on, so nothing can ring forever. Releasing a key only shortens the tail.
 */
const NATURAL_DECAY = 6.5;

const noteLabel = (id: string) => id.replace("#", "♯").replace(/\d/, "");

const COPY = {
  volume: { en: "Volume", pt: "Volume" },
  octave: { en: "Octave", pt: "Oitava" },
  sustain: { en: "Sustain", pt: "Sustentar" },
  reset: { en: "Release all", pt: "Soltar tudo" },
  help: {
    en: "Play with your mouse, touch, or the computer keyboard. Press Space to toggle sustain.",
    pt: "Toque com o mouse, o dedo ou o teclado do computador. Pressione Espaço para ligar ou desligar o sustain.",
  },
  whiteKeys: { en: "White keys", pt: "Teclas brancas" },
  blackKeys: { en: "Black keys", pt: "Teclas pretas" },
  hint: {
    en: "A note will only sound after your first interaction, as browsers block audio until then.",
    pt: "O som só começa após a sua primeira interação, pois os navegadores bloqueiam áudio até lá.",
  },
};

export function Piano() {
  const { t } = useLanguage();

  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const voicesRef = useRef(new Map<string, Voice>());
  const sustainedRef = useRef(new Set<string>());
  const sustainRef = useRef(false);
  const octaveRef = useRef(0);
  const volumeRef = useRef(0.7);

  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [sustain, setSustain] = useState(false);
  const [octave, setOctave] = useState(0);
  const [volume, setVolume] = useState(0.7);
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
      compressor.threshold.value = -18;
      compressor.knee.value = 20;
      compressor.ratio.value = 6;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      master.connect(compressor);
      compressor.connect(context.destination);

      // Short decaying noise burst used as a hammer transient on each note.
      const length = Math.floor(context.sampleRate * 0.15);
      const buffer = context.createBuffer(1, length, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        const decay = Math.pow(1 - i / length, 6);
        data[i] = (Math.random() * 2 - 1) * decay;
      }

      contextRef.current = context;
      masterRef.current = master;
      noiseRef.current = buffer;
    }

    if (contextRef.current.state === "suspended") {
      void contextRef.current.resume();
    }

    return contextRef.current;
  }, []);

  const releaseVoice = useCallback((id: string, releaseTime = 0.32) => {
    const voice = voicesRef.current.get(id);
    const context = contextRef.current;
    if (!voice || !context) return;

    voicesRef.current.delete(id);

    const now = context.currentTime;
    const gain = voice.gain.gain;

    if (typeof gain.cancelAndHoldAtTime === "function") {
      gain.cancelAndHoldAtTime(now);
    } else {
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(Math.max(voice.peak * 0.3, 0.0001), now);
    }

    gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

    voice.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop(now + releaseTime + 0.05);
      } catch {
        // The oscillator may already have been stopped.
      }
    });
  }, []);

  const startVoice = useCallback(
    (note: NoteDef) => {
      const context = ensureContext();
      const master = masterRef.current;
      if (!context || !master) return;

      setHasStarted(true);

      // Retrigger cleanly if the note is still ringing from a previous hit.
      releaseVoice(note.id, 0.04);
      if (sustainedRef.current.has(note.id)) {
        sustainedRef.current.delete(note.id);
      }

      const now = context.currentTime;
      const frequency = midiToFrequency(note.midi + octaveRef.current * 12);
      const peak = 0.26;

      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 0.6;
      filter.frequency.setValueAtTime(
        Math.min(frequency * 10 + 1200, 14000),
        now,
      );
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(frequency * 3.2, 700),
        now + 1.8,
      );

      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(peak * 0.55, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(peak * 0.32, now + 0.9);
      gain.gain.exponentialRampToValueAtTime(peak * 0.16, now + 2.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + NATURAL_DECAY);

      filter.connect(gain);
      gain.connect(master);

      const partials = [
        { ratio: 1, level: 1, type: "triangle" as OscillatorType, detune: 0 },
        { ratio: 2.002, level: 0.34, type: "sine" as OscillatorType, detune: 3 },
        { ratio: 3.004, level: 0.16, type: "sine" as OscillatorType, detune: -4 },
        { ratio: 4.02, level: 0.07, type: "sine" as OscillatorType, detune: 2 },
      ];

      const oscillators: OscillatorNode[] = [];

      partials.forEach((partial) => {
        const oscillator = context.createOscillator();
        oscillator.type = partial.type;
        oscillator.frequency.value = frequency * partial.ratio;
        oscillator.detune.value = partial.detune;

        const partialGain = context.createGain();
        partialGain.gain.value = partial.level;

        oscillator.connect(partialGain);
        partialGain.connect(filter);
        oscillator.start(now);
        oscillator.stop(now + NATURAL_DECAY + 0.05);
        oscillators.push(oscillator);
      });

      const noise = context.createBufferSource();
      if (noiseRef.current) {
        noise.buffer = noiseRef.current;

        const noiseFilter = context.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.value = Math.min(frequency * 4, 9000);
        noiseFilter.Q.value = 1.1;

        const noiseGain = context.createGain();
        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);
        noise.start(now);
        noise.stop(now + 0.08);
      }

      voicesRef.current.set(note.id, { gain, oscillators, peak });
    },
    [ensureContext, releaseVoice],
  );

  const pressNote = useCallback(
    (id: string) => {
      const note = [...WHITE_NOTES, ...BLACK_NOTES].find(
        (candidate) => candidate.id === id,
      );
      if (!note) return;

      // A sustained note keeps ringing in the voices map. Retrigger it
      // instead of ignoring the new key press.
      if (sustainedRef.current.has(id)) {
        sustainedRef.current.delete(id);
        releaseVoice(id, 0.05);
      }

      if (voicesRef.current.has(id)) return;

      startVoice(note);
      setActiveNotes((current) => {
        const next = new Set(current);
        next.add(id);
        return next;
      });
    },
    [startVoice, releaseVoice],
  );

  const releaseNote = useCallback(
    (id: string) => {
      setActiveNotes((current) => {
        if (!current.has(id)) return current;
        const next = new Set(current);
        next.delete(id);
        return next;
      });

      if (sustainRef.current) {
        sustainedRef.current.add(id);
        return;
      }

      releaseVoice(id);
    },
    [releaseVoice],
  );

  const releaseAll = useCallback(() => {
    sustainedRef.current.clear();
    Array.from(voicesRef.current.keys()).forEach((id) => releaseVoice(id, 0.15));
    setActiveNotes(new Set());
  }, [releaseVoice]);

  const toggleSustain = useCallback(() => {
    const next = !sustainRef.current;
    sustainRef.current = next;
    setSustain(next);

    if (!next) {
      Array.from(sustainedRef.current).forEach((id) => releaseVoice(id));
      sustainedRef.current.clear();
    }
  }, [releaseVoice]);

  const shiftOctave = useCallback((direction: -1 | 1) => {
    const next = Math.min(2, Math.max(-2, octaveRef.current + direction));
    octaveRef.current = next;
    setOctave(next);
  }, []);

  const resetOctave = useCallback(() => {
    octaveRef.current = 0;
    setOctave(0);
  }, []);

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

      const note = KEY_MAP[event.key.toLowerCase()];
      if (!note) return;

      event.preventDefault();
      pressNote(note.id);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = KEY_MAP[event.key.toLowerCase()];
      if (!note) return;
      releaseNote(note.id);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseAll);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseAll);
    };
  }, [pressNote, releaseNote, releaseAll, toggleSustain]);

  useEffect(() => {
    const voices = voicesRef.current;

    return () => {
      const context = contextRef.current;
      if (!context) return;
      voices.clear();
      void context.close();
      contextRef.current = null;
    };
  }, []);

  return (
    <div className="surface overflow-hidden rounded-3xl">
      <div className="flex flex-col gap-4 border-b border-[var(--border-color)] p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
              className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-[var(--layer-300)] accent-[var(--accent)]"
            />
          </label>

          <div className="flex items-center gap-2 text-sm text-[var(--font-muted)]">
            <span>{t(COPY.octave)}</span>
            <div className="flex items-center overflow-hidden rounded-full border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => shiftOctave(-1)}
                disabled={octave <= -2}
                aria-label={t({ en: "Lower octave", pt: "Descer oitava" })}
                className="px-3 py-1 text-[var(--font-color)] transition-colors hover:bg-[var(--layer-200)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                −
              </button>
              <button
                type="button"
                onClick={resetOctave}
                aria-label={t({ en: "Reset octave", pt: "Restaurar oitava" })}
                className="min-w-[2.75rem] border-x border-[var(--border-color)] px-2 py-1 text-center text-xs tabular-nums text-[var(--font-color)] transition-colors hover:bg-[var(--layer-200)]"
              >
                {octave > 0 ? `+${octave}` : octave}
              </button>
              <button
                type="button"
                onClick={() => shiftOctave(1)}
                disabled={octave >= 2}
                aria-label={t({ en: "Raise octave", pt: "Subir oitava" })}
                className="px-3 py-1 text-[var(--font-color)] transition-colors hover:bg-[var(--layer-200)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSustain}
            aria-pressed={sustain}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              sustain
                ? "border-[var(--accent)] bg-[var(--accent-transparent)] text-white"
                : "border-[var(--border-color)] text-[var(--font-muted)] hover:border-[var(--accent)] hover:text-[var(--font-color)]",
            )}
          >
            {t(COPY.sustain)}
          </button>
          <button
            type="button"
            onClick={releaseAll}
            aria-label={t(COPY.reset)}
            title={t(COPY.reset)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--font-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <ArrowCounterClockwise size={17} />
          </button>
        </div>
      </div>

      <div className="bg-[var(--layer-200)] p-4 md:p-6">
        <div className="relative select-none touch-none" style={{ height: "clamp(180px, 34vw, 280px)" }}>
          <div className="flex h-full w-full">
            {WHITE_NOTES.map((note) => {
              const active = activeNotes.has(note.id);

              return (
                <button
                  key={note.id}
                  type="button"
                  aria-label={note.id}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    pressNote(note.id);
                  }}
                  onPointerUp={() => releaseNote(note.id)}
                  onPointerLeave={() => releaseNote(note.id)}
                  onPointerCancel={() => releaseNote(note.id)}
                  onPointerEnter={(event) => {
                    if (event.buttons === 1) pressNote(note.id);
                  }}
                  className={cn(
                    "relative flex-1 rounded-b-lg border border-black/25 text-[#3a342c] shadow-[inset_0_-6px_12px_rgba(0,0,0,0.14)] transition-[transform,background-color,box-shadow] duration-75",
                    active
                      ? "translate-y-[2px] bg-gradient-to-b from-[#ffd7e2] to-[#efa2b8] shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]"
                      : "bg-gradient-to-b from-[#faf7ef] to-[#ded6c5] hover:from-white hover:to-[#e7dfcf]",
                  )}
                >
                  <span className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-1.5 md:bottom-14">
                    <span className="font-display text-[0.65rem] font-semibold uppercase tracking-wide opacity-60">
                      {noteLabel(note.id)}
                    </span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded border border-black/15 bg-black/5 px-1 font-mono text-[0.6rem] uppercase">
                      {note.key}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {BLACK_NOTES.map((note) => {
            const active = activeNotes.has(note.id);
            const left = (note.after + 1) * WHITE_WIDTH_PCT - BLACK_WIDTH_PCT / 2;

            return (
              <button
                key={note.id}
                type="button"
                aria-label={note.id}
                onPointerDown={(event) => {
                  event.preventDefault();
                  pressNote(note.id);
                }}
                onPointerUp={() => releaseNote(note.id)}
                onPointerLeave={() => releaseNote(note.id)}
                onPointerCancel={() => releaseNote(note.id)}
                onPointerEnter={(event) => {
                  if (event.buttons === 1) pressNote(note.id);
                }}
                style={{
                  left: `${left}%`,
                  width: `${BLACK_WIDTH_PCT}%`,
                  height: "62%",
                }}
                className={cn(
                  "absolute top-0 z-10 flex items-end justify-center rounded-b-md border border-black/60 pb-2 shadow-[0_6px_10px_rgba(0,0,0,0.45)] transition-[transform,background-color] duration-75",
                  active
                    ? "translate-y-[2px] bg-gradient-to-b from-[var(--accent)] to-[hsl(340,60%,30%)]"
                    : "bg-gradient-to-b from-[#34343a] to-[#09090b] hover:from-[#45454c]",
                )}
              >
                <span className="flex h-5 min-w-5 items-center justify-center rounded border border-white/15 bg-white/10 px-1 font-mono text-[0.6rem] uppercase text-white/70">
                  {note.key}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-2 text-xs text-[var(--font-muted)] md:flex-row md:items-center md:justify-between">
          <p className="mb-0">{t(COPY.help)}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <span>
              <span className="text-[var(--font-color)]">{t(COPY.whiteKeys)}:</span>{" "}
              <span className="font-mono uppercase tracking-wider">z x c v b n m q w e r t y u i</span>
            </span>
            <span>
              <span className="text-[var(--font-color)]">{t(COPY.blackKeys)}:</span>{" "}
              <span className="font-mono uppercase tracking-wider">s d g h j 2 3 5 6 7</span>
            </span>
          </div>
        </div>

        {!hasStarted && (
          <p className="mb-0 mt-3 text-xs text-[var(--accent-2)]">{t(COPY.hint)}</p>
        )}
      </div>
    </div>
  );
}
