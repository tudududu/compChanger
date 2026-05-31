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
