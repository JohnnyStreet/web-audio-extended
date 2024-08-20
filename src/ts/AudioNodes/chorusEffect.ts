import type { AudioContextExtended } from "../AudioContextExtended";
import { DefaultProperties } from "../defaultProperties";

export function createChorusEffect(audioContext: AudioContextExtended) {
  const inputNode = audioContext.createGain();
  const delayNode = audioContext.createDelay();
  const outputNode = audioContext.createGain();
  const delayModulator = audioContext.createOscillator();
  const delayModulatorGain = audioContext.createGain();
  const wetGain = audioContext.createGain();
  const dryGain = audioContext.createGain();

  wetGain.connect(outputNode);
  dryGain.connect(outputNode);

  inputNode.connect(delayNode);
  delayNode.connect(wetGain);

  inputNode.connect(dryGain);
  
  delayNode.delayTime.value = 0.002;
  delayModulator.frequency.value = 0.2;
  delayModulatorGain.gain.value = 0.02;

  delayModulator.connect(delayModulatorGain);
  delayModulatorGain.connect(delayNode.delayTime);
  delayModulator.start(audioContext.currentTime);

  DefaultProperties.assign(inputNode, outputNode);

  Object.assign(inputNode, {
    delayTime: delayNode.delayTime,
    rate: delayModulator.frequency,
    depth: delayModulatorGain.gain,
    wet: wetGain.gain,
    dry: dryGain.gain,
  });

  return inputNode;
}
