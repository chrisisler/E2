import glamorous from 'glamorous/preact'

// reusable css
const grayBackground = { backgroundColor: '#f3f3f3' }
const transitionCSS = { transition: 'background-color ease 300ms' }

export const ProcRow = glamorous.div(transitionCSS, {
    display: 'flex'
    , textAlign: 'center'
    , userSelect: 'none'
}, props => ({
    backgroundColor: props.isMarked && '#b2ebf2'
}))

export const ProcData = glamorous.p(transitionCSS, {
    padding: 8
    , margin: 0
    , display: 'inline'
    , width: '33.3%'
    , cursor: 'pointer'
    // https://css-tricks.com/almanac/properties/t/text-overflow/
    , overflow: 'hidden'
    , whiteSpace: 'nowrap'
    , textOverflow: 'ellipsis'
}, props => ({
    ':hover': {
        backgroundColor: props.isTitle && '#b2ebf2'
    }
    , textTransform: props.isTitle && 'uppercase'
}))

export const SearchInput = glamorous.input(grayBackground, {
    padding: '8px 16px'
    , margin: '0 16px 8px 32px'
    , minWidth: 200
    , fontSize: 14
    , border: 'none'
    , outline: 'none'
})

export const RefreshButton = glamorous.button(grayBackground, {
    width: 'fit-content'
    , padding: '8px 24px'
    , margin: '0 24px'
    , fontSize: 14
    , border: 'none'
    , outline: 'none'
    , borderRadius: 3
    , cursor: 'pointer'
})

export const ProcessesScrollWrapper = glamorous.div({
    overflow: 'scroll'
    , height: '80vh'
})
