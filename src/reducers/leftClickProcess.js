import markProcesses from './markProcesses'
import unmarkProcesses from './unmarkProcesses'
import { keysFrom } from '../shared'

/** @type {[Any] -> Any} */
const last = x => x[x.length - 1]

/** @type {(Number, Number) -> [Number]} */
const range = (start, end) => [...Array(end - start)].map((_, idx) => idx + start)

/**
 * Handles (un)highlighting the process rows:
 * - Left-click a process to highlight only that one (and de-select all others).
 * - Ctrl + left-click a process to highlight multiple processes.
 * - Shift + left-click to highlight all processes between.
 *
 * @param {Object} state
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state.
 */
export default function leftClickProcess(state, payload) {
    const { event, procIndex } = payload

    // which modifier keys was the user pressing when they left-clicked?
    const altKeyPressed = (event.altKey === true)
    const shiftKeyPressed = (event.shiftKey === true)

    if (!altKeyPressed && !shiftKeyPressed) {

        // unmark all processes except for the clicked one.
        const indexes = keysFrom(state.markedProcessesMap)
        if (indexes.length > 0) {
            state = Object.assign(state, unmarkProcesses(state, { indexes }))
        }

        // mark the clicked process
        state = Object.assign(state, markProcesses(state, { indexes: [procIndex] }))
    }
    else if (altKeyPressed === true) {
        // just add the clicked process to the other marked processes
        state = Object.assign(state, markProcesses(state, { indexes: [procIndex] }))
    }
    else if (shiftKeyPressed === true) {
        const lastIndex = last(keysFrom(state.markedProcessesMap))

        // mark every process between `lastIndex` and `procIndex`
        const indexes = (lastIndex < procIndex)
            ? range(lastIndex, procIndex + 1) // need `+1` because procIndex is not yet marked.
            : range(procIndex, lastIndex)
        state = Object.assign(state, markProcesses(state, { indexes }))
    }

    return state
}
