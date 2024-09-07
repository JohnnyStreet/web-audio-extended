import type { AudioContextExtended } from "../../AudioContextExtended";
import { DefaultProperties } from "../defaultProperties";
import { IImpulseResponseOptions } from "../../helpers/impulseResponse";

export interface IReverbOptions extends IImpulseResponseOptions {
  wet?: number;
  dry?: number;
  buffer?: AudioBuffer;
  // other params are inherited from IImpulseResponseOptions
}

const defaultOptions = {
  duration: 2,
  decay: 2,
  reverse: false,
  wet: 0.5,
  dry: 1,
};

export function createReverbEffect(
  audioContext: AudioContextExtended,
  options: IReverbOptions = {}
) {
  options = { ...defaultOptions, ...options };
  const inputNode = audioContext.createGain();
  const highpass = audioContext.createBiquadFilter();
  const lowpass = audioContext.createBiquadFilter();
  const convolverNode = audioContext.createConvolver();
  const predelayNode = audioContext.createDelay();
  const wetGain = audioContext.createGain();
  const dryGain = audioContext.createGain();
  const outputNode = audioContext.createGain();

  highpass.type = "highpass";
  highpass.frequency.value = 1000;
  highpass.Q.value = 0;

  lowpass.type = "lowpass";
  lowpass.frequency.value = 4000;
  lowpass.Q.value = 0;

  wetGain.gain.value = options.wet!;
  dryGain.gain.value = options.dry!;

  predelayNode.delayTime.value = 0.01;

  convolverNode.buffer =
    options.buffer || audioContext.createImpulseResponse(options);

  inputNode.connect(dryGain).connect(outputNode);

  inputNode
    .connect(lowpass)
    .connect(highpass)
    .connect(predelayNode)
    .connect(convolverNode)
    .connect(wetGain)
    .connect(outputNode);

  DefaultProperties.assign(inputNode, outputNode);
  Object.assign(inputNode, {
    wet: wetGain.gain,
    dry: dryGain.gain,
    predelay: predelayNode.delayTime,
    lowpass: lowpass.frequency,
    highpass: highpass.frequency,
  });

  Object.defineProperty(inputNode, "buffer", {
    get: function () {
      return convolverNode.buffer;
    },
    set: function (buffer: AudioBuffer) {
      convolverNode.buffer = buffer;
    },
  });

  if (options.buffer) {
    convolverNode.buffer = options.buffer;
  } else {
    convolverNode.buffer = audioContext.createImpulseResponse(options);
  }

  return inputNode;
}
