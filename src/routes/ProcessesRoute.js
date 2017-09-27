import { h } from 'preact'
import glamorous from 'glamorous/preact'

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
        <glamorous.Section padding={16} >
            <Heading />
            <glamorous.Div overflow='scroll' height='80vh'>
                {processRows}
            </glamorous.Div>
        </glamorous.Section>
    )
}
