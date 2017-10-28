import createStore from './createStore'
import { getProcessesSync } from './process-utils'
import reducer from './reducers/index'

const getInitialState = () => ({
    processes: getProcessesSync() // [Object]
    , markedProcessesMap: new Map() // Map<index: Number, proc: Object>
    , actionsMenuNode: null // DOMNode reference
    , doReverseSort: false // Boolean
    , previousSortKey: '' // String
    , visibilityFilter: null // Null or Function (procObj: Object) -> Boolean
    , unfilteredProcesses: [] // [Object]
    , renamesMap: new Map() // Map<pid: Number, history: Object<originalName: String, latestName: String>>
})

let store = createStore(reducer, getInitialState())
export default store
