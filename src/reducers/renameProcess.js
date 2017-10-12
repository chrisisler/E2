import closeActionsMenu from './closeActionsMenu'

/**
 * @param {Object} store
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - Contains properties of state to update.
 */
export default function renameProcess(store, payload) {
    const { newName, procIndex } = payload
    let { processes } = store.getState()
    processes[procIndex].name = newName

    // closes the actions menu
    const { actionsMenuNode } = closeActionsMenu(store)

    // TODO implement a history of renames. persisting renames across "Refresh" actions.
    return { processes, actionsMenuNode,  }
}
// oldname
// newname
// index
// pid
