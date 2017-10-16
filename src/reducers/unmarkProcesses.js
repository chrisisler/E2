/**
 * Sets the `isMarked` property of a list of process Objects to `false`.
 *
 * @param {Object} store
 * @param {Object} payload
 * @param {[Number]} payload.indexes - Indexes of `processes` to alter.
 * @returns {Object} - Updated properties of app state.
 */
export default function unmarkProcesses(store, payload) {
    const indexesToChange = payload.indexes
    let { processes, markedProcessesMap } = store.getState()

    indexesToChange.forEach(index => {
        processes[index].isMarked = false
        markedProcessesMap.delete(index) // remove the mark
    })

    return { processes, markedProcessesMap }
}
