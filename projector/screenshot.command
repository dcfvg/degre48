#!/bin/bash
mkdir -v ~/Desktop/capture-auto/

while true; do
  screencapture -x ~/Desktop/capture-auto/capture.png
  
  for (( i=15; i>0; i--)); do
    sleep 1 &
    printf "next shot in $i s \r"
    wait    
    printf "                   \r"
  done
done