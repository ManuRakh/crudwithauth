var chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

const random_word = require("./services/random_words")
require('dotenv').config();
const config = require("./config_files/config")
const send_object = config
let access_token = ""
describe("/api/user/notes", async () => {
    it("user should be able get all his own notes", (done)=>{
        chai.request(server)
        .post("/api/auth/signin")
        .send(send_object)
        .end((err, res) =>{
            res.should.have.status(200)
            access_token = res.body.accessToken
            chai.request(server)
            .get("/api/user/notes")
            .set({ "x-access-token": `${access_token}` })
            .end((err, res) =>{
                res.should.have.status(200)
                res.body.should.be.a('Array');
                done();
            })
        })
    })
})
const server = require("../server")