// TODO

import { h } from 'preact'
import glamorous from 'glamorous/preact'

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

export default () => (
    <InfoBarWrap>
    </InfoBarWrap>
)
