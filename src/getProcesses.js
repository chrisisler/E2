import cp from 'child_process'
import os from 'os'

const makeProcessObjFromStr = s => {
  const [ pid, memory, name ] = s.split(' ')
  return { pid, memory, name }
}

const stripExtraWhitespace = s => s.trim().replace(/\s+/g, ' ')

const getProcesses = string => string
  .split(os.EOL)
  .map(stripExtraWhitespace)
  .filter(Boolean)
  .map(makeProcessObjFromStr)

const makeDetailedProcessObjFromStr = s => {
  s = stripExtraWhitespace(s)
  const [ percentCPU, percentMemory, memory, runningTime, parentPID, user, status ] = s.split(' ')
  return { percentCPU, percentMemory, memory, runningTime, parentPID, user, status }
}

export const getProcessesSync = () => {
  const processes = cp.execSync('ps -axco pid=,rss=,command=', { encoding: 'utf8' })
  return getProcesses(processes)
}

/**
export async function() {
  const processes = await cp.execSync('ps -axco pid=,rss=,command=', { encoding: 'utf8' })
  return getProcesses(processes)
}
*/

/**
 * %cpu: percantage cpu usage
 * %mem: percentage memory usage
 * rss:
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
 */
/** @type {String -> Object} */
export const getDetailedProcessObj = pid => {
  const cmdOutputStr = cp.execSync(`ps -p ${pid} -cxo %cpu=,%mem=,rss=,etime=,ppid=,user=,stat=`, { encoding: 'utf8' })
  return makeDetailedProcessObjFromStr(cmdOutputStr)
}
