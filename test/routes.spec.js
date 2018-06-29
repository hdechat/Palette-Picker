process.env.NODE_ENV = 'test'

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const configuration = require('../knexfile')['test'];
const knex = require('knex')(configuration);

describe('Client Routes', () => {

  before(() => knex.migrate.latest());
  beforeEach(() => knex.seed.run());

  it('should receive landing page with the root endpoint', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.be.html;
      done();
    });
  });

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
    .get('/sadpath')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {

  before(() => knex.migrate.latest());
  beforeEach(() => knex.seed.run());

  describe('GET /api/v1/projects', () => {
    it('should return an array of project objects', done => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('ProjectAlpha');
        response.body[0].should.have.property('id');
        response.body[0].id.should.be.a('number');
        done();
      });
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return an array of palette objects', done => {
      chai.request(server)
      .get('/api/v1/palettes')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('spring');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.be.a('number')
        response.body[0].should.have.property('color1');
        response.body[0].color1.should.equal('#00A68C');
        response.body[0].should.have.property('color2');
        response.body[0].color2.should.equal('#E34132');
        response.body[0].should.have.property('color3');
        response.body[0].color3.should.equal('#645394');
        response.body[0].should.have.property('color4');
        response.body[0].color4.should.equal('#6CAODC');
        response.body[0].should.have.property('color5');
        response.body[0].color5.should.equal('#ECDB54');
        done();
      });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({ name: 'ProjectBeta'})

      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.be.a('number');
        done();
      });
    });

    it('should not create a project with missing data', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({})

      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format: { name: <String> }. You're missing a name property.`)
      });
      done();
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should create a new palette', done => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        name: 'earthy',
        color1: '#A7E9F3',
        color2: '#B7E9F3',
        color3: '#C7E9F3',
        color4: '#D7E9F3',
        color5: '#E7E9F3',
        project_id: null
      })

      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.be.a('number');
        done();
      });
    });

    it('should not create a palette with missing information', done => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        color1: '#A7E9F3',
        color2: '#B7E9F3',
        color3: '#C7E9F3',
        color4: '#D7E9F3',
        color5: '#E7E9F3',
        project_id: null
      })

      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format 
          { 
            name: <String>, 
            color1: <String>, 
            color2: <String>, 
            color3: <String>, 
            color4: <String>, 
            color5: <String>
          }. You're missing a "name" property.`)
        done();
      });
    });
  });

  //THESE WORK ONLY IF THEY ARE AT THE VERY END OF THE CODE. OTHERWISE THEY RETURN A STATUS 500

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return the palettes of the project with the given endpoint id', done => {
      let id;

      chai.request(server)
      .get('/api/v1/projects')
      .end((err, response) => {
        id = response.body[0].id;
        done();
      });

      chai.request(server)
      .get(`/api/v1/projects/${id}/palettes`)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.propery('name');
        response.body[0].name.should.equal('spring');
        done();
      });
    });
  });

  // describe('GET /api/v1/projects/:id', () => {
  //   it('should return the project with the id given in the endpoint', done => {
  //     let endpoint;

  //     chai.request(server)
  //     .get('/api/v1/projects')
  //     .end((err, response) => {
  //       endpoint = response.body[0].id;
  //       done();
  //     });

  //     chai.request(server)
  //     .get(`/api/v1/projects/${endpoint}`)
  //     .end((err, response) => {
  //       response.should.have.status(200);
  //       done();
  //     });
  //   });
  // });

  // describe('GET /api/v1/palettes/:id', () => {
  //   it('should return the palette with the id given in the endpoint', done => {
  //     let endpoint;

  //     chai.request(server)
  //     .get('/api/v1/palettes')
  //     .end((err, response) => {
  //       endpoint = response.body[0].id;
  //       done();
  //     });

  //     chai.request(server)
  //     .get(`/api/v1/palettes/${endpoint}`)
  //     .end((err, response) => {
  //       response.should.have.status(200);
  //     });
  //   });
  // });

  // describe('DELETE /api/v1/projects/:id', () => {
  //   it('should delete the project with the id given in the endpoint', done => {
  //     let endpoint;

  //     chai.request(server)
  //     .get('/api/v1/projects')
  //     .end((err, response) => {
  //       endpoint = response.body[0].id;
  //       done();
  //     });

  //     chai.request(server)
  //     .get(`/api/v1/projects/${endpoint}`)
  //     .end((err, response) => {
  //       response.should.have.status(204);
  //       done();
  //     });
  //   });
  // });

  // describe('DELETE /api/v1/palettes/:id', () => {
  //   it('should delete the palette with the id given in the endpoint', done => {
  //     let endpoint;

  //     chai.request(server)
  //     .get('/api/v1/palettes')
  //     .end((err, response) => {
  //       endpoint = response.body[0].id;
  //       done();
  //     });

  //     chai.request(server)
  //     .get(`/api/v1/palettes/${endpoint}`)
  //     .end((err, response) => {
  //       response.should.have.status(204);
  //       done();
  //     });
  //   });
  // });

});
