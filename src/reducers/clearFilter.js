import { keysFrom } from '../shared'
import unmarkProcesses from './unmarkProcesses'

/**
 * @returns {Object} - Properties of the app state to update.
 */
export default function clearFilter(store) {
    const { markedProcessesMap, unfilteredProcesses } = store.getState()

    const indexes = keysFrom(markedProcessesMap)
    const moreState = unmarkProcesses(store, { indexes })
    return {
        visibilityFilter: null
        , processes: unfilteredProcesses
        , ...moreState
    }
}
