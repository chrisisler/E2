import { h, render } from 'preact'
import { Router } from 'preact-router'
import { RouteWithHeader } from './Header'

import ProcessesRoute from './routes/ProcessesRoute'
import SettingsRoute from './routes/SettingsRoute'
import DetailsRoute from './routes/DetailsRoute'
import { getProcessesSync } from './getProcesses'
import DispatchComponent from './DispatchComponent'
import {
    markProcessesReducer
    , leftClickProcessReducer
    , rightClickProcessReducer
} from './reducers'

// TODO Add state attribute for ActionsMenu ref.
const getInitialState = () => ({
    processes: getProcessesSync()
    , markedProcessesMap: new Map()
})

const App = DispatchComponent({
    render: store => (
        <Router>
            <RouteWithHeader path='/' default RouteComponent={ProcessesRoute} store={store} />
            <RouteWithHeader path='/details' RouteComponent={DetailsRoute} store={store} />
            <RouteWithHeader path='/settings' RouteComponent={SettingsRoute} />
        </Router>
    ),
    reducer: (action, store) => {
        switch (action.type) {
            case 'CONSTRUCTOR': return getInitialState()
            case 'MARK_PROCESSES': return markProcessesReducer(store, action.payload, true)
            case 'UNMARK_PROCESSES': return markProcessesReducer(store, action.payload, false)
            case 'LEFT_CLICK_PROCESS': return leftClickProcessReducer(store, action.payload)
            case 'RIGHT_CLICK_PROCESS': return rightClickProcessReducer(store, action.payload)
            default: throw new Error(`Unsupported action.type: ${action.type}`)
        }
    }
})

render(<App />, document.body)
