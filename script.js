// Visualizer //
// create a canvas element that reacts to audio
// make one singe line
// make a line out of multiple smaller objects
// index each object
// make different frequencies create branches

const canvas2 = document.getElementById('canvas2');
let ctx2 = canvas2.getContext('2d')
canvas2.height = window.innerHeight
canvas2.width = window.innerWidth

document.getElementById('file').addEventListener('click', () =>{
const audioElem = document.getElementById('audio')
const audioCtx = new window.AudioContext()
const analyzer = audioCtx.createAnalyser()
const source = audioCtx.createMediaElementSource(audioElem)
const canvas = document.getElementById('audio-visual');
let ctx = canvas.getContext('2d')

canvas.width = 500;
canvas.height = 500;



analyzer.fftSize = 64;
let bufferLength = analyzer.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)
analyzer.getByteFrequencyData(dataArray)
source.connect(analyzer)
analyzer.connect(audioCtx.destination)
function onInputFileChange() {

  var file = document.getElementById('file').files[0];

  var url = URL.createObjectURL(file);

  console.log(url);

  document.getElementById("audio").src = url;

}

function loopingFunction() {
  requestAnimationFrame(loopingFunction)
  analyzer.getByteFrequencyData(dataArray)
  draw(dataArray)
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  let space = canvas.width / dataArray.length;
  dataArray.forEach((value,i)=>{
    ctx.beginPath();
    ctx.moveTo(space*i,canvas.height); //x,y
    ctx.lineTo(space*i,canvas.height-value); //x,y
    ctx.stroke();
})
}
document.getElementById('file').addEventListener('change', e => onInputFileChange())
loopingFunction()
})
let number = 1;
let scale = 10;
let posX = 200
let posY = 200
let size = 15
let grow = true
let angle = 0
let hue = 80
ctx2.globalCompositeOperation = 'destination-over'

function drawFlower() {
  let angle = number * 1;
  let radius = scale * Math.sqrt(number)
  let posX = radius * Math.sin(angle) + canvas2.width / 2;
  let posY = radius * Math.cos(angle) + canvas2.height / 2;
  ctx2.fillStyle = 'hsl(' + hue + ', 100%, 50%)'
  ctx2.strokeStyle = 'hsl(' + (hue + 180) + ', 100%, 50%)'
  ctx2.lineWidth = 4
  ctx2.beginPath();
  ctx2.arc(posX, posY, size, 0, Math.PI * 2)
  ctx2.closePath()
  ctx2.fill()
  ctx2.stroke()
  hue += 0.2
  number++
}
function animate() {
  drawFlower()
  if(number>=60)return number = 0
  posX += 0.3 * Math.sin(angle); 
  posY += 0.3 * Math.cos(angle);
  angle += 0.1;
  // if(grow) size *= 1.01
  // if(!grow) size /= 1.01
  if(size > 50) grow = false
  if(size <= 0.1) grow = true
  requestAnimationFrame(animate)
}
function drawCircle() {
  ctx2.clearRect(0,0,canvas2.width, canvas2.height)
  ctx2.strokeStyle = "red"
  ctx2.lineWidth = 5;
  ctx2.beginPath()
  ctx2.arc(posX, posY, size, 0, Math.PI *2)
  ctx2.closePath()
  ctx2.stroke()
}

animate()