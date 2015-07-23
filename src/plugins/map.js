import _ from 'lodash'

function request() {
  return function() {
    throw new Error('rest.map.req is not implemented')
  }
}

function response(map, spec = {}) {
  const {expand} = spec

  function mapFields(document, map) {
    const doc = {}

    if (_.isFunction(document.toObject)) {
      document = document.toObject()
    }

    _.forEach(document, function(val, key) {
      key = map[key] || key
      doc[key] = val
    })

    // expand
    _.forEach(expand, function(map, path) {
      if (_.isArray(doc[path])) {
        doc[path] = _.map(doc[path], function(document) {
          return mapFields(document, map)
        })
        return
      }

      if (_.isObject(doc[path])) {
        doc[path] = mapFields(doc[path], map)
      }
    })

    return doc
  }

  return function(req, res) {
    if (_.isArray(res.body)) {
      res.body = _.map(res.body, function(document) {
        return mapFields(document, map)
      })
      return
    }

    if (_.isObject(res.body)) {
      res.body = mapFields(res.body, map)
    }
  }

}

export default Object.freeze({
  req: request,
  res: response
})
