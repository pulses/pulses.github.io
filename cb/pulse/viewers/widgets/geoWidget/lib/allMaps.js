if ("geoMapType" in viewerConfigFiles) { 
    //console.log(geo)
    if (geo == 'US'){
        document.write("<script language='javascript' type='text/javascript' src='./lib/unitedStatesStateMap.js'><\x2Fscript>"); 
    } else if (geo == 'ASIA'){
        document.write("<script language='javascript' type='text/javascript' src='./lib/asiaMap.js'><\x2Fscript>"); 
    } else if (geo =='EUROPE'){
        document.write("<script language='javascript' type='text/javascript' src='./lib/euroMap.js'><\x2Fscript>"); 
    } else if (geo == 'SOUTHAMERICA'){
        document.write("<script language='javascript' type='text/javascript' src='./lib/southAmericaMap.js'><\x2Fscript>"); 
    } else if (geo == 'BRAZIL'){
        document.write("<script language='javascript' type='text/javascript' src='./lib/brazilMap.js'><\x2Fscript>"); 
    } else if (geo == 'WORLD'){
        document.write("<script language='javascript' type='text/javascript' src='./lib/worldMap.js'><\x2Fscript>"); 
    } else {
        // default to US
        document.write("<script language='javascript' type='text/javascript' src='./lib/unitedStatesStateMap.js'><\x2Fscript>"); 
    }
} else {
    document.write("<script language='javascript' type='text/javascript' src='./lib/unitedStatesStateMap.js'><\x2Fscript>"); 
} //end of else function