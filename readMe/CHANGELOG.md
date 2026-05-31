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
