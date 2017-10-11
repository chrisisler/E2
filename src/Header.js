import { h } from 'preact'
import { Link } from 'preact-router/match'
import glamorous from 'glamorous/preact'
import { css } from 'glamor'

export const headerHeight = 48

const headerHeightCSS = { height: headerHeight }
const HeaderWrap = glamorous.nav(headerHeightCSS, {
    position: 'fixed'
    , width: '100vw'
    , top: 0
    , padding: '8px 0 0 8px'
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
    , margin: '0 0 0 32px'
    , flexDirection: 'column'
    , justifyContent: 'center'
    , textDecoration: 'none'
})

const routeNameToLink = routeName => (
    <HeaderLink>
        <Link href={`/${routeName}`} {...LinkCSS}>
            {routeName.toUpperCase()}
        </Link>
    </HeaderLink>
)

// Maybe put all route names into some shared js file in an array.
const Header = () => (
    <HeaderWrap>
        <HeaderLinksList>
            {[ 'processes', 'settings', 'details' ].map(routeNameToLink)}
        </HeaderLinksList>
    </HeaderWrap>
)

const RouteWrap = glamorous.div({
    paddingTop: headerHeight
    , marginTop: 16
    , height: `calc(100vh - ${headerHeight + 16}px)`
})

export const RouteWithHeader = ({ RouteComponent, ...props }) => (
    <div>
        <Header />

        <RouteWrap>
            <RouteComponent {...props} />
        </RouteWrap>
    </div>
)
