import { createThreeBandEqualizer } from "./AudioNodes/threeBandEqualizer";
import { createChorusEffect } from "./AudioNodes/chorusEffect";
import { createDelayEffect } from "./AudioNodes/delayEffect";
import { createReverbEffect } from "./AudioNodes/reverbEffect";

import {
  createImpulseResponse,
  IImpulseResponseOptions,
} from "./AudioNodes/impulseResponse";
import { createPulseOscillator } from "./AudioNodes/pulseOscillator";

export class AudioContextExtended extends AudioContext {
  createThreeBandEqualizer() {
    return createThreeBandEqualizer(this);
  }

  createChorusEffect() {
    return createChorusEffect(this);
  }

  createDelayEffect() {
    return createDelayEffect(this);
  }

  createReverbEffect() {
    return createReverbEffect(this);
  }

  createPulseOscillator() {
    return createPulseOscillator(this);
  }

  createImpulseResponse(options: IImpulseResponseOptions) {
    return createImpulseResponse(this);
  }

  loadBuffer(url: string) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          return response.arrayBuffer();
        })
        .then((buffer) => {
          return this.decodeAudioData(buffer);
        })
        .then((audioBuffer) => {
          resolve(audioBuffer);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

(window as any).AudioContextExtended = AudioContextExtended;
