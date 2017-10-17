/**
 * @param {Map<Any, Any>} map
 * @returns {[Any]} - An array containing the keys out of `map`.
 */
export const keysFrom = map => [...map.keys()]

/**
 * Returns a new store, updating only the `getState` method.
 * Arguably unnecessarily hides complexity of updating state when calling other
 * reducers (it's a readibility tradeoff).
 *
 * @param {Object} store
 * @param {Object} newState - Properties of state to update.
 * @returns {Object} - The new store.
 */
export const updateStore = (store, newState) =>
    ({ ...store, getState: () => ({ ...store.getState(), ...newState }) })
