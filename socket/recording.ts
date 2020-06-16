import socketIO from 'socket.io';
import * as socketIOClient from 'socket.io-client';
import fs from 'fs';
import { spawn } from 'child_process';

export default class Recording {
  private socket: SocketIOClient.Socket;
  private currentProcess: any;
  private infoFile: { name: string };

  constructor() {
    this.infoFile = {
      name: ''
    };
  }

  start(socket: SocketIOClient.Socket) {
    this.socket = socket;

    this.listenStartRecording();
    this.listenStopRecording();
    this.emitList();

    const hasProcess = !!this.currentProcess;
    this.emitRecording(hasProcess);
    this.devicesList();
  }

  private listenStartRecording() {
    this.socket.on('startRecording', (info) => {
      console.log('asfsadfsadf');
      if (!info.deviceId) {
        return console.error('### [ERROR] Device not found');
      }

      this.currentProcess = spawn('python', [
        './scripts/recording.py',
        info.deviceId
      ]);

      this.currentProcess.stdout.on('data', (info: any) => {
        if (info && info.indexOf('{') > -1) {
          this.infoFile = JSON.parse(info);
        }

        console.log(`stdout: ${info}`);
      });

      this.currentProcess.on('close', (code: any) => {
        console.log(`child process exited with code ${code}`);
      });

      this.emitRecording(true);
    });
  }

  private listenStopRecording() {
    this.socket.on('stopRecording', () => {
      if (this.currentProcess) {
        this.currentProcess.kill('SIGTERM');
      }

      this.currentProcess = null;

      this.convertToMp3(this.infoFile.name);
      this.emitRecording(false);
    });
  }

  getList() {
    let files: any = fs.readdirSync('./audios/mp3');
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
  }

  emitList() {
    this.socket.emit('list', this.getList());
  }

  emitRecording(isRecording: boolean) {
    this.socket.emit('recording', { isRecording });
  }

  private convertToMp3(fileName: string) {
    const convert = spawn('bash', [
      './scripts/convertToMp3.sh',
      `./audios/wav/${fileName}.wav`,
      `./audios/mp3/${fileName}.mp3`
    ]);

    convert.stdout.on('data', (info: any) => {
      console.log(`stdout: ${info}`);
    });

    convert.stdout.on('error', (info: any) => {
      console.log(`error: ${info}`);
    });

    convert.on('close', (code: any) => {
      console.log(`exit convert ${code}`);
    });

    this.emitList();
  }

  devicesList() {
    const devicesSpawn = spawn('python', ['./scripts/devices.py']);

    devicesSpawn.stdout.on('data', (devices: any) => {
      devices = JSON.parse(devices);
      this.socket.emit('devices', devices);
    });;

    devicesSpawn.on('close', (code: any) => {
      console.log(`exit devices list ${code}`);
    });
  }
}
