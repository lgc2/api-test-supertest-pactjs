const req = require('supertest');
const { getAccessToken } = require('../utils/request');
const API_URL = process.env.API_URL

describe('Addresses Resource', () => {
    let token
    let addressId

    const address1 = `Vancouver Street, ${Math.floor(Math.random() * 10000)}`
    const address2 = `Toronto Street, ${Math.floor(Math.random() * 10000)}`
    const city = "Vancouver"
    const state = "Britsh Columbia"
    const zip = Math.floor(Math.random() * 100)

    beforeAll(async () => {
        token = await getAccessToken("admin", "admin")
    })

    it('(E2E) should register an addres', async () => {

        await req(API_URL)
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
                addressId = response.body.id

                expect(response.statusCode).toEqual(201)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.address_1).toEqual(address1)
                expect(response.body.address_2).toEqual(address2)
                expect(response.body.city).toEqual(city)
                expect(response.body.state).toEqual(state)
                expect(response.body.zip).toEqual(zip)
            })
    })

    it('(E2E) should list all addresses', async () => {

        await req(API_URL)
            .get('/addresses')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Array)
            })
    })

    it('(E2E) should list specific address', async () => {

        await req(API_URL)
            .get(`/addresses/${addressId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {

                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.id).toEqual(addressId)
                expect(response.body.address_1).toEqual(address1)
                expect(response.body.address_2).toEqual(address2)
                expect(response.body.city).toEqual(city)
                expect(response.body.state).toEqual(state)
                expect(response.body.zip).toEqual(zip)

            })
    })

    // it('show addresId', () => {
    //     console.log(addresId)
    // })



})