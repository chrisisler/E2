import { keysFrom } from '../shared'
import markProcesses from './markProcesses'
import updateProcesses from './updateProcesses'

/** @type {(state: Object) -> newState: Object} */
export default function clearFilter(state) {
    const { markedProcessesMap, unfilteredProcesses, visibilityFilter } = state

    // revert processes back to unfiltered (if applicable), clear the search
    if (unfilteredProcesses.length !== 0 && visibilityFilter != null) {
        state = { ...state, visibilityFilter: null }
        state = Object.assign(state, updateProcesses(state, { processes: unfilteredProcesses }))
    }

    // remark all previously marked processes
    state = Object.assign(state, markProcesses(state, { indexes: keysFrom(markedProcessesMap) }))

    return state
}
