import { h } from 'preact'
import { getMemoryPercent } from '../process-utils'
import {
    ProcRow
    , ProcData
    , SearchInput
    , RefreshButton
    , ProcessesScrollWrapper
} from './ProcessesRouteStyles.js'

const SearchBar = ({ store }) => (
    <SearchInput placeholder='Search...' onKeyDown={event => {
        const query = event.target.value
        const didPressEnterKey = (event.key === 'Enter')

        // If user presses enter on an empty input field, remove the filter & show all processes
        if (didPressEnterKey && query.length === 0 && store.getState().visibilityFilter != null) {
            store.dispatch('CLEAR_FILTER')
        } else if (didPressEnterKey) {
            store.dispatch('SEARCH_PROCESSES', { query })
        }
    }}/>
)

const Heading = ({ sortProcesses }) => {
    const titles = ['name', 'pid', 'memory'].map(key => <ProcData key={key} isTitle onClick={sortProcesses(key)}>{key}</ProcData>)
    return <ProcRow css={{ padding: '16px 0', fontWeight: 600 }}> {titles} </ProcRow>
}

export default function ProcessesRoute({ store }) {
    const { processes, visibilityFilter } = store.getState()

    return (
        <section>
            <SearchBar store={store} />

            {visibilityFilter != null
                    && <button onClick={() => store.dispatch('CLEAR_FILTER')}>Clear Filter</button>
            }

            <RefreshButton onClick={() => store.dispatch('REFRESH_PROCESSES')}>
                Refresh
            </RefreshButton>

            <Heading sortProcesses={key => store.dispatch('SORT_PROCESSES', { key })} />

            <ProcessesScrollWrapper>
                {processes.map((procObj, procIndex) => (
                    <ProcRow
                        key={procObj.pid}
                        isMarked={procObj.isMarked}
                        onClick={event => store.dispatch('LEFT_CLICK_PROCESS', { event, procIndex })}
                        onContextMenu={event => store.dispatch('RIGHT_CLICK_PROCESS', { event, procObj, procIndex })}
                    >
                        <ProcData title={procObj.name}>{procObj.name}</ProcData>
                        <ProcData>{procObj.pid}</ProcData>
                        <ProcData title={`Using ${getMemoryPercent(procObj.memory)} total memory`}>{procObj.memory}</ProcData>
                    </ProcRow>
                ))}
            </ProcessesScrollWrapper>

        </section>
    )
}
