// TODO
// - Add ability to "Copy"

import { h } from 'preact'
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

const id = 'actions-menu'
const persistClicksClass = 'persist-on-click'

function didMount(closeActionsMenu) {
    document.addEventListener('click', (e) => {
        // If there's a `getChildComponent` sub-prop in `this.props` then allow
        // users to click on it without closing the actions menu.
        if (!e.path.filter(x => x.classList).some(x => [...x.classList].includes(persistClicksClass))) {
            closeActionsMenu()
            document.removeEventListener('click', document)
        }
    })
}

export default ({ actions, x, y, closeActionsMenu }) => {
    didMount(closeActionsMenu)
    return (
        <ActionsMenuWrap x={x} y={y} id={id}>
            <ActionsList>
                {actions.map(({ text, effect, getChildComponent, doPersist }) => (
                    <ActionItem
                        key={text}
                        onClick={() => { effect && effect() }}
                        className={doPersist && persistClicksClass}
                    >
                        {text}
                        {getChildComponent && getChildComponent()}
                    </ActionItem>
                ))}
            </ActionsList>
        </ActionsMenuWrap>
    )
}
