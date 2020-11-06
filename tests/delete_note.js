var chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

const random_word = require("./services/random_words")
require('dotenv').config();
const config = require("./config_files/config")
const send_object = config
let access_token = ""
describe("DELETE NOTE /api/user/notes/:id", async () => {
    it("user should be able to delete note", (done)=>{
        chai.request(server)
        .post("/api/auth/signin")
        .send(send_object)
        .end((err, res) =>{
            res.should.have.status(200)
            access_token = res.body.accessToken
            chai.request(server)
            .delete("/api/user/notes/1")
            .set({ "x-access-token": `${access_token}` })
            .end((err, res) =>{
                res.should.have.status(200)
                done();
            })
        })
    })
})
const server = require("../server")