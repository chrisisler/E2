// Individual reducers may need access to each other.
// If so, all state updates are batched together.
// See the `rightClickProcess` reducer for an example.

export default {
    clearFilter: require('./clearFilter').default
    , closeActionsMenu: require('./closeActionsMenu').default
    , killProcesses: require('./killProcesses').default
    , leftClickProcess: require('./leftClickProcess').default
    , markProcesses: require('./markProcesses').default
    , refreshProcesses: require('./refreshProcesses').default
    , renameProcess: require('./renameProcess').default
    , rightClickProcess: require('./rightClickProcess').default
    , searchProcesses: require('./searchProcesses').default
    , showNotification: require('./showNotification').default
    , sortProcesses: require('./sortProcesses').default
    , updateProcesses: require('./updateProcesses').default
}
