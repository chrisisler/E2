/**
 * This function adds a non-null `visibilityFilter` attribute to the app state.
 * Inside `payload` is a `query` String or Number which the user types into to
 * search for a specific property either by `.name` or `.pid`. If the `query`
 * value can be transformed into a Number type, then they're searching for a
 * process ID value. When the user hits the Enter key, this function is ran.
 *
 * A list of the previous "unfiltered" processes gets persisted in state.
 * This is done so that index-based logic (for manipulating `state.processes`)
 * does not have to be aware of that fact that the user issued a search.
 * It's hard to describe why this is needed (or even exactly how it works).
 *
 * @param {Object} store
 * @param {Object} payload
 * @param {String|Number} payload.query
 * @returns {Object} - Properties of the app state to update.
 */
export default function searchProcesses(store, payload) {
    const unfilteredProcesses = store.getState().processes
    const { query } = payload

    if (query.length < 1) return

    const queryIsString = isNaN(query)

    /** @type {Function (process: Object) -> Boolean} */
    const visibilityFilter = (queryIsString === true)
        ? (proc) => proc.name.toLowerCase().includes(query.toLowerCase()) // searching for process name
        : (proc) => String(proc.pid).includes(query) // searching for process ID

    /** @see clearFilter.js */
    return {
        visibilityFilter
        , unfilteredProcesses
        , processes: unfilteredProcesses.filter(visibilityFilter)
    }
}
