import * as socketIOClient from 'socket.io-client';
import Recording from './socket/recording';

const socket = socketIOClient.connect('http://localhost:3000', {
  query: {
    name: 'machine'
  }
});

class Machine {
  private socket: SocketIOClient.Socket;
  private recording: Recording;

  constructor(socket: SocketIOClient.Socket) {
    this.socket = socket;

    this.recording = new Recording();
  }

  start() {
    this.socket.on('storeConnect', () => {
      this.recording.start(this.socket);
    });


    this.recording.start(this.socket);
  }
}

new Machine(socket).start();
