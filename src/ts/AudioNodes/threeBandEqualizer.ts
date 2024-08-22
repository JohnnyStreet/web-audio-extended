import type { AudioContextExtended } from "../AudioContextExtended";
import { DefaultProperties } from "../defaultProperties";

export function createThreeBandEqualizer(audioContext: AudioContextExtended) {
  const inputNode = audioContext.createGain();
  const filterLow = audioContext.createBiquadFilter();
  const filterMid = audioContext.createBiquadFilter();
  const filterHigh = audioContext.createBiquadFilter();
  const outputNode = audioContext.createGain();

  // Set filter types
  filterLow.type = "lowshelf";
  filterMid.type = "peaking";
  filterHigh.type = "highshelf";
  
  filterLow.frequency.value = 250;
  filterMid.frequency.value = 1000;
  filterHigh.frequency.value = 4000;

  filterLow.gain.value = 0;
  filterMid.gain.value = 0;
  filterHigh.gain.value = 0;

  filterMid.Q.value = 1.5; // Q factor for peaking filter

  // Connect input to filters in series
  inputNode.connect(filterLow);
  filterLow.connect(filterMid);
  filterMid.connect(filterHigh);
  filterHigh.connect(outputNode);

  DefaultProperties.assign(inputNode, outputNode);
  
  Object.assign(inputNode, {
    low: filterLow.gain,
    mid: filterMid.gain,
    high: filterHigh.gain,
    lowCutoff: filterLow.frequency,
    midCenter: filterMid.frequency,
    midPrecision: filterMid.Q,
    highCutoff: filterHigh.frequency,
  });  

  return inputNode;
}
