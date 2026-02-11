//  Zkrac-ovator v01
//  copyright Jan Svatuska 2023

(function (thisObj) {
    
    newPanel(thisObj);

    function newPanel(thisObj) {
        var win = (thisObj instanceof Panel) 
        ? 
        thisObj
        :
        new Window('palette', 'Zkracovator', undefined);
        
        win.preferredSize = [350, 300];

        var groupOne = win.add('group');
            groupOne.orientation = 'row';
            groupOne.alignChildren = 'fill';
        
        //  label
        var label = groupOne.add('statictext', undefined, 'start: ');
        //  input text    
        var startTimeInput = groupOne.add('edittext', undefined, '1', {enterKeySignalsOnChange: false});
            startTimeInput.characters = 10;
        //  apply Button
        var applyBtn = groupOne.add('button', undefined, 'Apply');
        
        // --- Action ---
        function trigerChange() {
            zkracovator(startTimeInput.text);
        }

        startTimeInput.onChange = trigerChange;
        applyBtn.onClick = trigerChange;

        // --- ACTIONS ---
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };
        win instanceof Window
            ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());

    }

function zkracovator(startTimeInput) {
    
    app.beginUndoGroup("Zkracovator");
        var startTime = parseFloat(startTimeInput);
        var selected = app.project.selection; //array
        
        if (selected.length == 0) {
            alert("Select a composition");
        } else {
            zkracOvatorEngine(selected, startTime);
        }
    app.endUndoGroup();
    
function zkracOvatorEngine(array, startTimeFx) {
    for (var index = 0; index < array.length; index++) {
        var element = array[index];
        
        if (element instanceof CompItem) {

            var elementDur = element.duration;
            var elementDurFixed = elementDur.toFixed();
            element.workAreaStart = startTimeFx;
            element.workAreaDuration = elementDurFixed - startTimeFx;
        }
    }
}
    
}

})(this);

