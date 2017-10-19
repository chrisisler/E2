// Individual reducers may need access to each other.
// If so, all state updates are batched together.
// See the `rightClickProcess` reducer for an example.

import clearFilter from './clearFilter'
import closeActionsMenu from './closeActionsMenu'
import killProcesses from './killProcesses'
import leftClickProcess from './leftClickProcess'
import markProcesses from './markProcesses'
import refreshProcesses from './refreshProcesses'
import renameProcess from './renameProcess'
import rightClickProcess from './rightClickProcess'
import searchProcesses from './searchProcesses'
import showNotification from './showNotification'
import sortProcesses from './sortProcesses'
import unmarkProcesses from './unmarkProcesses'
import updateProcesses from './updateProcesses'

export default (action, store) => {
    /* eslint-disable indent */
    switch (action.type) {
        // synchronous actions
        case 'MARK_PROCESSES'     : return markProcesses(store, action.payload)
        case 'UNMARK_PROCESSES'   : return unmarkProcesses(store, action.payload)
        case 'LEFT_CLICK_PROCESS' : return leftClickProcess(store, action.payload)
        case 'RIGHT_CLICK_PROCESS': return rightClickProcess(store, action.payload)
        case 'RENAME_PROCESS'     : return renameProcess(store, action.payload)
        case 'CLOSE_ACTIONS_MENU' : return closeActionsMenu(store)
        case 'SORT_PROCESSES'     : return sortProcesses(store, action.payload)
        case 'SEARCH_PROCESSES'   : return searchProcesses(store, action.payload)
        case 'CLEAR_FILTER'       : return clearFilter(store)
        case 'UPDATE_PROCESSES'   : return updateProcesses(store, action.payload)
        case 'SHOW_NOTIFICATION'  : return showNotification(null, action.payload)

        // asynchronous actions
        case 'KILL_PROCESSES'     : killProcesses(store, action.payload); break
        case 'REFRESH_PROCESSES'  : refreshProcesses(store); break

        default: throw new Error(`Unhandled action type: ${action.type}`)
    }
}
