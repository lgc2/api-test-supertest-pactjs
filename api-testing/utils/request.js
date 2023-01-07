const req = require('supertest')
const API_URL = process.env.API_URL

let getAccessToken = (user, pass) => {
    return req('http://localhost:3000/api')
        .post('/login')
        .send({
            "username": user,
            "password": pass
        })
        .set('Accept', 'application/json')
        .then(response => {
            return response.body.accessToken
        })
}

let postAddress = (token, address1, address2, city, state, zip) => {
    return req(API_URL)
        .post('/addresses')
        .send({
            "address_1": address1,
            "address_2": address2,
            "city": city,
            "state": state,
            "zip": zip
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
            return response.body.id
        })
}

module.exports = { getAccessToken, postAddress }