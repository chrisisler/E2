/**
 * @param {Object} store
 * @param {Object} payload
 * @param {[Object]} payload.processes - The new processes array.
 * @returns {Object} - Properties of new state.
 */
export default function updateProcesses(store, payload) {
    return { processes: payload.processes }
}
