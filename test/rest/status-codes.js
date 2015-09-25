import request from 'supertest'
import db,{teardown} from '../utils/db.test'
import routes from '../utils/routes'
import userFixture from '../fixtures/user.json'

describe('REST', function() {
  const app = require('../utils/app.test')()

  before(() => {
    routes.users(app)
    routes.resources(app)
  })
  after(teardown)

  describe('Status Codes', () => {

    it('should fail creating a user', done => {
      const invalidUser = Object.assign(
        {},
        userFixture,
        {email: 'wrong@user'})

      request(app)
        .post('/users')
        .send(invalidUser)
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done)
    })

    it('should deny permission to delete resource', done => {
      request(app)
        .delete('/resource')
        .set('Accept', 'application/json')
        .expect(403)
        .expect('Content-Type', /json/)
        .end(done)
    })

  })
})
