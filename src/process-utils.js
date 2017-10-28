import { exec, execSync } from 'child_process'
import { EOL, totalmem as totalMemoryInBytes } from 'os'

const totalMemoryInKilobytes = totalMemoryInBytes() / 1024
const windowsCommand = 'tasklist /fo csv /nh' // format: csv. no headers.
const macOsCommand = 'ps -axco pid=,rss=,command='
const options = { encoding: 'utf8' }

/**
 * Attempting to cache the result in a closure.
 * @type {() -> Boolean}
 */
const isWindows = (() => {
    let cache = {}
    return () =>
        'platformIsWindows' in cache
            ? cache.platformIsWindows
            : cache.platformIsWindows = process.platform.startsWith('win')
})()

/** @type {String -> String} */
const stripExtraWhitespace = str => str.trim().replace(/\s+/g, ' ')

/**
 * @private
 * @param {String} csv - The comma separated list from the terminal output
 * @returns {[Object]} processes - An array of the computer's current running processes as objects.
 */
const _getProcessesWindows = csv => csv
    .split(EOL)
    .map(line => {
        // split by comma, excluding `memory`
        const lineParts = JSON.parse(`[${line.trim()}]`)

        const [ name, pid, , , memory ] = lineParts
        return { name, pid, memory }
    })

/**
 * @private
 * @param {String} string - The input of the CLI command.
 * @returns {[Object]} processes - An array of the computer's current running processes as objects.
 */
const _getProcessesMacOs = csv => csv
    .split(EOL)
    .map(stripExtraWhitespace)
    .filter(Boolean)
    .map(s => {
        const [ pid, memory, name ] = s.split(' ')
        return { pid, memory, name }
    })

/**
 * This is the important export.
 * @returns {[Object]} processes - Retrieved synchronously.
 */
export const getProcessesSync = () =>
    isWindows()
        ? _getProcessesWindows(execSync(windowsCommand, options))
        : _getProcessesMacOs(execSync(macOsCommand, options))

/**
 * @todo make Windows equivalent
 * @see getProcessesSync For the sync version.
 * @returns {Promise<Array[Object]>} - Array of process objects retrieved asynchronously.
 */
export const getProcessesAsync = () =>
    new Promise((resolve, reject) => {
        const command = isWindows() ? windowsCommand : macOsCommand
        /* eslint-disable no-unused-vars */
        exec(command, options, (err, stdout, stderr) => {
            if (err) reject(err)
            resolve(stdout)
        })
    }).then(processesCsv => getProcessesSync(processesCsv))


/**
 * @private
 * @param {String} str
 * @returns {Object} - Detailed process Object.
 */
// const _makeDetailedProcessObjFromStr = str => {
//     str = stripExtraWhitespace(str)
//     const [ percentCPU, percentMemory, memory, runningTime, parentPID, user, status ] = str.split(' ')
//     return { percentCPU, percentMemory, memory, runningTime, parentPID, user, status }
// }

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
 * - How many processes of this name
 *     - if not singular process, display %cpu, %mem, and rss for the summated process.
 *
 * @todo make Windows equivalent
 * @todo make async?
 * @param {String} pid - The process ID of some process object.
 * @returns {Object} - An enhanced process object with more properties.
 */
// export const getDetailedProcessObj = pid =>
//     _makeDetailedProcessObjFromStr(execSync(`ps -p ${pid} -cxo pid=,rss=,command=,%cpu=,%mem=,etime=,ppid=,user=,stat=`, options))

/**
 * Maps a process id String|Number to a Promise (to kill that object).
 *
 * @see https://nodejs.org/api/process.html#process_process_kill_pid_signal
 * @param {String|Number} pid - The process ID
 * @param {String|Number} signal - signal to send to the process obj with given `pid`.
 * @returns {Promise<Boolean|Undefined>} - `then` arg is `true` if kill succeeded, `undefined` otherwise.
 */
export const killProcess = (pid, signal = 'SIGTERM') =>
    Promise.resolve().then(() => {
        try {
            return process.kill(Number(pid), signal)
        } catch (err) {
            throw err
        }
    })

/**
 * @todo make it work
 * @param {String|Number} memoryInKilobytes - The `memory` value of some proc Obj.
 * @returns {String} - Memory as a percentage of total.
 */
export const getMemoryPercent = memoryInKilobytes =>
    ((memoryInKilobytes / totalMemoryInKilobytes) * 100).toFixed(1) + '%'
