# 4.0.2 - 2026-05-31

Added:
- Log behavior is now incremental per opened project session in js_compChanger.jsx:
1. One log file reused per project session
    Added session-level tracking variables at js_compChanger.jsx:75.
    Added resolver that creates the log filename once per project folder/session and reuses it on later runs at js_compChanger.jsx:313.
2. Append mode instead of overwrite
    Log writer now opens file with append mode so each rename run adds a new block at js_compChanger.jsx:323.
    Header before each new block
    Each write now starts with a separator and header lines at js_compChanger.jsx:331.
3. Header text updated
    Changed from created to rename processed with full date string at js_compChanger.jsx:333, matching your requested format.


# 4.0.2 - 2026-05-31

Added:
- Renamer filters and log

Three checkboxes are available in one row under the Batch Rename status line:
- Comps: include only CompItems.
- Folders: include only FolderItems.
- Log: write rename changes to a file.

Filter behavior
- Filters apply to all Renamer modes: Search (including Batch), Append, Remove, and Case Conv.
- If both Comps and Folders are OFF, the run is blocked.

Log behavior
- Log writes changed names only (no unchanged/no-op rows).
- The script creates a `log` folder next to the opened `.aep` file.
- Log file name format: `compchanger_YYYYMMDD_HHMMSS.log`.
- If Log is ON and the project is unsaved, the run is blocked until the project is saved.

Example log line
[CompItem] Old_Name -> New_Name

# 4.0.1 - 2026-05-31

Added:
- Updated batch checkbox handler at js_compChanger.jsx:460:
1. ON now always calls loadBatchRulesFromDialog(...), regardless of whether a list was already loaded.
2. If loading is canceled or fails, batch is turned back OFF.
3. Previous loaded rules/path are restored on failed/canceled load, so you do not lose the old list accidentally.

- Key lines
    Handler start: js_compChanger.jsx:460
    Save previous state before reload: js_compChanger.jsx:469
    Always prompt for load on ON: js_compChanger.jsx:471
    Restore previous list on failure/cancel: js_compChanger.jsx:473


# 4.0.0 - 2026-05-31

Added:
- Implemented Batch rename in Renamer and connected it end-to-end.

1. Batch data parsing and loading
    Added CSV parsing, validation, deduplication, dialog loading, and sequential literal replacement helpers in `js_compChanger.jsx:81`, `js_compChanger.jsx:116`, `js_compChanger.jsx:222`, and `js_compChanger.jsx:276`.
    CSV supports two columns (search,replace), optional header (search/replace or in/out), ignores empty/comment rows, and applies duplicate search keys as last-row-wins.
2. Renamer UI changes
    Added status line under radio controls and above search input at `js_compChanger.jsx:318`.
    Added batch checkbox next to Search radio at `js_compChanger.jsx:375`.
    Implemented mode-aware visibility and state behavior plus file-prompt-on-check flow at `js_compChanger.jsx:382` and `js_compChanger.jsx:460`.
3. Rename execution updates
    Search mode now applies loaded batch rules in sequence when batch is enabled at `js_compChanger.jsx:635`.
    Main run gate now allows execution with batch-enabled rules even if text fields are empty, with guard for missing loaded list at `js_compChanger.jsx:859`.
4. Documentation
    Added Batch rename usage, CSV format, and your Word01 example to `README.md:10`.



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