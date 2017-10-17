import { h, render } from 'preact'
import { route } from 'preact-router'
import ActionsMenu from '../ActionsMenu'
import closeActionsMenu from './closeActionsMenu'
import markProcesses from './markProcesses'
import unmarkProcesses from './unmarkProcesses'
import { updateStore, keysFrom } from '../shared'

export default function rightClickProcess(store, payload) {
    const { procObj, procIndex: procIndexToMark } = payload
    const prevState = store.getState()

    // if actions menu already exists, close it
    if (prevState.actionsMenuNode != null) {
        // invoke the reducer, place the returned state in the new store
        // store = updateStore(store, closeActionsMenu(store))

        // might change if the closeActionsMenu reducer returns attributes other than `actionsMenuNode`
        closeActionsMenu(store)
    }

    // un-mark the previously marked processes
    if (prevState.markedProcessesMap.size > 0 && !procObj.isMarked) {
        const indexes = keysFrom(prevState.markedProcessesMap)
        store = updateStore(store, unmarkProcesses(store, { indexes }))
    }

    // mark the clicked processes
    const updatedState = markProcesses(store, { indexes: [procIndexToMark] })
    store = updateStore(store, updatedState)

    // prepare props for the actions menu
    const { pageX: x, pageY: y } = payload.event
    const actions = _getActions(store, prevState.markedProcessesMap)
    const dispatchCloseActionsMenu = () => { store.dispatch('CLOSE_ACTIONS_MENU') }
    const actionsMenu = (<ActionsMenu {...{actions, x, y, dispatchCloseActionsMenu}} />)

    // render the actions menu
    const actionsMenuNode = render(actionsMenu, document.body)
    const state = { ...store.getState(), actionsMenuNode }
    return state
}

/**
 * Create options for dropdown menu.
 *
 * @private
 * @param {Object} store
 * @param {Map<Number, Object>} mapOfMarkedProcessesToKill
 *   - Keys are the indexes of the objects (that need killing), Values are the (process) objects.
 * @returns {[Object]} actions for dropdown menu
 */
function _getActions(store, mapOfMarkedProcessesToKill) {
    const { markedProcessesMap, renamesMap } = store.getState()
    const multipleProcessesAreMarked = markedProcessesMap.size > 1

    const cancelMenu =  { text: 'Cancel' }
    const navigateToDetails = {
        text: 'View details'
        , effect: () => { route('/details', true) }
    }
    const killMarkedProcesses =  {
        text: `Kill highlighted process${multipleProcessesAreMarked ? 'es' : ''}`
        , effect: () => {
            store.dispatch('KILL_PROCESSES', { mapOfMarkedProcessesToKill })
        }
    }
    let actions = [ cancelMenu, navigateToDetails, killMarkedProcesses ]

    // if only one proc is marked, add the ability to rename it
    if (!multipleProcessesAreMarked) {
        // retrieve the first <Number, Object> pair out of the map (ES6+ ftw!)
        const [ [ procIndex, proc ] ] = markedProcessesMap.entries()
        actions.push(_getRenameAction(store, proc.name, procIndex))

        // if proc was renamed, add ability to revert back to original name
        const nameHistory = renamesMap.get(proc.pid)
        if (nameHistory !== void 0) {
            actions.push({ text: 'Revert to original name', effect: () => {
                store.dispatch('RENAME_PROCESS', { procIndex, newName: nameHistory.originalName })
            }})
        }
    }

    return actions
}

/**
 * @private
 * @param {Object} store
 * @param {String} currentName
 * @param {Number} procIndex
 * @returns {Object} - A clickable renaming action for the dropdown actions menu.
 */
function _getRenameAction(store, currentName, procIndex) {
    let inputDOMNode
    const RenameInput = (<input
        placeholder={currentName}
        ref={node => { inputDOMNode = node }}
        onKeyDown={event => {
            if (event.key === 'Enter') {
                const newName = event.target.value
                store.dispatch('RENAME_PROCESS', { newName, procIndex })
            }
        }}
    />)

    return {
        text: 'Rename process: '
        , getChildComponent: () => RenameInput
        , effect: () => { inputDOMNode.focus() }
        , doPersist: true // True = clicking here does NOT close actions menu.
    }
}
