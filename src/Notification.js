import { h, Component } from 'preact'
import glamorous from 'glamorous/preact'

export const notificationTypes = {
    ERROR: 'ERROR'
    , SUCCESS: 'SUCCESS'
}

// TODO Use hex colors.
// TODO Wire up to config
const typeToColor = {
    ERROR: 'red'
    , SUCCESS: 'green'
}

const NotificationWrap = glamorous.div({
    bottom: 36
    , margin: '0 auto'
    , position: 'fixed'
    , cursor: 'pointer'
    , textAlign: 'center'
    , width: '90vw'
    , maxWidth: 512
    , minHeight: 56
    , fontSize: 14
    , boxShadow: '0 2p 2px 0 rgba(0,0,0,0.2)'
}, props => ({
    backgroundColor: typeToColor[props.type]
}))

export default class extends Component
{
    closeMe = () => {
        const domNode = document.getElementById(this.selfNode.id)
        if (domNode) domNode.remove()
    }

    componentDidMount() {
        console.log('this.closeMe is:', this.closeMe)
        setTimeout(this.closeMe, 6000)
    }

    render = ({ message, type }) => (
        <NotificationWrap type={type} ref={node => { this.selfNode = node }} onClick={this.closeMe}>
            <glamorous.P margin='0 auto'>{message}</glamorous.P>
        </NotificationWrap>
    )
}
