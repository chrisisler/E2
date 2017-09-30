import { h } from 'preact'
import glamorous from 'glamorous/preact'
// import InfoBar from './InfoBar'

const ProcRow = glamorous.div({
    display: 'flex'
    , textAlign: 'center'
    , userSelect: 'none'
}, props => ({
    // TODO use a less saturated color
    backgroundColor: props.isMarked ? '#b2ebf2' : 'inherit'
}))
const ProcData = glamorous.p({
    padding: 8
    , margin: 0
    , display: 'inline'
    , width: '33.3%'
}, props => ({
    transition: 'background-color ease 300ms'
    , ':hover': {
        backgroundColor: props.isTitle ? '#b2ebf2' : 'inherit'
        , cursor: 'pointer'
    }
}))

const Heading = ({ dispatch }) => (
    <ProcRow css={{ paddingBottom: 8, fontWeight: 600 }}>
        {['name', 'pid', 'memory'].map(key => (
            <ProcData isTitle onClick={() => dispatch('SORT_PROCESSES', { key })}>
                {key.toUpperCase()}
            </ProcData>
        ))}
    </ProcRow>
)

// TODO switch all dispatch calls to non-curried, like so:
// onContextMenu={event => store.dispatch('RIGHT_CLICK_PROCESS', { event, procObj, procIndex })}

export default ({ store }) => {
    const processRows = store.getState().processes.map((procObj, procIndex) => (
        <ProcRow
            key={procObj.pid}
            onClick={event => store.dispatch('LEFT_CLICK_PROCESS', { event, procObj, procIndex })}
            onContextMenu={event => store.dispatch('RIGHT_CLICK_PROCESS', { event, procObj, procIndex })}
            isMarked={procObj.isMarked}
        >
            <ProcData>{procObj.name}</ProcData>
            <ProcData>{procObj.pid}</ProcData>
            <ProcData>{procObj.memory}</ProcData>
        </ProcRow>
    ))

    return (
        <glamorous.Section padding={16}>
            <Heading dispatch={store.dispatch} />
            <glamorous.Div overflow='scroll' height='80vh'>
                {processRows}
            </glamorous.Div>
        </glamorous.Section>
    )
}
