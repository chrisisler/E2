/** @type {(String) -> String} */
const toLower = s => ''.toLowerCase.call(s)

/**
 * @todo THIS IS NOT WORKING
 * @param {Object} store - Contains: `getState` func and `dispatch` func.
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state.
 */
export default function sortProcesses(store, payload) {
    const sortKey = payload.key
    let { doReverseSort, processes, previousSortKey } = store.getState()

    if (previousSortKey === sortKey) {
        return { processes: processes.reverse() }
    }

    // TODO Not working!
    processes = processes.sort((p1, p2) => {
        if (sortKey === 'name') {
            return toLower(p1.name) < toLower(p2.name)
        }
        return Number(p1[sortKey]) < Number(p2[sortKey])
    })

    doReverseSort = !doReverseSort
    if (doReverseSort) {
        processes = processes.reverse()
    }

    return { processes, doReverseSort, previousSortKey }
}
