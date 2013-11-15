#!/bin/bash
mkdir -v ~/Desktop/live/
cd "$(pwd)/assets/03-replay/"

while true; do

  #ffmpeg -r 5 -y -f image2 -pattern_type glob -i '*.jpg' out.mp4
  ffmpeg -f image2 -pattern_type glob -i '*.jpg' -r 12 -vcodec mpeg4 -b 30000k -vf scale=1920:-1 -y tmp.mp4
	
  cp -rf tmp.mp4 ~/Desktop/live/live.mp4
  rm tmp.mp4
  
  for (( i=15; i>0; i--)); do
    sleep 1 &
    printf "next shot in $i s \r"
    wait    
    printf "                   \r"
  done
done