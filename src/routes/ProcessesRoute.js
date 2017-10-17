import { h } from 'preact'
import glamorous from 'glamorous/preact'

const grayBackground = { backgroundColor: '#f3f3f3' }
const transitionCSS = { transition: 'background-color ease 300ms' }
const ProcRow = glamorous.div(transitionCSS, {
    display: 'flex'
    , textAlign: 'center'
    , userSelect: 'none'
}, props => ({
    backgroundColor: props.isMarked && '#b2ebf2'
}))
const ProcData = glamorous.p(transitionCSS, {
    padding: 8
    , margin: 0
    , display: 'inline'
    , width: '33.3%'
    , cursor: 'pointer'
    // https://css-tricks.com/almanac/properties/t/text-overflow/
    , overflow: 'hidden'
    , whiteSpace: 'nowrap'
    , textOverflow: 'ellipsis'
}, props => ({
    ':hover': {
        backgroundColor: props.isTitle && '#b2ebf2'
    }
}))

const SearchInput = glamorous.input(grayBackground, {
    padding: '8px 16px'
    , margin: '0 16px 8px 32px'
    , minWidth: 200
    , fontSize: 14
    , border: 'none'
    , outline: 'none'
})

const RefreshButton = glamorous.button(grayBackground, {
    width: 'fit-content'
    , padding: '8px 24px'
    , margin: '0 24px'
    , fontSize: 14
    , border: 'none'
    , outline: 'none'
    , borderRadius: 3
    , cursor: 'pointer'
})

const SearchBar = ({ store }) => {
    return <SearchInput placeholder='Search...' onKeyDown={keyDown} />
    function keyDown(event) {
        const didPressEnterKey = event.key === 'Enter'
        const query = event.target.value

        // If user presses enter on an empty input field, remove the filter / show all processes
        if (didPressEnterKey && query.length === 0 && store.getState().visibilityFilter != null) {
            store.dispatch('CLEAR_FILTER')
        }
        if (didPressEnterKey) {
            store.dispatch('SEARCH_PROCESSES', { query })
        }
    }
}

const Heading = ({ dispatch }) => (
    <ProcRow css={{ padding: '16px 0', fontWeight: 600 }}>
        <ProcData isTitle onClick={() => dispatch('SORT_PROCESSES', { key: 'name' })}>NAME</ProcData>
        <ProcData isTitle onClick={() => dispatch('SORT_PROCESSES', { key: 'pid' })}>PID</ProcData>
        <ProcData isTitle onClick={() => dispatch('SORT_PROCESSES', { key: 'memory' })}>MEMORY</ProcData>
    </ProcRow>
)

export default ({ store }) => {
    const { processes, visibilityFilter } = store.getState()

    return (
        <section>
            <SearchBar store={store} />
            {visibilityFilter
                && <button onClick={() => store.dispatch('CLEAR_FILTER')}>Clear Filter</button>
            }
            <RefreshButton onClick={() => store.dispatch('REFRESH_PROCESSES')}>
                Refresh
            </RefreshButton>
            <Heading dispatch={store.dispatch} />
            <glamorous.Div overflow='scroll' height='80vh'>
                {processes.map((procObj, procIndex) => (
                    <ProcRow
                        key={procObj.pid}
                        isMarked={procObj.isMarked}
                        onClick={event => store.dispatch('LEFT_CLICK_PROCESS', { event, procIndex })}
                        onContextMenu={event => store.dispatch('RIGHT_CLICK_PROCESS', { event, procObj, procIndex })}
                    >
                        <ProcData title={procObj.name}>{procObj.name}</ProcData>
                        <ProcData>{procObj.pid}</ProcData>
                        <ProcData>{procObj.memory}</ProcData>
                    </ProcRow>
                ))}
            </glamorous.Div>
        </section>
    )
}
