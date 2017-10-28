/**
 * Sets the `isMarked` property of a list of process Objects to `true`.
 *
 * @param {Object} state
 * @param {Object} payload - Data which changes state in some way.
 * @param {[Number]} payload.indexes - Indexes of `processes` to alter.
 * @returns {Object} - Updated properties of app state.
 */
export default function markProcesses(state, payload) {
    const indexesToChange = payload.indexes
    let { processes, markedProcessesMap } = state

    indexesToChange.forEach(index => {
        processes[index].isMarked = true
        markedProcessesMap.set(index, processes[index]) // add the mark
    })

    return { processes, markedProcessesMap }
}
