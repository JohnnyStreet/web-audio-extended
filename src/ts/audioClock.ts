export function createAudioClock(audioContext: AudioContext) {
  const gainNode = audioContext.createGain();
  let startTime: number | null = null;
  let nextTickTime = 0;
  let timer: number | null = null;
  let bpm = audioContext.createConstantSource();
  bpm.offset.value = 120;
  bpm.start();
  let beats = 4;
  let currentBeat = 0;
  let metronomeEnabled = false;
  let elapsedTime = 0;
  let lastUpdateTime: number | null = null;

  const scheduleAhead = 0.1; // Schedule 100ms ahead
  const tickInterval = 25; // Check for new ticks every 25ms

  const tick = (time: number) => {
    if (!metronomeEnabled) return;

    const oscillator = audioContext.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.value = currentBeat === 0 ? 880 : 440;
    oscillator.connect(gainNode);
    oscillator.start(time);
    oscillator.stop(time + 0.05);
    currentBeat = (currentBeat + 1) % beats;
  };

  const scheduleTicks = () => {
    if (startTime === null) return;
    const currentTime = audioContext.currentTime;

    // Update elapsed time
    if (lastUpdateTime !== null) {
      elapsedTime += (currentTime - lastUpdateTime) * (bpm.offset.value / 120);
    }
    lastUpdateTime = currentTime;

    while (nextTickTime < currentTime + scheduleAhead) {
      tick(nextTickTime);
      nextTickTime += 60 / bpm.offset.value;
    }
  };

  const start = async () => {
    if (startTime !== null) return; // Already started
    gainNode.connect(audioContext.destination);
    await audioContext.resume();
    console.log("audio clock started");
    startTime = audioContext.currentTime;
    nextTickTime = startTime;
    currentBeat = 0;
    lastUpdateTime = startTime;
    elapsedTime = 0;
    scheduleTicks();
    timer = window.setInterval(scheduleTicks, tickInterval);
  };

  const stop = () => {
    console.log("audio clock stopped");
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    startTime = null;
    currentBeat = 0;
    lastUpdateTime = null;
  };

  const getPlaybackTime = () => {
    return elapsedTime;
  };

  Object.assign(gainNode, {
    start,
    stop,
    bpm: bpm.offset,
    metronomeVolume: gainNode.gain,
    beats,
    getPlaybackTime,
  });

  Object.defineProperty(gainNode, "started", {
    get: function () {
      return startTime !== null;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(gainNode, "metronome", {
    get: function () {
      return metronomeEnabled;
    },
    set: function (value: boolean) {
      metronomeEnabled = value;
    },
    enumerable: true,
    configurable: true,
  });

  return gainNode;
}
