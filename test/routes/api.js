process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
let should = chai.should();

chai.use(chaiHttp);

describe('API', () => {
    describe('POST /api/install', () => {
        it('it should install the schema structure', (done) => {
            chai.request(app)
                .post('/install')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
