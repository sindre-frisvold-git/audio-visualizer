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
let source = audioCtx.createMediaElementSource(audioElem)
source.connect(analyser)
source.connect(audioCtx.destination)
let data = new Uint8Array(analyser.frequencyBinCount)

// normalize audio input through function
// link output to lightning variables
// consider reducing parts of output into 4 main outputs as performance allows
// create function to change lightning variables
const lightningModifier = () => {

}

// Lightning variables //
let segmentSpread = 5         // lower values causes more spread between each segment
let lightningExtension = 20   // lightning length, higher values shortens lightning
let roughness = 2.5;            // lower values makes lightning more rough
let lightningThickness = 3
let testVar = 1
let finalSpread = 0

// Original lightning canvas seffect by Bálint @ https://codepen.io/mcdorli/ //
// Modifications by me to make lightning interact with audio //

let width = window.innerWidth;
let height = window.innerHeight
const c = document.getElementById("lightning");
c.width = width;
c.height = height;
var ctx = c.getContext("2d");

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
ctx. lineWidth = lightningThickness
function render() {
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

render();

render();
window.addEventListener('resize', function(e){
  console.log(e)
  width = window.innerWidth;
  height = window.innerHeight;
  c.width = width;
  c.height = height;
})