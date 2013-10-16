#!/bin/bash

echo "creating assets ..."

mkdir -v assets assets/01-sources

cd assets/01-sources
mkdir -v cam01/ cam02/ ipad/ mobile/ scanA3/

cd ../  # back to assets
mkdir -v 02-latexlinks/ 03-printbox/ 04-archives

cd ../  # back to root

echo "done"
