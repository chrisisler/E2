import { h, render } from 'preact'
import { Router } from 'preact-router'
import glamorous from 'glamorous/preact'

import { ViewWithHeader, Header } from './Header'
import ProcessesView from './ProcessesView'

const AppView = glamorous.main({
})

const App = () => (
  <AppView>
    <Router>
      <ViewWithHeader path='/' default View={ProcessesView} />
    </Router>
  </AppView>
)

render(<App />, document.body)
