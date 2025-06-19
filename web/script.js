const canvas = document.getElementById("map_canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// Main Elements
const transformedMousePos = document.getElementById('transformed-mouse-pos');
const titleOut = document.getElementById('titleOut');
const control_ps_complete = document.getElementById('control_ps_complete')
const control_ps_all_ends = document.getElementById('control_ps_all_ends')
const control_marker_pswitch = document.getElementById('control_marker_pswitch')
const control_all_segs = document.getElementById('control_all_segs')
const ps_search = document.getElementById('ps_search');
ul_pswitches = document.getElementById("pswitches_imgs");

// Map image
const map = new Image();
map.src = "web/map.png";
map.onload = drawMap;
window.innerWidth

map_pointer = {
    valid: false,
    x: 0,
    y: 0
};

map_control_x = 1920/2;
map_control_y = 1080/2;
map_control_zoom = 1;

spoiler = false;

let isDragging = false;
let dragStartPosition = { x: 0, y: 0 };
let clickStartPosition = { x: 0, y: 0 };
let currentTransformedCursor;
let scale = 1;
let selected = null;
let selected_key = null;
let found = null;
let found_key = null;
let filter = "";
marker_radius = 16;
loadData = null;
allends=false;
allsegments=false;
route=[];
route_sel_segment=null;
route_sel_split=null;
segment_colors = [
    "#f33",
    "#3f3",
    "#33f",
    "#ff3",
    "#3ff",
    "#f3f"
    ]


markers = {};
markers["pswitch"]=names;
markers["custom"]=[];
markers["track"]=[
    {
        "name":"Acorn Heights",
        "map_position":[927,83],
        "map_offset": [29, 29]
    },
    {
        "name":"Airship Fortress",
        "map_position":[490,299],
        "map_offset": [29, 29]
    },
    {
        "name":"Boo Cinema",
        "map_position":[1099,152],
        "map_offset": [29, 29]
    },
    {
        "name":"Bowser's Castle",
        "map_position":[633,195],
        "map_offset": [29, 29]
    },
    {
        "name":"Cheep Cheep Falls",
        "map_position":[1110,369],
        "map_offset": [29, 29]
    },
    {
        "name":"Choco Mountain",
        "map_position":[775,539],
        "map_offset": [29, 29]
    },
    {
        "name":"Crown City",
        "map_position":[765,780],
        "map_offset": [29, 29]
    },
    {
        "name":"Dandelion Depths",
        "map_position":[1094,558],
        "map_offset": [29, 29]
    },
    {
        "name":"Desert Hills",
        "map_position":[446,751],
        "map_offset": [29, 29]
    },
    {
        "name":"Dino Dino Jungle",
        "map_position":[1116,934],
        "map_offset": [29, 29]
    },
    {
        "name":"DK Pass",
        "map_position":[1220,424],
        "map_offset": [29, 29]
    },
    {
        "name":"DK Spaceport",
        "map_position":[738,941],
        "map_offset": [29, 29]
    },
    {
        "name":"Dry Bones Burnout",
        "map_position":[797,165],
        "map_offset": [29, 29]
    },
    {
        "name":"Faraway Oasis",
        "map_position":[1096,757],
        "map_offset": [29, 29]
    },
    {
        "name":"Great ? Block Ruins",
        "map_position":[1285,878],
        "map_offset": [29, 29]
    },
    {
        "name":"Koopa Troopa Beach",
        "map_position":[927,866],
        "map_offset": [29, 29]
    },
    {
        "name":"Mario Bros. Circuit",
        "map_position":[588,656],
        "map_offset": [29, 29]
    },
    {
        "name":"Mario Circuit",
        "map_position":[939,272],
        "map_offset": [29, 29]
    },
    {
        "name":"Moo Moo Meadows",
        "map_position":[933,451],
        "map_offset": [29, 29]
    },
    {
        "name":"Peach Beach",
        "map_position":[1375,737],
        "map_offset": [29, 29]
    },
    {
        "name":"Peach Stadium",
        "map_position":[932,620],
        "map_offset": [29, 29]
    },
    {
        "name":"Salty Salty Speedway",
        "map_position":[1256,663],
        "map_offset": [29, 29]
    },
    {
        "name":"Shy Guy Bazaar",
        "map_position":[451,552],
        "map_offset": [29, 29]
    },
    {
        "name":"Sky-High Sundae",
        "map_position":[1377,352],
        "map_offset": [29, 29]
    },
    {
        "name":"Starview Peak",
        "map_position":[1237,250],
        "map_offset": [29, 29]
    },
    {
        "name":"Toad's Factory",
        "map_position":[770,350],
        "map_offset": [29, 29]
    },
    {
        "name":"Wario Shipyard",
        "map_position":[1410,550],
        "map_offset": [29, 29]
    },
    {
        "name":"Wario Stadium",
        "map_position":[637,443],
        "map_offset": [29, 29]
    },
    {
        "name":"Whistlestop Summit",
        "map_position":[602,848],
        "map_offset": [29, 29]
    }
];


marker_show_pswitch=true;
marker_show_custom=false;
marker_show_track=false;
//markers["custom"].push({"name":"The middle of the ocean","map_position":[888,777]});

// ---- Events ---- //


// Add Segment
function markerCustomAdd()
{
    const name = document.getElementById('markerCustomName').value;
    if (!map_pointer.valid)
    {
        alert("Please select a location on the map first.");
        return;
    }
    if (name == "")
    {
        alert("Please enter a marker name.");
        return;
    }
    if (marker_find(name,true) != -1)
    {
        alert("Please enter a unique marker name.");
        return;
    }

    markers["custom"].push({"name":name,"map_position":[map_pointer.x,map_pointer.y]});
    map_addMarker(name,"custom")
    drawMap();

}
document.getElementById("markerCustomAdd").addEventListener('click', markerCustomAdd);
function markerCustomDel()
{
    mindex = marker_find(selected,false,"custom");
    split_remove(selected);
    markers["custom"].splice(mindex,1);
    map_delMarker(selected,"custom")
    set_selected(markers["pswitch"][0]["name"],null,"pswitch");
    drawMap();

}
document.getElementById("markerCustomDel").addEventListener('click', markerCustomDel);


// Completed check
function seg_remove()
{
    index = segment_find_index(route_sel_segment);
    if (index == -1) return;

    route.splice(index, 1);

    if (route.length > 0)
    {
        set_route_segment(route[0]["segment"]);
    }else{
        route_sel_segment = null;
    }
    route_list();
    drawMap();
    return;
}
document.getElementById('segDel').addEventListener('click', seg_remove);


function seg_up()
{
    index = segment_find_index(route_sel_segment);
    if (index == -1) return;

    if (index != 0 && 1 != route.length)
    {
        index = Number(index)
        temp = route[index-1];

        route[index-1] = route[index];
        route[index] = temp;
        route_list();
        drawMap();
        return;
    }

}
document.getElementById('segUp').addEventListener('click', seg_up);

function seg_down()
{
    index = segment_find_index(route_sel_segment);
    if (index == -1) return;

    if (index != route.length-1 && 1 != route.length)
    {
        index = Number(index)
        temp = route[index+1];

        route[index+1] = route[index];
        route[index] = temp;
        route_list();
        drawMap();
        return;
    }
}
document.getElementById('segDown').addEventListener('click', seg_down);

function split_remove()
{
    index = segment_find_index(route_sel_segment);
    if (index == -1) return;

    for (j in route[index]["splits"])
    {
        if (route[index]["splits"][j]["name"] == selected)
        {
            route[index]["splits"].splice(j, 1);
            route_list();
            drawMap();
            return;
        }
    }
}
document.getElementById('segDelSplit').addEventListener('click', split_remove);


function split_up()
{
    index = segment_find_index(route_sel_segment);
    if (index == -1) return;

    for (j in route[index]["splits"])
    {
        if (route[index]["splits"][j]["name"] == selected)
        {
            if (j != 0 && 1 != route[index]["splits"].length)
            {
                j = Number(j)
                temp = route[index]["splits"][j-1];

                route[index]["splits"][j-1] = route[index]["splits"][j];
                route[index]["splits"][j] = temp;
                route_list();
                drawMap();
                return;
            }
        }
    }
}
document.getElementById('segUpSplit').addEventListener('click', split_up);

function split_down()
{
    index = segment_find_index(route_sel_segment);
    if (index == -1) return;

    for (j in route[index]["splits"])
    {
        if (route[index]["splits"][j]["name"] == selected)
        {
            if (j != route[index]["splits"].length-1 && 1 != route[index]["splits"].length)
            {
                j = Number(j)
                temp = route[index]["splits"][j+1];

                route[index]["splits"][j+1] = route[index]["splits"][j];
                route[index]["splits"][j] = temp;
                route_list();
                drawMap();
                return;
            }
        }
    }
}
document.getElementById('segDownSplit').addEventListener('click', split_down);

function saveComplete()
{
    saveData = {"pswitch":[],"custom":[]};
    markers["pswitch"].forEach((c) => {
        saveData["pswitch"].push({ "name" : c["name"], "done":c["done"] });
    });

    markers["custom"].forEach((c) => {
        saveData["custom"].push({ "name" : c["name"], "x":c["map_position"][0], "y":c["map_position"][1] });
    });

    var xmlns_v = "urn:v";
    download("save.json",JSON.stringify(saveData));
}
document.getElementById("completeSave").addEventListener('click', saveComplete);

//  Upload
async function uploadCompletion()
{
    const [file] = document.getElementById("completeLoad").files;

    if (file) {
        loadData =  JSON.parse(await file.text());
    }

    loadData["pswitch"].forEach((c) => {
        setComplete(c["name"],c["done"],"pswitch");
    });
    loadData["custom"].forEach((c) => {
    markers["custom"].push({"name":c["name"],"map_position":[c["x"],c["y"]]});
    map_addMarker(c["name"],"custom")
    });
    drawMap();
};
document.getElementById("completeLoad").addEventListener('change', uploadCompletion);

// Completed check

function saveRoute()
{
    var xmlns_v = "urn:v";
    Run = document.createElementNS(xmlns_v, "Run");
    Run.setAttribute("version","1.7.0");

    GameIcon = document.createElementNS(xmlns_v, "GameIcon");
    Run.appendChild(GameIcon);

    GameName = document.createElementNS(xmlns_v, "GameName");
    GameName.innerHTML = "Mario Kart World";
    Run.appendChild(GameName);

    CategoryName = document.createElementNS(xmlns_v, "CategoryName");
    CategoryName.innerHTML = "All P-Switches";
    Run.appendChild(CategoryName);

    LayoutPath = document.createElementNS(xmlns_v, "LayoutPath");
    Run.appendChild(LayoutPath);

    Metadata = document.createElementNS(xmlns_v, "Metadata");
    Metadata_Run = document.createElementNS(xmlns_v, "Run");
    Metadata_Run.setAttribute("id","");
    Metadata.appendChild(Metadata_Run);

    Metadata_Platform = document.createElementNS(xmlns_v, "Platform");
    Metadata_Platform.setAttribute("usesEmulator","False");
    Metadata.appendChild(Metadata_Platform);

    Metadata_Region = document.createElementNS(xmlns_v, "Region");
    Metadata.appendChild(Metadata_Region);

    Metadata_Variables = document.createElementNS(xmlns_v, "Variables");
    Metadata.appendChild(Metadata_Variables);

    Metadata_CustomVariables = document.createElementNS(xmlns_v, "CustomVariables");
    Metadata.appendChild(Metadata_CustomVariables);
    Run.appendChild(Metadata);

    Offset = document.createElementNS(xmlns_v, "Offset");
    Offset.innerHTML = "00:00:00";
    Run.appendChild(Offset);

    AttemptCount = document.createElementNS(xmlns_v, "AttemptCount");
    AttemptCount.innerHTML = "0";
    Run.appendChild(AttemptCount);

    AttemptHistory = document.createElementNS(xmlns_v, "AttemptHistory");
    Run.appendChild(AttemptHistory);

    Segments = document.createElementNS(xmlns_v, "Segments");

    for (i in route)
    {

        route[i]["splits"].forEach(split => {

            Seg = document.createElementNS(xmlns_v, "Segment");
            Name = document.createElementNS(xmlns_v, "Name");
            pre="";
            if (split["rw"])
            {
                pre="[RW] ";
            }
            Name.innerHTML = pre+""+split["name"];
            Name.setAttribute("map_seg",route[i]["segment"]);
            Seg.appendChild(Name);
            Icon = document.createElementNS(xmlns_v, "Icon");
            Seg.appendChild(Icon);
            SplitTimes = document.createElementNS(xmlns_v, "SplitTimes");
            SplitTime = document.createElementNS(xmlns_v, "SplitTime");
            SplitTime.setAttribute("name","Personal Best");
            SplitTimes.appendChild(SplitTime);
            Seg.appendChild(SplitTimes);
            BestSegmentTime = document.createElementNS(xmlns_v, "BestSegmentTime");
            Seg.appendChild(BestSegmentTime);
            SegmentHistory = document.createElementNS(xmlns_v, "SegmentHistory");
            Seg.appendChild(SegmentHistory);

            Segments.appendChild(Seg);
        });
    };

    Run.appendChild(Segments);

    AutoSplitterSettings = document.createElementNS(xmlns_v, "AutoSplitterSettings");
    Run.appendChild(AutoSplitterSettings);

    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(Run);

    download("splits.lss",xmlStr);
}
document.getElementById("routeSave").addEventListener('click', saveRoute);

//  Upload
async function uploadRoute()
{
    const [file] = document.getElementById("routeLoad").files;
    seg="";
    if (file) {
        route=[];
        xml=await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");
        splits=doc.querySelectorAll("Segment");
        for (s in splits)
        {
            if (isNaN(s)) continue;
            for (const child of splits[s].children) {
                if ( child.tagName == "Name")
                {
                    seg=child.getAttribute("map_seg");
                    segment_add(seg);
                    split=child.textContent.replace("[RW] ", "");
                    rw = child.textContent.includes("[RW]");

                    index = segment_find_index(route_sel_segment);
                    route[index]["splits"].push({"name":split,"rw":rw})
                }
            }
        }
    }
    set_route_segment(seg);
    route_list();
    drawMap();

};
document.getElementById("routeLoad").addEventListener('change', uploadRoute);

function oncheck()
{
    setComplete(selected,control_ps_complete.checked,selected_key);
}
control_ps_complete.addEventListener('change', (event) => {
    oncheck()
});
control_ps_all_ends.addEventListener('change', (event) => {
    allends=event.currentTarget.checked;
    drawMap();
});
control_all_segs.addEventListener('change', (event) => {
    allsegments=event.currentTarget.checked;
    drawMap();
});
document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||
        e.keyCode == 32
    ) {
        setComplete(selected,!control_ps_complete.checked,selected_key);
    }
}


function showMarkersPswitch(set_state = null)
{
    if (set_state != null) control_marker_pswitch.checked = set_state;

    if(control_marker_pswitch.checked)
    {
         document.getElementById('field_markers_pswitch').style.display = "block";
        if(document.getElementById('control_show_pslocation').checked)
        {
            document.getElementById('menu_location').style.display = "block";
        }
        if(document.getElementById('control_show_pstitle').checked)
        {
            document.getElementById('menu_title').style.display = "block";
        }
    }else{
        document.getElementById('field_markers_pswitch').style.display = "none";
        document.getElementById('menu_location').style.display = "none";
        document.getElementById('menu_title').style.display = "none";
    }
    marker_show_pswitch=control_marker_pswitch.checked;
    drawMap();
}
control_marker_pswitch.addEventListener('change', (event) => {
    showMarkersPswitch()
});

function showRouting(event,set_state = null)
{
    if (set_state != null) document.getElementById('control_show_routing').checked = set_state;
    if(document.getElementById('control_show_routing').checked)
    {
         document.getElementById('menu_routing').style.display = "block";
    }else{
        document.getElementById('menu_routing').style.display = "none";
    }
}
document.getElementById('control_show_routing').addEventListener('change', (event) => {
    showRouting()
});

function showPSLocation(event,set_state = null)
{
    if (set_state != null) document.getElementById('control_show_pslocation').checked = set_state;
    if(document.getElementById('control_show_pslocation').checked)
    {
         document.getElementById('menu_location').style.display = "block";
    }else{
        document.getElementById('menu_location').style.display = "none";
    }
}
document.getElementById('control_show_pslocation').addEventListener('change', (event) => {
    showPSLocation()
});

function showPSTitle(event,set_state = null)
{
    if (set_state != null) document.getElementById('control_show_pstitle').checked = set_state;
    if(document.getElementById('control_show_pstitle').checked)
    {
         document.getElementById('menu_title').style.display = "block";
    }else{
        document.getElementById('menu_title').style.display = "none";
    }
}
document.getElementById('control_show_pstitle').addEventListener('change', (event) => {
    showPSTitle()
});

function showMarkersCustom(event,set_state = null)
{
    if (set_state != null) document.getElementById('control_marker_custom').checked = set_state;
    if(document.getElementById('control_marker_custom').checked)
    {
         document.getElementById('field_markers_custom').style.display = "block";
    }else{
        document.getElementById('field_markers_custom').style.display = "none";
    }
    marker_show_custom=control_marker_custom.checked;
    drawMap();
}
document.getElementById('control_marker_custom').addEventListener('change', (event) => {
    showMarkersCustom()
});

function showMarkersTracks(event,set_state = null)
{
    if (set_state != null) document.getElementById('control_marker_track').checked = set_state;
    if(document.getElementById('control_marker_track').checked)
    {
         document.getElementById('field_markers_track').style.display = "block";
    }else{
        document.getElementById('field_markers_track').style.display = "none";
    }
    marker_show_track=control_marker_track.checked;
    drawMap();
}
document.getElementById('control_marker_track').addEventListener('change', (event) => {
    showMarkersTracks()
});

// List search
const ps_search_filter_set = function(e) {
    filter = e.target.value;
    ps_search_filter();
    drawMap();
}

// TODO - Make this generic based off of textContent of list items
function ps_search_filter() {
    // loop list

    for (const [key, value] of Object.entries(markers)) {
        if (key == "pswitch") value.forEach((c) => {
            // Match
            list_item = document.getElementById("list_"+c['name']);
            img_item = document.getElementById(c['name']);
            if(filter=="" || c['name'].toUpperCase().includes(filter.toUpperCase()))
            {
                list_item.style.display = "list-item";
                img_item.style.display = "block";
            }else{
                list_item.style.display = "none";
                img_item.style.display = "none";
            }
        });
    }
}
ps_search.addEventListener('input', ps_search_filter_set);

function getTransformedPoint(x, y) {
    const originalPoint = new DOMPoint(x, y);
    return ctx.getTransform().invertSelf().transformPoint(originalPoint);
}
function getTransformedPointNonInvert(x, y) {
    const originalPoint = new DOMPoint(x, y);
    return ctx.getTransform().transformPoint(originalPoint);
}

function onMouseDown(event) {
    if (!isDragging)
    {
        clickStartPosition = {x:event.offsetX, y:event.offsetY};
    }
    isDragging = true;
    dragStartPosition = getTransformedPoint(event.offsetX, event.offsetY);
}

function onMouseMove(event) {
    currentTransformedCursor = getTransformedPoint(event.offsetX, event.offsetY);

    if (isDragging) {
        ctx.translate(currentTransformedCursor.x - dragStartPosition.x, currentTransformedCursor.y - dragStartPosition.y);
        drawMap();
    }
    if (map_pointer.valid)
    {
        transformedMousePos.innerText = `X: ${Math.round(currentTransformedCursor.x)}, Y: ${Math.round(currentTransformedCursor.y)}, Pointer X: ${Math.round(map_pointer.x)}, Y: ${Math.round(map_pointer.y)}`;
    }else{
        transformedMousePos.innerText = `X: ${Math.round(currentTransformedCursor.x)}, Y: ${Math.round(currentTransformedCursor.y)}`;
    }
}

function onMouseUp() {
    isDragging = false;
    if (
        clickStartPosition.x == event.offsetX &&
        clickStartPosition.y == event.offsetY
    ){
        map_pointer.valid=true;
        map_pointer.x = currentTransformedCursor.x;
        map_pointer.y = currentTransformedCursor.y;
        drawMap();
    }
}

function onWheel(event) {
    const zoom = event.deltaY < 0 ? 10/9 : 0.9;
    scale *= zoom;
    ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y);
    if (map_pointer.valid)
    {
        transformedMousePos.innerText = `X: ${Math.round(currentTransformedCursor.x)}, Y: ${Math.round(currentTransformedCursor.y)}, Pointer X: ${Math.round(map_pointer.x)}, Y: ${Math.round(map_pointer.y)}`;
    }else{
        transformedMousePos.innerText = `X: ${Math.round(currentTransformedCursor.x)}, Y: ${Math.round(currentTransformedCursor.y)}`;
    }

    drawMap();
    event.preventDefault();
}
function mapMove(x,y,scale) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);
    ctx.translate(
        -x+window.innerWidth/(2*scale),
        -y+window.innerHeight/(2*scale)
    );
    drawMap();
    map_control_x = x;
    map_control_y = y;
    map_control_zoom = scale;
}


onresize = (event) => {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    drawMap();
    windowWidthLayout();
}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('wheel', onWheel);
addEventListener("resize", (event) => { })


function mapControZoomIn()
{
    map_control_zoom+=0.3;
    mapMove(map_control_x,map_control_y,map_control_zoom);
}
document.getElementById("map_ctrl_zoom_in").addEventListener('click', mapControZoomIn);

function mapControZoomOut()
{
    map_control_zoom-=0.3;
    mapMove(map_control_x,map_control_y,map_control_zoom);
}
document.getElementById("map_ctrl_zoom_out").addEventListener('click', mapControZoomOut);

function mapControZoomUp()
{
    map_control_y-=(window.innerHeight/5)*(1/map_control_zoom);
    mapMove(map_control_x,map_control_y,map_control_zoom);
}
document.getElementById("map_ctrl_zoom_up").addEventListener('click', mapControZoomUp);

function mapControZoomDown()
{
    map_control_y+=(window.innerHeight/5)*(1/map_control_zoom);
    mapMove(map_control_x,map_control_y,map_control_zoom);
}
document.getElementById("map_ctrl_zoom_down").addEventListener('click', mapControZoomDown);

function mapControZoomLeft()
{
    map_control_x-=(window.innerWidth/5)*(1/map_control_zoom);
    mapMove(map_control_x,map_control_y,map_control_zoom);
}
document.getElementById("map_ctrl_zoom_left").addEventListener('click', mapControZoomLeft);

function mapControZoomRight()
{
    map_control_x+=(window.innerWidth/5)*(1/map_control_zoom);
    mapMove(map_control_x,map_control_y,map_control_zoom);
}
document.getElementById("map_ctrl_zoom_right").addEventListener('click', mapControZoomRight);




// Add Segment
function segment_add_click()
{
    const segName = document.getElementById('segName');
    segment_add(segName.value);
}
document.getElementById("segAdd").addEventListener('click', segment_add_click);



// Add Split
function segment_add_split()
{
    index = segment_find_index(route_sel_segment);
    if (index == -1)
    {

        if (route_sel_segment == null)
        {
            segment_add("Default Segment");
            index = segment_find_index(route_sel_segment);
        }else{
            return;
        }
    }

    route[index]["splits"].push({"name":selected,"rw":false})

    route_list();
    drawMap();
}
document.getElementById("segAddSplit").addEventListener('click', segment_add_split);


// Split RW
function segment_split_rw(name)
{

    index = segment_find_index(route_sel_segment);
    if (index == -1) return;

    for (j in route[index]["splits"])
    {
        if (route[index]["splits"][j]["name"] == name)
        {
            split_rw_check = document.getElementById("split_rw_"+route[index]["splits"][j]["name"]);
            route[index]["splits"][j]["rw"]=split_rw_check.checked;
        }
    }

    drawMap();
}





// ---- Utility Functions ---- //

// URL Escape Decoding
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Clean path of special characters
function pathClean(path)
{
    return path
        .replaceAll("#","")
        .replaceAll("?","")
        .replaceAll("\"","");
}

//  Download
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Find Segment index
function segment_find_index(name)
{
    if (route_sel_segment == null)
    {
        console.log("Segment null")
        return -1;
    }

    // Go through all route segments
    for(i in route)
    {
        if (route[i]["segment"] == name )
        {
            return i;
        }
    }
    console.log("Segment not found: " + name)
    return -1;
}

// Find marker
function marker_find(name, copy=false,key="pswitch")
{
    if (name == null)
    {
        console.log("Marker null")

        found_key = null;
        return -1;
    }


    if (copy)
    {
        out = -1;
        // Find selected
        markers[key].forEach((c) => {
            if (c['name'] == name)
            {
                out = c;
            }
        });
        if (out != -1){
            found = out;
            found_key = key;
            return out;
        }

        // Try deeper search of other keys
        for (const [key, value] of Object.entries(markers)) {
            out = -1;
            value.forEach((mc) => {
                // Find selected
                if (mc['name'] == name)
                {
                    out = mc;
                }
            });
            if (out != -1){
                found = out;
                found_key = key;
                return out;
            }

        }
    }else{
        // Go through all route segments
        for(i in markers[key])
        {
            if (markers[key][i]["name"] == name )
            {
                return i;
            }
        }
    }

    console.log("Marker not found: " + name)
    found_key = null;
    return -1;
}





// ---- Feature Functions ---- //

// Add Segment
function segment_add(name)
{

    if (segment_find_index(name) != -1 )
    {
        console.log("Segment already exists!");
        return;
    }

    route.push({"segment":name, "splits":[]});

    set_route_segment(name);
}

function route_list()
{
    route_segments = document.getElementById('route_segments');
    route_segments.innerHTML = "";
    route_splits = document.getElementById('route_splits');
    route_splits.innerHTML = "";
    route.forEach(r => {
        lir = document.createElement("li");
        lir.id = "route_"+r["segment"];
        lir.textContent = r["segment"];
        lir.addEventListener('click', function(e) {
            set_route_segment(r["segment"]);
        });
        route_segments.appendChild(lir);

        if ( r["segment"] == route_sel_segment)
        {
            lir.classList.add("highlight");

            r["splits"].forEach(split => {
                li = document.createElement("li");
                li.id ="split_li_"+split["name"];
                marker_find(split["name"],true);
                if (split["name"] == selected)
                {
                        li.classList.add("highlight");
                }

                if (found_key == "pswitch")
                {
                    split_rw_check = document.createElement("input");
                    split_rw_check.setAttribute("type","checkbox");
                    split_rw_check.id ="split_rw_"+split["name"];
                    split_rw_check.checked = split["rw"];
                    split_rw_check.addEventListener('change', function(e) {
                        segment_split_rw(split["name"]);
                    });
                    console.log(name)
                    li.appendChild(split_rw_check);

                    split_rw_label = document.createElement("label");
                    split_rw_label.setAttribute("for","split_rw_"+split["name"]);
                    split_rw_label.textContent = "RW";
                    li.appendChild(split_rw_label);
                }

                split_name = document.createElement("span");
                split_name.id = "split_"+split["name"];
                split_name.textContent = split["name"];
                split_name.addEventListener('click', function(e) {
                    set_selected(split["name"]);
                });
                li.appendChild(split_name);

                route_splits.appendChild(li);
            });
        }
    });
}

function set_route_segment(seg_name)
{
    route_sel_segment=seg_name;
    route_list();
    drawMap();
    //route_sel_split=null;
}

function setComplete(name,done,key=null)
{
    label = document.querySelector("label[for=control_ps_complete]");

    mindex = marker_find(name,false,key);
    if (mindex == -1) return;

    // Only change data if vaule provided
    if (done != null)
    {
        markers[key][mindex]['done'] = done;
    }
    state = markers[key][mindex]['done'];

    // Update UI to show comleted state
    if(state)
    {
        document.getElementById(markers[key][mindex]['name']).classList.add("complete");
        label.textContent = "Completed";
    }else{
        document.getElementById(markers[key][mindex]['name']).classList.remove("complete");
        label.textContent = "Uncompleted";
    }

    if (name == selected)
    {
        control_ps_complete.checked = state;
    }
}

function drawMap() {
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    ctx.restore();

    ctx.drawImage(map, 0, 0, 1920, 1080);
    map_set_pswitch();

    if (map_pointer.valid)
    {
        ctx.beginPath();
        ctx.moveTo(map_pointer.x-marker_radius,map_pointer.y);
        ctx.lineTo(map_pointer.x+marker_radius,map_pointer.y);
        ctx.moveTo(map_pointer.x,map_pointer.y-marker_radius);
        ctx.lineTo(map_pointer.x,map_pointer.y+marker_radius);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#333';
        ctx.stroke();

    }

    // Draw endpoints
    for (const [key, value] of Object.entries(markers)) {
        if (key == "pswitch") value.forEach((c) => {
            if (marker_show_pswitch && (c['name'] == selected|| allends))
            {

                img_item = document.getElementById(c['name']);
                if("end_position" in c && img_item.style.display != "none") {
                    ctx.beginPath();
                    ctx.moveTo(c["map_position"][0]+c["map_offset"][0], c["map_position"][1]+c["map_offset"][1]);
                    ctx.lineTo(c["end_position"][0]+c["map_offset"][0], c["end_position"][1]+c["map_offset"][1]);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = '#333333';
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(c["end_position"][0]+c["map_offset"][0], c["end_position"][1]+c["map_offset"][1], 4, 0, 2 * Math.PI, false);
                    if("end_flying" in c) {
                        ctx.fillStyle = '#3333ff';
                    }else{
                        ctx.fillStyle = '#333333';
                    }
                    ctx.fill();
                }
            }
        });
    }

    for (i in route)
    {
        if ( route[i]["segment"] == route_sel_segment || allsegments)
        {
            ctx.beginPath();
            first=true;
            for (j in route[i]["splits"])
            {
                c = marker_find(route[i]["splits"][j]["name"],true);


                if(typeof c["map_offset"] === 'undefined') {
                    offx = 0;
                    offy = 0;
                }else{
                    offx = c["map_offset"][0];
                    offy = c["map_offset"][1];
                }

                if (first)
                {
                    ctx.moveTo(c["map_position"][0]+offx, c["map_position"][1]+offy);
                    first = false;
                }else{
                    ctx.lineTo(c["map_position"][0]+offx, c["map_position"][1]+offy);
                }

                if("end_position" in c && ! route[i]["splits"][j]["rw"])
                {
                    ctx.lineTo(c["end_position"][0]+offx, c["end_position"][1]+offy);
                }
            };
            ctx.lineWidth = 2;
            color_i = Number(i);
            while (color_i >= segment_colors.length)
            {
                color_i -= segment_colors.length;
            }
            ctx.strokeStyle = segment_colors[color_i];
            ctx.stroke();
        }
    };


}

function set_selected(name,move=null,key=null)
{
    if ( selected != null && marker_find(selected,true) != -1) document.getElementById(selected).classList.remove("selected");

    selected = name;
    sel_marker = document.getElementById(name);

    if (sel_marker == null)
    {
        alert("Marker does not exist: "+name);
        route_list();
        return;
    }

    sel_marker.classList.add("selected");

    selected = name;
    titleOut.innerText = name;
    window.location.hash = "#"+name;

    // Only used for selecting from route list
    if (key == null)
    {
        marker_find(name,true);
        if (found_key != null)
        {
            key = found_key;
        }
    }
    selected_key = key;

    if (key == "pswitch")
    {
        if(document.getElementById('control_show_pslocation').checked)
            document.getElementById("menu_location").style.display = "block";
        if(document.getElementById('control_show_pstitle').checked)
            document.getElementById("menu_title").style.display = "block";
        img_location = document.getElementById("location");
        img_location.src = "P-Switches/"+pathClean(name)+"/300_location.jpg";
        a_location = document.getElementById("view_location");
        a_location.href = "P-Switches/"+pathClean(name)+"/location.jpg";
        a_location.target = '_blank';

        img_title = document.getElementById("title");
        img_title.src = "P-Switches/"+pathClean(name)+"/300_title.jpg";
        a_title = document.getElementById("view_title");
        a_title.href = "P-Switches/"+pathClean(name)+"/title.jpg";
        a_title.target = '_blank';
    }else{
        document.getElementById("menu_location").style.display = "none";
        document.getElementById("menu_title").style.display = "none";
    }


    // Move map view
    sc = marker_find(name,true,key);
    if (sc == -1) return;

    if(typeof sc["map_offset"] === 'undefined') {
        offx = 0;
        offy = 0;
    }else{
        offx = sc["map_offset"][0];
        offy = sc["map_offset"][1];
    }

    if(move != null) mapMove(
        sc["map_position"][0]+offx ,
        sc["map_position"][1]+offy ,
        move);

    drawMap();
    setComplete(selected,null,key);
    route_list();

}



function map_set_pswitch()
{
    for (const [key, value] of Object.entries(markers)) {
        if (key  == "pswitch")
        {
            ps_search_filter();
            dispay_set=true;
        }else{
            dispay_set=false;
        }
        value.forEach((msps) => {
            img = document.getElementById(msps['name']);
            if (!dispay_set) img.style.display = "block";

            // Verify a map offset exists
            if(typeof msps["map_offset"] === 'undefined') {
                pos = getTransformedPointNonInvert(msps["map_position"][0], msps["map_position"][1]);
            }
            else {
                pos = getTransformedPointNonInvert(msps["map_position"][0]+msps["map_offset"][0], msps["map_position"][1]+msps["map_offset"][1]);
            }
            img.style.left = pos.x - marker_radius + "px";
            img.style.top = pos.y - marker_radius+ "px";
            if(
                pos.y > canvas.height - marker_radius || pos.y < 0 ||
                pos.x > canvas.width - marker_radius || pos.x < 0
            ) {
                img.style.display = "none";
            }

            if (key  == "pswitch" && !marker_show_pswitch) img.style.display = "none";
            if (key  == "custom" &&   !marker_show_custom) img.style.display = "none";
            if (key  == "track" &&   !marker_show_track) img.style.display = "none";
        });

    }
}






// Build map data
function map_addMarker(name,key)
{
    img = document.createElement("div");
    img.id = name;
    img.classList.add("marker_"+key);
    img.classList.add("marker");
    if(key == "pswitch" && spoiler)
    {
        img.classList.add("spoil");
    }
    img.setAttribute('title', name)
    img.addEventListener('click', function(e) {
        set_selected(name,null,key);
    });
    ul_pswitches.appendChild(img);

    // Text List
    ul_pswitch_names = document.getElementById(key+"_names");
    li = document.createElement("li");
    li.id = "list_"+name;
    a = document.createElement("a");
    a.innerText = name;
    a.href = "#"+name;
    a.addEventListener('click', function(e) {
        set_selected(name,3,key);
    });
    li.appendChild(a);
    ul_pswitch_names.appendChild(li);
}
function map_delMarker(name,key)
{
    img = document.getElementById(name);
    img.remove();
    li = document.getElementById("list_"+name);
    li.remove();
}

function map_initialize()
{
    let params = new URLSearchParams(document.location.search);
    spoiler = params.get("spoiler") != null; // enable spoiler mode if set
    // Create P-Switch Items
    for (const [key, value] of Object.entries(markers)) {
        value.forEach((c) => {
            c["done"]=false;

            // Create map markers
            map_addMarker(c['name'],key);

        });

    };

    var hash = window.location.hash.substring(1);
    if (hash != "")
    {
        set_selected(decodeURI(hash));
    }
}

map_initialize();

function isMobile() {
  const minWidth = 768; // Minimum width for desktop devices
  return window.innerWidth < minWidth || screen.width < minWidth;
}

function windowWidthLayout()
{
    if (isMobile()) {
    //do mobile things
        showRouting(null,false);
        showPSLocation(null,false);
        showPSTitle(null,false);
        document.getElementById('map_nav_controls').style.display="block"
        document.getElementById('map_bottom').style.fontSize="3em"
        document.getElementById('menu_main').style.height="30%"
        document.getElementById('map_bottom').style.left="auto"
        document.getElementById('menu_left').style.width="calc(100% - 2em)"
        document.getElementById('menu_left').append(document.getElementById('menu_routing'));
        document.getElementById('menu_left').append(document.getElementById('menu_title'));
    }else{
        document.getElementById('map_nav_controls').style.display="none"
        document.getElementById('map_bottom').style.fontSize="1em"
        document.getElementById('map_bottom').style.left="0"
        document.getElementById('menu_main').style.height="auto"
        document.getElementById('menu_left').style.width="408px"
        document.getElementById('menu_right').append(document.getElementById('menu_routing'));
        document.getElementById('menu_right').append(document.getElementById('menu_title'));
    }
    mapMove(map_control_x,map_control_y,map_control_zoom);
}
windowWidthLayout();
