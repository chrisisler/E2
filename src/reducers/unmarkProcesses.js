/**
 * Sets the `isMarked` property of a list of process Objects to `false`.
 *
 * @param {Object} state
 * @param {Object} payload - Data which changes state in some way.
 * @param {[Number]} payload.indexes - Indexes of `processes` to alter.
 * @returns {Object} - Updated properties of app state.
 */
export default function unmarkProcesses(state, payload) {
    const indexesToChange = payload.indexes
    let { processes, markedProcessesMap } = state

    indexesToChange.forEach(index => {
        processes[index].isMarked = false
        markedProcessesMap.delete(index) // remove the mark
    })

    return { processes, markedProcessesMap }
}
