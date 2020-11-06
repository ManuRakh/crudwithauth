var axios = require('axios');

const api_call = async (token, data, url, method) => {
    var config = {
    method: method,
    url: url,
    headers: { 
        'x-access-token': token, 
        'Content-Type': 'application/json'
    },
    data : data
    };
    console.log(config)
    let result = await axios(config)
    return result.data
}
module.exports = api_call