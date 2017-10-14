/**
 * This function adds a non-null `visibilityFilter` attribute to the app state.
 * Inside `payload` is a `query` String or Number which the user types into to
 * search for a specific property either by `.name` or `.pid`. If the `query`
 * value can be transformed into a Number type, then they're searching for a
 * process ID value. When the user hits the Enter key, this function is ran.
 *
 * @param {Object} store
 * @param {Object} payload
 * @param {String|Number} payload.query
 * @returns {Object} - Properties of the app state to update.
 */
export default function searchProcesses(store, payload) {
    const { query } = payload

    if (query.length < 1) return

    const queryIsString = isNaN(query)

    /** @function visibilityFilter @type {(process: Object) -> Boolean} */
    const visibilityFilter = (queryIsString === true)
        ? (process) => process.name.toLowerCase().includes(query.toLowerCase()) // searching for process name
        : (process) => String(process.pid).includes(query) // searching for process ID

    return { visibilityFilter }
}
