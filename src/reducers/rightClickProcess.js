import { h, render } from 'preact'
import { route } from 'preact-router'
import ActionsMenu from '../ActionsMenu'
import closeActionsMenu from './closeActionsMenu'
import markProcesses from './markProcesses'
import unmarkProcesses from './unmarkProcesses'
import { keysFrom } from '../shared'
import store from '../store'

export default function rightClickProcess(state, payload) {
    const { procObj, procIndex: procIndexToMark } = payload
    const prevState = { ...state }

    // if actions menu already exists, close it
    if (prevState.actionsMenuNode != null) {
        state = Object.assign(state, closeActionsMenu(state))

        // might change if the closeActionsMenu reducer returns attributes other than `actionsMenuNode`
        closeActionsMenu(state)
    }

    // un-mark the previously marked processes
    if (prevState.markedProcessesMap.size > 0 && !procObj.isMarked) {
        const indexes = keysFrom(prevState.markedProcessesMap)
        state = Object.assign(state, unmarkProcesses(state, { indexes }))
    }

    // mark the clicked processes
    state = Object.assign(state, markProcesses(state, { indexes: [procIndexToMark] }))

    // prepare props for the actions menu
    const { pageX: x, pageY: y } = payload.event
    const actions = _getActions(state, prevState.markedProcessesMap)
    const dispatchCloseActionsMenu = () => { store.dispatch('CLOSE_ACTIONS_MENU') }
    const actionsMenu = (<ActionsMenu {...{actions, x, y, dispatchCloseActionsMenu}} />)

    // render the actions menu and assign the rendered dom node ref to state
    const actionsMenuNode = render(actionsMenu, document.body)
    return Object.assign(state, { actionsMenuNode })
}

/**
 * Create options for dropdown menu.
 *
 * @private
 * @param {Object} state
 * @param {Map<Number, Object>} mapOfMarkedProcessesToKill
 *   - Keys are the indexes of the objects (that need killing), Values are the (process) objects.
 * @returns {[Object]} actions for dropdown menu
 */
function _getActions(state, mapOfMarkedProcessesToKill) {
    const { markedProcessesMap, renamesMap } = state
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
        actions.push(_getRenameAction(proc.name, procIndex))

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
 * @param {String} currentName
 * @param {Number} procIndex
 * @returns {Object} - A clickable renaming action for the dropdown actions menu.
 */
function _getRenameAction(currentName, procIndex) {
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
