import sys
from pydub import AudioSegment
from pydub.utils import which

AudioSegment.converter = which("ffmpeg")

originFile=sys.argv[1]
destFile=sys.argv[2]

sound = AudioSegment.from_file(originFile)
sound = sound.set_channels(1)
sound.export(destFile, format="mp3", bitrate="128k")
