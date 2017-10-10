/**
 * TODO
 * - Write `getProcessesAsync` (for the "refresh processes" feature).
 *   - Use async/await for `getProcessesAsync`.
 */

import cp from 'child_process'
import os from 'os'

/** @type {() -> Boolean} */
// const isWindows = () => process.platform.startsWith('win')

export const PROCESS_KEYS = {
    name: 'name'
    , pid: 'pid'
    , memory: 'memory'

    // Properties for  "detailed" processes, with more keys/info.
    , percentCPU: 'percentCPU' 
    // etc...
}

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
 * rss: memory
 * etime: elapsed running time
 * ppid: parent process id
 *     - If ppid exists, render button linking to Details view of that pid proc
 * user: who started this process
 * stat: if includes "S", then is display: `status: sleeping`
 *
 * Additional:
 * - How many processes of this name
 *     - if not singular process, display %cpu, %mem, and rss for the summated process.
 *
 * @param {String} pid - The process ID of some process object.
 * @returns {Object} - An enhanced process object with more properties.
 */
export const getDetailedProcessObj = pid => {
    const commandOutputStr = cp.execSync(`ps -p ${pid} -cxo pid=,rss=,command=,%cpu=,%mem=,etime=,ppid=,user=,stat=`, { encoding: 'utf8' })
    return makeDetailedProcessObjFromStr(commandOutputStr)
}

/**
 * Maps a process id String|Number to a Promise (to kill that object).
 *
 * @param {String|Number} pid - The process ID
 * @param {String|Number} signal - signal to send to the process obj with given `pid`.
 * @returns {Promise<Boolean|Undefined>} - `then` arg is `true` if kill succeeded, `undefined` otherwise.
 */
export const killProcess = (pid, signal = 'SIGTERM') =>
    Promise.resolve().then(() => {
        try {
            // https://nodejs.org/api/process.html#process_process_kill_pid_signal
            /** @returns {Boolean|Undefined} - true if successfull kill, undefined otherwise. */
            return process.kill(pid, signal)
        } catch (err) {
            // if (err.code !== 'ESRCH') throw err // ESRCH: No process or process group can be found corresponding to that specified by pid.
            throw err
        }
    })

/**
 * TODO
 *
 * @param {String|Number} memory
 * @returns {String} - Memory as a percentage of total.
 */
export const asPercentage = memory => {}
