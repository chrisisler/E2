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

export default (action, state) => {
    /* eslint-disable indent */
    switch (action.type) {

        // synchronous actions
        case 'MARK_PROCESSES'     : return markProcesses(state, action.payload)
        case 'UNMARK_PROCESSES'   : return unmarkProcesses(state, action.payload)
        case 'LEFT_CLICK_PROCESS' : return leftClickProcess(state, action.payload)
        case 'RIGHT_CLICK_PROCESS': return rightClickProcess(state, action.payload)
        case 'RENAME_PROCESS'     : return renameProcess(state, action.payload)
        case 'CLOSE_ACTIONS_MENU' : return closeActionsMenu(state)
        case 'SORT_PROCESSES'     : return sortProcesses(state, action.payload)
        case 'SEARCH_PROCESSES'   : return searchProcesses(state, action.payload)
        case 'CLEAR_FILTER'       : return clearFilter(state)
        case 'UPDATE_PROCESSES'   : return updateProcesses(state, action.payload)
        case 'SHOW_NOTIFICATION'  : return showNotification(null, action.payload)

        // asynchronous actions
        case 'KILL_PROCESSES'     : killProcesses(state, action.payload); break
        case 'REFRESH_PROCESSES'  : refreshProcesses(state); break

        default: throw new Error(`Unhandled action type: ${action.type}`)
    }
}
