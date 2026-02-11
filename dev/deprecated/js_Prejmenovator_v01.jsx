//  Prejmen-ovator v01
//  copyright Jan Svatuska 2023

(function (thisObj) {

  newPanel(thisObj);

    function newPanel(thisObj) {

        var win = (thisObj instanceof Panel) ? thisObj 
        : new Window('palette', 'Prejmenovator', undefined);
        win.preferredSize = [350, 300];

        //  input text1: Search
        var groupOne = win.add('group');
            groupOne.orientation = 'column';
            groupOne.alignChildren = 'fill';

        var label = groupOne.add('statictext', undefined, 'Search for:');
        var txtInputSearch = groupOne.add('edittext', undefined, '');
            txtInputSearch.characters = 25;

        //  input text2: Replace
        var groupTwo = win.add('group');
            groupTwo.orientation = 'column';
            groupTwo.alignChildren = 'fill';

        var label = groupTwo.add('statictext', undefined, 'Replace with:');
        var txtInputReplace = groupTwo.add('edittext', undefined, '');
            txtInputReplace.characters = 25;
          
        //  apply Button
        var applyBtn = groupTwo.add('button', undefined, 'Apply');
        
      // --- Action ---
            applyBtn.onClick = function () {
            prejmenovator(txtInputSearch.text, txtInputReplace.text);
            }
      // --- ACTIONS ---
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };
        win instanceof Window
            ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());

    }


    function prejmenovator(searchIn, replaceIn) {

    app.beginUndoGroup("Prejmenovator");

    var oldStringIn = searchIn;
    var regex = /oldStringIn/g; // --- nefunguje regex --- PROC? ---
    var newStringIn = replaceIn;
    var selected = app.project.selection; // selected projekt items (arr)

    if (selected.length == 0) {
      alert("Nothing selected");
    } else {
      prejmenOvator(selected, oldStringIn, newStringIn);
    }

    app.endUndoGroup();

    function prejmenOvator(array, oldString, newString) {
      for (var index = 0; index < array.length; index++) {
          var element = array[index]; //  uma item da seleção
          
          var oldName = element.name; // nome da item
          var newName = oldName.replace(oldString, newString);
              
              element.name = newName;
          //  fixing broken expressions due to the change of the name;              
          app.project.autoFixExpressions(oldName, newName);
        }
    }
}

})(this);