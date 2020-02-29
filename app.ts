import express from 'express';
import socketIO from 'socket.io';
import http from 'http';
import path from 'path';
import Recording from './socket/recording';

const port: number = 3000;

class App {
  private port: number;
  private server: http.Server;
  private io: socketIO.Server;
  private recording: Recording;

  constructor(port: number) {
    this.port = port;

    const app = express();
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static('audios/mp3'));

    this.server = new http.Server(app);
    this.io = socketIO(this.server);

    this.recording = new Recording();
  }

  public start() {
    this.server.listen(this.port);
    console.log(`Server listening on ${this.port}`);

    this.onConnect();
  }

  private onConnect() {
    this.io.on('connection', (socket: socketIO.Socket) => {
      console.log('User connected : ' + socket.id);

      this.recording.start(socket);
    });
  }
}

new App(port).start();
