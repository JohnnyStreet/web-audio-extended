import type { AudioContextExtended } from "../../AudioContextExtended";
import { DefaultProperties } from "../defaultProperties";

export function createDelayEffect(audioContext: AudioContextExtended) {
  const inputNode = audioContext.createGain();
  const delayNode = audioContext.createDelay();
  const feedbackNode = audioContext.createGain();
  const wetGain = audioContext.createGain();
  const dryGain = audioContext.createGain();
  const outputNode = audioContext.createGain();

  delayNode.delayTime.value = 0.4;
  feedbackNode.gain.value = 0.4;

  wetGain.gain.value = 0.5;
  dryGain.gain.value = 1;

  inputNode.connect(dryGain).connect(outputNode);

  inputNode
    .connect(delayNode)
    .connect(feedbackNode)
    .connect(wetGain)
    .connect(outputNode);

  feedbackNode.connect(delayNode);

  DefaultProperties.assign(inputNode, outputNode);

  Object.assign(inputNode, {
    delayTime: delayNode.delayTime,
    feedback: feedbackNode.gain,
    wet: wetGain.gain,
    dry: dryGain.gain,
  });

  return inputNode;
}
