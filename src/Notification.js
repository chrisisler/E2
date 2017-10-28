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
    ERROR: 'linear-gradient(to right, #c90000 0%,#bc0035 100%)' // red
    // , SUCCESS: '#3c9a64' // green
    , SUCCESS: 'linear-gradient(to right, #328256 0%,#3d998e 100%)' // green
}

const NotificationItem = glamorous.li({
    listStyleType: 'none'
    , margin: '8px auto'
    , padding: 8
    , borderRadius: 3
    , width: '90%'
    , maxWidth: 640
    , textAlign: 'center'
    , boxShadow: '2px 2px 3px 0 rgba(0, 0, 0, 0.4)'
}, props => ({
    background: typeToColor[props.type]
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
        setTimeout(this.closeMe, this.props.timer || 4000)
    }

    // the `type` string determines backgroundColor
    render({ message, type }) {
        const id = `notification-${getUniqId()}`
        return (
            <NotificationItem {...{type, id}} innerRef={x => this._ref = x} onClick={this.closeMe}>
                {message}
            </NotificationItem>
        )
    }
}
