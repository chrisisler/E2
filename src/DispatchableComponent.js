/**
 * Disadvantages:
 * - Lose access to `this.setState()` callback after async render update.
 */

import { h, Component } from 'preact'

const curry2 = fn => (x, y) => !y ? y2 => fn(x, y2) : fn(x, y)

export default ({ reducer, render: renderDispatch }) => class DispatchableComponent extends Component {

  state = reducer({ type: 'CONSTRUCTOR' }) || {}

  dispatch = curry2((type, payload) => {
    const action = { type, payload }
    const state = reducer(action, this.props, this.state)
    if (state) {
      this.setState(state)
    }
  })

  render = () => renderDispatch(this.dispatch, this.props, this.state)
}
