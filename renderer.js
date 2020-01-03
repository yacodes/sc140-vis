// const audioCtx = new window.AudioContext();
// const analyser = audioCtx.createAnalyser();
// const source = audioCtx.createMediaStreamSource(stream);
// source.connect(analyser);
// analyser.connect(distortion);

const init = async () => {
  const devices = await navigator.mediaDevices
    .enumerateDevices()
    .then(devices => devices.filter(d => d.kind === 'audioinput'));

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {deviceId: devices[5].deviceId},
  });

  const aContext = new AudioContext();
  const source = aContext.createMediaStreamSource(stream);
  const analyser = aContext.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const $canvas = document.querySelector('canvas');
  const vContext = $canvas.getContext('2d');
  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
  draw(vContext, analyser, dataArray, bufferLength)();
};

const draw = (ctx, analyser, dataArray, bufferLength) => () => {
  const W = window.innerWidth;
  const H = window.innerHeight;

  ctx.clearRect(0, 0, W, H);
  requestAnimationFrame(draw(ctx, analyser, dataArray, bufferLength));

  analyser.getByteTimeDomainData(dataArray);

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, W, H);

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  ctx.beginPath();

  var sliceWidth = (W * 1.0) / bufferLength;
  var x = 0;
  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = (v * H) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(W, H / 2);
  ctx.stroke();
};

window.addEventListener('load', init);
