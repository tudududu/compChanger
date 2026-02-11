// compDurationChanger_240408_v02

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
            alert(levelOrderTraversal(selectedArr[j]));
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
			arr.push(item.name);
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
		arr.push("<br>");
		//console.log("<br>"); 
	}
	return arr;
}