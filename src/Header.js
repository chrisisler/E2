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
  , padding: '4px 0 0 16px'
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
  , margin: '0 0 0 20px'
  , flexDirection: 'column'
  , justifyContent: 'center'
  , textDecoration: 'none'
})

// TODO highlight the currently selected route
const routeNameToLink = routeName => (
  <HeaderLink>
    <Link href={`/${routeName}`} {...LinkCSS}>
      {routeName.toUpperCase()}
    </Link>
  </HeaderLink>
)

// TODO Put all route names into some shared js file in an array.
export const Header = () => (
  <HeaderWrap>
    <HeaderLinksList>
      {[ 'processes', 'settings', 'details' ].map(routeNameToLink)}
    </HeaderLinksList>
  </HeaderWrap>
)

const RouteWrap = glamorous.div({
  marginTop: headerHeight
  , height: `calc(100vh - ${headerHeight}px)`
})

export const RouteWithHeader = ({ RouteComponent, ...props }) => (
  <div>
    <Header />

    <RouteWrap>
      <RouteComponent {...props} />
    </RouteWrap>
  </div>
)
