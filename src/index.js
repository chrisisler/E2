import { h, render, Component } from 'preact'
import { Router } from 'preact-router'
import { RouteWithHeader } from './Header'
import ProcessesRoute from './routes/ProcessesRoute'
import SettingsRoute from './routes/SettingsRoute'
import DetailsRoute from './routes/DetailsRoute'
import store from './store'

class App extends Component
{
    componentWillMount() {
        // Hook UI updates into store updates.
        store.onDispatch(newState => { this.setState(newState) })
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
