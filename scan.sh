while true; do	
	now=$(date +"%y.%m.%d-%H.%M.%S")
	
	echo "\nscan EPSON @ $now"
	scanimage --format tiff --mode Gray --resolution 100 -d epson2:libusb:001:067 -p > A-$now.tiff
	
	echo "\nscan HP @ $now"
	scanimage --format tiff --mode Gray --resolution 100 -d hpaio:/usb/PSC_1600_series?serial=MY54PD10RQL0 -p > B-$now.tiff
	
	echo "\nscan HP @ $now"
	scanimage --format tiff --mode Gray --resolution 100 -d epson2:libusb:001:068 -p > C-$now.tiff
	
  convert A-$now.tiff -format jpeg scans/A-$now.jpeg
  convert B-$now.tiff -format jpeg scans/B-$now.jpeg
  convert C-$now.tiff -format jpeg scans/C-$now.jpeg
  
  rm A-$now.tiff
  rm B-$now.tiff
  rm C-$now.tiff
  
done