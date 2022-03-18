const ctx = new (window.AudioContext || window.webkitAudioContext)
const fft = new AnalyserNode(ctx, { fftSize: 2048 })
createWaveCanvas = ({ element: 'section', analyser: fft })

function adsr (opts) {
  const param = opts.param
  const peak = opts.peak || 1
  const hold = opts.hold || 0.7
  const time = opts.time || ctx.currentTime
  const dur = opts.duration || 1
  const a = opts.attack || dur * 0.2
  const d = opts.decay || dur * 0.1
  const s = opts.sustain || dur * 0.5
  const r = opts.release || dur * 0.2

  const init = param.value
  param.setValueAtTime(init, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(hold, time+a+d)
  param.linearRampToValueAtTime(hold, time+a+d+s)
  param.linearRampToValueAtTime(init, time+a+d+s+r)
}

function tone(type, pitch, time, duration) {
  const t = time || ctx.currentTime
  const d = duration || 0.25
  const p = pitch || 0.5

  const osc = new OscillatorNode(ctx, {
    type: type || 'sine',
    frequency: pitch || 440
  })
  const lvl = new GainNode(ctx, { gain: 0.001 }) // scale volume down by 1/2
  osc.connect(lvl)
  lvl.connect(ctx.destination)
  lvl.connect(fft)

  osc.start(t)
  osc.stop(t + d)

  adsr({ param: lvl.gain, 
    time: t,
    duration: d })
}

function ran (scale){
  Math.floor(Math.random() * scale.length) }

const major = [0, 2, 4, 5, 7, 9, 11, 12]
const minor = [0, 2, 3, 5, 7, 8, 10, 12]
const keys = [
  440.0000, //A
  446.1638, //A#
  493.8833, //B
  523.2511, //C
  554.3653, //C#
  587.3295, //D
  622.2540, //D#
  659.2551, //E
  698.4565, //F
  739.9888, //F#
  783.9909, //G
  830.6094 //G#
]

const delayStart = 1
const tempo = 140 //bpm
const beat = 60/tempo // seconds per beat
const bar = beat * 4
const root = 440 //A4
const scale = major
//const notes = [0, 0, 2, 2]


function step (rootFreq, steps) {
  let tr2 = Math.pow(2, 1/12)
  let rnd = rootFreq * Math.pow(tr2, steps)
  return Math.round(rnd * 100) / 100
}

// for (let b = 0; b < 4; b++){
//   const delayB = b * bar * 4
//   for(let a = 0; a < 4; a++){
//     const delayA = a * bar
//     for(let i = 0; i < notes.length; i++){
//       const time = i * beat + delayStart + delayA + delayB
//       const dur = beat
//       const pitch = step(root, notes[i])
//       tone('sine', pitch, time, dur)
//     }
//   }
// }

function chorus1(verse_num){
  const notes = [0, 0, 2, 2]
    const delayB = bar * verse_num * 4
    for(let a = 0; a < 4; a++){
      const delayA = a * bar
      for(let i = 0; i < notes.length; i++){
        const time = i * beat + delayStart + delayA + delayB
        const dur = beat
        const pitch = step(root, notes[i])
        tone('sine', pitch, time, dur)
      }
    }
}

function chorus2(verse_num){
  const notes = [0, 2, 2, 4]
  const delayB = bar * verse_num * 4
    for(let a = 0; a < 4; a++){
      const delayA = a * bar
      for(let i = 0; i < notes.length; i++){
        const time = i * beat + delayStart + delayA + delayB
        const dur = beat
        const pitch = step(root, notes[i])
        tone('sine', pitch, time, dur)
      }
    }
}

function verse(verse_num){
  const delayB = bar * verse_num * 4
    for(let a = 0; a < 4; a++){
      const delayA = a * bar
      for(let i = 0; i < 4; i++){
        const notes = [0, ran(scale), 2, ran(scale)]
        const time = i * beat + delayStart + delayA + delayB
        const dur = beat
        const pitch = step(root, notes[i])
        tone('sine', pitch, time, dur)
      }
    }
}

function bridge(verse_num){
  const scale = minor
  const delayB = bar * verse_num * 4
  for(let a = 0; a < 4; a++){
    const delayA = a * bar
    for(let i = 0; i < 4; i++){
      const notes = [0, ran(scale), 2, ran(scale)]
      const time = i * beat + delayStart + delayA + delayB
      const dur = beat
      const pitch = step(root, notes[i])
      tone('sine', pitch, time, dur)
    }
  }
}

chorus1(0)
verse(1)
chorus1(2)
chorus2(2)
verse(3)
chorus2(4)
bridge(5)
chorus1(6)
chorus2(6)





// for (let i = 0; i <= 16; i++){
//   const time = ctx.currentTime + (i/ 4)
//   const n = Math.floor(Math.random() * major.length)
//   const pitch = step(440, n)
//   tone('sine', pitch, time, 0.25)
//   tone.frequency.setValueCurveAtTime(freq, time)
// }

//make chorus and bridge




