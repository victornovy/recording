from pydub import AudioSegment
AudioSegment.from_wav("./2020-02-24_22-06-22.wav")
  .export("./2020-02-24_22-06-22.mp3", format="mp3")
