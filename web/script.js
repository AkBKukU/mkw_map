const canvas = document.getElementById("map_canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// Main Elements
const transformedMousePos = document.getElementById('transformed-mouse-pos');
const titleOut = document.getElementById('titleOut');
const control_ps_complete = document.getElementById('control_ps_complete')
const control_ps_all_ends = document.getElementById('control_ps_all_ends')
const ps_search = document.getElementById('ps_search');
ul_pswitches = document.getElementById("pswitches_imgs");


// Map image
const map = new Image();
map.src = "web/map.png";
map.onload = drawMap;
window.innerWidth

let isDragging = false;
let dragStartPosition = { x: 0, y: 0 };
let currentTransformedCursor;
let totalTranslate = { x: 0, y: 0 };
let scale = 1;
let selected = null;
let filter = "";
loadData = null;
endline=null;
allends=false;
route=[];
route_sel_segment=null;
route_sel_split=null;
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
//  Upload
async function upload()
{
    const [file] = document.getElementById("completeLoad").files;

    if (file) {
        loadData =  JSON.parse(await file.text());
    }
    loadComplete();
};

/*
// Start file download.


// Upload
document.getElementById('input-file')
.addEventListener('change', getFile)

function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(
        document.getElementById('content-target'),
        input.files[0])
    }
}

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        target.value = content
    }).catch(error => console.log(error))
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

        <div>
        <label for="input-file">Specify a file:</label><br>
        <input type="file" id="input-file">
        </div>

        <textarea id="content-target"></textarea>
*/

// ---- Events ---- //

// Completed check

function saveComplete()
{
    saveData = {};
    names.forEach((c) => {
        saveData[c["name"]] = c["done"];
    });

    var xmlns_v = "urn:v";
    download("save.json",JSON.stringify(saveData));
}
document.getElementById("completeSave").addEventListener('click', saveComplete);

function loadComplete()
{
    names.forEach((c) => {
        c["done"] = loadData[c["name"]];
        setComplete(c["name"],c["done"]);
    });
    drawMap();
}
document.getElementById("completeLoad").addEventListener('change', upload);

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

                    for(i in route)
                    {
                        if (route[i]["segment"] == route_sel_segment )
                        {
                                route[i]["splits"].push({"name":split,"rw":rw})
                        }
                    }
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
    setComplete(selected,control_ps_complete.checked);
}
control_ps_complete.addEventListener('change', (event) => {
    oncheck()
});
control_ps_all_ends.addEventListener('change', (event) => {
    allends=event.currentTarget.checked;
    drawMap();
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
    names.forEach((c) => {
        // Match
        list_item = document.getElementById("list_"+c['name']);
        img_item = document.getElementById(c['name']);
        if(filter=="" || c['name'].toUpperCase().includes(filter.toUpperCase()))
        {
            list_item.style.display = "block";
            img_item.style.display = "block";
        }else{
            list_item.style.display = "none";
            img_item.style.display = "none";
        }
    });
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
    isDragging = true;
    dragStartPosition = getTransformedPoint(event.offsetX, event.offsetY);
}

function onMouseMove(event) {
    currentTransformedCursor = getTransformedPoint(event.offsetX, event.offsetY);

    if (isDragging) {
        ctx.translate(currentTransformedCursor.x - dragStartPosition.x, currentTransformedCursor.y - dragStartPosition.y);
        totalTranslate.x += currentTransformedCursor.x - dragStartPosition.x;
        totalTranslate.y += currentTransformedCursor.y - dragStartPosition.y;
        drawMap();
    }
    transformedMousePos.innerText = `X: ${Math.round(currentTransformedCursor.x)}, Y: ${Math.round(currentTransformedCursor.y)}`;
}

function onMouseUp() {
    isDragging = false;
}

function onWheel(event) {
    const zoom = event.deltaY < 0 ? 10/9 : 0.9;
    scale *= zoom;
    ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y);
    totalTranslate.x = (totalTranslate.x+currentTransformedCursor.x)*(1/zoom);
    totalTranslate.y = (totalTranslate.y+currentTransformedCursor.y)*(1/zoom);
    ctx.scale(zoom, zoom);
    ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y);
    totalTranslate.x = (totalTranslate.x-currentTransformedCursor.x)*(zoom);
    totalTranslate.y = (totalTranslate.y-currentTransformedCursor.y)*(zoom);
    transformedMousePos.innerText = `X: ${Math.round(currentTransformedCursor.x)}, Y: ${Math.round(currentTransformedCursor.y)}`;

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
}


onresize = (event) => {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    drawMap();}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('wheel', onWheel);
addEventListener("resize", (event) => { })


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
    if (route_sel_segment != null)
    {

        for(i in route)
        {
            if (route[i]["segment"] == route_sel_segment )
            {
                route[i]["splits"].push({"name":selected,"rw":false})
            }
        }
        route_list();
    }
    drawMap();
}
document.getElementById("segAddSplit").addEventListener('click', segment_add_split);


// Split RW
function segment_split_rw(name)
{
    console.log(name)
    if (route_sel_segment != null)
    {
        for(i in route)
        {
            if (route[i]["segment"] == route_sel_segment )
            {
                for (j in route[i]["splits"])
                {
                    if (route[i]["splits"][j]["name"] == name)
                    {
                        split_rw_check = document.getElementById("split_rw_"+route[i]["splits"][j]["name"]);
                        route[i]["splits"][j]["rw"]=split_rw_check.checked;
                    }
                }
            }
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








// ---- Feature Functions ---- //

// Add Segment
function segment_add(name)
{

    for(i in route)
    {
        if (route[i]["segment"] == name )
        {
            console.log("Segment already exists!");
            return;
        }
    }
    route.push({"segment":name, "splits":[]});

    set_route_segment(name);
}

function route_list()
{
    route_segments = document.getElementById('route_segments');
    route_segments.innerHTML = "";
    route.forEach(r => {
        li = document.createElement("li");
        li.id = "route_"+r["segment"];
        li.textContent = r["segment"];
        li.addEventListener('click', function(e) {
            set_route_segment(r["segment"]);
        });
        route_segments.appendChild(li);

        if ( r["segment"] == route_sel_segment)
        {

            route_splits = document.getElementById('route_splits');
            route_splits.innerHTML = "";
            r["splits"].forEach(split => {
                li = document.createElement("li");
                li.id ="split_li_"+split["name"];
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

function setComplete(name,done)
{
    label = document.querySelector("label[for=control_ps_complete]");
    // Find selected
    names.forEach((c) => {
        if (c['name'] == name)
        {
            if (done != null)
            {
                c['done'] = done;
            }
            state = c['done'];

            // Check
            if(state)
            {
                label.textContent = "Completed";
                document.getElementById(c['name']).src = "web/icon_ps_old.png";
            }else{
                label.textContent = "Uncompleted";
                document.getElementById(c['name']).src = "web/icon_ps_new.png";
            }
        }
    });

    if (name == selected)
    {
        selected,control_ps_complete.checked = state;
    }
}

function drawMap() {
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    ctx.restore();

    ctx.drawImage(map, 0, 0, 1920, 1080);
    map_set_pswitch(names);

    // Draw endpoints
    names.forEach((c) => {
        if (c['name'] == selected|| allends)
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

    for (i in route)
    {
        if ( route[i]["segment"] == route_sel_segment)
        {
            ctx.beginPath();
            first=true;
            for (j in route[i]["splits"])
            {
                c = names.find(obj => {return obj.name === route[i]["splits"][j]["name"]});
                if (first)
                {
                    ctx.moveTo(c["map_position"][0]+c["map_offset"][0], c["map_position"][1]+c["map_offset"][1]);
                    first = false;
                }else{
                    ctx.lineTo(c["map_position"][0]+c["map_offset"][0], c["map_position"][1]+c["map_offset"][1]);
                }

                if("end_position" in c && ! route[i]["splits"][j]["rw"])
                {
                    ctx.lineTo(c["end_position"][0]+c["map_offset"][0], c["end_position"][1]+c["map_offset"][1]);
                }
            };
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ff3333';
            ctx.stroke();
        }
    };


}

function set_selected(name,move=null)
{
    selected = name;
    titleOut.innerText = name;
    window.location.hash = "#"+name;
    img_location = document.getElementById("location");
    img_location.src = "P-Switches/"+name+"/location.png";
    a_location = document.getElementById("view_location");
    a_location.href = "P-Switches/"+name+"/location.png";
    a_location.target = '_blank';

    img_title = document.getElementById("title");
    img_title.src = "P-Switches/"+name+"/title.png";
    a_title = document.getElementById("view_title");
    a_title.href = "P-Switches/"+name+"/title.png";
    a_title.target = '_blank';

    names.forEach((c) => {
        if (c['name'] == name)
        {
            if(move != null) mapMove(
                c["map_position"][0]+c["map_offset"][0] ,
                c["map_position"][1]+c["map_offset"][1] ,
                move);
            document.getElementById(c['name']).style.border = "solid 5px #00f";
            document.getElementById(c['name']).style.borderRadius = "32px";
            if(typeof c["end_position"] === 'undefined') {
                endline=null;
                drawMap();
            }
            else {
                endline=[
                [c["map_position"][0]+c["map_offset"][0], c["map_position"][1]+c["map_offset"][1]],
                [c["end_position"][0]+c["map_offset"][0], c["end_position"][1]+c["map_offset"][1]]
                ];
                drawMap();
            }
        }else{
            document.getElementById(c['name']).style.border = "solid 0px #0000";
            document.getElementById(c['name']).style.borderRadius = "32px";
        }
    });
    setComplete(selected,null);

}



function map_set_pswitch(data)
{
    ps_search_filter();
    data.forEach((c) => {
        img = document.getElementById(c['name']);
    if(typeof c["map_offset"] === 'undefined') {
        pos = getTransformedPointNonInvert(c["map_position"][0], c["map_position"][1]);
    }
    else {
        pos = getTransformedPointNonInvert(c["map_position"][0]+c["map_offset"][0], c["map_position"][1]+c["map_offset"][1]);
    }
    if (c['name'] == selected)
    {
        borderOffset=5;
    }else{borderOffset=0;}
    img.style.left = pos.x -16-borderOffset + "px";
    img.style.top = pos.y -16-borderOffset + "px";
    if(pos.y > canvas.height-16 || pos.y < 0 || pos.x > canvas.width-16 || pos.x < 0)
    {
        img.style.display = "none";
    }
});
}






// Build map data
function map_initialize()
{
    // Create P-Switch Items
    names.forEach((c) => {
        c["done"]=false;

        // Create map markers
        li = document.createElement("li");
        img = document.createElement("img");
        img.src = "web/icon_ps_new.png";
        img.id = c['name'];
        img.setAttribute('title', c['name'])
        img.addEventListener('click', function(e) {
            set_selected(c['name']);
        });
        li.appendChild(img);
        ul_pswitches.appendChild(li);

        // Text List
        ul_pswitches_names = document.getElementById("pswitches_names");
        li = document.createElement("li");
        li.id = "list_"+c['name'];
        a = document.createElement("a");
        a.innerText = c['name'];
        a.href = "#"+c['name'];
        a.addEventListener('click', function(e) {
            set_selected(c['name'],3);
        });
        li.appendChild(a);
        ul_pswitches_names.appendChild(li);
    });

    var hash = window.location.hash.substring(1);
    if (hash != "")
    {
        set_selected(decodeURI(hash));
    }
}

map_initialize();
