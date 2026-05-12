# Ak@sh — Local Workspace

A fully local, browser-based canvas workspace for organizing notes, images, and documents. All data stays on your machine using the File System Access API. Connect multiple canvases to search, navigate, and link across workspaces.

## Features

### Canvas Basics

- **Text Notes** — Right-click on the canvas to create. Double-click to edit. Supports rich text formatting (bold, italic, bullets), multiple fonts, and color backgrounds.
- **Images** — Paste from clipboard, drag & drop from file explorer, or use the Add Image button. Images are stored locally and capped at 800px max dimension.
- **Documents** — Add PDF, DOCX, MD, and other files. Double-click to open in browser.
- **Frames** — Colored background regions for visually grouping items. Hold `F` and drag to draw, or use the Add Frame button. Choose from 6 background colors.
- **Frame Locking** — Right-click a frame to lock/unlock. Locked frames protect all fully contained items from editing, moving, resizing, or deletion. Resizing an unlocked frame proportionally scales all items within it.
- **Tagging** — Add comma-separated tags to any item via the context toolbar. Browse by tag in the sidebar outline.
- **Bookmarks** — Pin items for quick access from the bookmarks panel.
- **Search** — Full-text search with support for `recent:7d`, `after:YYYY-MM-DD`, `before:YYYY-MM-DD`, `pinned:yes`, and `file:yes` filters. Arrow keys navigate results live.
- **Sidebar Outline** — Toggle with `\`. View items organized by tags or timeline.
- **Undo** — `Ctrl/Cmd+Z` with up to 50 levels.

### Multi-Canvas Connection

- **Canvas Switcher** — Click the Ak@sh brand button or press `Cmd/Ctrl+K` to open the workspace switcher dropdown. Lists all recent workspaces sorted by last opened, with the current one highlighted. Includes "Open folder..." to browse for an existing workspace and "New canvas..." to create a fresh one.
- **Navigation History** — Back/forward navigation across items and workspaces. Press `Alt+Left` / `Alt+Right` or click the arrow buttons in the topbar. Each entry records the workspace, item, pan position, and zoom level. Navigating back to a different workspace switches automatically.
- **Global Search** — Click the globe icon in the search bar to toggle cross-workspace search. Results are grouped by workspace name. Arrow keys navigate results from the current workspace live; press Enter to jump to a result in another workspace. An IndexedDB search index caches item content from all workspaces and refreshes on startup and after every save.
- **Cross-Canvas Links** — A `canvaslink` item type that visually references an item on another canvas. Right-click an item and choose "Copy Link", then right-click on the canvas and choose "Paste Link Here" to create a link card. Double-click a link card to follow it to the target workspace and item. Link cards show the target item preview and source workspace name. You can also create links directly from global search results using the link button on cross-workspace rows.

## Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Pan view | Drag on canvas |
| Zoom | Scroll wheel |
| Add note | Right-click on canvas / Double-click |
| Quick note | `N` |
| Edit note | Double-click note |
| Add frame | Hold `F` + drag |
| Lock/Unlock frame | Right-click on frame |
| Region select | Hold `Space` + move mouse |
| Lasso select | `Shift` + drag |
| Multi-select | `Shift` + click |
| Duplicate | `Cmd/Ctrl` + `D` |
| Delete | `Delete` / `Backspace` |
| Undo | `Cmd/Ctrl` + `Z` |
| Paste at cursor | `Cmd/Ctrl` + `V` |
| Toggle outline | `\` |
| Open file | Double-click file |
| Switch workspace | `Cmd/Ctrl` + `K` |
| Navigate back | `Alt` + `Left` |
| Navigate forward | `Alt` + `Right` |
| Search results up/down | `Arrow Up` / `Arrow Down` |
| Open search result | `Enter` |
| Clear search & exit | `Escape` |

## Requirements

- A modern Chromium-based browser (Chrome, Edge) with File System Access API support.
- No server or build step required — open `index.html` directly.

## Getting Started

1. Open `index.html` in Chrome or Edge.
2. Click **Open or Create Workspace Folder** and select a local directory.
3. Start adding notes, images, files, and frames to your canvas.

## Multi-Canvas Workflow

1. Create multiple workspace folders (one per project or topic).
2. Use `Cmd/Ctrl+K` to switch between them. The switcher also lets you open new folders or create empty canvases.
3. Toggle the globe icon in the search bar to search across all workspaces at once.
4. Right-click any item and choose "Copy Link", then paste it into another canvas to create a cross-canvas reference card.
5. Double-click a link card to jump to the target item in its workspace.
6. Use `Alt+Left` / `Alt+Right` to navigate back and forward across items and workspaces.
