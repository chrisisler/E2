/**
 * @param {Object} state
 *   @param {Map<Object, Number>} state.renamesMap
 * @param {Object} payload
 *   @param {[Object]} payload.processes - The new processes array.
 * @returns {Object} - Properties of new state.
 */
export default function updateProcesses(state, payload) {
    let { renamesMap, visibilityFilter, unfilteredProcesses } = state
    let { processes } = payload

    if (renamesMap.size !== 0) {
        // persist renames. see `renameProcess.js`
        renamesMap.forEach((renameHistory, pid) => {
            const idx = processes.findIndex(p => p.pid == pid)
            processes[idx].name = renameHistory.latestName
        })
    }

    if (visibilityFilter != null) {
        unfilteredProcesses = processes
        processes = processes.filter(visibilityFilter)
    }

    return { processes, unfilteredProcesses }
}
