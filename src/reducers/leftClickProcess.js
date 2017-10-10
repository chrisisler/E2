import markProcesses from './markProcesses'

// Utility functions.
const last = x => x[x.length - 1]
const range = (start, end) => [...Array(end - start)].map((_, idx) => idx + start)

/**
 * Handles (un)highlighting the process rows:
 * - Left-click a process to highlight only that one (and de-select all others).
 * - Ctrl + left-click a process to highlight multiple processes.
 * - Shift + left-click to highlight all processes between.
 *
 * @param {Object} store
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state.
 */
export default function leftClickProcess(store, payload) {
    const { event, procObj, procIndex } = payload
    let { markedProcessesMap, processes } = store.getState()

    // If no modifiers (left-click only) then mark the clicked process (and unhighlight the rest).
    if (!event.altKey && !event.shiftKey) {
        // Unmark any previously marked processes.
        const indexes = [...markedProcessesMap.keys()]
        if (indexes.length > 0) {
            processes = markProcesses(store, { indexes }, false).processes
            // store = { ...store, processes }
        }
        // Mark the clicked process.
        processes = markProcesses(store, { indexes: [procIndex] }, true).processes
        markedProcessesMap = new Map().set(procIndex, procObj)
    }
    // If ALT + left-click, add the clicked process to the markedProcessesMap.
    else if (event.altKey) {
        processes = markProcesses(store, { indexes: [procIndex] }, true).processes
        markedProcessesMap.set(procIndex, procObj)
    }
    // If SHIFT + left-click 
    else if (event.shiftKey) {
        const lastIndex = last([...markedProcessesMap.keys()])

        // Mark every process between `lastIndex` and `procIndex`.
        const indexes = (lastIndex < procIndex)
            ? range(lastIndex, procIndex + 1) // need `+1` because procIndex is not yet marked.
            : range(procIndex, lastIndex)
        processes = markProcesses(store, { indexes }, true).processes

        // Update the Map to reflect the newly marked processes per `indexes`.
        indexes.forEach(index => {
            markedProcessesMap.set(index, processes[index])
        })
    }
    return { markedProcessesMap, processes }
}
