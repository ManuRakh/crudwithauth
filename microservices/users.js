const MicroMQ = require('micromq');
const jwt = require("jsonwebtoken");
const config = require("../app/config/auth.config.js");

const app = new MicroMQ({
  name: 'users',
  rabbit: {
    url: "amqp://guest:guest@localhost:5672",
  },
});

app.get('/info', async (req, res) => {
  const token = req.headers["x-access-token"];
  const info = await decode_jwt(token)  
  res.json({message:"MQ works!", user_info:info});
});

app.get('/status',async (req, res) => {
  const token = req.headers["x-access-token"];
  const info = await decode_jwt(token)
  let is_authorized = true
  if(info.exp-info.iat<=0) is_authorized=false
  res.json({
    status: info,
    is_authorized:is_authorized
  });
});

app.start();
async function decode_jwt(token){//функция для распарсивания JWT токена и вытаскивания оттуда user id
    let user_info = null
    await new Promise((res)=>{
        jwt.verify(token, config.secret, (err, decoded) => {
          user_info = decoded;
        if(!err) res()
    });
    })
    return user_info 
}