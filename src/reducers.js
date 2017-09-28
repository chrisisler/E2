/**
 * This is the reducers file.
 * Reducers receive (store, payload [, maybeMoreArgs]) -> newState
 */

import { h, render } from 'preact'
import { killProcess } from './killProcess'
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
 * Helper func for `rightClickProcessReducer`.
 * @see rightClickProcessReducer
 * @param {Map} markedProcessesMap
 * @param {Function} dispatch - From the top-level (state-manager) `store`.
 * @returns {[Object]} actions
 */
const getActions = (markedProcessesMap, dispatch) => {
    const procs = [...markedProcessesMap.values()]
    let actions = []

    actions.push({
        text: 'Kill highlighted processes'
        // TODO also need to update state, do the below instead.
        // , effect: () => { dispatch('KILL_PROCESSES', procs) }
        , effect: () => { procs.forEach(p => killProcess(p.pid)) }
    })

    if (procs.length === 1) {
        // TODO async import here on a custom <Input /> component?
        const procIndex = [...markedProcessesMap.keys()][0]
        let inputNodeRef
        const RenameInput = <input
            placeholder={procs[0].name}
            ref={node => { inputNodeRef = node }}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    const newName = event.target.value
                    dispatch('RENAME_PROCESS', { newName, procIndex })
                }
            }}
        />
        actions.push({
            text: 'Rename process: '
            , getChildComponent: () => RenameInput
            , effect: () => { inputNodeRef.focus() }
            , persistOnClick: true
        })
    }
    return actions
}

/**
 * @param {Object} store - Contains: `getState` func and `dispatch` func.
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state. Updates the `actionsMenuNode` property.
 */
export function closeActionsMenuReducer(store) {
    // Should the `remove` call go here?
    const node = store.getState().actionsMenuNode
    document.getElementById(node.id).remove()

    return { actionsMenuNode: null }
}

/**
 * @param {Object} store - Contains: `getState` func and `dispatch` func.
 * @param {Object} payload - Data which changes state in some way.
 * @returns {Object} - The new app state. Updates the `processes` property.
 */
export function renameProcessReducer(store, payload) {
    const { newName, procIndex } = payload
    let { processes } = store.getState()
    processes[procIndex].name = newName

    // Are we supposed to grab the object returned by this dispatch and attach it to
    // our returned object? If we choose to do that, we will have to beconsistent and
    // do that for _all_ dispatch calls inside a reducer. Could be bad for perf?
    store.dispatch('CLOSE_ACTIONS_MENU', 'fuck')
    return { processes }
}

/**
 * Helper func. NOT a reducer.
 * @see rightClickProcessReducer
 * @param {[Object]} actions
 * @param {[Object]} actions
 * @param {[Object]} actions
 * @returns {DOMNode}
 */

/** @type {(Object, Object) -> newState: Object} */
export function rightClickProcessReducer(store, payload) {
    const { procObj, event, procIndex } = payload
    const state = store.getState()

    // TODO Destory the previous ActionsMenu component node before rendering the new one.
    // In actuality, this conditional just checks to see if the actions menu was _previously_ rendered.
    // Maybe a reducer case is needed for setting state for this property back to `null`.
    console.log('right clicked')
    console.log('state.actionsMenuNode is:', state.actionsMenuNode)
    if (state.actionsMenuNode) {
        console.log('inside conditional')
        // console.log('state.actionsMenuNode is:', state.actionsMenuNode)
        store.dispatch('CLOSE_ACTIONS_MENU')()
    }

    if (state.markedProcessesMap.size > 0 && !procObj.isMarked) {
        store.dispatch('UNMARK_PROCESSES', { indexes: [...state.markedProcessesMap.keys()] })
    }
    store.dispatch('MARK_PROCESSES', { indexes: [ procIndex ] })

    const markedProcessesMap = new Map(state.markedProcessesMap).set(procIndex, procObj)
    const actions = getActions(markedProcessesMap, store.dispatch)

    const actionsMenu = <ActionsMenu store={store} actions={actions} x={event.pageX} y={event.pageY}/>

    // TODO fix double rendering issue (occurs when right-click on two different rows)
    const actionsMenuNode = render(actionsMenu, document.getElementById('actions-menu-wrap'))

    return { markedProcessesMap, actionsMenuNode }
}