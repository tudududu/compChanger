// compDurationChanger_240408_v03

compDurationChange();

function compDurationChange() {

    app.beginUndoGroup("Change comp duration");

        var selected = app.project.selection;
        var newDuration = 25;

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
            //alert(levelOrderTraversal(selectedArr[j]));
            layerInspectionCycle(selectedArr[j], newDuration);
            }
        }
        
    }

    function layerInspectionCycle(selectedComp, newDuration) {
        const subCompArr = levelOrderTraversal(selectedComp);
        for (var i = 0; i < subCompArr.length; i++) {
            layerInspection(subCompArr[i], newDuration);
        }
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


function levelOrderTraversal(root) {
	if (root == null)
		return;

	// Standard level order traversal code
	// using queue
    var arr = [];
	var q = []; // Create a queue
	q.push(root); // push root 
	while (q.length != 0)
	{
		var n = q.length;

		// If this node has children
		while (n > 0)
		{
			// Dequeue an item from queue
			// and print it
			var item = q[0];
			q.shift();
			arr.push(item);
			//console.log(p.key + " ");
            var itemLayers = item.layers;
			// push all children of the dequeued item
			for (var i = 1; i <= item.layers.length; i++) {
                if (item.layers[i].source instanceof CompItem) {
				q.push(item.layers[i].source);
                    }
                }
			n--;
		}
		
		// Print new line between two levels
		//arr.push("<br>");
		//console.log("<br>"); 
	}
	return arr;
}