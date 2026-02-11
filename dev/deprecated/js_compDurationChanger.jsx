// compDurationChanger_240310_v01b

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
            alert(searchForChildren(selectedArr[j]));
            //layerInspection(selectedArr[j], newDuration);
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

function folderPath(item) {
    var objArr = [item];
    
    do {
        if (item.length > 0) {
            for (var j = 1; j <= item.length; j++) {
            var layerSource = item[j].source;
                        
            if (layerSource instanceof CompItem) {  // pokud je vrstva slate jdeme ho hledat
                objArr.push(layerSource);
                }
            }
            item = item.parentFolder;
            objArr.push(item);
        }
    } while(item.length > 0);
    
    return objArr;
}

var children = [];  //  nefunguje kdyz je childern venku
function searchForChildren(tree, children) {
    var compLayerArr = tree.layers; // prohlidka vrstev
    for (var i = 1; i <= compLayerArr.length; i++) {
        var layerSource = compLayerArr[i].source;
        if (layerSource instanceof CompItem) {
            children.push(layerSource);
        }
    };
    for (var child in children) {
        var childrenTemp = searchForChildren(child);
        children.push(childrenTemp);
    }
    return children;
    }

/*
function setItemDuration(itemArr, newDuration) {
    var itelArr = 
    for (var i = 0; itemArr.length; i++) {
        itemArr[i].duration = newDuration;
    }
}
*/