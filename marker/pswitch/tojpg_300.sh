#!/bin/bash

for dir in *
do
	if [[ -d $dir ]]
	then
		echo "Working on: $dir"
		cd "$dir"
		for png in *.png
		do
			echo "Converting: $png to ${png%.*}.jpg"
			#convert "$png" -resize 300x300 "300_${png%.*}.jpg"
			rm *.png
		done
		cd ..
	fi
done
