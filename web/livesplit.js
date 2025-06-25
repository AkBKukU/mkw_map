
class LiveSplit
{

    xmlns_v =        "urn:v";
    ls_version =     "1.7.0";
    timeOfset =             "00:00:00";
    attempteCount=          "0";
    usesEmulator=          "False";
    constructor(gameName="", categoryName="")
    {
        this.gameName = gameName;
        this.categoryName = categoryName;
    }

    generateXMLBase()
    {
        var Run = document.createElementNS(this.xmlns_v, "Run");
        Run.setAttribute("version",this.ls_version);

        var GameIcon = document.createElementNS(this.xmlns_v, "GameIcon");
        Run.appendChild(GameIcon);

        var GameName = document.createElementNS(this.xmlns_v, "GameName");
        GameName.innerHTML = this.gameName;
        Run.appendChild(GameName);

        var CategoryName = document.createElementNS(this.xmlns_v, "CategoryName");
        CategoryName.innerHTML = this.categoryName;
        Run.appendChild(CategoryName);

        var LayoutPath = document.createElementNS(this.xmlns_v, "LayoutPath");
        Run.appendChild(LayoutPath);

        var Metadata = document.createElementNS(this.xmlns_v, "Metadata");
        var Metadata_Run = document.createElementNS(this.xmlns_v, "Run");
        Metadata_Run.setAttribute("id","");
        Metadata.appendChild(Metadata_Run);

        var Metadata_Platform = document.createElementNS(this.xmlns_v, "Platform");
        Metadata_Platform.setAttribute("usesEmulator",this.usesEmulator);
        Metadata.appendChild(Metadata_Platform);

        var Metadata_Region = document.createElementNS(this.xmlns_v, "Region");
        Metadata.appendChild(Metadata_Region);

        var Metadata_Variables = document.createElementNS(this.xmlns_v, "Variables");
        Metadata.appendChild(Metadata_Variables);

        var Metadata_CustomVariables = document.createElementNS(this.xmlns_v, "CustomVariables");
        Metadata.appendChild(Metadata_CustomVariables);
        Run.appendChild(Metadata);

        var Offset = document.createElementNS(this.xmlns_v, "Offset");
        Offset.innerHTML = this.timeOfset;
        Run.appendChild(Offset);

        var AttemptCount = document.createElementNS(this.xmlns_v, "AttemptCount");
        AttemptCount.innerHTML = "0";
        Run.appendChild(AttemptCount);

        var AttemptHistory = document.createElementNS(this.xmlns_v, "AttemptHistory");
        Run.appendChild(AttemptHistory);

        var Segments = document.createElementNS(this.xmlns_v, "Segments");
        Run.appendChild(Segments);

        var AutoSplitterSettings = document.createElementNS(this.xmlns_v, "AutoSplitterSettings");
        Run.appendChild(AutoSplitterSettings);

        return Run;
    }

    generateXML(data=[{"name":"","attributes":[]}])
    {
        var xml = this.generateXMLBase();
        for(i in data)
        {
            var Seg = document.createElementNS(this.xmlns_v, "Segment");
            var Name = document.createElementNS(this.xmlns_v, "Name");
            for (const [key, value] of Object.entries(data[i]))
            {
                if (key == "name")
                {
                    Name.innerHTML = value;
                }
                if (key == "attributes")
                {
                    for(j in value)
                    {
                        for (const [attr_key, attr_value] of Object.entries(value[j]))
                        {
                            Name.setAttribute(attr_key,attr_value);
                        }
                    }
                }

            }
            Seg.appendChild(Name);
            var Icon = document.createElementNS(this.xmlns_v, "Icon");
            Seg.appendChild(Icon);
            var SplitTimes = document.createElementNS(this.xmlns_v, "SplitTimes");
            var SplitTime = document.createElementNS(this.xmlns_v, "SplitTime");
            SplitTime.setAttribute("name","Personal Best");
            SplitTimes.appendChild(SplitTime);
            Seg.appendChild(SplitTimes);
            var BestSegmentTime = document.createElementNS(this.xmlns_v, "BestSegmentTime");
            Seg.appendChild(BestSegmentTime);
            var SegmentHistory = document.createElementNS(this.xmlns_v, "SegmentHistory");
            Seg.appendChild(SegmentHistory);

            xml.querySelector("Segments").appendChild(Seg);
        }


        const serializer = new XMLSerializer();
        return serializer.serializeToString(xml);
    }

    pareseSplitsToData(text="")
    {
        if (text=="") return null;

        let data=[];

        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");
        var splits=doc.querySelectorAll("Segment");
        for (var s in splits)
        {
            if (isNaN(s)) continue;
            for (const child of splits[s].children) {
                if ( child.tagName == "Name")
                {
                    var value = {"name":"","attributes":[]};
                    value.name = child.textContent;
                    if (child.hasAttributes()) {
                        for (const attr of child.attributes) {
                            var obj = {};
                            obj[attr.name] = attr.value;
                            value.attributes.push(obj);
                        }
                    }
                    data.push(value);
                }
            }
        }

        return data;
    }
}
