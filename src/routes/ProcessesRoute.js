import { h } from 'preact'
import glamorous from 'glamorous/preact'

const transitionCSS = { transition: 'background-color ease 300ms' }
const ProcRow = glamorous.div(transitionCSS, {
    display: 'flex'
    , textAlign: 'center'
    , userSelect: 'none'
}, props => ({
    backgroundColor: props.isMarked && '#b2ebf2'
}))
const ProcData = glamorous.p({
    padding: 8
    , margin: 0
    , display: 'inline'
    , width: '33.3%'

    // https://css-tricks.com/almanac/properties/t/text-overflow/
    , overflow: 'hidden'
    , whiteSpace: 'nowrap'
    , textOverflow: 'ellipsis'
}, props => ({
    ...transitionCSS
    , ':hover': {
        backgroundColor: props.isTitle && '#b2ebf2'
        , cursor: 'pointer'
    }
}))

const SearchInput = glamorous.input({
    padding: '8px 16px'
    , margin: '0 16px 8px 32px'
    , minWidth: 232
    , fontSize: 14
    , border: 'none'
    , boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.15)'
    , outline: 'none'
})

const SearchBar = ({ store }) => (
    <SearchInput placeholder='Search...' onKeyDown={event => {
        const query = event.target.value
        const pressedEnter = event.key === 'Enter'

        // If user presses enter on an empty input field, remove the filter / show all processes
        if (pressedEnter && query.length === 0 && store.getState().visibilityFilter != null) {
            store.dispatch('CLEAR_FILTER')
        }
        if (pressedEnter) {
            store.dispatch('SEARCH_PROCESSES', { query })
        }
    }} />
)

const Heading = ({ dispatch }) => (
    <ProcRow css={{ paddingBottom: 16, fontWeight: 600 }}>
        <ProcData isTitle onClick={() => dispatch('SORT_PROCESSES', { key: 'name' })}>NAME</ProcData>
        <ProcData isTitle onClick={() => dispatch('SORT_PROCESSES', { key: 'pid' })}>PID</ProcData>
        <ProcData isTitle onClick={() => dispatch('SORT_PROCESSES', { key: 'memory' })}>MEMORY</ProcData>
    </ProcRow>
)

export default ({ store }) => {
    let { processes, visibilityFilter } = store.getState()

    if (visibilityFilter) {
        processes = processes.filter(visibilityFilter)
    }

    // TODO clear search bar on clicking the "clear filter" button.
    return (
        <section>
            <SearchBar store={store} />
            {visibilityFilter
                && <button onClick={() => store.dispatch('CLEAR_FILTER')}>Clear Filter</button>
            }

            <glamorous.Div border='1px solid black' height={50} width={50} onClick={() => { store.dispatch('GET_LATEST_PROCESSES') }}>Refresh</glamorous.Div>

            <Heading dispatch={store.dispatch} />

            <glamorous.Div overflow='scroll' height='80vh'>
                {processes.map((procObj, procIndex) => (
                    <ProcRow
                        key={procObj.pid}
                        title={procObj.name}
                        isMarked={procObj.isMarked}
                        onClick={event => store.dispatch('LEFT_CLICK_PROCESS', { event, procObj, procIndex })}
                        onContextMenu={event => store.dispatch('RIGHT_CLICK_PROCESS', { event, procObj, procIndex })}
                    >
                        <ProcData>{procObj.name}</ProcData>
                        <ProcData>{procObj.pid}</ProcData>
                        <ProcData>{procObj.memory}</ProcData>
                    </ProcRow>
                ))}
            </glamorous.Div>
        </section>
    )
}
