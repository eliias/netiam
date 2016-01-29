import _ from 'lodash'
import Promise from 'bluebird'

export default function({plugins = {}} = {}) {

  const stack = []

  const dispatcher = (req, res) => {
    return Promise
      .each(stack, call => call(req, res))
      .catch(err => {
        if (err.nonce) {
          return
        }

        res
          .status(err.status || 500)
          .json(err && _.isFunction(err.toJSON) ? err.toJSON() : err)
      })
  }

  function registerPlugin(plugin) {
    if (_.isFunction(plugin)) {
      return (...spec) => {
        stack.push(plugin(...spec))
        return dispatcher
      }
    }

    if (_.isObject(plugin)) {
      const container = {}
      _.forEach(plugin, (name, key) => {
        container[key] = (...spec) => {
          stack.push(name(...spec))
          return dispatcher
        }
      })

      return container
    }

    throw new Error(`The provided plugin has invalid type "${typeof plugin}"`)
  }

  // plugins
  function plugin(name, plugin) {
    if (dispatcher.hasOwnProperty(name)) {
      throw new Error(`The plugin with name ${name} is already registered or would overwrite a builtin method.`)
    }
    Object.defineProperty(dispatcher, name, {
      value: registerPlugin(plugin)
    })

    return dispatcher
  }

  Object.defineProperty(dispatcher, 'plugin', {
    value: plugin
  })

  _.forEach(plugins, (fn, name) => plugin(name, fn))

  return dispatcher
}
