import { exec, execSync } from 'child_process'
import { EOL } from 'os'

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
    .split(EOL)
    .map(stripExtraWhitespace)
    .filter(Boolean)
    .map(makeProcessObjFromStr)

const command = 'ps -axco pid=,rss=,command='
const options = { encoding: 'utf8' }

/**
 * This is the important export.
 * @returns {[Object]} processes - Retrieved synchronously.
 */
export const getProcessesSync = () =>
    _getProcesses(execSync(command, options))

/**
 * @see getProcessesSync For the sync version.
 * @returns {Promise<Array[Object]>} - Array of process objects retrieved asynchronously.
 */
export const getProcessesAsync = () =>
    new Promise((resolve, reject) => {
        /* eslint-disable no-unused-vars */
        exec(command, options, (err, stdout, stderr) => {
            if (err) reject(err)
            resolve(stdout)
        })
    }).then(processesCsv => _getProcesses(processesCsv))


/**
 * @private
 * @param {String} str
 * @returns {Object} - Detailed process Object.
 */
const _makeDetailedProcessObjFromStr = str => {
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
 * @todo make async?
 * @param {String} pid - The process ID of some process object.
 * @returns {Object} - An enhanced process object with more properties.
 */
export const getDetailedProcessObj = pid =>
    _makeDetailedProcessObjFromStr(execSync(`ps -p ${pid} -cxo pid=,rss=,command=,%cpu=,%mem=,etime=,ppid=,user=,stat=`, options))

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
            return process.kill(Number(pid), signal)
        } catch (err) {
            // if (err.code !== 'ESRCH') throw err // ESRCH: No process or process group can be found corresponding to that specified by pid.
            throw err
        }
    })

/**
 * @param {String|Number} memory
 * @returns {String} - Memory as a percentage of total.
 */
export const getMemoryPercent = pid => execSync(`ps -p ${pid} -cxo %mem=`, options)
