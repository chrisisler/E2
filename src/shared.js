exports.PROCESS_KEYS = [ 'pid', 'memory', 'name' ]

exports.pipe = (...[f1, ...fns]) => (...args) => fns.reduce((x, f) => f(x), f1(...args))
