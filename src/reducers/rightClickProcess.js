import { h, render } from 'preact'
import { route } from 'preact-router'
import ActionsMenu from '../ActionsMenu'
import closeActionsMenu from './closeActionsMenu'
import markProcesses from './markProcesses'
import renameProcess from './renameProcess'
import killProcesses from './killProcesses'

/** @type {Map -> [Any]} */
const keysFrom = map => [...map.keys()]

/** @type {Map -> [Any]} */
const valuesFrom = map => [...map.values()]

/** @type {(Object, Object) -> Object} */
const merge = (o1, o2) => ({ ...o1, ...o2 })

/**
 * @param {Object} store
 * @param {Object} payload
 * @returns {Object} newState
 */
export default function rightClickProcess(store, payload) {
    const prevState = store.getState()
    const { procObj, procIndex } = payload

    let newState = {...prevState}
    let newStore = {...store} // must be manually updated as `newState` is updated, before being passed to other reducers

    // if actions menu already exists, close it
    if (prevState.actionsMenuNode != null) {
        newState = merge(newState, closeActionsMenu(store))
        newStore = merge(newStore, { getState: () => newState })
    }

    // clear previously marked processes
    if (prevState.markedProcessesMap.size > 0 && !procObj.isMarked) {
        const indexes = keysFrom(prevState.markedProcessesMap)
        newState = merge(newState, markProcesses(newStore, { indexes }, false))

        newState.markedProcessesMap.clear() // mutable change
        newStore = merge(newStore, { getState: () => newState })
    }

    // marked clicked processes
    newState = merge(newState, markProcesses(newStore, { indexes: [procIndex] }, true))
    newState.markedProcessesMap.set(procIndex, procObj) // mutable change
    newStore = merge(newStore, { getState: () => newState })

    const procsToKill = valuesFrom(prevState.markedProcessesMap)

    const { pageX: x, pageY: y } = payload.event
    const actions = getActions(newStore, prevState.markedProcessesMap)
    const actionsMenu = <ActionsMenu closeActionsMenu={() => { store.dispatch('CLOSE_ACTIONS_MENU')} } actions={actions} x={x} y={y} />

    newState.actionsMenuNode = render(actionsMenu, document.body) // `render` returns the ref

    return newState
}

/**
 * helper func
 * create options for dropdown menu
 *
 * @param {Object} store
 * @param {Map<Number, Object>} mapOfMarkedProcessesToKill
 *   - Keys are the indexes of the objects (that need killing), Values are the (process) objects.
 * @returns {[Object]} actions for dropdown menu
 */
function getActions(store, mapOfMarkedProcessesToKill) {
    const state = store.getState()
    const multipleProcessesAreMarked = state.markedProcessesMap.size > 1

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

    if (!multipleProcessesAreMarked) {
        const procIndex = keysFrom(state.markedProcessesMap)[0]
        const currentName = valuesFrom(state.markedProcessesMap)[0].name
        actions.push(getRenameAction(store, currentName, procIndex))
    }

    return actions
}

/**
 * @param {Object} store
 * @param {String} currentName
 * @param {Number} procIndex
 * @returns {Object} - A clickable renaming action for the dropdown actions menu.
 */
function getRenameAction(store, currentName, procIndex) {
    let inputNodeRef
    const RenameInput = (<input
        placeholder={currentName}
        ref={node => { inputNodeRef = node }}
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
        , effect: () => { inputNodeRef.focus() }
        , doPersist: true // True = clicking here does NOT close actions menu.
    }
}
