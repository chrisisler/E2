import { h, Component } from 'preact'

export default ({ reducer, render: renderWithDispatch }) => class extends Component {
  state = reducer({ type: '@@compononentWillMount' })

  dispatch = type => payload => {
    const action = { type, payload }
    const newState = reducer(action, this.props, this.state)
    if (newState) {
      this.setState(newState)
    }
  }

  render() {
    const { dispatch, props, state } = this
    return renderWithDispatch(dispatch, props, state)
  }
}
