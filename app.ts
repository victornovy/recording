const fs = require('fs');
import express = require('express');
const { spawn } = require('child_process');

const app: express.Application = express();
const http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static('public'));
app.use(express.static('audios/mp3'));

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});

var currentProcess: any;
let infoFile: any = {};

const getList = () => {
  let files = fs.readdirSync('./audios/mp3');
  files = files
    .filter((file: any) => {
      return file.endsWith('.mp3');
    })
    .map((file: any) => {
      return {
        name: file.replace('.mp3', ''),
        file: file
      };
    });

  return files;
};

const convert = (socket: any) => {
  const convert = spawn('bash', [
    './scripts/convertToMp3.sh',
    `./audios/wav/${infoFile.name}.wav`,
    `./audios/mp3/${infoFile.name}.mp3`
  ]);

  convert.stdout.on('data', (info: any) => {
    console.log(`stdout: ${info}`);
  });

  convert.stdout.on('error', (info: any) => {
    console.log(`error: ${info}`);
  });

  convert.on('close', (code: any) => {
    console.log(`exit convert ${code}`);

    socket.emit('list', getList());
  });
};

// TODO: Refatorar
io.on('connection', function(socket: any) {
  console.log('a user connected');

  socket.on('startRecording', (data: any) => {
    currentProcess = spawn('python', ['./scripts/recording.py']);

    currentProcess.stdout.on('data', (info: any) => {
      if (info && info.indexOf('{') > -1) {
        infoFile = JSON.parse(info);
      }

      console.log(`stdout: ${info}`);
    });

    currentProcess.on('close', (code: any) => {
      console.log(`child process exited with code ${code}`);
    });

    socket.emit('recording', {
      recording: true
    });
  });

  socket.emit('recording', {
    recording: !!currentProcess
  });

  socket.emit('list', getList());

  socket.on('convert', function(data: any) {});

  socket.on('stopRecording', function(data: any) {
    if (currentProcess) {
      currentProcess.kill('SIGTERM');
    }

    currentProcess = null;

    convert(socket);

    socket.emit('recording', {
      recording: false
    });
  });
});
