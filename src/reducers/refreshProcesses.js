import { getProcessesAsync } from '../process-utils'
import store from '../store'
import { notificationTypes } from '../Notification'
const { SUCCESS } = notificationTypes

/**
 * Asynchronously updates state.
 * @see ./updateProcesses.js
 * @see ./showNotification.js
 */
export default function refreshProcesses() {
    getProcessesAsync().then(processes => {
        store.dispatch('UPDATE_PROCESSES', { processes })
        store.dispatch('SHOW_NOTIFICATION', { type: SUCCESS, message: 'Refreshed.', timer: 2000 })
    })
}
