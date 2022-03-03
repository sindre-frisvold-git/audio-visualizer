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
let audioCtx = new AudioContext || new webkitAudioContext
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 32;
let source = audioCtx.createMediaElementSource(audioElem)
source.connect(analyser)
source.connect(audioCtx.destination)

// start audio context after userinteraction
// create overlay that disappears after click
const welcomeSplash = document.getElementById('welcome')
welcomeSplash.onclick = function(){
  this.classList.add('hide')
  console.log(this)
  audioCtx.resume()
}
// Audio context //



// Lightning canvas seffect by Bálint @ https://codepen.io/mcdorli/ //
// Modifications by me to make lightning interact with audio //

var width = window.innerWidth;
var height = window.innerHeight;
var c = document.getElementById("lightning");
c.width = width;
c.height = height;
var ctx = c.getContext("2d");

var center = {x: width / 2, y: 20};
var minSegmentHeight = 5;
var groundHeight = height - 20;
var color = "hsl(180, 80%, 80%)";
var roughness = 2;
var maxDifference = width / 4
ctx.lineWidth = 3;

ctx.globalCompositeOperation = "lighter";

ctx.strokeStyle = color;
ctx.shadowColor = color;

ctx.fillStyle = color;
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = "hsla(0, 0%, 10%, 0.2)";

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
  lightning.push({x: Math.random() * (width /10) +width/2, y: groundHeight + (Math.random() - 0.9) * 50});
  var currDiff = maxDifference;
  while (segmentHeight > minSegmentHeight) {
    var newSegments = [];
    for (var i = 0; i < lightning.length - 1; i++) {
      var start = lightning[i];
      var end = lightning[i + 1];
      var midX = (start.x + end.x);
      var newX = midX + (Math.random()) * currDiff;
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
window.addEventListener('resize', function(e){
  console.log(e)
  width = window.innerWidth;
  height = window.innerHeight;
})