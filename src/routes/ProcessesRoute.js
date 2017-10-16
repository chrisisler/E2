import { h, render } from 'preact'
import glamorous from 'glamorous/preact'
import HoverBox from '../HoverBox' // for hover info

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
    padding: 8
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

// TODO: add hover menu
function makeProcessObjectView(store, procObj, procIndex) {
    let timeoutId, hoverBoxRefNode

    function mouseEnter() {
        // keep track of mouse movement for rendering the hoverbox if users mouse stays there.
        let x, y
        document.addEventListener('mousemove', ({ pageX, pageY }) => {
            x = pageX
            y = pageY
        })

        timeoutId = setTimeout(() => {
            // don't render more than one hoverbox
            if (timeoutId) {
                // wip
                // hoverBoxRefNode = render(<HoverBox x={x} y={y} />, document.body)
            }
        }, 2000)
    }

    function mouseLeave(event) {
        clearTimeout(timeoutId)

        // do not unmount hoverbox from dom if hovering the hoverbox
        if (hoverBoxRefNode) {
            if (event.toElement.id !== hoverBoxRefNode.id) {
                const domNode = document.getElementById(hoverBoxRefNode.id)
                if (domNode) {
                    domNode.remove()
                }
            }
        }
    }

    return (
        <ProcRow
            key={procObj.pid}
            isMarked={procObj.isMarked}
            onClick={event => store.dispatch('LEFT_CLICK_PROCESS', { event, procIndex })}
            onContextMenu={event => store.dispatch('RIGHT_CLICK_PROCESS', { event, procObj, procIndex })}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
        >
            <ProcData title={procObj.name}>{procObj.name}</ProcData>
            <ProcData>{procObj.pid}</ProcData>
            <ProcData>{procObj.memory}</ProcData>
        </ProcRow>
    )
}

export default ({ store }) => {
    let { processes, visibilityFilter } = store.getState()

    // TODO just render `processes` -> see `searchProcesses.js`
    // if (visibilityFilter) {
    //     processes = processes.filter(visibilityFilter)
    // }

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
                {processes.map((procObj, procIndex) => makeProcessObjectView(store, procObj, procIndex))}
            </glamorous.Div>
        </section>
    )
}
