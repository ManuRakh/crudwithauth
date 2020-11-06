var chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
require('dotenv').config();
const config = require("./config_files/config")
const test_datas = require("./config_files/test_datas")
const send_object = config
let access_token = ""
describe("INSERT NOTE /api/user/notes", async () => {
    it("user should be able to INSERT A NEW NOTE", (done)=>{
        chai.request(server)
        .post("/api/auth/signin")
        .send(send_object)
        .end((err, res) =>{
            res.should.have.status(200)
            access_token = res.body.accessToken
            console.log(access_token)
            chai.request(server)
            .post("/api/user/notes")
            .set({ "x-access-token": `${access_token}` })
            .send(test_datas)
            .end((err, res) =>{
                res.should.have.status(200)
                done();
            })
        })
    })
})
const server = require("../server")