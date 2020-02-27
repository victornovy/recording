import express = require('express');
const { spawn } = require('child_process');

const app: express.Application = express();
const http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static('public'));

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});

var currentProcess: any;

// TODO: Refatorar
io.on('connection', function(socket: any) {
  console.log('a user connected');

  socket.on('startRecording', (data: any) => {
    currentProcess = spawn('python', ['./scripts/recording.py']);

    currentProcess.stdout.on('data', (data: any) => {
      console.log(`stdout: ${data}`);
    });

    currentProcess.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data}`);
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

  socket.on('stopRecording', function() {
    if (currentProcess) {
      currentProcess.kill();
    }
    currentProcess = null;

    socket.emit('recording', {
      recording: false
    });
  });
});
