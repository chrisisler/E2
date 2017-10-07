/**
 * For the "ProcessesRoute" (so far).
 * Given an array of indexes for the `processes` array, set `isMarked` on/off
 * for the given `indexes` in `payload`.
 *
 * @TODO SEPARATE INTO TWO DIFFERENT FUNCTIONS (FOR TRUE vs. FALSE `.isMarked`)!
 * @param {Object} store - Contains: `getState` func and `dispatch` func.
 * @param {Object} payload - Data which changes state in some way.
 * @param {[Number]} payload.indexes - Indexes of `processes` to alter.
 * @param {Boolean} doMarkProcess - To set `isMarked` (of a process obj) on/off.
 * @returns {Object} - The new state.
 */
export default function markProcesses(store, payload, doMarkProcess) {
    let { processes } = store.getState()
    payload.indexes.forEach(index => {
        processes[index].isMarked = doMarkProcess
    })
    return { processes }
}
