Vue.use(VueMaterial.default);

var app = new Vue({
  el: '#app',
  data: {
    isRecording: false,
    records: [{ name: 'Teste', date: '2020-01-01' }]
  },
  methods: {
    startRecord: () => {
      console.log('startRecord');
      app.isRecording = true;

      // socket.emit('startRecord', 'HELLO WORLD');
    },
    stopRecord: () => {
      console.log('stopRecord');
      app.isRecording = false;
      // socket.emit('stopRecord', 'by WORLD');
    },
    recording: data => {
      app.isRecording = data.recording;
      console.log('recording', data);
    }
  }
});

const socket = io(window.location.origin);

socket.on('recording', app.recording);
