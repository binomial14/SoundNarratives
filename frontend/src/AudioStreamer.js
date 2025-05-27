import io from 'socket.io-client';

// const socket = new io.connect("https://10.0.0.123:10003/", {transports: ['websocket']});
const BACKEND_URL = "https://34.170.102.124:10000"
const socket = io("wss://34.170.102.124:10000",{transports: ['websocket']});

const mediaConstraints = {
    audio: true,
    video: false
  };

let AudioContext, context, processor, globalStream, input

let AudioStreamer = {
    startRecording: function (onData, onLoading, config) {
        socket.emit('startClient', config);

        AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        processor = context.createScriptProcessor(2048, 1, 1);
        processor.connect(context.destination);
        context.resume();

        const handleSuccess = function (stream) {
            globalStream = stream;
            input = context.createMediaStreamSource(stream);
            input.connect(processor);
      
            processor.onaudioprocess = function (e) {
              microphoneProcess(e);
            };
          };
      
          navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(handleSuccess);
      
      //   if (onData) {
      //       socket.on('transcriptData', (response) => {
      //           onData(response.speaker_id, response.data, response.isFinal);
      //           console.log("data")
      //       });
      //   }

      //   if (onData) {
      //     socket.on('systemInfo', (response) => {
      //         onLoading(response.speaker_id, response.data, response.isFinal);
      //         console.log("Loading")
      //         console.log(response.isFinal)
      //     });
      // }
      
          
        socket.on('stopClient', () => {
            closeAll();
        });

        console.log("start recording!");
    },

    stopRecording: function () {
        console.log("stop recording!");
        socket.emit('stopClient');
        closeAll();
    }
}

export {AudioStreamer, socket, BACKEND_URL};

function microphoneProcess(e) {
    const left = e.inputBuffer.getChannelData(0);
    const left16 = convertFloat32ToInt16(left);
    socket.emit('audioData',left16);
  }
  
  /**
   * Converts a buffer from float32 to int16. Necessary for streaming.
   * sampleRateHertz of 1600.
   *
   * @param {object} buffer Buffer being converted
   */
  function convertFloat32ToInt16(buffer) {
    let l = buffer.length;
    let buf = new Int16Array(l / 3);
  
    while (l--) {
      if (l % 3 === 0) {
        buf[l / 3] = buffer[l] * 0xFFFF;
      }
    }
    return buf.buffer
  }

function closeAll() {
    socket.off("transcriptData");
    let tracks = globalStream ? globalStream.getTracks() : null;
    let track = tracks ? tracks[0] : null;
    if (track) {
        track.stop();
    }

    if (processor) {
        if (input) {
        try {
            input.disconnect(processor);
        } catch (error) {
            console.warn('Attempt to disconnect input failed.')
        }
        }
        processor.disconnect(context.destination);
    }
    if (context) {
        
        context.close().then(function () {
        input = null;
        processor = null;
        context = null;
        AudioContext = null;
        });
}
}