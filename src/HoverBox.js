import { h, Component } from 'preact'
import glamorous from 'glamorous/preact'

const Wrapper = glamorous.nav({
    position: 'absolute'
    , border: '1px solid #ccc'
    , borderRadius: 3
    , backgroundColor: '#eee'
    , zIndex: 100
    , fontSize: 14
    , padding: 8
}, props => ({
    top: props.y
    , left: props.x
}))

export default class extends Component
{
    componentDidMount() {
        // document.addEventListener('mousemove', ({ pageX: x, pageY: y }) => {
            // this.setState({ x, y })
        // })
    }

    componentWillUnmount() {
        // document.removeEventListener('mousemove', document)
    }

    render = (props, state) => {
        const x = state.x || props.x
        const y = state.y || props.y

        return (
            <Wrapper x={x} y={y} id='hoverbox'>
                hello
            </Wrapper>
        )
    }
}
