import { h, render } from 'preact'
import { Router } from 'preact-router'
import { ViewWithHeader } from './Header'
import ProcessesView from './ProcessesView'
import SettingsView from './SettingsView'
import DetailsView from './DetailsView'
import { getProcessesSync } from './getProcesses'
import DispatchableComponent from './DispatchableComponent'

/**
 * @param {Object} payload
 * @param {[Number]} payload.indexes - An array of numbers, some indexes of `state.processes`.
 * @param {Object} state
 * @param {Boolean} doSetMark
 * @returns {Object} - The new state.
 */
const markProcessesReducer = (payload, state, doSetMark) => {
  let { processes } = state
  payload.indexes.forEach(index => {
    processes[index].isMarked = doSetMark
  })
  return { processes }
}

const App = DispatchableComponent({
  render: (dispatch, props, state) => (
    <Router>
      <ViewWithHeader path='/' View={ProcessesView} processes={state.processes} dispatch={dispatch} default />
      <ViewWithHeader path='/details'   View={DetailsView}   processes={state.processes} />
      <ViewWithHeader path='/settings'  View={SettingsView} />
    </Router>
  ),
  reducer: (action, props, state) => {
    switch (action.type) {
      case 'CONSTRUCTOR': return { processes: getProcessesSync() }
      case 'MARK_PROCESSES': return markProcessesReducer(action.payload, state, true)
      case 'UNMARK_PROCESSES': return markProcessesReducer(action.payload, state, false)
      default: throw new Error(`defaulted: action.type is ${action.type}`)
    }
  }
})

render(<App />, document.body)
