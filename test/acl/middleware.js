import path from 'path'
import request from 'supertest'
import User from '../models/user'
import api from '../../src/netiam'
import loader from '../../src/acl/loader/file'
import roles from '../../src/rest/roles'
import db from '../utils/db.test'
import rolesFixture from '../utils/roles'
import userFixture from '../fixtures/user.json'

const userAcl = loader({path: path.join(__dirname, '../fixtures/acl.json')})

describe('ACL', function() {
  const app = require('../utils/app.test')({port: 3001})

  this.timeout(10000)

  before(function(done) {

    app.post(
      '/users',
      api()
        .rest({collection: User})
        .map.res({_id: 'id'})
        .json()
    )

    app.get(
      '/users/:id',
      api()
        .rest({collection: User})
        .map.res({_id: 'id'})
        .acl.res({
          collection: User,
          acl: userAcl
        })
        .json()
    )

    app.get(
      '/auth-users/:id',
      api()
        .auth({collection: User})
        .rest({collection: User})
        .map.res({_id: 'id'})
        .acl.res({
          collection: User,
          acl: userAcl
        })
        .json()
    )

    db.connection.db.dropDatabase(function(err) {
      if (err) {
        return done(err)
      }

      rolesFixture(function(err) {
        if (err) {
          return done(err)
        }

        roles.load(function(err) {
          done(err)
        })
      })
    })

  })

  after(function(done) {
    db.connection.db.dropDatabase(function(err) {
      if (err) {
        return done(err)
      }
      done()
    })
  })

  describe('middleware', function() {
    let userId

    it('should create a user', function(done) {
      request(app)
        .post('/users')
        .send(userFixture)
        .set('Accept', 'application/json')
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err)
          }

          res.body.should.have.properties({
            'name': 'eliias',
            'description': 'Hey, ich bin der Hannes.',
            'email': 'hannes@impossiblearts.com',
            'firstname': 'Hannes',
            'lastname': 'Moser',
            'location': [
              13.0406998,
              47.822352
            ]
          })

          userId = res.body.id

          done()
        })
    })

    it('should get a user', function(done) {
      request(app)
        .get('/users/' + userId)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err)
          }

          res.body.should.not.have.property('password')

          done()
        })
    })

    it('should get an authenticated user', function(done) {
      request(app)
        .get('/auth-users/' + userId)
        .auth(userFixture.email, userFixture.password)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err)
          }

          res.body.should.not.have.property('password')

          done()
        })
    })

    it('should deny access to user document', function(done) {
      request(app)
        .get('/auth-users/' + userId)
        .set('Accept', 'application/json')
        .expect(401)
        .expect('Content-Type', /json/)
        .end(function(err) {
          if (err) {
            return done(err)
          }

          done()
        })
    })

  })

})