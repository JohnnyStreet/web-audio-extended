import type { AudioContextExtended } from "../../AudioContextExtended";
import { DefaultProperties } from "../defaultProperties";

export function createChorusEffect(audioContext: AudioContextExtended) {
  const inputNode = audioContext.createGain();
  const delayNode = audioContext.createDelay();
  const outputNode = audioContext.createGain();
  const delayModulator = audioContext.createOscillator();
  const delayModulatorGain = audioContext.createGain();
  const wetGain = audioContext.createGain();
  const dryGain = audioContext.createGain();

  inputNode.connect(dryGain).connect(outputNode);

  inputNode.connect(delayNode).connect(wetGain).connect(outputNode);

  delayNode.delayTime.value = 0.004;
  delayModulator.frequency.value = 0.2;
  delayModulatorGain.gain.value = 0.002;

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
