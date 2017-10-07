import { h, render } from 'preact'
import { route } from 'preact-router'
import ActionsMenu from '../ActionsMenu'
import closeActionsMenu from './closeActionsMenu'
import markProcesses from './markProcesses'

/**
 * Helper func for `rightClickProcess`.
 * @see rightClickProcess
 * @param {Map} markedProcessesMap - Part of top-level app state.
 * @param {Function} dispatch - From the top-level (state-manager) `store`.
 * @returns {[Object]} actions
 */
const getActions = (markedProcessesMap, dispatch) => {
    const procs = [...markedProcessesMap.values()]
    let actions = []

    actions.push({
        text: 'View details'
        , effect: () => { route('/details', true) }
    })

    actions.push({
        text: 'Kill highlighted processes'
        // , effect: () => { dispatch('KILL_PROCESSES', procs) } // TODO
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
            , doPersist: true // True = clicking here does NOT close actions menu.
        })
    }

    return actions
}

/** @type {(Object, Object) -> newState: Object} */
export default function rightClickProcess(store, payload) {
    const { procObj, event, procIndex } = payload
    const state = store.getState()
    const { markedProcessesMap } = state
    let { processes } = state // mutable

    if (state.actionsMenuNode) {
        // store.dispatch('CLOSE_ACTIONS_MENU')
        // Close the actions menu.
        // We throw away the returned ref because we update state with a new ref when we return from this function.
        closeActionsMenu(store)
    }

    if (markedProcessesMap.size > 0 && !procObj.isMarked) {
        // store.dispatch('UNMARK_PROCESSES', { indexes: [...markedProcessesMap.keys()] })
        const indexes = [...markedProcessesMap.keys()]
        processes = markProcesses(store, { indexes }, false).processes // unmark
        store = { ...store, processes }
    }
    // store.dispatch('MARK_PROCESSES', { indexes: [ procIndex ] })
    processes = markProcesses(store, { indexes: [procIndex] }, true) // mark

    const newMarkedProcessesMap = new Map(markedProcessesMap).set(procIndex, procObj)
    const actions = getActions(newMarkedProcessesMap, store.dispatch)
    const actionsMenu = <ActionsMenu
        closeActionsMenu={() => { closeActionsMenu(store) }}
        actions={actions}
        x={event.pageX}
        y={event.pageY}
    />
    const actionsMenuNode = render(actionsMenu, document.body) // The ref

    return {
        markedProcessesMap: newMarkedProcessesMap
        , actionsMenuNode
    }
}

