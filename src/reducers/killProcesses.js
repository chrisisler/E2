

/**
 * TODO For each process in payload, run a batch of concurrent promises
 *     attempting to kill each process by its `pid` property.
 *
 * @TODO This should be a promise.
 * @param {Object} store - Contains: `getState` func and `dispatch` func.
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state.
 */
export default function killProcesses(store, payload) {
    let { processes } = store.getState()
    // const pidsToKill = payload.processesToKill.map(proc => proc.pid)
    // console.error('killProcesses: NOT IMPLEMENTED')

    return { processes }
}
