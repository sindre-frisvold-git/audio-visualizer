// create audio element
const audioElem = document.getElementById('audio')
const fileSelect = document.getElementById('file')
// change audio src on file change
function onInputFileChange() {

  var file = fileSelect.files[0];

  var url = URL.createObjectURL(file);

  console.log(url);

  audioElem.src = url;
}
fileSelect.onchange = onInputFileChange
// link audio element to analyser


// start audio context after userinteraction

// create overlay that disappears after click
const welcomeSplash = document.getElementById('welcome')
welcomeSplash.onclick = function(){
  this.classList.add('hide')
  console.log(this)
  audioCtx.resume()
}
// Audio context //

let audioCtx = new AudioContext || new webkitAudioContext
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 32;
let mic = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
// const myPromise = new Promise((resolver,) =>{

// }
let source2
mic.then((e) => {
  console.log(e)
  source2 = audioCtx.createMediaStreamSource(e)
  // source2.connect(analyser)
  // source2.connect(audioCtx.destination)
})
let source = audioCtx.createMediaElementSource(audioElem)
source.connect(analyser)
source.connect(audioCtx.destination)
let data = new Uint8Array(analyser.frequencyBinCount)

// normalize audio input through function
let width = window.innerWidth;
let height = window.innerHeight
const c = document.getElementById("lightning");
c.width = width;
c.height = height;
var ctx = c.getContext("2d");
// Lightning variables //
let segmentSpread = 5         // lower values causes more spread between each segment
let lightningExtension = 20   // lightning length, higher values shortens lightning
let roughness = 2;            // lower values makes lightning more rough
let lightningThickness = 0.1
let testVar = 1
let finalSpread = 0

// Audio constants


const normaliser = (max, min, value, floorValue = 0) =>{
  // create function that normalises a range to a value between 1 and 0
  // ?add 3rd parameter for value to be parsed and return final value.
  let ratio =((value - floorValue)/(256 - floorValue))
  let output = (max - min) * ratio
  if((output + min)<0) return min
  return output + min
}
// link output to lightning variables
// consider reducing parts of output into 4 main outputs as performance allows
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
// create function to change lightning variables
const lightningModifier = () => {
// link one variable to audio output
analyser.getByteFrequencyData(data);
let frequencyData = inputReducer(data)
segmentSpread = normaliser(1, 20, frequencyData[1],);
lightningThickness = ((normaliser(25, 1, (data[2] + data[1])/2, 200)) || 3);
finalSpread = normaliser(1, 0, frequencyData[2])
roughness = normaliser(1.5, 2, frequencyData[3])
// lightningThickness = (data[])
requestAnimationFrame(lightningModifier)
}



// Original lightning canvas seffect by Bálint @ https://codepen.io/mcdorli/ //
// Modifications by me to make lightning interact with audio //



var center = {x: width / 2, y: 20};
var minSegmentHeight = 5;
var groundHeight = height - lightningExtension;
var color = "hsl(180, 80%, 80%)";

var maxDifference = width / segmentSpread;

ctx.globalCompositeOperation = "lighter";

ctx.strokeStyle = color;
ctx.shadowColor = color;

ctx.fillStyle = color;
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = "hsla(0, 0%, 10%, 0.2)";
ctx.lineWidth = lightningThickness
function render() {
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
  requestAnimationFrame(render);
}

function createLightning() {
  maxDifference = width / segmentSpread
  var segmentHeight = groundHeight - center.y;
  var lightning = [];
  lightning.push({x: center.x, y: center.y});
  lightning.push({x: center.x + ((Math.random() * (-width) + width / 2) * finalSpread), y: groundHeight});
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
window.addEventListener('resize', function(e){
  console.log(e)
  width = window.innerWidth;
  height = window.innerHeight;
  c.width = width;
  c.height = height;
})