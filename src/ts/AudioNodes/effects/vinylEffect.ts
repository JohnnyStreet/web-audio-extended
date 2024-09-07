import { AudioContextExtended } from "../../AudioContextExtended";
import { DefaultProperties } from "../defaultProperties";

export function createVinylEffect(audioContext: AudioContextExtended) {
  const inputNode = audioContext.createGain();
  const outputNode = audioContext.createGain();
  const noise = audioContext.createGain();
  const wet = audioContext.createGain();
  const dry = audioContext.createGain();
  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 10000;
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 25;

  noise.gain.value = 0.02;

  inputNode.connect(dry).connect(outputNode);
  inputNode.connect(highpass).connect(lowpass).connect(wet).connect(outputNode);
  noise.connect(highpass);

  let bufferSource: AudioBufferSourceNode | null = null;

  const start = () => {
    bufferSource?.stop();
    bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = createVinylNoiseBuffer(audioContext, 10.0, 0.5);
    bufferSource.loop = true;
    bufferSource.connect(noise);
    bufferSource.start(audioContext.currentTime);
  };

  const stop = () => {
    bufferSource?.stop();
  };

  DefaultProperties.assign(inputNode, outputNode);

  Object.assign(inputNode, {
    wet: wet.gain,
    dry: dry.gain,
    start,
    stop,
    noise: noise.gain,
  });

  return inputNode;
}

function createVinylNoiseBuffer(
  audioContext: AudioContext,
  duration = 10.0,
  dirtLevel = 0.5
) {
  const sampleRate = audioContext.sampleRate;

  const bufferSize = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const channelData = buffer.getChannelData(0);

  // Pink noise generation
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;

    // Pink noise algorithm (Voss-McCartney)
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;

    // Scale and apply dirt level (reduced overall volume)
    let noise = (pink / 8) * dirtLevel * 0.3;

    // Add occasional pops and crackles (less frequent, more subtle)
    if (Math.random() < 0.0005 * dirtLevel) {
      noise += (Math.random() - 0.5) * dirtLevel * 0.5;
    }

    // Add low-frequency rumble
    const rumble =
      Math.sin((i * 2 * Math.PI * 33) / sampleRate) * 0.005 * dirtLevel;
    noise += rumble;

    // Add periodic surface noise (like a recurring scratch)
    const surfaceNoise =
      Math.sin((i * 2 * Math.PI * 0.5) / sampleRate) * 0.01 * dirtLevel;
    if (Math.random() < 0.1) {
      noise += surfaceNoise;
    }

    channelData[i] = noise;
  }

  return buffer;
}
