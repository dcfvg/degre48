#!/bin/bash
#set -x

freq=${1-5}
echo "Setting frequence to $freq s"

dpi=${2-72}
echo "Setting resolution to $dpi dpi"

fuzz=${3-40}
echo "Setting fuzz for keying to $fuzz%"

scanA3="epson2:libusb:001:006"
scanA4="epson2:libusb:001:006"

hiddenColor="#3485e0"

assets=assets
mkdir $assets

function scan {
  now=$(date +"%y.%m.%d-%H.%M.%S")
  
  # config scanner 
  # 1. scanimage -L
  # 2. copy the adress ( ex. epson2:libusb:001:006 ) to the -d param
  # 
  
  echo "scan A3 Epson ES-7000H      "
	scanimage --format tiff --resolution $dpi --mode Lineart -d $scanA3 > $assets/A3.tiff
  #convert -monitor -format png $assets/A3.jpeg $assets/A3.jpeg
  
  # echo "scan A4                     "
  # scanimage --format tiff --mode Color --resolution $dpi -d $scanA4 -p > $assets/A4.tiff
  # convert -format png "$assets/A4.tiff" -fuzz $fuzz% -transparent $hiddenColor -modulate 100,0 $assets/A4.png
  
}

while true; do 
  scan
  for (( i=$freq; i>0; i--)); do
    sleep 1 &
    printf "next shot in $i s \r"
    wait    
    printf "                  \r"
  done
done  