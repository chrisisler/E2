import { h } from 'preact'
import { Link } from 'preact-router'
import glamorous from 'glamorous/preact'
import { css } from 'glamor'

const headerHeight = 42
const headerHeightCSS = { height: headerHeight }
const HeaderWrap = glamorous.nav(headerHeightCSS, {
  position: 'fixed'
  , width: '100vw'
  , top: 0
  , padding: '0 0 0 24px'
  , backgroundColor: '#eee'
  , boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.18)'
})
const HeaderLinksList = glamorous.ul(headerHeightCSS, {
  display: 'flex' // flexin' it up
  , alignItems: 'center'
  , margin: '0 auto'
  , overflow: 'hidden'
  , maxWidth: 1800
  , padding: 0
})
const HeaderLink = glamorous.li(headerHeightCSS, {
  listStyleType: 'none'
})
const LinkCSS = css(headerHeightCSS, {
  color: '#000'
  , display: 'flex'
  , position: 'relative'
  , margin: '0 12px'
  , flexDirection: 'column'
  , justifyContent: 'center'
  , textDecoration: 'none'
})

// TODO highlight the currently selected view
const viewNameToViewLink = viewName => (
  <HeaderLink>
    <Link href={`/${viewName}`} {...LinkCSS}>
      {viewName}
    </Link>
  </HeaderLink>
)

// TODO Put views into `./shared.js`
export const Header = () => (
  <HeaderWrap>
    <HeaderLinksList>
      {[ 'processes', 'settings', 'card' ].map(viewNameToViewLink)}
    </HeaderLinksList>
  </HeaderWrap>
)

const ViewWrap = glamorous.div({
  marginTop: headerHeight
  , height: `calc(100vh - ${headerHeight}px)`
})

export const ViewWithHeader = ({ View, ...props }) => (
  <div>
    <Header />

    <ViewWrap>
      <View {...props} />
    </ViewWrap>
  </div>
)
