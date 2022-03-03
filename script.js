// Visualizer //
// create a canvas element that reacts to audio
// make one singe line
// make a line out of multiple smaller objects
// index each object
// make different frequencies create branches

document.getElementById('file').addEventListener('click', () =>{
const audioElem = document.getElementById('audio')
const audioCtx = new window.AudioContext()
const analyzer = audioCtx.createAnalyser()
const source = audioCtx.createMediaElementSource(audioElem)
const canvas = document.getElementById('audio-visual');
let ctx = canvas.getContext('2d')

canvas.width = 500;
canvas.height = 500;

// Array size *2 //
analyzer.fftSize = 32;


let bufferLength = analyzer.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)
analyzer.getByteFrequencyData(dataArray)
source.connect(analyzer)
analyzer.connect(audioCtx.destination)

// ctx settings //
ctx.lineWidth = canvas.width / dataArray.length

function onInputFileChange() {

  var file = document.getElementById('file').files[0];

  var url = URL.createObjectURL(file);

  console.log(url);

  document.getElementById("audio").src = url;

}

function loopingFunction() {
  analyzer.getByteFrequencyData(dataArray)
  requestAnimationFrame(loopingFunction)
  draw(dataArray)
}
let heightVar = 2
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  let space = canvas.width / dataArray.length;
  for(i = 0;i < dataArray[2];i++){
    ctx.beginPath();
    ctx.moveTo(space*dataArray.length/2,canvas.height); //x,y
    ctx.lineTo(space*dataArray.length/2,canvas.height-(heightVar*i)); //x,y
    ctx.stroke();
  }
}
document.getElementById('file').addEventListener('change', e => onInputFileChange())
loopingFunction()
})