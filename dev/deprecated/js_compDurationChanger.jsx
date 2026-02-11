// compDurationChanger_240224_v00a

compDurationChange();

function compDurationChange() {

    app.beginUndoGroup("Make output compositions");

        var selected = app.project.selection;
        var newDuration = 5;

        if (selected.length == 0) {
            alert("Select a composition");
        } else {
            cycleSelection(selected, newDuration);
        }
    app.endUndoGroup();

}

    function cycleSelection(selectedArr, newDuration) {
        var foundCopmArr = [];
        for (var j = 0; j < selectedArr.length; j++) {
            if (selectedArr[j] instanceof CompItem) {
            foundCopmArr.push(layerInspection(selectedArr[j], newDuration));
            }
        }
        //alert(foundCopmArr);
    }

//  hleda jmena slatu v comp - zrusit a vymenit za layerInspection2
    function layerInspection(comp, newDuration) {
        
        var compLayerArr = comp.layers; // prohlidka vrstev
        var foundLayersArr = [];
        comp.duration = newDuration;

        for (var j = 1; j <= compLayerArr.length; j++) {
            var layerSource = compLayerArr[j].source;
            var layer = compLayerArr[j];
            
            if (layerSource instanceof CompItem) {  // pokud je vrstva slate jdeme ho hledat
                //foundLayersArr.push(layerSource.name);
                layerSource.duration = newDuration;
            }
                layer.outPoint = newDuration;
        }
        //alert(foundLayersArr);
        //return foundLayersArr;                  
    }
/*
function setItemDuration(itemArr, newDuration) {
    var itelArr = 
    for (var i = 0; itemArr.length; i++) {
        itemArr[i].duration = newDuration;
    }
}
*/
function folderPath(item) {
    var objArr = [item];
    
    do {
        if(item.parentFolder != app.project.rootFolder) {
            item = item.parentFolder;
            objArr.push(item);
        }
    } while(item.parentFolder != app.project.rootFolder);
    
    return objArr;
}