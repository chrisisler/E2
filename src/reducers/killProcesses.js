import { killProcess, asPercentage } from '../process-utils'
import { notificationTypes } from '../Notification'
const { ERROR, SUCCESS } = notificationTypes

/**
 * @param {Object} store
 * @param {Object} payload - Data which changes state in some way.
 * @param {Map<Number, Object>} payload.mapOfMarkedProcessesToKill - <index, proc>
 * @returns {Promise} - A promise containing properties of the new state.
 */
export default function killProcesses(store, payload) {
    // An array of [Number, Object] paris.
    const indexObjectPairs = [...payload.mapOfMarkedProcessesToKill.entries()]
    let { processes } = store.getState()

    // Couple each promise with the object kill and its index
    const promises = indexObjectPairs.map(([ procIndex, procObj ]) => {
        return killProcess(procObj.pid)
            .then(didKill => ({ didKill, procObj, procIndex }))
    })

    allSettled(promises).then(settledPromises => {
        const { resolved, rejected } = splitByState(settledPromises)
        let message

        if (resolved.length !== 0) {
            let freedMemory = 0

            resolved.forEach(({ value }) => {
                const { memory, name } = value.procObj

                freedMemory += Number(memory)
                processes.splice(value.procIndex, 1)

                message = `Killed ${name} (freeing ${memory} [${asPercentage(memory)}])` 
                store.dispatch('SHOW_NOTIFICATION', { message, type: SUCCESS })
            })

            store.dispatch('UPDATE_PROCESSES', { processes })

            if (resolved.length > 1) {
                message = `Killed ${resolved.length} processes. Freed up ${freedMemory} memory!` 
                store.dispatch('SHOW_NOTIFICATION', { message, type: SUCCESS })
            }
        }
        if (rejected.length !== 0) {
            rejected.forEach(({ value }) => {
                message = `Could not kill ${value.procObj.name}` 
                store.dispatch('SHOW_NOTIFICATION', { message, type: ERROR })
            })

            if (rejected.length > 1) {
                message = `Could not kill ${rejected.length} processes (out of ${settledPromises.length} total).`
                store.dispatch('SHOW_NOTIFICATION', { message, type: ERROR })
            }
        }
    })
}

/**
 * Splits an array of promises into resolved and rejected groups.
 * Not natively supported, needs the kriskowal/q promises library
 * or a sufficient `allSettled` function where promise objects
 * have an additional `state` property (or similar).
 * 
 * @param {[Promise]} promises
 * @returns {Object} - { resolved: [Promise], rejected: [Promise] }
 */
function splitByState(promises) {
    let resolved = []
    let rejected = []

    promises.forEach(promise => {
        if (promise.state === 'fulfilled') resolved.push(promise)
        else if (promise.state === 'rejected') rejected.push(promise)
    })

    return { resolved, rejected }
}

/**
 * Waits for all promises to be settled (non-pending); either fulfilled or rejected.
 * This is different from `Promise.all` since `all` behaves error-first and 
 * would stop waiting at the first rejected promise. The promise returned by
 * `allSettled` will never be rejected.
 *
 * For every promise:
 *   1) Wait for all promises to become fulfilled or rejected, in parallel.
 *   2) Wrap a "fulfilled" or "rejected" `state` property around the value/error.
 *
 * @see "https://github.com/robhicks/es2015-Promise.allSettled/blob/master/index.js"
 * @see "https://github.com/kriskowal/q/blob/master/q.js#L1704-L1721"
 *
 * @param {[Promise]} promises - An array of promises.
 * @returns {Promise}
 */
const allSettled = promises =>
    Promise.all(promises.map(promise => promise
        .then(value => ({ state: 'fulfilled', value }))
        .catch(reason => ({ state: 'rejected', reason }))
    ))

