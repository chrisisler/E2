// TODO Add an action to view details of the right-clicked process.
// - This would redirect to the Details view and show extra info.

import { h, Component } from 'preact'
import glamorous from 'glamorous/preact'

const ActionsMenuWrap = glamorous.nav({
    position: 'absolute'
    , border: '1px solid #ccc'
    , borderRadius: 3
    , backgroundColor: '#eee'
    , zIndex: 100
    , fontSize: 14
}, props => ({
    top: props.y
    , left: props.x
}))

const ActionsList = glamorous.ul({
    display: 'block'
    , listStyleType: 'none'
    , margin: 0
    , padding: 0
    , minWidth: 180
    , maxWidth: 450
    , maxHeight: 400
})

const ActionItem = glamorous.li({
    clear: 'both'
    , textAlign: 'left'
    , padding: '6px 20px'
    , textTransform: 'none'
    , cursor: 'pointer'
    , ':hover': {
        backgroundColor: '#ddd'
    }
})

export default class extends Component {
    id = 'actions-menu'

    componentDidMount() {
        document.addEventListener('click', event => {
            // If there's a `getChildComponent` sub-prop in `this.props` then allow
            // users to click on it without closing the actions menu.
            if (!event.path.some(node => [...node.classList].includes('persist-on-click'))) {
                // this.hide()
                this.props.store.dispatch('CLOSE_ACTIONS_MENU')()
            }
            document.removeEventListener('click', document)
        })
    }

    // hide() {
        // const thisNode = document.getElementById(this.id)
        // if (thisNode) {
        //     thisNode.remove()
        // }
    // }

    render = ({ actions, x, y }) => (
        <ActionsMenuWrap x={x} y={y} id={this.id}>
            <ActionsList>
                {actions.map(({ text, effect, getChildComponent, persistOnClick }) => (
                    <ActionItem onClick={() => { effect && effect() }} className={persistOnClick && 'persist-on-click'} key={text}>
                        {text}
                        {getChildComponent && getChildComponent()}
                    </ActionItem>
                ))}
            </ActionsList>
        </ActionsMenuWrap>
    )
}