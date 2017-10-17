import closeActionsMenu from './closeActionsMenu'

/**
 * @param {Object} store
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - Contains properties of state to update.
 */
export default function renameProcess(store, payload) {
    const { newName, procIndex } = payload
    let { processes, renamesMap } = store.getState()
    let proc = processes[procIndex]

    // record the renaming in the renamesMap
    if (renamesMap.get(proc.pid) !== void 0) {
        // the given proc has been renamed before, just update its latestName
        renamesMap.get(proc.pid).latestName = newName
    } else {
        // first time renaming the given proc obj
        renamesMap.set(proc.pid, { originalName: proc.name, latestName: newName })
    }

    // update to the new name
    proc.name = newName

    // closes the actions menu
    const { actionsMenuNode } = closeActionsMenu(store)

    return { processes, actionsMenuNode, renamesMap }
}
