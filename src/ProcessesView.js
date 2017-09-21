import { h, Component } from 'preact'
import glamorous from 'glamorous/preact'

import DispatchableComponent from './DispatchableComponent'
// import InfoBar from './InfoBar'

const ProcRow = glamorous.div({
  display: 'flex'
  , textAlign: 'center'
  , userSelect: 'none'
}, props => ({
  backgroundColor: props.isMarked ? '#b2ebf2' : 'inherit' // TODO use a less saturated color
}))
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
      {props.processes.map((procObj, procIndex) => (
        <ProcRow
          key={procObj.pid}
          onClick={event => dispatch('LEFT_CLICK', { event, procObj, procIndex })}
          isMarked={procObj.isMarked}
        >
          <ProcData>{procObj.name}</ProcData>
          <ProcData>{procObj.pid}</ProcData>
          <ProcData>{procObj.memory}</ProcData>
        </ProcRow>
      ))}
    </section>
  ),

  reducer: (action, props, state) => {
    switch (action.type) {
      // `marksMap` is a Map of (index: Number, procObj: Object).
      // We use it to propagate changes the the top-level `props.dispatch`.
      case 'CONSTRUCTOR': return { marksMap: new Map() }

      case 'LEFT_CLICK': {
        const { event, procObj, procIndex } = action.payload
        let { marksMap } = state

        // If no modifier keys, only highlight the clicked process (unhighlight all others).
        if (!event.altKey && !event.shiftKey) {
          props.dispatch('UNMARK_PROCESSES', { indexes: [...marksMap.keys()] })
          props.dispatch('MARK_PROCESSES', { indexes: [ procIndex ] })
          marksMap = new Map().set(procIndex, procObj)
        }
        // If ALT + left-click, add the clicked process to the marksMap.
        else if (event.altKey) {
          props.dispatch('MARK_PROCESSES', { indexes: [ procIndex ] })
          marksMap.set(procIndex, procObj)
        }
        // If SHIFT + left-click, todo
        else if (event.shiftKey) {
          const last = x => x[x.length - 1]
          const range = (start, end) => [...Array(end - start)].map((_, idx) => idx + start)
          const lastIndex = last([...marksMap.keys()])

          // Mark every process between `lastIndex` and `procIndex`.
          const indexes = (lastIndex < procIndex)
            ? range(lastIndex, procIndex + 1) // need `+1` because procIndex is not yet marked.
            : range(procIndex, lastIndex)
          props.dispatch('MARK_PROCESSES', { indexes })

          indexes.forEach(index => {
            marksMap.set(index, props.processes[index])
          })
        }

        return { marksMap }
      }

      default: throw new Error(`defaulted: action.type is ${action.type}`)
    }
  }
})
