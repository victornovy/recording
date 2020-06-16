import express from 'express';
import socketIO from 'socket.io';
import http from 'http';

const port: number = 3000;

class App {
  private port: number;
  private server: http.Server;
  private io: socketIO.Server;

  constructor(port: number) {
    this.port = port;

    const app = express();

    this.server = new http.Server(app);
    this.io = socketIO(this.server);
  }

  public start() {
    this.server.listen(this.port);
    console.log(`Server listening on ${this.port}`);

    this.onConnect();
  }

  private onConnect() {
    this.io.on('connection', (socket: socketIO.Socket) => {
      console.log('User connected : ' + socket.id);
      const isMachine = socket.handshake.query.name === 'machine';
      if (isMachine) {
        this.io.emit('machineAvaible', isMachine);
      } else {
        this.io.emit('storeConnect');
      }

      socket.on('disconnect', () => {
        const isMachine = socket.handshake.query.name === 'machine';
        if (isMachine) {
          this.io.emit('machineAvaible', false);
        }
      });

      socket.on('list', (data) => {
        this.io.emit('list', data);
      });

      socket.on('devices', (data) => {
        this.io.emit('devices', data);
      });

      socket.on('startRecording', (data) => {
        this.io.emit('startRecording', data);
      });

      socket.on('stopRecording', (data) => {
        this.io.emit('stopRecording', data);
      });
    });
  }
}

new App(port).start();
