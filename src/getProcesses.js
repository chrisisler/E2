/**
 * TODO
 * - Write `getProcessesAsync` (for the "refresh processes" feature).
 *   - Use async/await for `getProcessesAsync`.
 */

import cp from 'child_process'
import os from 'os'

const makeProcessObjFromStr = s => {
    const [ pid, memory, name ] = s.split(' ')
    return { pid, memory, name }
}

/** @type {String -> String} */
const stripExtraWhitespace = str => str.trim().replace(/\s+/g, ' ')

/**
 * @private
 * @param {String} string - The input of the CLI command.
 * @returns {[Object]} processes - An array of the computer's current running processes as objects.
 */
const _getProcesses = str => str
    .split(os.EOL)
    .map(stripExtraWhitespace)
    .filter(Boolean)
    .map(makeProcessObjFromStr)


/**
 * This is the important export.
 * @returns {[Object]} processes - Retrieved synchronously.
 */
export const getProcessesSync = () =>
    _getProcesses(cp.execSync('ps -axco pid=,rss=,command=', { encoding: 'utf8' }))


/** @type {String -> Object} */
const makeDetailedProcessObjFromStr = str => {
    str = stripExtraWhitespace(str)
    const [ percentCPU, percentMemory, memory, runningTime, parentPID, user, status ] = str.split(' ')
    return { percentCPU, percentMemory, memory, runningTime, parentPID, user, status }
}
/**
 * %cpu: percantage cpu usage
 * %mem: percentage memory usage
 * rss: memory (?)
 * etime: elapsed running time
 * ppid: parent process id
 *     - if this exists, use this pid value to show a button
 *     - which will display a full card (router view) of the
 *     - process with this id.
 * user: who started this process
 * stat: if includes "S", then is display: `status: sleeping`
 *
 * Additional:
 * - How many processes of this name
 *     - if not singular process, display %cpu, %mem, and rss for
 *       the summated process.
 *
 * @param {String} pid - The process ID of some process object.
 * @returns {Object} - An enhanced process object with more properties.
 */
export const getDetailedProcessObj = pid => {
    const commandOutputStr = cp.execSync(`ps -p ${pid} -cxo pid=,rss=,command=,%cpu=,%mem=,etime=,ppid=,user=,stat=`, { encoding: 'utf8' })
    return makeDetailedProcessObjFromStr(commandOutputStr)
}
