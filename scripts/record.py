import sounddevice as sd
import soundfile as sf
import queue
import datetime;

q = queue.Queue()

def callback(indata, frames, time, status):
    """This is called (from a separate thread) for each audio block."""
    if status:
        print(status)
    q.put(indata.copy())

fileName=datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S") + '.wav'
mode='x'
channels=1
device=8

device_info = sd.query_devices(device, 'input')
samplerate = int(device_info['default_samplerate'])

try:
  with sf.SoundFile(fileName, mode=mode, samplerate=samplerate, channels=channels) as file:
    with sd.InputStream(samplerate=samplerate, device=device, channels=channels, callback=callback):
      while True:
        file.write(q.get())
except KeyboardInterrupt:
    print('\nRecording finished: ' + fileName)
    exit()
except Exception as e:
    print(e)
    exit()