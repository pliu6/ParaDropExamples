#!/bin/sh

mkdir -p deployment/chute
mkdir -p deployment/chute/airshark
mkdir -p deployment/chute/dashboard
cp development/setup.py deployment/chute/
cp development/airshark/*.py deployment/chute/airshark/
cp -R development/dashboard/dist/* deployment/chute/dashboard/
