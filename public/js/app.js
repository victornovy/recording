Vue.use(VueMaterial.default);

var app = new Vue({
  el: '#app',
  data: {
    isRecording: false,
    recordings: [{ name: 'Teste', date: '2020-01-01' }]
  },
  methods: {
    startRecording: () => {
      console.log('startRecording');
      app.isRecording = true;

      socket.emit('startRecording', 'HELLO WORLD');
    },
    stopRecording: () => {
      console.log('stopRecording');
      app.isRecording = false;
      socket.emit('stopRecording', 'by WORLD');
    },
    getList: recordings => {
      app.recordings = recordings;
    },
    recording: data => {
      app.isRecording = data.recording;
      console.log('recording', data);
    },
    download: recording => {
      console.log(recording);
    }
  }
});

const socket = io(window.location.origin);

socket.on('recording', app.recording);
socket.on('list', app.getList);
