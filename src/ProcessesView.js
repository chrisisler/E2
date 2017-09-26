import { h, render } from 'preact'
import glamorous from 'glamorous/preact'

import ActionsMenu from './ActionsMenu'
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
  <ProcRow css={{ borderBottom: '2px solid #eee', fontWeight: 600 }}>
    <ProcData>NAME</ProcData>
    <ProcData>PID</ProcData>
    <ProcData>MEMORY</ProcData>
  </ProcRow>
)

/** @type {[Object] -> [Object]} */
// Guaranteed non-empty array.
const getActions = procs => {
  let actions = []

  // Dummy func for now.
  const killProcess = pid => {}

  actions.push({
    text: 'Kill highlighted processes'
    , effect: () => { procs.forEach(p => killProcess(p.pid)) }
  })
  return actions
}

/** @type {([Object], Number, Number) -> DOMNode} */
const renderActionsMenu = (actions, x, y) => {
  let ref
  const actionsMenuComponent = <ActionsMenu actions={actions} x={x} y={y} ref={node => { ref = node }}/>;
  // TODO fix
  const el = document.getElementById('actions-menu-wrap')
  render(actionsMenuComponent, el, el || null)
  return ref
}

/** @type {(Object, Object, Object) -> Object} */
const rightClickReducer = (state, props, payload) => {
  const { procObj, event, procIndex } = payload
  // TODO fix bugs

  if (state.marksMap.size > 0 && !procObj.isMarked) {
    props.dispatch('UNMARK_PROCESSES', { indexes: [...state.marksMap.keys()] })
  }
  props.dispatch('MARK_PROCESSES', { indexes: [ procIndex ] })

  const marksMap = new Map(state.marksMap).set(procIndex, procObj)
  const procs = [...marksMap.values()]

  const actionsMenuNode = renderActionsMenu(getActions(procs), event.pageX, event.pageY)
  return { marksMap }
}

/**
 * Handles (un)highlighting the process rows:
 * - Left-click a process to highlight only that one.
 * - Ctrl + left-click a process to highlight multiple processes.
 * - Shift + left-click to highlight all processes between.
 * @type {(Object, Object, Object) -> Object}
 */
const leftClickReducer = (state, props, payload) => {
  const { event, procObj, procIndex } = payload
  let { marksMap } = state

  // If no modifiers, mark the clicked process (unhighlight rest).
  if (!event.altKey && !event.shiftKey) {
    const indexes = [...marksMap.keys()]
    if (indexes.length > 0) {
      props.dispatch('UNMARK_PROCESSES', { indexes })
    }
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

export default DispatchableComponent({
  render: (dispatch, props, state) => (
    <glamorous.Section padding={16} >
      <Heading />
      <glamorous.Div overflow='scroll' height='80vh'>
        {props.processes.map((procObj, procIndex) => (
          <ProcRow
            key={procObj.pid}
            onClick={event => dispatch('LEFT_CLICK', { event, procObj, procIndex })}
            onContextMenu={event => dispatch('RIGHT_CLICK', { event, procObj, procIndex })}
            isMarked={procObj.isMarked}
          >
            <ProcData>{procObj.name}</ProcData>
            <ProcData>{procObj.pid}</ProcData>
            <ProcData>{procObj.memory}</ProcData>
          </ProcRow>
        ))}
      </glamorous.Div>
    </glamorous.Section>
  ),

  reducer: (action, props, state) => {
    switch (action.type) {
        // `marksMap` is a Map of (index: Number, procObj: Object).
        // We use it to propagate changes the the top-level `props.dispatch`.
      case 'CONSTRUCTOR': return { marksMap: new Map() }
      case 'RIGHT_CLICK': return rightClickReducer(state, props, action.payload)
      case 'LEFT_CLICK': return leftClickReducer(state, props, action.payload)
      default: throw new Error(`defaulted: action.type is ${action.type}`)
    }
  }
})
