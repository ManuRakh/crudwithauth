var chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
const random_word = require("./services/random_words")
const name = random_word(10)
const password = random_word(10)
const email = random_word(10)+"@gmail.com"
const send_object = require("./config_files/config")
let access_token = ""
describe("/api/auth/signup", async () => {
  it('user should be able to sign up himself.',  (done) => {
    // let result = await api_call("", JSON.stringify({username:name, password:password, email:email}), signup_url, "POST" )
    console.log(send_object)
    chai.request(server)
    .post("/api/auth/signup")
    .send(send_object)
    .end((err, res) =>{
        res.should.have.status(200)
        res.body.should.be.a('object');
        done();
    })
    
  });
});
describe("/api/auth/signin", async () => {
    it("user should be able to sign in and take a token", (done)=>{
        chai.request(server)
        .post("/api/auth/signin")
        .send(send_object)
        .end((err, res) =>{
            res.should.have.status(200)
            access_token = res.body.accessToken
            done();
        })
    })
})
const server = require("../server")
