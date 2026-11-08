/**
 * Shared synthesis helpers for the Lab instruments. Everything is generated
 * from scratch — no samples or audio files.
 */

export const midiToFrequency = (midi: number) =>
  440 * Math.pow(2, (midi - 69) / 12);

/**
 * Karplus–Strong plucked-string synthesis: a burst of filtered noise is fed
 * through a delay line with a lossy feedback path. The result is rendered into
 * an AudioBuffer.
 */
export function createPluckBuffer(
  context: AudioContext,
  frequency: number,
  sustain = 1,
) {
  const sampleRate = context.sampleRate;
  const length = Math.floor(sampleRate * 2.4 * sustain);
  const buffer = context.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  const period = Math.max(2, Math.round(sampleRate / frequency - 0.5));

  // Pick attack: a short, gently low-passed burst of noise.
  let smooth = 0;
  for (let i = 0; i < period; i += 1) {
    const noise = Math.random() * 2 - 1;
    smooth = smooth * 0.6 + noise * 0.4;
    data[i] = smooth;
  }

  // Per-period loss, scaled so longer sustains take proportionally longer to
  // reach the same decay level.
  const decay = Math.min(
    0.9999,
    Math.pow(0.001, 1 / (frequency * 4.5 * sustain)),
  );

  for (let i = period + 1; i < length; i += 1) {
    data[i] = decay * 0.5 * (data[i - period] + data[i - period - 1]);
  }

  // Normalize so every note has a similar level.
  let peak = 0;
  for (let i = 0; i < length; i += 1) {
    peak = Math.max(peak, Math.abs(data[i]));
  }
  const scale = peak > 0 ? 0.8 / peak : 1;
  for (let i = 0; i < length; i += 1) {
    data[i] *= scale;
  }

  // Fade the tail to avoid a click at the end of the buffer.
  const fade = Math.min(length, Math.floor(sampleRate * 0.12));
  for (let i = 0; i < fade; i += 1) {
    data[length - 1 - i] *= i / fade;
  }

  return buffer;
}

export function createDistortionCurve(drive = 2) {
  const size = 2048;
  const curve = new Float32Array(size);
  const normalized = Math.tanh(drive);

  for (let i = 0; i < size; i += 1) {
    const x = (i * 2) / (size - 1) - 1;
    curve[i] = Math.tanh(x * drive) / normalized;
  }

  return curve;
}

/**
 * Asymmetric clipping adds even-order harmonics on top of the odd harmonics
 * from the first stage, which thickens a plain square wave into a fuzzier
 * tone.
 */
export function createAsymmetricDistortionCurve(drive = 3, bias = 0.22) {
  const size = 2048;
  const curve = new Float32Array(size);
  const offset = Math.tanh(bias);
  let peak = 0;

  for (let i = 0; i < size; i += 1) {
    const x = (i * 2) / (size - 1) - 1;
    const y = Math.tanh(x * drive + bias) - offset;
    curve[i] = y;
    peak = Math.max(peak, Math.abs(y));
  }

  const scale = peak > 0 ? 1 / peak : 1;
  for (let i = 0; i < size; i += 1) {
    curve[i] *= scale;
  }

  return curve;
}
