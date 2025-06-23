#!/usr/env python3
import os
import json
import pprint
data=[]
for filename in os.listdir('./'):
	if os.path.isdir(filename):
		if os.path.isfile(filename+"/info.json"):
			# Open and read the JSON file
			with open(filename+"/info.json", 'r') as file:
				data.append(json.load(file))
list_output = "names="
list_output+=pprint.pformat(data, indent=4)
list_output += ";"

print(list_output)
