#!/bin/bash

echo "creating assets ..."

mkdir -v assets 

cd assets
mkdir -v 01-printbox/ 03-replay/ 00-import

cd 00-import
mkdir -v phone table

cd ../  # back to assets
cp -r 00-import 02-archives

mkdir 02-archives/printedpdf

cd ../  # back to root
mkdir -v tex_template/links

echo "done"