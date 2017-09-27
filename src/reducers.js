/**
 * This is the reducers file.
 * Reducers receive (store, payload [, maybeMoreArgs]) -> newState
 */

import ActionsMenu from './ActionsMenu' // TODO For `rightClickProcessReducer`

/**
 * For the "ProcessesRoute".
 * Given an array of indexes for the `processes` array, set `isMarked` on/off
 * for the given `indexes` in `payload`.
 *
 * @param {Object} store - Contains: `getState` func and `dispatch` func.
 * @param {Object} payload - Data which changes state in some way.
 *   @param {[Number]} payload.indexes - Indexes of `processes` to alter.
 * @param {Boolean} doMarkProcess - To set `isMarked` (of a process obj) on/off.
 * @returns {Object} - The new state.
 */
export function markProcessesReducer(store, payload, doMarkProcess) {
    let { processes } = store.getState()
    payload.indexes.forEach(index => {
        processes[index].isMarked = doMarkProcess
    })
    return { processes }
}

/**
 * Handles (un)highlighting the process rows:
 * - Left-click a process to highlight only that one.
 * - Ctrl + left-click a process to highlight multiple processes.
 * - Shift + left-click to highlight all processes between.
 *
 * @param {Object} store - Contains: `getState` func and `dispatch` func.
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state.
 */
export function leftClickProcessReducer(store, payload) {
    const { event, procObj, procIndex } = payload
    const state = store.getState()
    let { markedProcessesMap } = state

    // If no modifiers, mark the clicked process (unhighlight rest).
    if (!event.altKey && !event.shiftKey) {
        const indexes = [...markedProcessesMap.keys()]
        if (indexes.length > 0) {
            store.dispatch('UNMARK_PROCESSES', { indexes })
        }
        store.dispatch('MARK_PROCESSES', { indexes: [ procIndex ] })
        markedProcessesMap = new Map().set(procIndex, procObj)
    }
    // If ALT + left-click, add the clicked process to the markedProcessesMap.
    else if (event.altKey) {
        store.dispatch('MARK_PROCESSES', { indexes: [ procIndex ] })
        markedProcessesMap.set(procIndex, procObj)
    }
    // If SHIFT + left-click, todo
    else if (event.shiftKey) {
        const last = x => x[x.length - 1]
        const range = (start, end) => [...Array(end - start)].map((_, idx) => idx + start)
        const lastIndex = last([...markedProcessesMap.keys()])

        // Mark every process between `lastIndex` and `procIndex`.
        const indexes = (lastIndex < procIndex)
            ? range(lastIndex, procIndex + 1) // need `+1` because procIndex is not yet marked.
            : range(procIndex, lastIndex)
        store.dispatch('MARK_PROCESSES', { indexes })

        indexes.forEach(index => {
            markedProcessesMap.set(index, store.processes[index])
        })
    }
    return { markedProcessesMap }
}



/**
 * Guaranteed non-empty input array.
 * @see rightClickProcessReducer
 * @param {[Object]} procs - An array of objects, the processes.
 * @returns {[Object]} actions
 */
const getActions = procs => {
    let actions = []

    // Dummy func for now.
    const killProcess = pid => {}

    actions.push({
        text: 'Kill highlighted processes'
        , effect: () => { procs.forEach(p => killProcess(p.pid)) }
    })
    return actions
}

/** @type {([Object], Number, Number) -> DOMNode} */
const renderActionsMenu = (actions, x, y) => {
    let ref
    const actionsMenuComponent = <ActionsMenu actions={actions} x={x} y={y} ref={node => { ref = node }}/>;

    // TODO fix double rendering issue (occurs when right-click on two different rows)
    render(actionsMenuComponent, document.getElementById('actions-menu-wrap'))
    return ref
}

/** @type {(Object, Object, Object) -> Object} */
export function rightClickProcessReducer(store, payload) {
    const { procObj, event, procIndex } = payload
    const state = store.getState()
    // TODO fix bugs

    if (state.markedProcessesMap.size > 0 && !procObj.isMarked) {
        store.dispatch('UNMARK_PROCESSES', { indexes: [...state.markedProcessesMap.keys()] })
    }
    store.dispatch('MARK_PROCESSES', { indexes: [ procIndex ] })

    const markedProcessesMap = new Map(state.markedProcessesMap).set(procIndex, procObj)
    const procs = [...markedProcessesMap.values()]

    const actionsMenuNode = renderActionsMenu(getActions(procs), event.pageX, event.pageY)
    return { markedProcessesMap }
}
