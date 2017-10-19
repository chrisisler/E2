# ErxiDesk 2

E2 allows you to easily manage and gain insight into the processes running on your computer.

### Needed Features

- searching then killing does not work because...
  - the unfiltered process gets highlighted/marked.
- Notification CSS
- Support Windows
  - getProcesses(Sync/Async) for Windows
  - killProcess for Windows
- Installation
  - Windows
  - macOS
- dark/light themes in config view
  - make em persist locally

### Wanted Features

none.

```
/**
 * Actions to invoke on individual process hover:
 * - Display percent memory used by this process out of all processes.
 * - If there are more than one instances of processes of this name,
 *   display how many and their total memory usage, and their total memory
 *   usage as a percentage.
 *
 * General actions
 * - refresh (get fresh batch of processes)
 *
 * Status bar information (fixed to bottom):
 * - Number of processes
 * - Number of processes highlighted
 * - Sum memory (from all processes) out of total memory.
 * - Up arrow icon, on click: scroll to top.
 */
```

### Technology Used
- [Preact](https://github.com/developit/preact)
- [Preact-router](https://github.com/developit/preact-router)
- [Electron](https://github.com/electron/electron)
- [Webpack](https://github.com/webpack/webpack)
- [Webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- [Glamorous](https://medium.com/@kentcdodds/introducing-glamorous-fb3c9f4ed20e)
- [Yarn](https://github.com/yarnpkg/yarn)
- [Babel](https://babeljs.io)
- [ESLint](https://eslint.org)
