#/bin/bash
ffmpeg -i "$1" -vn -c:a libmp3lame "$2"