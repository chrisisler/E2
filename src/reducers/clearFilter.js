import { keysFrom, updateStore } from '../shared'
import unmarkProcesses from './unmarkProcesses'
import updateProcesses from './updateProcesses'

/**
 * @returns {Object} - Properties of the app state to update.
 */
export default function clearFilter(store) {
    const { markedProcessesMap, unfilteredProcesses } = store.getState()

    // update store so that `getState` reflects that processes are now unfiltered
    store = updateStore(store, updateProcesses(store, { processes: unfilteredProcesses }))

    const indexes = keysFrom(markedProcessesMap)
    const moreState = unmarkProcesses(store, { indexes })

    return {
        visibilityFilter: null
        , ...moreState
    }
}
