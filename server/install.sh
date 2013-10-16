#!/bin/bash

echo "creating assets ..."

mkdir -v assets 

cd assets
mkdir -v 01-printbox/ 02-archives/

cd 02-archives
mkdir -v cam01/ cam02/ A3-trace/ A4-docs/

cd ../../  # back to root

echo "done"