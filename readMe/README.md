js_compsChanger

This project is an Adobe After Effects script written in ExtendScript. 
It provides a user interface (UI) panel with two main functionalities: 
1. "Prejmenovator" (Renamer): Allows users to rename compositions, folders, or files in the project using search-and-replace, append, remove, or case conversion operations.
2. "Comp settings": Enables users to modify composition properties such as width, height, frame rate (FPS), start time, and duration, including the option to apply changes to nested sub-compositions.

The script is designed to work with selected compositions in the After Effects project and includes features like resetting input fields, handling invalid inputs, and managing 2D/3D layers during dimension changes. The UI is organized into panels and groups for better separation of functionalities.

Batch rename (Renamer)

Renamer Search mode supports Batch rename using a CSV file loaded from the file system.

UI behavior
- A checkbox batch is available next to the Search radio option.
- A status line appears under the radio options:
	Status: Batch Rename: Not loaded.
	Status: Batch Rename: List loaded (N rules).
- If batch is checked and no list is loaded yet, a file dialog prompts you to choose a CSV file.
- Batch mode is active only in Search mode.
- Checking batch ON always prompts for a new CSV.

CSV format
- Two columns per row: search,replace
- Optional first-row header values: search,replace or in,out
- Comma is default delimiter. Semicolon is accepted when the first data row uses semicolon and no comma.
- Empty lines are ignored.
- Comment lines starting with # or // are ignored.
- Duplicate search values are resolved by last-row-wins.

Example CSV
search,replace
Word01,Word01alt
Word03,Word03alt
Word05,Word05alt

Example result
- Input: Word01_Word02_Word03_Word04
	Output: Word01alt_Word02_Word03alt_Word04
- Input: Word01_Word02_Word03_Word04_Word05
	Output: Word01alt_Word02_Word03alt_Word04_Word05alt

Renamer filters and log

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