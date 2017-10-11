import { h, Component } from 'preact'
import glamorous from 'glamorous/preact'

// Used to create props for this component
export const notificationTypes = {
    ERROR: 'ERROR'
    , SUCCESS: 'SUCCESS'
}

// Maps notificationType to backgroundColor.
// TODO Wire up to config
const typeToColor = {
    ERROR: '#ff420e' // red
    , SUCCESS: '#3c9a64' // green
}

const NotificationItem = glamorous.li({
    listStyleType: 'none'
    , margin: '8px auto'
    , padding: 8
    , borderRadius: 3
    , width: '90%'
    , maxWidth: 640
    , textAlign: 'center'
}, props => ({
    backgroundColor: typeToColor[props.type]
}))

const getUniqId = (() => {
    let id = 1
    return () => id++
})()

export default class extends Component
{
    closeMe = () => {
        const domNode = document.getElementById(this.selfNode.id)
        if (domNode) domNode.remove()
    }

    componentDidMount = () => {
        setTimeout(() => { this.closeMe() }, this.props.displayTime || 6000)
    }

    // `type` determines backgroundColor, check the css.
    render = ({ message, type }) => (
        <NotificationItem type={type} innerRef={node => { this.selfNode = node }} onClick={this.closeMe} id={`notification-${getUniqId()}`}>
            {message}
        </NotificationItem>
    )
}
