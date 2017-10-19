import { h, render, Component } from 'preact'
import { Router } from 'preact-router'
import { RouteWithHeader } from './Header'
import ProcessesRoute from './routes/ProcessesRoute'
import SettingsRoute from './routes/SettingsRoute'
import DetailsRoute from './routes/DetailsRoute'
import { getProcessesSync } from './process-utils'
import reducer from './reducers/index'
import createStore from './createStore'

const initialState = {
    processes: getProcessesSync() // [Object]
    , markedProcessesMap: new Map() // Map<index: Number, proc: Object>
    , actionsMenuNode: null // DOMNode
    , doReverseSort: false // Boolean
    , previousSortKey: '' // String
    , visibilityFilter: null // Null or (procObj: Object) -> Boolean
    , unfilteredProcesses: [] // [Object]
    , renamesMap: new Map() // Map<pid: Number, history: Object<originalName: String, latestName: String>>
}

const store = createStore(reducer, initialState)

class App extends Component
{
    constructor() {
        super(...arguments)
        store.onDispatch(state => this.setState(state))
    }

    render = () => (
        <Router>
            <RouteWithHeader path='/' default RouteComponent={ProcessesRoute} store={store} />
            <RouteWithHeader path='/details' RouteComponent={DetailsRoute} store={store} />
            <RouteWithHeader path='/settings' RouteComponent={SettingsRoute} />
        </Router>
    )
}

render(<App />, document.body)
