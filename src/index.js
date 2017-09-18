import { h, render } from 'preact'
import { Router } from 'preact-router'

import { ViewWithHeader, Header } from './Header'
import ProcessesView from './ProcessesView'
import SettingsView from './SettingsView'

const App = () => (
  <Router>
    <ViewWithHeader path='/' View={ProcessesView} default />
    <ViewWithHeader path='/settings' View={SettingsView} />
  </Router>
)

render(<App />, document.body)
