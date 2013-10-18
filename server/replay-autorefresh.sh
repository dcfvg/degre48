#!/bin/bash

mkdir -v ~/Desktop/live/
epath=$(dirname $0)

cd $(pwd)

while true; do

  ffmpeg -r 5 -y -f image2 -pattern_type glob -i '*.jpg' out.mp4
  cp -rf ~/Desktop/live/live.mp4
  rm tmp.mp4
  
  for (( i=15; i>0; i--)); do
    sleep 1 &
    printf "next shot in $i s \r"
    wait    
    printf "                   \r"
  done
done