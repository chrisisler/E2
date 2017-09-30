/**
 * Disadvantages:
 * - Lose access to `setState `callback.
 * - Lose access to lifecycle hooks (unless they're made into `reducer` calls).
 */

/* eslint-disable no-unused-vars */
import { h, Component } from 'preact'

export default ({ reducer, render }) => class extends Component {
    constructor() {
        super(...arguments)
        this.state = reducer({ type: 'CONSTRUCTOR' }) || {}
        this.store = {
            dispatch: this.dispatch
            , getState: () => this.state
        }
        // this.cache = {}
    }

    dispatch = (type, payload) => {
        const newState = reducer({ type, payload }, this.store, this.props)
        if (newState) this.setState(newState)
    }

    // dispatch = (type, payload) => {
    //     // TODO Referential transparency of the pure `reducer` function allows for caching optimization.
    //     if (this.cache[type]) this.cache[type](payload)

    //     this.cache[type] = payload => {
    //         const action = { type, payload }
    //         const newState = reducer(action, this.store, this.props)
    //         if (newState) this.setState(newState)
    //     }
    //     this.cache[type](payload)
    // }

    render = () => render(this.store, this.props)
}
