Vue.use(VueMaterial.default);

var app = new Vue({
  el: '#app',
  data: {
    isRecording: false,
    recordings: [],
    currentDevice: '',
    devicesList: []
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
      console.log(devicesList);
      app.devicesList = devicesList;
    }
  }
});

const socket = io(window.location.origin);

socket.on('recording', app.recording);
socket.on('list', app.getList);
socket.on('devices', app.devices);
