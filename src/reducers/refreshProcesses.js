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

        const payload = {
            type: SUCCESS
            , message: 'Refreshed processes.'
            , displayTime: 2000
        }
        store.dispatch('SHOW_NOTIFICATION', payload)
    })
}
