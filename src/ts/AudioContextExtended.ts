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

  loadBuffer(url: string, onprogress?: (progress: number) => void) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          const contentLength = Number(response.headers.get('Content-Length'));
          let loaded = 0;
          const reader = response.body!.getReader();
          const stream = new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    return;
                  }
                  loaded += value.length;
                  if (onprogress) {
                    onprogress(loaded / contentLength);
                  }
                  controller.enqueue(value);
                  push();
                });
              }
              push();
            }
          });
          return new Response(stream).arrayBuffer();
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
