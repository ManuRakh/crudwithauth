var chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
require('dotenv').config();
const search_note = 2
describe("GET SINGLE NOTE /api/user/notes/:id", async () => {
    it("user should be able get single note without authorization", (done)=>{
            chai.request(server)
            .get(`/api/user/notes/${search_note}`)
            .end((err, res) =>{
                res.should.have.status(200)
                res.body.should.be.a('object');
                done();
        })
    })
})
const server = require("../server")