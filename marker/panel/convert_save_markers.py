#!/usr/bin/env python3

import sys
import os
import json
from pprint import pprint

markers=sys.argv[1]

offset=0

newdata = []
with open(markers) as f:
    jdata = json.load(f)

    for d in jdata["custom"]:

        newdata.append(
            {
                "name":d["name"],
                "map_position":[int(d["x"]),int(d["y"])],
                "map_offset": [offset, offset],
                "imgs": ["location"],
            })

pprint(newdata)
