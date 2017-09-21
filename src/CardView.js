import { h } from 'preact'

import { getDetailedProcessObj, getProcessesSync } from './getProcesses'

const pid = getProcessesSync()[8].pid
const detailedProcessObj = getDetailedProcessObj(pid)
const o = detailedProcessObj

// TODO
//   Initially display the process (from props) with the highest `memory`.
//   Use the `.pid` of the process object on `getDetailedProcessObj`.
//   Then render that data in a nice way.
//   Display an `<InfoBar />` component with a search bar to view a CardView
//   that searched process name / pid.
export default () => (
  <ul>
    {Object.keys(o).map(k => (
      <li>{k} is {o[k]}</li>
    ))}
  </ul>
)
