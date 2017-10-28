import { killProcess, getMemoryPercent } from '../process-utils'
import { dispatch } from '../store'
import { notificationTypes } from '../Notification'
const { ERROR, SUCCESS } = notificationTypes

/**
 * @param {Object} state
 * @param {Object} payload - Data which changes state in some way.
 * @param {Map<Number, Object>} payload.mapOfMarkedProcessesToKill - <index, proc>
 * @returns {Promise} - A promise containing properties of the new state.
 */
export default function killProcesses(state, payload) {
    // array of [Number, Object] pairs
    const indexObjectPairs = [...payload.mapOfMarkedProcessesToKill.entries()]
    let { processes } = state

    // Couple each promise with the object killing promise and its according index
    // after all those promises finish (in parallel), do work on the `settledPromises`
    allSettled(indexObjectPairs.map(([ procIndex, procObj ]) =>
        killProcess(procObj.pid)
            .then(didKill => ({ didKill, procObj, procIndex }))
    )).then(splitByState).then(({ resolved, rejected }) => {
        let message // placeholder for dispatching notifications

        if (resolved.length !== 0) {
            let totalMemoryFreed = resolved.reduce((accum, resolvedPromise) => {
                const { memory, name } = resolvedPromise.value.procObj

                processes.splice(resolvedPromise.value.procIndex, 1) // mutate in place!

                message = `Killed "${name}", freeing ${memory} [${getMemoryPercent(memory)}] memory!` 
                dispatch('SHOW_NOTIFICATION', { message, type: SUCCESS })

                return accum += Number(memory)
            }, 0)

            dispatch('UPDATE_PROCESSES', { processes })

            if (resolved.length > 1) {
                message = `Killed ${resolved.length} processes, freeing ${totalMemoryFreed} memory!` 
                dispatch('SHOW_NOTIFICATION', { message, type: SUCCESS })
            }
        }

        if (rejected.length !== 0) {
            // get list of names of process objects that couldn't be killed
            const resolvedNames = resolved.map(r => r.value.procObj.name)
            const rejectedNames = indexObjectPairs.map(([ , p]) => p.name).filter(n => !resolvedNames.includes(n))

            rejectedNames.forEach(name => {
                message = `Could not kill "${name}"` 
                dispatch('SHOW_NOTIFICATION', { message, type: ERROR })
            })

            if (rejected.length > 1) {
                message = `Could not kill ${rejected.length} processes (out of ${indexObjectPairs.length} total).`
                dispatch('SHOW_NOTIFICATION', { message, type: ERROR })
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
 * @see allSettled
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
 * Wait for all promises to become fulfilled or rejected, in parallel.
 * Per promise, add a "fulfilled" or "rejected" `state` prop.
 *
 * @see "https://github.com/robhicks/es2015-Promise.allSettled/blob/master/index.js"
 * @see "https://github.com/kriskowal/q/blob/master/q.js#L1704-L1721"
 * @see splitByState
 *
 * @param {[Promise]} promises - An array of promises.
 * @returns {Promise}
 */
const allSettled = promises =>
    Promise.all(promises.map(promise => promise
        .then(value => ({ state: 'fulfilled', value }))
        .catch(reason => ({ state: 'rejected', reason }))
    ))
