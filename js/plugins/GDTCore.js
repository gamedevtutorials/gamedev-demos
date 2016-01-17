var GDT = {};
GDT.Core = {
  "version" : "1.0"
};

GDT.Core.parseTag = function(note, tag, parseElement) {
  var searchString = "<GDT:"+tag+":";
  var start = note.indexOf(searchString);
  if(start < 0) return false; // Nothing found
  var subString = note.substr(start+searchString.length);
  end = subString.indexOf(">");
  if(end < 0) {
    console.error("Config for following object was not correct", parseElement||"No Object given", note, tag);
    return false;
  }

  return subString.substr(0,end).trim();
};
