// TODO split

/**
 * For the "ProcessesRoute" (so far).
 * Given an array of indexes for the `processes` array, set `isMarked` on/off
 * for the given `indexes` in `payload`.
 *
 * @TODO SEPARATE INTO TWO DIFFERENT FUNCTIONS (FOR TRUE vs. FALSE `.isMarked`)!
 * @param {Object} store
 * @param {Object} payload - Data which changes state in some way.
 * @param {[Number]} payload.indexes - Indexes of `processes` to alter.
 * @param {Boolean} doMarkProcess - To set `isMarked` (of a process obj) on/off.
 * @returns {Object} - The new state.
 */
export default function markProcesses(store, payload, doMarkProcess) {
    const indexesToChange = payload.indexes
    let { processes, markedProcessesMap } = store.getState()

    if (doMarkProcess) {
        indexesToChange.forEach(index => {
            processes[index].isMarked = true
            markedProcessesMap.set(index, processes[index]) // add the mark
        })
    } else {
        indexesToChange.forEach(index => {
            processes[index].isMarked = false
            markedProcessesMap.delete(index) // remove the mark
        })
    }

    return { processes, markedProcessesMap }
}
