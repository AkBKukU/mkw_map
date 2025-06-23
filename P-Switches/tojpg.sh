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
			convert "$png" "${png%.*}.jpg"
		done
		cd ..
	fi
done
