import type { AudioContextExtended } from "../AudioContextExtended";
import { DefaultProperties } from "../defaultProperties";

const squareCurve = new Float32Array(256);
squareCurve.fill(-1, 0, 128);
squareCurve.fill(1, 128, 256);

const constantCurve = new Float32Array(2);
constantCurve[0] = 1;
constantCurve[1] = 1;

export function createPulseOscillator(audioContext: AudioContextExtended) {
  const oscillator = audioContext.createOscillator();
  const squareShaper = audioContext.createWaveShaper();
  const constantShaper = audioContext.createWaveShaper();
  const widthParameter = audioContext.createGain();

  oscillator.type = "sawtooth";
  oscillator.frequency.value = 220;

  squareShaper.curve = squareCurve;
  constantShaper.curve = constantCurve;

  widthParameter.gain.value = 0;

  oscillator.connect(constantShaper);
  constantShaper.connect(widthParameter);
  widthParameter.connect(squareShaper);

  DefaultProperties.assign(oscillator, squareShaper);

  Object.assign(oscillator, {
    pulseWidth: widthParameter.gain,
  });

  return oscillator;
}
