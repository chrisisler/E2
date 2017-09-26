// Features:
//   Initially display the process (from props) with the highest `memory`.
//   Use the `.pid` of the process object on `getDetailedProcessObj`.
//   Then render that data in a nice way.
//   Display an `<InfoBar />` component with a search bar to view a DetailsView
//   that searched process name / pid.

/**
 * %cpu: percantage cpu usage
 * %mem: percentage memory usage
 * rss: memory (?)
 * etime: elapsed running time
 * ppid: parent process id
 *     - if this exists, use this pid value to show a button
 *     - which will display a full card (router view) of the
 *     - process with this id.
 * user: who started this process
 * stat: if includes "S", then is display: `status: sleeping`
 *
 * Additional:
 * - How many processes of this name
 *     - if not singular process, display %cpu, %mem, and rss for
 *       the summated process.
 */
import { h } from 'preact'
import glamorous from 'glamorous/preact'
import { getDetailedProcessObj } from './getProcesses'
import DispatchableComponent from './DispatchableComponent'

const sortByMemory = procs => procs.sort((p1, p2) => p1.memory > p2.memory)

// fake data
const percentCPU = 0.0
const percentMemory = 0.1
const memory = 2860
const runningTime = '50:32'
const parentPID = 42514
const user = 'litebox'
const status = 'S'

const DetailsFlexWrap = glamorous.section({
  display: 'flex'
  , padding: '32px 28px'
  , flexDirection: 'column'
})

export default DispatchableComponent({
  render: (dispatch, props, state) => {

    const { pid } = sortByMemory(props.processes)[0]
    const detailedProc = getDetailedProcessObj(pid)

    return (
      <DetailsFlexWrap>
        foo
      </DetailsFlexWrap>
    )
  },
  reducer: (action, props, state) => {
    switch (action.type) {
        case 'CONSTRUCTOR': return { index: 0 }
        default: throw new Error('foo')
    }
  }
})



























// // fake data
// const pid = getProcessesSync()[8].pid
// const detailedProcessObj = getDetailedProcessObj(pid)
// const o = detailedProcessObj
// // details

// const DetailsWrap = glamorous.section({
//   margin: 0
//   , padding: 36
//   , display: 'flexbox'
// })

// export default () => (
//   <DetailsWrap>
//     foo
//   </DetailsWrap>
// )
