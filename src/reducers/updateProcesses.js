/**
 * @param {Object} store
 * @param {Object} payload
 * @param {[Object]} payload.processes - The new processes array.
 * @returns {Object} - Properties of new state.
 */
export default function updateProcesses(store, payload) {
    const { renamesMap } = store.getState()
    let { processes } = payload

    // persist renames. see `renameProcess.js`
    renamesMap.forEach(({ latestName }, pid) => {
        const idx = processes.findIndex(p => p.pid == pid)
        processes[idx].name = latestName
    })

    return { processes }
}
