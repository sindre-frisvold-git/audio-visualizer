// DOM selectors for sliders
// The sliders can be modified in index.html to change the max and min values for each variable on the fly
// Also allows for frequency band change for each variable.
const thicknessRange = document.getElementById('thickness')
const thicknessFrequency = document.getElementById('thicknessFrequency')
const spreadRange = document.getElementById('spread')
const spreadFrequency = document.getElementById('spreadFrequency')
const roughnessRange = document.getElementById('roughness')
const roughnessFrequency = document.getElementById('roughnessFrequency')
const colorRange = document.getElementById('color')
const colorFrequency = document.getElementById('colorFrequency')
const widthRange = document.getElementById('width')
const widthFrequency = document.getElementById('widthFrequency')


const welcomeSplash = document.getElementById('welcome')
const audioElem = document.getElementById('audio')
const fileSelect = document.getElementById('file')





// Audio context //

let audioCtx = new AudioContext || new webkitAudioContext
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 128;   // Size of frequency bands, data array will have fftsize/2 entries
let source = audioCtx.createMediaElementSource(audioElem)
source.connect(analyser)
source.connect(audioCtx.destination)
let data = new Uint8Array(analyser.frequencyBinCount)

// Canvas //
let width = window.innerWidth;
let height = window.innerHeight
const c = document.getElementById("lightning");
c.width = width;
c.height = height;
var ctx = c.getContext("2d");


// Lightning variables //
let segmentSpread = 5             // lower values causes more spread between each segment
let lightningExtension = 20       // lightning length, higher values shortens lightning
let roughness = 2;                // lower values makes lightning more rough
let lightningThickness = 1        // adjusts widtth of lightning bolt
let testVar = 1                   // placeholder, ignore
let finalSpread = 0               // lightning spread at the bottom ov canvas
let color = "hsl(180, 80%, 80%)"; // color of lightning

// Functions //

// change audio src on file change
function onInputFileChange() {

  var file = fileSelect.files[0];

  var url = URL.createObjectURL(file);

  console.log(url);

  audioElem.src = url;
}

// Creates a linear ratio from audio output
const normaliser = (max, min, value, offset = 0) =>{

  let ratio =((value - offset)/(256 - offset))
  let output = (max - min) * ratio
  if((output + min)<0) return min
  return output + min
}


// creates an exponential ratio which has amplified contrast between amplitudes
const exponentialNormaliser = (max, min, value) =>{
  let divisor = 12
  let exponent = 2
  let maxValue = (256/divisor)**exponent
  let modValue = (value/divisor)**exponent
  let ratio = modValue/maxValue
  return ((max-min)*ratio) + min
  
}


// Creates an exponential ratio based of the normal output
const experimentalExponent = (max, min, value) =>{
  let range = max - min
  let ratio = value/255
  if(range === (-1))return min -(10**ratio)/10
  if(range === 1)return (10**ratio)/10 + min
  if(range <= 0)return min -(-range)**ratio
  return range**ratio+min
}


// reduces the output channels by 4, this one can be modified to group more frequencies together. 
// I just havent modified this one since creating the visualiser.
const inputReducer = (arr) =>{
  let length = arr.length / 4
  let result =[]
  let sum = 0;
  for(i = 0; i < length; i++){
    for(j = 0; j<4; j++){
      sum += arr[i*4+j]
    }
    result.push(sum/4);
    sum = 0;
  }
  return result
}


// callback function for modifying variables based on frequency data
// variables are described at initialisation
const lightningModifier = () => {
analyser.getByteFrequencyData(data);
let frequencyData = inputReducer(data)
segmentSpread = exponentialNormaliser(1, spreadRange.valueAsNumber, frequencyData[spreadFrequency.value]);
lightningThickness = exponentialNormaliser(thicknessRange.valueAsNumber, 0.3, frequencyData[thicknessFrequency.value]);
finalSpread = exponentialNormaliser(widthRange.valueAsNumber, 0, frequencyData[widthFrequency.value])
roughness = exponentialNormaliser(roughnessRange.valueAsNumber, 2, frequencyData[roughnessFrequency.value])
color = `hsl(${exponentialNormaliser(colorRange.value, 0, frequencyData[colorFrequency.value])}, 80%, 80%)`

// varable to modify how far the lightning extends, I couldnt get this to look good but it is left here for your experimentation
// lightningExtension = Math.random() * normaliser(height/2, 0, frequencyData[5])

}

// Events //


fileSelect.onchange = onInputFileChange

welcomeSplash.onclick = function(){
  this.classList.add('hide')
  console.log(this)
  audioCtx.resume()
}


window.addEventListener('resize', function(e){
  console.log(e)
  width = window.innerWidth;
  height = window.innerHeight;
  c.width = width;
  c.height = height;

  center = {x: width / 2, y: 20};
  minSegmentHeight = 5;
  groundHeight = height - lightningExtension;


  maxDifference = width / segmentSpread;

  // ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "hsla(0, 0%, 10%, 0.5)";
  ctx.lineWidth = lightningThickness

})

// Original lightning canvas effect by Bálint @ https://codepen.io/mcdorli/ //
// Modifications by me to make lightning interact with audio //


var center = {x: width / 2, y: 20};
var minSegmentHeight = 5;
var groundHeight = height - lightningExtension;


var maxDifference = width / segmentSpread;

ctx.globalCompositeOperation = "lighter";



ctx.fillStyle = color;
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = "hsla(0, 0%, 10%, 0.5)";
ctx.lineWidth = lightningThickness
function render() {
  requestAnimationFrame(render)
  // const t0 = performance.now();


  lightningModifier()
  groundHeight = height - lightningExtension
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.lineWidth = lightningThickness
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowBlur = 15;
  var lightning = createLightning();
  ctx.beginPath();
  for (var i = 0; i < lightning.length; i++) {
    ctx.lineTo(lightning[i].x, lightning[i].y);
  }
  ctx.stroke();

  // const t1 = performance.now();
  // console.log(t1-t0);
  ;
}

function createLightning() {
  maxDifference = width / segmentSpread
  var segmentHeight = groundHeight - center.y;
  var lightning = [];
  lightning.push({x: center.x + ((Math.random() * (-width) + width / 2) * finalSpread), y: center.y});
  lightning.push({x: center.x + ((Math.random() * (-width) + width / 2) * finalSpread), y: groundHeight});
  // lightning.push({x: center.x, y: center.y});
  // lightning.push({x: center.x + ((Math.random() * (-width) + width / 2) * finalSpread), y: groundHeight});
  var currDiff = maxDifference;
  while (segmentHeight > minSegmentHeight) {
    var newSegments = [];
    for (var i = 0; i < lightning.length - 1; i++) {
      var start = lightning[i];
      var end = lightning[i + 1];
      var midX = (start.x + end.x) / 2;
      var newX = midX + ((Math.random() * 2 - 1) * currDiff) * testVar;
      newSegments.push(start, {x: newX, y: (start.y + end.y) / 2});
    }
    
    newSegments.push(lightning.pop());
    lightning = newSegments;
    
    currDiff /= roughness;
    segmentHeight /= 2;
  }
  return lightning;
}

lightningModifier();

render();



// Mic test, worked but broke again, leaving in to fix later //
// let mic = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
// let source2
// mic.then((e) => {
//   console.log(e)
//   source2 = audioCtx.createMediaStreamSource(e)
//   source2.connect(analyser)
//   source2.connect(audioCtx.destination)
// })
// end of Mic experiment

