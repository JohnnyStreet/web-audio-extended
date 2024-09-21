# web-audio-extended
 
Include the script in your HTML:
```html
<script src="AudioContextExtended.js"></script>
```

Create an audio context:
```javascript
const audioContext = new AudioContextExtended();
```

Create and connect components:
```javascript
const audioContext = new AudioContextExtended();

const eq = audioContext.createThreeBandEqualizer();
const reverb = audioContext.createReverbEffect();

mySource.connect(eq).connect(reverb).connect(audioContext.destination);
```

Simplify effects chains:
```javascript
const audioContext = new AudioContextExtended();

const eq = audioContext.createThreeBandEqualizer();
const chorus = audioContext.createChorusEffect();
const delay = audioContext.createDelayEffect();
const reverb = audioContext.createReverbEffect();
const vinyl = audioContext.createVinylEffect();

const effectsChain = audioContext.createEffectsChain([
  eq,
  chorus,
  delay,
  reverb,
  vinyl
]);

mySource.connect(effectsChain).connect(audioContext.destination);

...

effectsChain.toggleBypass(chorus); // toggle effects on demand
```
