import closeActionsMenu from './closeActionsMenu'

/**
 * @param {Object} state
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - Contains properties of state to update.
 */
export default function renameProcess(state, payload) {
    const { newName, procIndex } = payload
    let { processes, renamesMap } = state
    let proc = processes[procIndex]

    const nameHistory = renamesMap.get(proc.pid)

    // record the renaming in the renamesMap
    if (nameHistory !== void 0) {
        // if updating name to original name, remove entry from the map
        if (newName === nameHistory.originalName) {
            renamesMap.delete(proc.pid)
        } else {
            // the given proc has been renamed before, just update its latestName
            nameHistory.latestName = newName
        }
    } else {
        // first time renaming the given proc obj
        renamesMap.set(proc.pid, { originalName: proc.name, latestName: newName })
    }

    // update to the new name
    proc.name = newName

    // closes the actions menu
    const { actionsMenuNode } = closeActionsMenu(state)

    return { processes, actionsMenuNode, renamesMap }
}
