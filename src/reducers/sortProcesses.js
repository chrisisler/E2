/** @type {(String) -> String} */
const toLower = s => ''.toLowerCase.call(s)

/**
 * @param {Object} store
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state.
 */
export default function sortProcesses(store, payload) {
    const sortKey = payload.key
    let { doReverseSort, processes, previousSortKey } = store.getState()

    if (previousSortKey === sortKey) {
        return { processes: processes.reverse() }
    }

    processes = processes.sort((p1, p2) => {
        // TODO sorting by name does not work
        if (sortKey === 'name') {
            const a = toLower(p1.name)
            const b = toLower(p2.name)
            return a < b ? -1 : a > b ? 1 : 0
            // return toLower(p1.name) < toLower(p2.name)
        }
        return Number(p1[sortKey]) - Number(p2[sortKey])
    })

    doReverseSort = !doReverseSort
    if (doReverseSort) {
        processes = processes.reverse()
    }

    return { processes, doReverseSort, previousSortKey }
}
