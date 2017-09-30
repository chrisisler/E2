import { h, render } from 'preact'
import { Router } from 'preact-router'
import { RouteWithHeader } from './Header'
import ProcessesRoute from './routes/ProcessesRoute'
import SettingsRoute from './routes/SettingsRoute'
import DetailsRoute from './routes/DetailsRoute'
import { getProcessesSync } from './process-utils'
import DispatchComponent from './DispatchComponent'
import * as reducers from './reducers'

const getInitialState = () => ({
    processes: getProcessesSync()
    , markedProcessesMap: new Map()
    , actionsMenuNode: null
    , doReverseSort: false
    , previousSortKey: null
})

const App = DispatchComponent({
    render: store => (
        <Router>
            <RouteWithHeader path='/processes' default RouteComponent={ProcessesRoute} store={store} />
            <RouteWithHeader path='/details' RouteComponent={DetailsRoute} store={store} />
            <RouteWithHeader path='/settings' RouteComponent={SettingsRoute} />
        </Router>
    ),
    reducer: (action, store) => {
        /* eslint-disable indent */
        switch (action.type) {
            case 'CONSTRUCTOR'        : return getInitialState()
            case 'MARK_PROCESSES'     : return reducers.markProcessesReducer(store, action.payload, true)
            case 'UNMARK_PROCESSES'   : return reducers.markProcessesReducer(store, action.payload, false)
            case 'LEFT_CLICK_PROCESS' : return reducers.leftClickProcessReducer(store, action.payload)
            case 'RIGHT_CLICK_PROCESS': return reducers.rightClickProcessReducer(store, action.payload)
            case 'RENAME_PROCESS'     : return reducers.renameProcessReducer(store, action.payload)
            case 'CLOSE_ACTIONS_MENU' : return reducers.closeActionsMenuReducer(store)
            case 'SORT_PROCESSES'     : return reducers.sortProcessesReducer(store, action.payload)
            default: throw new Error(`Unsupported action type, ${action.type}`)
        }
    }
})

render(<App />, document.body)
