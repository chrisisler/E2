# ErxiDesk 2

A desktop app for analyzing and managing your running processes.

### Uses
- [Preact](https://github.com/developit/preact)
- [Preact-router](https://github.com/developit/preact-router)
- [Electron](https://github.com/electron/electron)
- [Webpack](https://github.com/webpack/webpack)
- [Webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- [Glamorous](https://medium.com/@kentcdodds/introducing-glamorous-fb3c9f4ed20e)
- [Yarn](https://github.com/yarnpkg/yarn)

```
/**
 * Left-click a process to highlight only that one.
 * Ctrl + left-click a process to highlight multiple processes.
 * Shift + left-click to highlight all processes between.
 *
 * Right-click on a process to open the context menu.
 *   If the right-click occurred on an already highlighted process,
 *     display the context menu for those highlighted processes.
 *   Otherwise, clear the highlighted processes, highlight the right-clicked
 *     process, and open the context menu on it.
 *
 * Actions to invoke on a an individual process context menu:
 * - kill
 * - rename
 *
 * Actions to invoke on individual process hover:
 * - Display percent memory used by this process out of all processes.
 * - If there are more than one instances of processes of this name,
 *   display how many and their total memory usage, and their total memory
 *   usage as a percentage.
 *
 *
 * General actions
 * - sort
 * - refresh (get fresh batch of processes)
 * - search (fuzzy)
 *
 * Status bar information (fixed to bottom):
 * - Number of processes
 * - Number of processes highlighted
 * - Sum memory (from all processes) out of total memory.
 * - Up arrow icon, on click: scroll to top.
 */
```
