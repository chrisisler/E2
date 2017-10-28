import { h, render } from 'preact'
import Notification from '../Notification'

/**
 * Does not update state.
 * Does not utilize `state`.
 * Renders a notification.
 * Don't need to use the returned ref node, Notification components self-unmount.
 *
 * @param {state}
 * @param {Object} payload
 */
export default function showNotification(state, payload) {
    render(<Notification {...payload} />, document.getElementById('notification-flex-container'))
}
