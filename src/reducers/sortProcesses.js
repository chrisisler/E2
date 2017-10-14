/** @type {(String) -> String} */
const toLower = s => String.prototype.toLowerCase.call(s)

/** @type {[Any] -> [Any]} */
const copyArray = array => Array.prototype.slice.call(array, 0)

/**
 * @param {Object} store
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state.
 */
export default function sortProcesses(store, payload) {
    const sortKey = payload.key
    let { doReverseSort, processes, previousSortKey } = store.getState()
    processes = copyArray(processes)

    if (previousSortKey === sortKey) {
        return { processes: processes.reverse() }
    }

    processes = processes.sort((proc1, proc2) => {
        if (sortKey === 'name') {
            const a = toLower(proc1.name)
            const b = toLower(proc2.name)
            // https://github.com/ramda/ramda/blob/master/source/sortBy.js
            return a < b
                ? true
                : a > b
                    ? true
                    : false
        }
        return Number(proc2[sortKey]) - Number(proc2[sortKey])
    })

    doReverseSort = !doReverseSort
    if (doReverseSort) {
        processes = processes.reverse()
    }

    return { processes, doReverseSort, previousSortKey }
}
