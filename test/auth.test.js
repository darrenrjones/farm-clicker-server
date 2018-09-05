'use strict';
require('dotenv').config();

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {TEST_DATABASE_URL} = require('../config');

let jwtDecode = require('jwt-decode');

const expect = chai.expect;
chai.use(chaiHttp);

const User = require('../models/user');


describe('User', () => {
  const username = 'testuser';
  const password = 'abc12345';
  const farmname = 'testuser Farm';
  const badUsername = 'tstsuer';

  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    return User.createIndexes();
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('POST api/login', () => {
    
    it('should login with valid credentials', () => {
      return chai
        .request(app)
        .post('/api/register')
        .send({ username, password, farmname })
        .then(() => {
          return chai
            .request(app)
            .post('/api/login')
            .send({ username, password})
            })
          .then((res) => {
            let decoded = jwtDecode(res.body.authToken);
            expect(decoded.user.username).to.equal(username);
            expect(decoded.user.farmname).to.equal(farmname);
          });
    });

    it('should give error if logging in with invalid username', () => {
      return chai
        .request(app)
        .post('/api/register')
        .send({ username, password, farmname })
        .then(() => {
          return chai
            .request(app)
            .post('/api/login')
            .send({ badUsername, password})
            })
          .catch(err => {
            console.log(err)
            expect(err.response.body.status).to.have.status(401);
          })
    });
    

  })
  





})
