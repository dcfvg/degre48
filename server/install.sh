#!/bin/bash

echo "creating assets ..."

mkdir -v assets 

cd assets
mkdir -v 01-printbox/ 03-replay/ 00-import

cd 00-import
mkdir -v phone01 phone02 table

cd ../  # back to assets
cp -r 00-import 02-archives

cd ../  # back to root
mkdir -v tex_template/links

echo "done"