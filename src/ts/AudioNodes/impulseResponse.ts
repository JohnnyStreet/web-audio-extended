import { AudioContextExtended } from "../AudioContextExtended";

export interface IImpulseResponseOptions {
  duration?: number;
  decay?: number;
  reverse?: boolean;
}

export function createImpulseResponse(
  audioContext: AudioContextExtended,
  options: IImpulseResponseOptions = {}
): AudioBuffer {
  const { duration = 2, decay = 2, reverse = false } = options;
  const bufferSize = Math.floor(duration * audioContext.sampleRate);
  const buffer = audioContext.createBuffer(
    2,
    bufferSize,
    audioContext.sampleRate
  );

  for (let channel = 0; channel < 2; channel++) {
    const impulseResponse = buffer.getChannelData(channel);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / audioContext.sampleRate;
      const amplitude = Math.pow(1 - t / duration, decay);
      impulseResponse[i] = (Math.random() * 2 - 1) * amplitude;
    }

    if (reverse) {
      impulseResponse.reverse();
    }
  }

  return buffer;
}
