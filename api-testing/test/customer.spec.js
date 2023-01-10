const req = require('supertest');
const { getAccessToken, postAddress } = require('../utils/request');
const API_URL = process.env.API_URL

describe('Customers Resource', () => {
    let token
    let customerId

    const address1 = `Vancouver Street, ${Math.floor(Math.random() * 10000)}`
    const address2 = `Toronto Street, ${Math.floor(Math.random() * 10000)}`
    const city = "Vancouver"
    const state = "Britsh Columbia"
    const zip = Math.floor(Math.random() * 100)

    const email = `lg.c${Math.floor(Math.random() * 10000)}@test.com`
    const firstname = `${Math.floor(Math.random() * 10000)} - lg`
    const lastname = `${Math.floor(Math.random() * 10000)} - cc`
    const phone = `${Math.floor(Math.random() * 10000)}`

    beforeAll(async () => {
        token = await getAccessToken("admin", "admin")
    })

    it('(E2E) should register an customer', async () => {
        const adressId = await postAddress(token, address1, address2, city, state, zip)

        await req(API_URL)
            .post('/customers')
            .send({
                "address": {
                    "id": adressId
                },
                "email": email,
                "firstName": firstname,
                "lastName": lastname,
                "phone": phone
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                customerId = response.body.id

                expect(response.statusCode).toEqual(201)
                expect(response.body).toBeInstanceOf(Object)

                expect(response.body.email).toEqual(email)
                expect(response.body.firstName).toEqual(firstname)
                expect(response.body.lastName).toEqual(lastname)
                expect(response.body.phone).toEqual(phone)
            })
    })

    // it('skip', () => {
    //     console.log(token)
    // });

})