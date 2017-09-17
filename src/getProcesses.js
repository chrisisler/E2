import cp from 'child_process'
import os from 'os'
import { pipe } from './shared'

const input = cp.execSync('ps -axco pid=,rss=,command=', { encoding: 'utf8' })

/** @type {(String) -> [Object]} */
const pipeline = pipe(
    string => string.split(os.EOL)
    , strings => strings.map(s => s.trim().replace(/\s+/g, ' '))
    , strings => strings.filter(Boolean)
    , strings => strings.map(s => {
        const [ pid, memory, name ] = s.split(' ')
        return { pid, memory, name }
    })
)

export default () => pipeline(input)
