import { h, Component } from 'preact'
import glamorous from 'glamorous/preact'

// Used to create props for this component
export const notificationTypes = {
    ERROR: 'ERROR'
    , SUCCESS: 'SUCCESS'
}

// Maps a notificationType to backgroundColor.
// TODO Wire up to config
const typeToColor = {
    ERROR: '#e50000' // red
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
    , boxShadow: '1px 2px 5px 1px rgba(0, 0, 0, 0.35)'
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
        const domNode = document.getElementById(this._ref.id)
        if (domNode) domNode.remove()
    }

    componentDidMount() {
        setTimeout(this.closeMe, this.props.displayTime || 4000)
    }

    // `type` determines backgroundColor
    /** @type { message: String, type: String } */
    render({ message, type }) {
        const id = `notification-${getUniqId()}`
        return (
            <NotificationItem {...{type, id}} innerRef={x => this._ref = x} onClick={this.closeMe}>
                {message}
            </NotificationItem>
        )
    }
}
