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
    padding: 16
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
    <ProcRow css={{ borderBottom: '2px solid #eee', fontWeight: 600 }}>
        {[ 'name', 'pid', 'memory' ].map(key => (
            <ProcData isTitle onClick={() => dispatch({ type: 'SORT_PROCESSES', payload: { key } })}>
                {key.toUpperCase()}
            </ProcData>
        ))}
    </ProcRow>
)

export default ({ store }) => {
    const processRows = store.getState().processes.map((procObj, procIndex) => (
        <ProcRow
            key={procObj.pid}
            onClick={event => store.dispatch({ type: 'LEFT_CLICK_PROCESS', payload: { event, procObj, procIndex } })}
            onContextMenu={event => store.dispatch({ type: 'RIGHT_CLICK_PROCESS', payload: { event, procObj, procIndex } })}
            isMarked={procObj.isMarked}
        >
            <ProcData>{procObj.name}</ProcData>
            <ProcData>{procObj.pid}</ProcData>
            <ProcData>{procObj.memory}</ProcData>
        </ProcRow>
    ))

    return (
        <glamorous.Section padding={16} >
            <Heading dispatch={store.dispatch} />
            <glamorous.Div overflow='scroll' height='80vh'>
                {processRows}
            </glamorous.Div>
        </glamorous.Section>
    )
}
