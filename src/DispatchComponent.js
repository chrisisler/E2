/**
 * Disadvantage:
 * - Lose access to `this.setState()` callback after async render update.
 * - Lose access to lifecycle hooks like willMount, didMount, etc. (unless explicity reducer'd).
 */

/* eslint-disable no-unused-vars */
import { h, Component } from 'preact'

export default ({ reducer, render: renderWithStore }) => class extends Component {
    constructor() {
        super(...arguments)

        this.state = reducer({ type: 'CONSTRUCTOR' }) || {}
        this.store = {
            dispatch: this.dispatch
            , getState: () => this.state
        }
    }

    dispatch = ({ type, payload }) => {
        const action = { type, payload }
        const newState = reducer(action, this.store, this.props)
        if (newState) this.setState(newState)
    }

    render = () => renderWithStore(this.store, this.props)
}
