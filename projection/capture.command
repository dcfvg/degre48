#!/bin/bash
# set -x

computer=$(scutil --get LocalHostName)  # OSX Only
inbox=~/Desktop/capture-$computer
interval=${1-4}

mkdir -v $inbox
here="`dirname \"$0\"`"

while true; do
  
  now=$(date +%s)
  screencapture -x $inbox/$now.jpg
  
  for (( i=interval; i>0; i--)); do
    sleep 1 &
    printf "next shot in $i s \r"
    wait    
    printf "                   \r"
  done
done