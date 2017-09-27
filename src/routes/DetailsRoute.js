// Features:
//   Initially display the process (from props) with the highest `memory`.
//   Use the `.pid` of the process object on `getDetailedProcessObj`.
//   Then render that data in a nice way.
//   Display an `<InfoBar />` component with a search bar to view a DetailsView
//   that searched process name / pid.

import { h } from 'preact'
import glamorous from 'glamorous/preact'
import { getDetailedProcessObj } from '../getProcesses'

const sortByMemory = procs => procs.sort((p1, p2) => p1.memory > p2.memory)

// fake data
// const percentCPU = 0.0
// const percentMemory = 0.1
// const memory = 2860
// const runningTime = '50:32'
// const parentPID = 42514
// const user = 'litebox'
// const status = 'S'

const DetailsFlexWrap = glamorous.section({
  display: 'flex'
  , padding: '32px 28px'
  , flexDirection: 'column'
})

export default ({ store }) => (
    <h1>details view</h1>
)
