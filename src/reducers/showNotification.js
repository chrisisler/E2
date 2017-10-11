import { h, render } from 'preact'
import Notification from '../Notification'

/**
 * Does not update state.
 * Renders a notification.
 * Don't need to use the returned ref node, Notification's remove themselves.
 *
 * @param {}
 * @param {Object} payload
 */
export default function showNotification(_, payload) {
    render(<Notification {...payload} />, document.getElementById('notification-flex-container'))
}
