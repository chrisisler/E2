/**
 * @param {(action: Object, store: Object) -> state: Object} reducer
 * @param {Object} state
 * @returns {Object} store
 */
export default function createStore(reducer, state={}) {
    let listeners = []
    const store = { dispatch, getState: () => state, onDispatch }

    /**
     * All changes to state occur by dispatches.
     *
     * @param {String} type - Describes what the action is/does.
     * @param {Object} payload - Data relevant to the action.
     */
    function dispatch(type, payload) {
        const action = { type, payload }
        const newState = reducer(action, store)
        if (newState) state = { ...state, ...newState }
        listeners.forEach(listener => { listener(state) })
    }

    /**
     * This is a subscribe/addEventListener-like function for
     * attaching functionality to every `dispatch` call.
     *
     * @param {(state: Object) -> Void} fn - Listens to `dispatch` calls.
     * @returns {() -> Void} removeListener
     */
    function onDispatch(fn) {
        listeners.push(fn)

        // Return a fn, when called, removes the given listener fn
        return function removeListener() {
            listeners.splice(listeners.indexOf(fn), 1)
        }
    }

    return store
}
