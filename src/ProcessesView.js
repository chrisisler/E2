/**
 * Left-click a process to highlight only that one.
 * Ctrl + left-click a process to highlight multiple processes.
 * Shift + left-click to highlight all processes between.
 *
 * Right-click on a process to open the context menu.
 *   If the right-click occurred on an already highlighted process,
 *     display the context menu for those highlighted processes.
 *   Otherwise, clear the highlighted processes, highlight the right-clicked
 *     process, and open the context menu on it.
 *
 * Actions to invoke on a an individual process context menu:
 * - kill
 * - rename
 *
 * Actions to invoke on individual process hover:
 * - Display percent memory used by this process out of all processes.
 * - If there are more than one instances of processes of this name,
 *   display how many and their total memory usage, and their total memory
 *   usage as a percentage.
 *
 *
 * General actions
 * - sort
 * - refresh (get fresh batch of processes)
 * - search (fuzzy)
 *
 * Status bar information (fixed to bottom):
 * - Number of processes
 * - Number of processes highlighted
 * - Sum memory (from all processes) out of total memory.
 * - Up arrow icon, on click: scroll to top.
 */

import { h } from 'preact'
import glamorous from 'glamorous/preact'

import DispatchableComponent from './DispatchableComponent'
import getProcessesSync from './getProcesses'
import { getUniqId } from './shared'

const ProcRow = glamorous.div({
  display: 'flex'
  , textAlign: 'center'
})

const ProcData = glamorous.p({
  padding: 0
  , display: 'inline'
  , width: '33.3%'
})

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
      case '@@compononentWillMount': return { processes: getProcessesSync() }
    }
  }
})
