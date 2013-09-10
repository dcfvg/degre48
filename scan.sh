# set -x
function allscan48 {
  rawDir=$1   # raw directory
  scaDir=$2   # scan directory for latex (jpeg)
  pdfDir=$3   # pdf directory for print
  
  dpi=100
  now=$(date +"%y.%m.%d-%H.%M.%S")
 	
 	echo "scan 01             "
	scanimage --format tiff --mode Gray --resolution $dpi -d epson2:libusb:001:010 -p > $rawDir/01.tiff
	
	echo "scan 02             "
	scanimage --format tiff --mode Gray --resolution $dpi -d hpaio:/usb/PSC_1600_series?serial=MY54PD10RQL0 -p > $rawDir/02.tiff
	
	echo "scan 03             "
	scanimage --format tiff --mode Gray --resolution $dpi -d epson2:libusb:001:011 -p > $rawDir/03.tiff
	
	echo "$rawDir > jpeg > $scaDir"
  mogrify -path $scaDir/ -format jpeg "$rawDir*.tiff" 
  
}
while true; do
  clear
	allscan48 raw/ links/
done