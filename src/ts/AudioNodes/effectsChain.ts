import { DefaultProperties } from "./defaultProperties";

class EffectState {
  private _bypassed = false;
  readonly wet: GainNode;
  readonly dry: GainNode;

  get bypassed() {
    return this._bypassed;
  }

  constructor(
    public readonly audioContext: AudioContext,
    public readonly effect: AudioNode
  ) {
    console.assert(audioContext instanceof AudioContext);
    console.assert(effect instanceof AudioNode);
    this.wet = audioContext.createGain();
    this.wet.gain.value = 1;
    effect.connect(this.wet);

    this.dry = audioContext.createGain();
    this.dry.gain.value = 0;
  }

  setBypass(bypass: boolean) {
    this._bypassed = bypass;
    console.log("setBypass", this._bypassed);
    if (bypass) {
      this.wet.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.dry.gain.setValueAtTime(1, this.audioContext.currentTime);
    } else {
      this.wet.gain.setValueAtTime(1, this.audioContext.currentTime);
      this.dry.gain.setValueAtTime(0, this.audioContext.currentTime);
    }
  }

  dispose() {
    this.effect.disconnect();
    this.wet.disconnect();
    this.dry.disconnect();
  }
}

export function createEffectsChain(
  audioContext: AudioContext,
  effectNodes: AudioNode[] = []
) {
  const inputNode = audioContext.createGain();
  const outputNode = audioContext.createGain();
  const effectStates: EffectState[] = effectNodes.map(
    (effect) => new EffectState(audioContext, effect)
  );

  if (effectNodes.length === 0) {
    throw new Error("No effect nodes provided");
  }

  console.log("effect states", effectStates);

  inputNode.connect(effectStates[0].effect);
  inputNode.connect(effectStates[0].dry);
  for (let i = 0; i < effectStates.length - 1; i++) {
    const effectState = effectStates[i];
    const next = effectStates[i + 1];
    effectState.wet.connect(next.effect);
    effectState.dry.connect(next.effect);
    effectState.wet.connect(next.dry);
    effectState.dry.connect(next.dry);
  }
  effectStates[effectStates.length - 1].wet.connect(outputNode);
  effectStates[effectStates.length - 1].dry.connect(outputNode);

  const getEnabledEffects = () => {
    return effectStates
      .filter((state) => !state.bypassed)
      .map((state) => state.effect);
  };

  const toggleBypass = (effect: AudioNode, bypass?: boolean) => {
    const effectState = effectStates.find((state) => state.effect === effect);
    if (effectState) {
      effectState.setBypass(
        bypass !== undefined ? bypass : !effectState.bypassed
      );
      console.log(
        `Effect ${effect.constructor.name} is ${
          effectState.bypassed ? "bypassed" : "enabled"
        }`
      );
    } else {
      throw new Error(`Effect not found: ${effect}`);
    }
  };

  DefaultProperties.assign(inputNode, outputNode);

  Object.assign(inputNode, {
    toggleBypass,
    getEnabledEffects,
  });

  return inputNode;
}
