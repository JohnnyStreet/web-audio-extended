import { DefaultProperties } from "../defaultProperties";

export function createMetronome(audioContext: AudioContext) {
  const inputNode = audioContext.createGain();
  let oscillator = null;
  const outputNode = audioContext.createGain();

  let startTime = 0;
  let lastTick = 0;
  let timer: number | NodeJS.Timeout | null = null;

  const tick = (time: number) => {
    oscillator = audioContext.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.value = 440;
    oscillator.connect(outputNode);
    oscillator.start(time);
    oscillator.stop(time + 0.1);
    lastTick = time;
  };

  const checkNextTick = () => {
    const now = audioContext.currentTime;
    const nextTick = Math.ceil(now / 0.5) * 0.5;
    const timeToNextTick = nextTick - now;
    if (timeToNextTick < 0.2) {
      tick(nextTick);
    }
    timer = setTimeout(checkNextTick, 100);
  };

  const start = () => {
    startTime = audioContext.currentTime;
    tick(startTime);
    timer = setInterval(() => checkNextTick(), 100);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  Object.assign(inputNode, {
    start,
    stop,
  });

  DefaultProperties.assign(inputNode, outputNode);

  return inputNode;
}
