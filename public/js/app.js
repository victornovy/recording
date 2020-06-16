Vue.use(VueMaterial.default);

var app = new Vue({
  el: '#app',
  data: {
    isRecording: false,
    recordings: [],
    currentDevice: '',
    devicesList: [],
    avaibleToRecord: false
  },
  methods: {
    startRecording: () => {
      app.isRecording = true;
      socket.emit('startRecording', { deviceId: app.currentDevice });
    },
    stopRecording: () => {
      app.isRecording = false;
      socket.emit('stopRecording', 'by WORLD');
    },
    getList: recordings => {
      app.recordings = recordings;
    },
    recording: data => {
      app.isRecording = data.isRecording;
    },
    devices: devicesList => {
      app.devicesList = devicesList;
    },
    machineAvaible: avaible => {
      app.avaibleToRecord = avaible;
      if (!avaible) {
        app.devicesList = false;
        app.recordings = false;
      }
    }
  }
});

const socket = io('http://localhost:3000');

socket.on('recording', app.recording);
socket.on('list', app.getList);
socket.on('devices', app.devices);
socket.on('machineAvaible', app.machineAvaible);