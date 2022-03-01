const audioElem = document.getElementById('audio')
const audioCtx = new window.AudioContext()
const analyzer = audioCtx.createAnalyser()
const source = audioCtx.createMediaElementSource(audioElem)
analyzer.fftSize = 32;
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
document.getElementById('file').addEventListener('change', e => onInputFileChange())