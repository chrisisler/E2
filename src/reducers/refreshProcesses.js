import { getProcessesAsync } from '../process-utils'
import { notificationTypes } from '../Notification'
const { SUCCESS } = notificationTypes

/**
 * Asynchronously updates `state.processes`
 * 
 * @param {Object} store
 */
export default function refreshProcesses(store) {
    getProcessesAsync().then(processes => {
        store.dispatch('UPDATE_PROCESSES', { processes })
        store.dispatch('CLEAR_FILTER')
        store.dispatch('SHOW_NOTIFICATION', { type: SUCCESS, message: 'Refreshed.', timer: 2000 })
    })
}
