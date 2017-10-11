import { h, render } from 'preact'
import { Router } from 'preact-router'
import { RouteWithHeader } from './Header'
import ProcessesRoute from './routes/ProcessesRoute'
import SettingsRoute from './routes/SettingsRoute'
import DetailsRoute from './routes/DetailsRoute'
import { getProcessesSync } from './process-utils'
import DispatchComponent from './DispatchComponent'
import reducers from './reducers/index'

const getInitialState = () => ({
    /** @type {[Object]} */
    processes: getProcessesSync()

    /** @type {Map} */
    , markedProcessesMap: new Map()

    /** @type {Null} or {DOMNode} */
    , actionsMenuNode: null

    /** @type {Boolean} */
    , doReverseSort: false

    /** @type {Null} or {String} */
    , previousSortKey: null

    /** @type {Null} or {(procObj: Object) -> Boolean} */
    , visibilityFilter: null
})

const App = DispatchComponent({
    render: store => {
        return (
            <Router>
                <RouteWithHeader path='/' default RouteComponent={ProcessesRoute} store={store} />
                <RouteWithHeader path='/details' RouteComponent={DetailsRoute} store={store} />
                <RouteWithHeader path='/settings' RouteComponent={SettingsRoute} />
            </Router>
        )
    },
    reducer: (action, store) => {
        /* eslint-disable indent */
        switch (action.type) {
            case 'CONSTRUCTOR': return getInitialState()

            // synchronous actions
            case 'MARK_PROCESSES'     : return reducers.markProcesses(store, action.payload, true)
            case 'UNMARK_PROCESSES'   : return reducers.markProcesses(store, action.payload, false)
            case 'LEFT_CLICK_PROCESS' : return reducers.leftClickProcess(store, action.payload)
            case 'RIGHT_CLICK_PROCESS': return reducers.rightClickProcess(store, action.payload)
            case 'RENAME_PROCESS'     : return reducers.renameProcess(store, action.payload)
            case 'CLOSE_ACTIONS_MENU' : return reducers.closeActionsMenu(store)
            case 'SORT_PROCESSES'     : return reducers.sortProcesses(store, action.payload)
            case 'SEARCH_PROCESSES'   : return reducers.searchProcesses(store, action.payload)
            case 'CLEAR_FILTER'       : return reducers.clearFilter()
            case 'UPDATE_PROCESSES'   : return reducers.updateProcesses(store, action.payload)
            case 'SHOW_NOTIFICATION'  : return reducers.showNotification(null, action.payload)

            // asynchronous actions
            case 'KILL_PROCESSES':
                reducers.killProcesses(store, action.payload)
                break
            case 'REFRESH_PROCESSES':
                reducers.refreshProcesses(store)
                break
            default:
                throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
})

render(<App />, document.body)
