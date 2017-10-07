/**
 * DispatchComponent is a wrapper around `Component` providing a functional way
 *   to facilitate state.
 *
 * Disadvantages:
 * - Lose access to `setState `callback.
 * - Lose access to lifecycle hooks (unless they're made into `reducer` calls).
 */

/* eslint-disable no-unused-vars */
import { h, Component } from 'preact'

/**
 * The reducer function receives actions which may propogate state changes.
 * The render function receives the `store` to pass to its stateful/functional children.
 */
export default ({ reducer, render }) => class extends Component
{
    constructor() {
        super(...arguments)

        this.state = reducer({ type: 'CONSTRUCTOR' }) || {}
        this.store = {
            dispatch: this.dispatch
            , getState: () => this.state
        }
    }

    dispatch = (type, payload) => {
        const newState = reducer({ type, payload }, this.store, this.props)
        if (newState) this.setState(newState)
    }

    render = () => render(this.store, this.props)
}
