import { h } from 'preact'
import glamorous from 'glamorous/preact'

// Places some info at the bottom of client screen.
const InfoBarWrap = glamorous.div({
    position: 'fixed'
    , height: 24
    , width: '100vw'
    , bottom: 0
    // , padding: '2px 0'
    , backgroundColor: '#eee'
    , color: '#777'
    , fontSize: 16
    , display: 'flex'
    , textAlign: 'center' // vertical-align to center
})

// TODO
const InfoLeft = glamorous.div({
    position: 'fixed'
    , left: 0
})
const InfoCenter = glamorous.div({
    position: 'fixed'
    // , margin: '0 auto'
    , textAlign: 'center'
})
const InfoRight = glamorous.div({
    position: 'fixed'
    , right: 0
})

export default ({ left, center, right }) => (
    <InfoBarWrap>
        <InfoLeft>{left}</InfoLeft>
        <InfoCenter>{center}</InfoCenter>
        <InfoRight>{right}</InfoRight>
    </InfoBarWrap>
)
