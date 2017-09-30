// TODO Add an action to view details of the right-clicked process.
// - This would redirect to the Details view and show extra info.

import { h, Component } from 'preact'
import glamorous from 'glamorous/preact'

const ActionsMenuWrap = glamorous.nav({
    position: 'absolute'
    , border: '1px solid #ccc'
    , borderRadius: 4
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
    , minWidth: 192
    , maxWidth: 512
    , maxHeight: 480
})

const ActionItem = glamorous.li({
    clear: 'both'
    , textAlign: 'left'
    , padding: '8px 24px'
    , textTransform: 'none'
    , cursor: 'pointer'
    , ':hover': {
        backgroundColor: '#ccc'
    }
})

export default class extends Component {
    id = 'actions-menu'

    componentDidMount() {
        document.addEventListener('click', ({ path }) => {
            // If there's a `getChildComponent` sub-prop in `this.props` then allow
            // users to click on it without closing the actions menu.
            if (!path.filter(x => x.classList).some(x => [...x.classList].includes('persist-on-click'))) {
                this.props.store.dispatch('CLOSE_ACTIONS_MENU')
                document.removeEventListener('click', document)
            }
        })
    }

    render = ({ actions, x, y }) => (
        <ActionsMenuWrap x={x} y={y} id={this.id}>
            <ActionsList>
                {actions.map(({ text, effect, getChildComponent, persistOnClick }) => (
                    <ActionItem
                        key={text}
                        onClick={() => { effect && effect() }}
                        className={persistOnClick && 'persist-on-click'}
                    >
                        {text}
                        {getChildComponent && getChildComponent()}
                    </ActionItem>
                ))}
            </ActionsList>
        </ActionsMenuWrap>
    )
}
