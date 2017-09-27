/**
 * Disadvantage:
 * - Lose access to `this.setState()` callback after async render update.
 */

import { h, Component } from 'preact'

/**
 * Curries a binary function, enabling buttery-smooth partial application.
 * @type {Function -> Function}
 */
const curry2 = fn => (x, y) => !y ? y2 => fn(x, y2) : fn(x, y)

export default ({ reducer, render: renderWithStore }) => class extends Component {
  state = reducer({ type: 'CONSTRUCTOR' }) || {}

  dispatch = curry2((type, payload) => {
    // TODO Reduce duplication. (Put store on `this`?)
    const store = {
      dispatch: this.dispatch, // Can we self reference like this?
      getState: () => this.state
    }

    const action = { type, payload }
    const newState = reducer(action, store, this.props)
    if (newState) this.setState(newState)
  })

  render() {
    const store = {
      dispatch: this.dispatch,
      getState: () => this.state
    }
    return renderWithStore(store, this.props)
  }
}
