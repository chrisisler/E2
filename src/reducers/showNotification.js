import { h, render } from 'preact'
import Notification from '../Notification'

/**
 * Does not update state.
 * Renders a notification.
 *
 * @param {}
 * @param {Object} payload
 */
export default function showNotification(_, payload) {
    render(<Notification {...payload} />, document.body)
}
