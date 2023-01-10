const req = require('supertest');
const { getAccessToken, postAddress } = require('../utils/request');
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

        const getAdressId = await postAddress(token, address1, address2, city, state, zip)

        await req(API_URL)
            .get(`/addresses/${getAdressId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {

                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.id).toEqual(getAdressId)
                expect(response.body.address_1).toEqual(address1)
                expect(response.body.address_2).toEqual(address2)
                expect(response.body.city).toEqual(city)
                expect(response.body.state).toEqual(state)
                expect(response.body.zip).toEqual(zip)

            })
    })

    it('(E2E) should edit an address', async () => {

        const getAdressId = await postAddress(token, address1, address2, city, state, zip)

        await req(API_URL)
            .patch(`/addresses/${getAdressId}`)
            .send({
                "address_1": `Editado - ${address1}`,
                "address_2": `Editado - ${address2}`,
                "city": city,
                "state": state,
                "zip": zip
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {

                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.id).toEqual(getAdressId)
                expect(response.body.address_1).toEqual(`Editado - ${address1}`)
                expect(response.body.address_2).toEqual(`Editado - ${address2}`)
                expect(response.body.city).toEqual(city)
                expect(response.body.state).toEqual(state)
                expect(response.body.zip).toEqual(zip)

            })
    })

    it('(E2E) should remove an address', async () => {

        const getAdressId = await postAddress(token, address1, address2, city, state, zip)

        await req(API_URL)
            .delete(`/addresses/${getAdressId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {

                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.id).toEqual(getAdressId)
                expect(response.body.address_1).toEqual(address1)
                expect(response.body.address_2).toEqual(address2)
                expect(response.body.city).toEqual(city)
                expect(response.body.state).toEqual(state)
                expect(response.body.zip).toEqual(zip)
            })

        await req(API_URL)
            .get(`/addresses/${getAdressId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(404)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.message).toEqual(`No resource was found for {\"id\":\"${getAdressId}\"}`)
            })
    })
})