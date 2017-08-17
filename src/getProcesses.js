const cp = require('child_process')
const os = require('os')
const { pipe } = require('./shared')

const input = cp.execSync('ps -axco pid=,rss=,command=', { encoding: 'utf8' })

// String -> Array[Object]
const pipeline = pipe(
    string => string.split(os.EOL)

    // Remove extra and duplicate whitespace.
    , strings => strings.map(s => s.trim().replace(/\s+/g, ' '))

    // Remove falsy values
    , strings => strings.filter(Boolean)

    , strings => strings.map(s => {
        const [ pid, memory, name ] = s.split(' ')
        return { pid, memory, name }
    })
)

module.exports = () => pipeline(input)
