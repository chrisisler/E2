import { h } from 'preact'
import glamorous from 'glamorous/preact'

import DispatchableComponent from './DispatchableComponent'

// Closure gimmick for `key` prop.
// TODO move to shared/util.js
const getUniqId = (() => {
  let id = 1
  return () => id++
})()

// import getProcessesSync from './getProcesses'

// const ProcsCSS = {
//     display: 'flex'
//     , flexDirection: 'row'
//     , justifyContent: 'space-evenly'
// }

const fakeProc = { pid: 42, memory: 23423, name: 'chrome' }
const initProcs = [ fakeProc, fakeProc, fakeProc, fakeProc, fakeProc ]

const ProcRow = glamorous.div({
  display: 'flex'
  , textAlign: 'center'
})

const ProcData = glamorous.p({
  padding: 0
  , display: 'inline'
  , width: '33.3%'
})

// Displays the titles of the properties.
const Heading = () => (
  <ProcRow>
    <ProcData>NAME</ProcData>
    <ProcData>PID</ProcData>
    <ProcData>MEMORY</ProcData>
  </ProcRow>
)

export default DispatchableComponent({
  render: (dispatch, props, state) => (
    <section>
      <Heading />
        {state.processes.map(proc => (
          <ProcRow key={getUniqId()}>
            <ProcData>{proc.name}</ProcData>
            <ProcData>{proc.pid}</ProcData>
            <ProcData>{proc.memory}</ProcData>
          </ProcRow>
        ))}
    </section>
),

  reducer: (action, props, state) => {
    switch (action.type) {
      case '@@compononentWillMount': return { processes: initProcs }
    }
  }
})
