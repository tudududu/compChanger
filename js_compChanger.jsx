/* 
js_compChanger
copyright Jan Svatuska 2024
250703

v01a    Dimension section reposition 3D layer, but not 2D
        nefunguje pokud x = 0, nebo neni zadano
v01b    Condition for dimension: if (inputX.length > 0)
        Dimension rozchozeno, lze zadat jen jednu stranu,
        merime delku retezce, (null a undefined nefungovalo)
v01d    Pridan ZkracOvator
v01e    Zmena UI - zkracovator do comp panelu
        Zkracovator ma nastavenou default hodnotu 1
        zahada: pri default hodnote nereaguje na btn, samostatne (v01d) reagoval
        reaguje az po nastaveni 0 a pak dalsiho cisla a jeste spatne pocita konec
        patrani: funguje pokud btn00 spousti jen triggerCompIn (ostatni funkce vypnute)
        nalez: ostatni fce vrati chybu, protoze nemaji osetreny chybejici vstup
v02a    reorganizace, zkracovator spatne pocita konec, nic jineho nefunguje
        Opraveno - Zkracovator zastavoval cinnost na kompozicich kratsich nez 01s
        Zkracovator stale spatne pocita konec
        vylepsit prejmenovator
v02d    Prejmenovator: event listener key "Enter" added to 'replace with'
        Zkracovator: Opraven vypocet konce
v02e    Prejmenovator: event listener key "Enter" added to 'Apply'
v02f    == v02e
v02g    better describtion
        Dimension: priprava na vylepseni - zatim nepouzito, vlozeny 2 funkce:
v02h    better description, reorder
v02i    new order - one run. Vubec nefunguje.

v03     Uplne predelat podle vzoru Design 02 (crg)
        Z UI jednotlive funkce nespoustime naprimo, ale
        spoutime centralni funkci, ktera je bud obsahuje nebo spousti,
        podle toho jestli maji zadany vstup.
        Do funkce spoustene v UI dosazujeme (this.parent), 
        Ve funci pod nazvem promenne, uvnitr pristupujem k hodnotam 
        napr. takto: theDialog.inDimensionX.text
v03x    Prejmenovator: vylepsit (crg)
        Dimension: zprovoznit pro 2D i 3D

v03a    Rozchozeno. Dimension: Width, funguje 3D layer, tj. je bez korekce Nullem.
v03b    Dimension: Zprovozneno pro 2D i 3D layer. Implementaci re-centeringu.
v03c    Info message zprovoznena.
v03d    Prejmenovator: Pridan. UI: Dimension a prejmenovator rozchozeno, ale za cenu ztraty deleni na panly a skupiny.
v03e    Organize the script design so the functions can read the input from UI by passing the dialog object. Separate the functions in the UI design where into panels and groups.
v03e    Solution: doMain(this.parent.parent); // Failed. Worked only for the first function.
v03f    Solution: doMain(panel01, panel02); // Worked. The functions are separated into panels and groups.
v03g    Prejmenovator: EventListener added to 'replace with' and 'Apply' button.
v03h    Prejmenovator: 3-way: Search&Replace, Append, Remove.
v03i    Complete: Duration, FPS, Start, Duration including subComps.
v03j    Reset input fields & unclick duration checkbox.
v03k    Reset input fields except Prejmenovator.
v03l    Prejmenovator: Case convertor. Radio buttons in 1 row.
v03m    Prejmenovator: Case convertor. Radio buttons in 2 rows.
v03n    Prejmenovator: UI - Case convertor + Append -> to aligne.
v03o    Prejmenovator: Removed limit to Comps only.
v03p    Prejmenovator: Fix: Added 2nd condition enabling run if 1st or 2nd field != "".
v03p2   Section Main moved to the end of the code.
v03q    Separated "OK" button of panel01 and panel 02. Function doMain divided into doMain_01 and doMain_02.
v03q2   Case conversion radio buttons added. Capitalize, Upper, Lower.
v03r    Prejmenovator: Case conversion radio buttons Capitalize, Upper, Lower. Connected.
v03r2   Prejmenovator: Case conversion. Capitalize can recognize words separated by space, dash, or underscore.
v03s    Prejmenovator: Case conversion. Search off checkbox added. Apply the change to the complete old name.
v03t    Prejmenovator: Case conversion. Search off checkbox. Limited to the Case conversion.
v03u    Prejmenovator: Case conversion. Search off checkbox. Limited fnc and visibility to the Case conversion.
v03v    Prejmenovator: Case conversion. Checkbox label: Search off. Alerts cleanup Not a number -> Enter a number.
v03w    Comp settings: Start: Event listener for Enter key added.
v03x    Prejmenovator: Renamed to Renamer.
*/

//===========globals
var vers = '03x';
var title = 'compsChanger (v' + vers + ')';
var message = "";
var sessionLogProjectPath = '';
var sessionLogFilePath = '';
//==================
function trimString(value) {
    return value.replace(/^\s+|\s+$/g, '');
}

function replaceAllLiteral(input, searchValue, replaceValue) {
    if (searchValue === '') {
        return input;
    }
    return input.split(searchValue).join(replaceValue);
}

function parseCsvLine(line, delimiter) {
    var columns = [];
    var current = '';
    var inQuotes = false;

    for (var i = 0; i < line.length; i++) {
        var ch = line.charAt(i);
        if (ch === '"') {
            if (inQuotes && i + 1 < line.length && line.charAt(i + 1) === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === delimiter && !inQuotes) {
            columns.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    columns.push(current);
    return columns;
}

function parseBatchRenameCsv(csvText) {
    var text = csvText;
    if (text.length > 0 && text.charCodeAt(0) === 65279) {
        text = text.substring(1);
    }

    var lines = text.split(/\r\n|\n|\r/);
    var delimiter = ',';
    var rules = [];
    var firstDataRow = true;

    for (var i = 0; i < lines.length; i++) {
        var rawLine = lines[i];
        var line = trimString(rawLine);

        if (line === '' || line.indexOf('#') === 0 || line.indexOf('//') === 0) {
            continue;
        }

        if (firstDataRow) {
            if (line.indexOf(';') !== -1 && line.indexOf(',') === -1) {
                delimiter = ';';
            }
            firstDataRow = false;
        }

        var columns = parseCsvLine(rawLine, delimiter);
        if (columns.length !== 2) {
            return {
                ok: false,
                message: 'Invalid CSV at line ' + (i + 1) + '. Expected exactly 2 columns: search,replace.'
            };
        }

        var searchText = trimString(columns[0]);
        var replaceText = trimString(columns[1]);

        if (rules.length === 0) {
            var col0 = searchText.toLowerCase();
            var col1 = replaceText.toLowerCase();
            var isHeader = (col0 === 'search' || col0 === 'in') && (col1 === 'replace' || col1 === 'out');
            if (isHeader) {
                continue;
            }
        }

        if (searchText === '') {
            return {
                ok: false,
                message: 'Invalid CSV at line ' + (i + 1) + '. Search value cannot be empty.'
            };
        }

        rules.push({
            search: searchText,
            replace: replaceText
        });
    }

    if (rules.length === 0) {
        return {
            ok: false,
            message: 'No valid rename rules found in the selected file.'
        };
    }

    var deduped = [];
    var indexBySearch = {};
    var duplicateCount = 0;

    for (var j = 0; j < rules.length; j++) {
        var rule = rules[j];
        if (indexBySearch.hasOwnProperty(rule.search)) {
            deduped[indexBySearch[rule.search]].replace = rule.replace;
            duplicateCount++;
        } else {
            indexBySearch[rule.search] = deduped.length;
            deduped.push(rule);
        }
    }

    return {
        ok: true,
        rules: deduped,
        duplicateCount: duplicateCount
    };
}

function updateBatchStatus(panel, statusText) {
    panel.batchStatus.text = 'Status: Batch Rename: ' + statusText;
}

function refreshBatchStatus(panel) {
    if (panel.batchRules.length === 0) {
        updateBatchStatus(panel, 'Not loaded.');
    } else {
        var suffix = '';
        if (!panel.repRad.value) {
            suffix = ' Search mode only.';
        } else if (!panel.batchEnabled) {
            suffix = ' Disabled.';
        }
        updateBatchStatus(panel, 'List loaded (' + panel.batchRules.length + ' rules).' + suffix);
    }
}

function loadBatchRulesFromDialog(panel) {
    var selectedFile = File.openDialog('Load Batch Rename list (CSV)', '*.csv');
    if (!selectedFile) {
        return {
            ok: false,
            canceled: true,
            message: 'Batch rename loading canceled.'
        };
    }

    if (!selectedFile.exists) {
        return {
            ok: false,
            canceled: false,
            message: 'Selected file does not exist.'
        };
    }

    selectedFile.encoding = 'UTF-8';
    if (!selectedFile.open('r')) {
        return {
            ok: false,
            canceled: false,
            message: 'Cannot open the selected file.'
        };
    }

    var fileContent = selectedFile.read();
    selectedFile.close();

    var parsed = parseBatchRenameCsv(fileContent);
    if (!parsed.ok) {
        return {
            ok: false,
            canceled: false,
            message: parsed.message
        };
    }

    panel.batchRules = parsed.rules;
    panel.batchFilePath = selectedFile.fsName;

    var duplicateInfo = '';
    if (parsed.duplicateCount > 0) {
        duplicateInfo = ' Duplicates resolved: ' + parsed.duplicateCount + ' (last row wins).';
    }

    return {
        ok: true,
        duplicateCount: parsed.duplicateCount,
        message: 'List loaded from ' + selectedFile.name + '.' + duplicateInfo
    };
}

function applyBatchRenameRules(inputName, rules) {
    var outputName = inputName;
    for (var i = 0; i < rules.length; i++) {
        outputName = replaceAllLiteral(outputName, rules[i].search, rules[i].replace);
    }
    return outputName;
}

function pad2(value) {
    return (value < 10 ? '0' : '') + value;
}

function getLogTimestamp() {
    var now = new Date();
    return ''
        + now.getFullYear()
        + pad2(now.getMonth() + 1)
        + pad2(now.getDate())
        + '_'
        + pad2(now.getHours())
        + pad2(now.getMinutes())
        + pad2(now.getSeconds());
}

function getProjectFolder() {
    if (!app.project || app.project.file == null) {
        return null;
    }
    return app.project.file.parent;
}

function ensureLogFolder(projectFolder) {
    var logFolder = new Folder(projectFolder.fsName + '/log');
    if (!logFolder.exists && !logFolder.create()) {
        return null;
    }
    return logFolder;
}

function resolveSessionLogFile(logFolder) {
    if (sessionLogFilePath === '' || sessionLogProjectPath !== logFolder.fsName) {
        sessionLogProjectPath = logFolder.fsName;
        sessionLogFilePath = logFolder.fsName + '/compchanger_' + getLogTimestamp() + '.log';
    }
    return new File(sessionLogFilePath);
}

function writeRenameLogFile(logFolder, logEntries) {
    var logFile = resolveSessionLogFile(logFolder);
    logFile.encoding = 'UTF-8';

    if (!logFile.open('a')) {
        return {
            ok: false,
            message: 'Failed to write log file.'
        };
    }

    logFile.writeln('----------------------------------------');
    logFile.writeln('compChanger rename log');
    logFile.writeln('rename processed ' + (new Date()).toString());
    if (app.project && app.project.file != null) {
        logFile.writeln('project: ' + app.project.file.fsName);
    }
    logFile.writeln('changes: ' + logEntries.length);
    logFile.writeln('');

    for (var i = 0; i < logEntries.length; i++) {
        var entry = logEntries[i];
        logFile.writeln('[' + entry.itemType + '] ' + entry.oldName + ' -> ' + entry.newName);
    }

    logFile.writeln('');

    logFile.close();
    return {
        ok: true,
        path: logFile.fsName
    };
}
    
(function (thisObj) {
    newPanel(thisObj);
    //========================UI========================
    function newPanel(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj 
        : new Window('palette', title, undefined);
        
        win.orientation = 'column';
        win.alignChildren = 'fill';
        win.preferredSize = [200, 300]; // if not - the size is auto
        var buttonSize = [30, 23];

        // ================panel01================oo
        // ================Renamer================oo
        var panel01 = win.add('panel', undefined, 'Renamer');
            panel01.orientation = 'column';
            panel01.alignChildren = 'fill';
        //  group02: radio buttons
        var p01g02 = panel01.add("group", undefined, { name: "p01g02" });
            p01g02.orientation = "column"; // Change orientation to column
            p01g02.alignment = "fill";
            p01g02.alignChildren = ["fill", "center"];
            p01g02.spacing = 10;
            p01g02.margins = 0;
        var p01g02_row1 = p01g02.add("group");
            p01g02_row1.orientation = "row";
            p01g02_row1.alignChildren = ["fill", "center"];
            p01g02_row1.spacing = 10;
            p01g02_row1.margins = 0;
        var p01g02_row2 = p01g02.add("group");
            p01g02_row2.orientation = "row";
            p01g02_row2.alignChildren = ["fill", "center"];
            p01g02_row2.spacing = 10;
            p01g02_row2.margins = 0;
        panel01.batchStatus = panel01.add('statictext', undefined, 'Status: Batch Rename: Not loaded.');
            panel01.batchStatus.alignment = ['fill', 'top'];
            panel01.batchStatus.characters = 36;

        var p01g03 = panel01.add('group');
            p01g03.orientation = 'row';
            p01g03.alignChildren = ['left', 'center'];
            p01g03.spacing = 10;
            p01g03.margins = 0;

        panel01.compFilterChkBx = p01g03.add('checkbox', undefined, 'Comps');
        panel01.compFilterChkBx.value = true;
        panel01.folderFilterChkBx = p01g03.add('checkbox', undefined, 'Folders');
        panel01.folderFilterChkBx.value = true;
        panel01.logChkBx = p01g03.add('checkbox', undefined, 'Log');
        panel01.logChkBx.value = false;

        //  group01: fields
        var p01g01 = panel01.add('group');
            p01g01.orientation = 'column';
            p01g01.alignChildren = 'fill';
        //  input text
        panel01.label_01 = p01g01.add('statictext', undefined, 'Search:');
        panel01.txt_in_search = p01g01.add('edittext', undefined, '');
        panel01.txt_in_search.characters = 25;

        // --- Shared group for Replace/Capitalize ---
        var p01g01_replaceStack = p01g01.add('group');
            p01g01_replaceStack.orientation = 'stack'; // stack overlays children

        // Column group for label_02 and txt_in_replace
        var p01g01_replaceCol = p01g01_replaceStack.add('group');
            p01g01_replaceCol.orientation = 'column';
            p01g01_replaceCol.alignChildren = 'fill';
            p01g01_replaceCol.alignment = ['fill', 'top'];
            // p01g01_replaceCol.minimumSize.width = 150;     // <-- Or set a preferred width

        panel01.label_02 = p01g01_replaceCol.add('statictext', undefined, 'Replace:');
            panel01.label_02.alignment = ['fill', 'top'];
        panel01.txt_in_replace = p01g01_replaceCol.add('edittext', undefined, '');
            panel01.txt_in_replace.characters = 25;
            panel01.txt_in_replace.alignment = ['fill', 'top'];


        var p01g01_replaceRow = p01g01_replaceStack.add('group');
            p01g01_replaceRow.orientation = 'row';
            p01g01_replaceRow.alignChildren = 'fill';
            p01g01_replaceRow.visible = false; // Start hidden

        // capRad in the same stack group
        panel01.capRad = p01g01_replaceRow.add('radiobutton', undefined, 'Capitalize');
        panel01.capRad.value = true;
        panel01.capRad.visible = false; // Start hidden
        panel01.uppRad = p01g01_replaceRow.add('radiobutton', undefined, 'Upper');
        panel01.capRad.value = false;
        panel01.capRad.visible = false; // Start hidden
        panel01.lowRad = p01g01_replaceRow.add('radiobutton', undefined, 'Lower');
        panel01.capRad.value = false;
        panel01.capRad.visible = false; // Start hidden

        //  apply Button
        panel01.btnRename = panel01.add('button', undefined, 'Search and replace', {name: "Renamer"});

        //  ================panel01=sub================oo
        function doTextChange(target, newText) {
            target.text = newText;
        }
        //  radio buttons
        panel01.repRad = p01g02_row1.add('radiobutton', undefined, 'Search');
            panel01.repRad.alignChildren = 'fill';
            panel01.repRad.value = true;
        panel01.batchChkBx = p01g02_row1.add('checkbox', undefined, 'batch');
            panel01.batchChkBx.value = false;
        panel01.batchEnabled = false;
        panel01.batchRules = [];
        panel01.batchFilePath = '';

            panel01.repRad.onClick = function () {
                doTextChange(panel01.btnRename, 'Search and replace');
                doTextChange(panel01.label_01, 'Search for:');
                doTextChange(panel01.label_02, 'Replace with:');
                panel01.label_02.visible = true;
                panel01.txt_in_replace.visible = true; // Show the replace field
                p01g01_replaceCol.visible = true;
                p01g01_replaceRow.visible = false;
                panel01.capRad.visible = false; // Hide the capitalize radio button
                panel01.appRad.value = false;
                panel01.remRad.value = false;
                panel01.caseRad.value = false;
                panel01.searchChkBx.visible = false;
                panel01.batchChkBx.visible = true;
                panel01.batchChkBx.value = panel01.batchEnabled;
                refreshBatchStatus(panel01);
            };
        panel01.appRad = p01g02_row1.add('radiobutton', undefined, 'Append');
            panel01.appRad.alignChildren = 'fill';
            panel01.appRad.onClick = function () {
                doTextChange(panel01.btnRename, 'Append');
                doTextChange(panel01.label_01, 'Append head:');
                doTextChange(panel01.label_02, 'Append tail:');
                panel01.label_02.visible = true;
                panel01.txt_in_replace.visible = true; // Show the replace field
                p01g01_replaceCol.visible = true;
                p01g01_replaceRow.visible = false;
                panel01.capRad.visible = false; // Hide the capitalize radio button
                panel01.repRad.value = false;
                panel01.remRad.value = false;
                panel01.caseRad.value = false;
                panel01.searchChkBx.visible = false;
                panel01.batchEnabled = false;
                panel01.batchChkBx.value = false;
                panel01.batchChkBx.visible = false;
                refreshBatchStatus(panel01);
            };

        panel01.remRad = p01g02_row2.add('radiobutton', undefined, 'Remove');
            panel01.remRad.alignChildren = 'fill';
            panel01.remRad.onClick = function () {
                doTextChange(panel01.btnRename, 'Remove');
                doTextChange(panel01.label_01, 'Remove from head (number):');
                doTextChange(panel01.label_02, 'Remove from tail (number):');
                panel01.label_02.visible = true;
                panel01.txt_in_replace.visible = true; // Show the replace field
                p01g01_replaceCol.visible = true;
                p01g01_replaceRow.visible = false;
                panel01.capRad.visible = false; // Hide the capitalize radio button
                panel01.repRad.value = false;
                panel01.appRad.value = false;
                panel01.caseRad.value = false;
                panel01.searchChkBx.visible = false;
                panel01.batchEnabled = false;
                panel01.batchChkBx.value = false;
                panel01.batchChkBx.visible = false;
                refreshBatchStatus(panel01);
            };
        panel01.caseRad = p01g02_row2.add('radiobutton', undefined, 'Case Conv');
            panel01.caseRad.alignChildren = 'fill';
            panel01.caseRad.onClick = function () {
                doTextChange(panel01.btnRename, 'Convert case');
                doTextChange(panel01.label_01, 'Search for:');
                // doTextChange(panel01.label_02, 'Nothing here:');
                panel01.label_02.visible = false; // Hide the replace field
                panel01.txt_in_replace.visible = false; // Hide the replace field
                p01g01_replaceCol.visible = false;
                p01g01_replaceRow.visible = true;
                panel01.capRad.visible = true; // Show the capitalize radio button
                panel01.repRad.value = false;
                panel01.appRad.value = false;
                panel01.remRad.value = false;
                panel01.searchChkBx.visible = true;
                panel01.batchEnabled = false;
                panel01.batchChkBx.value = false;
                panel01.batchChkBx.visible = false;
                refreshBatchStatus(panel01);
            };

        panel01.batchChkBx.onClick = function () {
            if (!panel01.repRad.value) {
                panel01.batchChkBx.value = false;
                panel01.batchEnabled = false;
                refreshBatchStatus(panel01);
                return;
            }

            if (panel01.batchChkBx.value) {
                var previousRules = panel01.batchRules;
                var previousFilePath = panel01.batchFilePath;
                var loadResult = loadBatchRulesFromDialog(panel01);
                if (!loadResult.ok) {
                    panel01.batchRules = previousRules;
                    panel01.batchFilePath = previousFilePath;
                    panel01.batchEnabled = false;
                    panel01.batchChkBx.value = false;
                    refreshBatchStatus(panel01);
                    if (!loadResult.canceled) {
                        alert(loadResult.message);
                    }
                    return;
                }

                if (loadResult.duplicateCount > 0) {
                    alert(loadResult.message);
                }

                panel01.batchEnabled = true;
            } else {
                panel01.batchEnabled = false;
            }

            refreshBatchStatus(panel01);
        };

        panel01.searchChkBx = p01g02_row2.add('checkbox', undefined, 'search off');
        panel01.searchChkBx.value = false;
        panel01.searchChkBx.visible = false;


        //  ================panel02================oo
        //  ================compSettings================oo
        var panel02 = win.add('panel', undefined, 'Comp settings');
            panel02.orientation = 'column';
            panel02.alignChildren = 'fill';
        var p02g01 = panel02.add('group');
            p02g01.orientation = 'row';
            p02g01.alignChildren = 'center';
        var p02g02 = panel02.add('group');
            p02g02.orientation = 'column';
            p02g02.alignChildren = 'fill';
        var panel02_groupA = p02g01.add('group', undefined, 'labely a pole');
            panel02_groupA.orientation = 'column';
            panel02_groupA.alignChildren = 'right';
        var panel02_group_0 = panel02_groupA.add('group', undefined, 'width');
            panel02_group_0.orientation = 'row';
        var panel02_group_1 = panel02_groupA.add('group', undefined, 'height');
            panel02_group_1.orientation = 'row';
        var panel02_group_2 = panel02_groupA.add('group', undefined, 'Framerate');
            panel02_group_2.orientation = 'row';
        var panel02_group_3 = panel02_groupA.add('group', undefined, 'Start');
            panel02_group_3.orientation = 'row';
        var panel02_group_4 = panel02_groupA.add('group', undefined, 'Duration');
            panel02_group_4.orientation = 'row';
        //  input text
        panel02.label01a = panel02_group_0.add('statictext', undefined, 'Width: ');
        panel02.txt_in_x = panel02_group_0.add('edittext', undefined, '');
        panel02.txt_in_x.characters = 10;
        panel02.label01b = panel02_group_1.add('statictext', undefined, 'Height: ');
        panel02.txt_in_y = panel02_group_1.add('edittext', undefined, '');
        panel02.txt_in_y.characters = 10;
        panel02.label03 = panel02_group_2.add('statictext', undefined, 'FPS: ');
        panel02.txt_in_fps = panel02_group_2.add('edittext', undefined, '');
        panel02.txt_in_fps.characters = 10;
        panel02.label04 = panel02_group_3.add('statictext', undefined, 'Start: ');
        panel02.txt_in_start = panel02_group_3.add('edittext', undefined, '');
        panel02.txt_in_start.characters = 10;
        panel02.label05 = panel02_group_4.add('statictext', undefined, 'Duration: ');
        panel02.txt_in_dur = panel02_group_4.add('edittext', undefined, '');
        panel02.txt_in_dur.characters = 10;
        panel02.durChkBx = panel02_groupA.add('checkbox', undefined, 'Duration including subComps');
        panel02.durChkBx.value = false;
        //  apply Button
        panel02.btnCompSet = p02g02.add('button', undefined, 'OK', {name: "compSettings"});
        
        // --- Action ---
        //  "Enter" v poli "Replace" spusti funkci
        panel01.txt_in_replace.addEventListener("keydown", function(kd) {pressed (kd)});
        function pressed(k) {
            if (k.keyName === "Enter") {
                //alert("You pressed " + k.keyName);
                doMain_01(panel01); // Pass both panels to doMain
            }
        }
        panel02.txt_in_start.addEventListener("keydown", function(kd) {pressed_p02 (kd)});
        function pressed_p02(k) {
            if (k.keyName === "Enter") {
                //alert("You pressed " + k.keyName);
                doMain_02(panel02); // Pass both panels to doMain
            }
        }
        //  "Enter" na tlacitku spusti funkci
        panel01.btnRename.addEventListener("keydown", function(kd) {pressed_02 (kd)});
        function pressed_02(k) {
            if (k.keyName === "Enter") {
                //alert("You pressed " + k.keyName);
                doMain_01(panel01); // Pass both panels to doMain
            }
            /*if (k.keyName === "Tab") {
                txt_in_search.active = true;
                //alert("You pressed " + k.keyName);
            }*/
        }

        // ================click================oo
        panel01.btnRename.onClick = function () {
            doMain_01(panel01); // Pass panel01 to doMain_01
        }
        panel02.btnCompSet.onClick = function () {
            doMain_02(panel02); // Pass panel02 to doMain_01
        }
        
        //  ================window================oo
        // --- ACTIONS ---
        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };
        win instanceof Window
            ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());
    }

    //========================function========================

    //  work area IN
    function zkracovator(comp, panel) {
        var startTimeL = panel.txt_in_start.text;
        if (startTimeL != "") {
            if(isNaN(parseFloat(startTimeL))) {
                alertStr = ("Enter a number for duration\r");
                inWorkAreaIn.text = "";    // clear field in case of NaN input
            } else {
        var compDur = comp.duration;
        var compDurFixed = compDur//.toFixed(0); //round to integer
        if (compDur > 1) {  //  fix stopping on comps shorter than 01s
        comp.workAreaStart = startTimeL;
        comp.workAreaDuration = compDurFixed - startTimeL;
                }
            }
        }
    }
    
    function fps(comp, panel) {
        var input = panel.txt_in_fps.text;
        if (input != "") {
            if(isNaN(parseFloat(input))) {
                alertStr = ("Enter a number for FPS\r");
                inFps.text = "";    // clear field in case of NaN input
            } else {
        var inputDecimalFix = input.replace(/,/, ".");
        var newFpsFloat = parseFloat(inputDecimalFix).toFixed(3);
        //var newFpsFixed = newFpsFloat.toFixed(3);
        comp.frameRate = newFpsFloat;
            }
        }
    }


    function renamer(item, panel) {

        var oldString = panel.txt_in_search.text;
        var newString = panel.txt_in_replace.text;

        var oldName = item.name; // nome da item
        var newName = oldName;
        var changed = false;
        var itemType = 'Item';

        if (item instanceof CompItem) {
            itemType = 'CompItem';
        } else if (item instanceof FolderItem) {
            itemType = 'FolderItem';
        }
        
        if (panel.repRad.value) {
            if (panel.batchEnabled && panel.batchRules.length > 0) {
                newName = applyBatchRenameRules(oldName, panel.batchRules);
            } else {
                newName = oldName.replace(oldString, newString);
            }
        } else if (panel.appRad.value) {
            newName = (oldString + oldName + newString);
        } else if (panel.remRad.value) {
            if (oldString == "") {oldString = 0;}
            if (newString == "") {newString = 0;}
            oldString = ( parseFloat(oldString) );
            newString = ( parseFloat(newString) );
            if ( (isNaN(oldString)) || (isNaN(newString)) ) {
                alert('Error: Not a number?');
                inputError = true;
            } else {
                newName = (newName.substr(oldString, oldName.length));
                newName = (newName.substr(0, newName.length - newString));
                oldString = "";
                newString = "";
            }
        } else if (panel.caseRad.value) {

            if (!panel.searchChkBx.value) {
                //  if checkbox is not checked, use the search field
                oldString = panel.txt_in_search.text;
            } else {
                //  if checkbox is checked, use the item name
                oldString = oldName;
            }

            if (panel.capRad.value) {
                // Capitalize the first letter of each word separated by space, dash, or underscore
                var pattern = new RegExp(oldString, "g");
                newName = oldName.replace(pattern, function(match) {
                    // Split by space, dash, or underscore, capitalize each part, then join back
                    return match.replace(/([^\s\-_]+)/g, function(word) {
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    });
                });
            } else if (panel.uppRad.value) {
            newName = oldName
                // toUpperCase
                .replace(oldString, oldString.toUpperCase());
            } else if (panel.lowRad.value) {
            newName = oldName
                // toLowerCase
                .replace(oldString, oldString.toLowerCase());
            }
        }
        //////////////////////
        try {
            if (oldName != newName) {
                item.name = newName;
                changed = true;
            }
        } catch (error ) {
            // just ignore errors; if it can't be named, what the hay
        }
        oldString = "";
        newString = "";
        //////////////////////
        //  fixing broken expressions due to the change of the name;              
        if (changed) {
            app.project.autoFixExpressions(oldName, newName);
        }

        return {
            changed: changed,
            oldName: oldName,
            newName: newName,
            itemType: itemType
        };
    }

    function makeParentLayerOfAllUnparented(theComp, newParent) {
        for (var i = 1; i <= theComp.numLayers; i++) {
            var curLayer = theComp.layer(i);
            if (curLayer.locked) {curLayer.locked = false;}
            if (curLayer != newParent && curLayer.parent == null && curLayer.threeDLayer != true) {
                curLayer.parent = newParent;
            }
        }
    }

    function moveParent(parent, axis, shift) {
        //null is at 000 anyway, so no math needed
        newPos = [0, 0, 0];
        newPos[axis] = shift;
        parent.position.setValue(newPos);
    }

    function width(item, panel) {
        if (isNaN(parseInt(panel.txt_in_x.text))) {
            message = (message + "Enter a number value for Width\r");
            panel.txt_in_x.text = ""; //empty field if it is bad so we don't try anymore
        } else {
            var oldWidth = item.width;
            var newWidth = (parseInt(panel.txt_in_x.text));
            if ( (newWidth > 30000) || (newWidth < 4) ) {
                message = (message + "Value out of range for Width\r");
                panel.txt_in_x.text = ""; //empty field if it is bad so we don't try anymore
            } else {
                if (oldWidth != newWidth) {
                    item.width = newWidth;
                    thisMuch = (-1 * (oldWidth - newWidth)) / 2;
                    null3DLayer = item.layers.addNull();
                    null3DLayer.threeDLayer = true;
                    doomedNullSrc = null3DLayer.source; // null project item, so that it could be removed
                    null3DLayer.position.setValue([0, 0, 0]);
                    makeParentLayerOfAllUnparented(item, null3DLayer);
                    moveParent(null3DLayer, 0, thisMuch);
                    null3DLayer.remove();
                    doomedNullSrc.remove();
                }
            }
        }
    }

    function height(item, panel) {
        if (isNaN(parseInt(panel.txt_in_y.text))) {
            message = (message + "Enter a number value for Height\r");
            panel.txt_in_y.text = ""; //empty field if it is bad so we don't try anymore
        } else {
            var oldHeight = item.height;
            var newHeight = (parseInt(panel.txt_in_y.text));
            if ( (newHeight > 30000) || (newHeight < 4) ) {
                message = (message + "Value out of range for Height\r");
                panel.txt_in_y.text = ""; //empty field if it is bad so we don't try anymore
            } else {
                if (oldHeight != newHeight) {
                    item.height = newHeight;
                    thisMuch = (-1 * (oldHeight - newHeight)) / 2;
                    null3DLayer = item.layers.addNull();
                    null3DLayer.threeDLayer = true;
                    doomedNullSrc = null3DLayer.source; // null project item, so that it could be removed
                    null3DLayer.position.setValue([0, 0, 0]);
                    makeParentLayerOfAllUnparented(item, null3DLayer);
                    moveParent(null3DLayer, 1, thisMuch);
                    null3DLayer.remove();
                    doomedNullSrc.remove();
                }
            }
        }
    }

    //---------------compDurationChange--------------------
    //---change-only-selected-comp-duration----------------
    function duration(comp, panel) {
        var input = panel.txt_in_dur.text;
        if (input != "") {
            if(isNaN(parseFloat(input))) {
                alertStr = ("Enter a number for Duration\r");
                panel.txt_in_dur.text = "";    // clear field in case of NaN input
            } else {
        var inputDecimalFix = input.replace(/,/, ".");
        var newDuration = parseFloat(inputDecimalFix).toFixed(2);
        comp.duration = newDuration;
            }
        }
    }
    //---change-including-the-comps-content----------------
    function durationInDepht(comp, panel) {
        var newDuration = panel.txt_in_dur.text;
        const subCompArr = levelOrderTraversal(comp);
        for (var i = 0; i < subCompArr.length; i++) {
            changeDuration(subCompArr[i], newDuration);
        }
    
    //  setting the dur for layers of the comp
    //  layer - set new out point
    //  layer-comp - set new duration to the source comp
    function changeDuration(comp, newDuration) {
        
        var compLayerArr = comp.layers; // prohlidka vrstev
        comp.duration = newDuration;

        for (var j = 1; j <= compLayerArr.length; j++) {
            var layerSource = compLayerArr[j].source;
            var layer = compLayerArr[j];
            
            if (layerSource instanceof CompItem) {
                layerSource.duration = newDuration;
            }
            layer.outPoint = newDuration;
        }
    }
    //  iterating through the subComps
    function levelOrderTraversal(root) {
        if (root == null)
            return;

        // Standard level order traversal code
        // using queue
        var arr = [];
        var q = []; // Create a queue
        q.push(root); // push root 
        while (q.length != 0) {
            var n = q.length;

            // If this node has children
            while (n > 0) {
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
        }
        return arr;
    }
    }


    //========================Main========================

    function doMain_01(panel01) {
        app.beginUndoGroup("Change Selected Comps");
        
        var selection = app.project.selection; // compositions
        var logEntries = [];
        var logEnabled = panel01.logChkBx.value;
        var logFolder = null;

        if (selection.length == 0) {
            alert("Select a composition");
            app.endUndoGroup();
            return;
        }

        if (!panel01.compFilterChkBx.value && !panel01.folderFilterChkBx.value) {
            alert('Enable at least one filter: Comps or Folders.');
            app.endUndoGroup();
            return;
        }

        if (logEnabled) {
            var projectFolder = getProjectFolder();
            if (projectFolder == null) {
                alert('Log requires a saved project. Save the .aep file first.');
                app.endUndoGroup();
                return;
            }

            logFolder = ensureLogFolder(projectFolder);
            if (logFolder == null) {
                alert('Failed to create log folder in project directory.');
                app.endUndoGroup();
                return;
            }
        }

        for (var index = 0; index < selection.length; index++) {
            var item = selection[index];

            var isComp = (item instanceof CompItem);
            var isFolder = (item instanceof FolderItem);
            var passesFilter = (isComp && panel01.compFilterChkBx.value)
                || (isFolder && panel01.folderFilterChkBx.value);

            if (!passesFilter) {
                continue;
            }

            var shouldRun = (panel01.txt_in_search.text != "" || panel01.txt_in_replace.text != "");
            if (panel01.repRad.value && panel01.batchEnabled) {
                if (panel01.batchRules.length == 0) {
                    alert('Batch rename is enabled, but no list is loaded.');
                    app.endUndoGroup();
                    return;
                }
                shouldRun = true;
            }

            if (shouldRun) {
                var renameResult = renamer(item, panel01);
                if (logEnabled && renameResult.changed) {
                    logEntries.push(renameResult);
                }
            }
        //  reset input fields & unclick duration checkbox
        // panel01.txt_in_search.text = "";
        // panel01.txt_in_replace.text = "";
        }

        if (logEnabled && logEntries.length > 0) {
            var logWrite = writeRenameLogFile(logFolder, logEntries);
            if (!logWrite.ok) {
                alert(logWrite.message);
            }
        }

        app.endUndoGroup();
    }

    function doMain_02(panel02) {
        app.beginUndoGroup("Change Selected Comps");
        
        var selection = app.project.selection; // compositions

        if (selection.length == 0) {
            alert("Select a composition");
        } else {
            for (var index = 0; index < selection.length; index++) {
                var item = selection[index];
                
                if (item instanceof CompItem) {  //  zbytek pracuje jen na comps
                    if (panel02.txt_in_x.text != "") {
                        width(item, panel02);
                    }
                    if (panel02.txt_in_y.text != "") {
                        height(item, panel02);
                    }
                    if (panel02.txt_in_start.text != "") {
                        zkracovator(item, panel02);
                    }
                    if (panel02.txt_in_fps.text != "") {
                        fps(item, panel02);
                    }
                    if (panel02.txt_in_dur.text != "" && panel02.durChkBx.value == false) {
                        duration(item, panel02);
                    }
                    if (panel02.txt_in_dur.text != "" && panel02.durChkBx.value == true) {
                        durationInDepht(item, panel02);
                    }
                    if (message != "") {
                        alert("The following problems were found (these settings were not changed!):\r" + message);
                    }
                }
            }
            //  reset input fields & unclick duration checkbox
            panel02.txt_in_x.text = "";
            panel02.txt_in_y.text = "";
            panel02.txt_in_fps.text = "";
            panel02.txt_in_start.text = "";
            panel02.txt_in_dur.text = "";
            panel02.durChkBx.value = false;
            message = "";
        }   

        app.endUndoGroup();
    }
    //========================Main========================
    

})(this);
