import closeActionsMenu from './closeActionsMenu'

/**
 * @param {Object} store - Contains: `getState` func and `dispatch` func.
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state. Updates the `processes` property.
 */
export default function renameProcess(store, payload) {
    const { newName, procIndex } = payload
    let { processes } = store.getState()
    processes[procIndex].name = newName

    // Are we supposed to grab the object returned by this dispatch and attach it to
    // our returned object? If we choose to do that, we will have to beconsistent and
    // do that for _all_ dispatch calls inside a reducer. Could be bad for perf?

    // store.dispatch('CLOSE_ACTIONS_MENU')
    const { actionsMenuNode } = closeActionsMenu(store) // Close the actions menu.
    return { processes, actionsMenuNode }
}
