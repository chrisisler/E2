import { h } from 'preact'
import glamorous from 'glamorous/preact'
// import InfoBar from './InfoBar'

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
}, props => ({
    ...transitionCSS
    , ':hover': {
        backgroundColor: props.isTitle && '#b2ebf2'
        , cursor: 'pointer'
    }
}))

const Heading = ({ dispatch }) => (
    <ProcRow css={{ paddingBottom: 8, fontWeight: 600 }}>
        <ProcData isTitle onClick={() => { dispatch('SORT_PROCESSES', { key: 'name' })   }}>NAME</ProcData>
        <ProcData isTitle onClick={() => { dispatch('SORT_PROCESSES', { key: 'pid' })    }}>PID</ProcData>
        <ProcData isTitle onClick={() => { dispatch('SORT_PROCESSES', { key: 'memory' }) }}>MEMORY</ProcData>
    </ProcRow>
)

// TODO Use action creators. This example would be `leftClickProcess`.
// onClick={event => { store.dispatch(leftClickProcess({ event, procObj, procIndex })) }}

export default ({ store }) => {
    return (
        <glamorous.Section>
            <Heading dispatch={store.dispatch} />
            <glamorous.Div overflow='scroll' height='80vh'>
                {store.getState().processes.map((procObj, procIndex) => (
                    <ProcRow
                        key={procObj.pid}
                        onClick={event => { store.dispatch('LEFT_CLICK_PROCESS', { event, procObj, procIndex })} }
                        onContextMenu={event => store.dispatch('RIGHT_CLICK_PROCESS', { event, procObj, procIndex })}
                        isMarked={procObj.isMarked}
                    >
                        <ProcData>{procObj.name}</ProcData>
                        <ProcData>{procObj.pid}</ProcData>
                        <ProcData>{procObj.memory}</ProcData>
                    </ProcRow>
                ))}
            </glamorous.Div>
        </glamorous.Section>
    )
}
