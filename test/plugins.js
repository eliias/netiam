import netiam from '../src/netiam'
import Promise from 'bluebird'

function plugin() {
  return function() {
    return Promise.resolve()
  }
}

describe('netiam', () => {
  describe('plugins', () => {

    it('should register plugin', done => {
      const api = netiam()
      api.plugin('test', plugin)
      api
        .test()
        .call()
        .then(() => done())
        .catch(done)
    })

    it('should throw error on plugin registration', () => {
      const api = netiam()
      api.plugin('test', plugin);
      (function() {
        api.plugin('test', plugin)
      }).should.throw();

      (function() {
        api.plugin('plugin', plugin)
      }).should.throw()
    })

  })
})
