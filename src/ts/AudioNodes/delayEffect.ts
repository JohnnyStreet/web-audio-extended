import type { AudioContextExtended } from "../AudioContextExtended";
import { DefaultProperties } from "../defaultProperties";

export function createDelayEffect(audioContext: AudioContextExtended) {
  const inputNode = audioContext.createGain();
  const delayNode = audioContext.createDelay();
  const feedbackNode = audioContext.createGain();
  const wetGainNode = audioContext.createGain();
  const dryGainNode = audioContext.createGain();
  const outputNode = audioContext.createGain();

  delayNode.delayTime.value = 0.4;
  feedbackNode.gain.value = 0.4;

  wetGainNode.gain.value = 0.5;
  dryGainNode.gain.value = 1;

  inputNode.connect(delayNode);
  inputNode.connect(dryGainNode);
  delayNode.connect(feedbackNode);
  feedbackNode.connect(delayNode);
  feedbackNode.connect(wetGainNode);
  wetGainNode.connect(outputNode);
  dryGainNode.connect(outputNode);

  DefaultProperties.assign(inputNode, outputNode);

  Object.assign(inputNode, {
    delayTime: delayNode.delayTime,
    feedback: feedbackNode.gain,
    wet: wetGainNode.gain,
    dry: dryGainNode.gain,
  });

  return inputNode;
}
