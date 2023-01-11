const req = require('supertest');
const { getAccessToken, postAddress, postCostumer } = require('../utils/request');
const API_URL = process.env.API_URL

describe('Customers Resource', () => {
    let token

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

    it('(Healthcheck) should list customers', async () => {
        const adressId = await postAddress(token, address1, address2, city, state, zip)
        const customerId = await postCostumer(token, adressId, email, firstname, lastname, phone)

        await req(API_URL)
            .get('/customers')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Array)
                expect(JSON.stringify(response.body)).toContain(customerId)
            })
    })

    it('(E2E) should list specific customer', async () => {
        const adressId = await postAddress(token, address1, address2, city, state, zip)
        const customerId = await postCostumer(token, adressId, email, firstname, lastname, phone)

        await req(API_URL)
            .get(`/customers/${customerId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {

                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.address.id).toEqual(adressId)
                expect(response.body.id).toEqual(customerId)
                expect(response.body.email).toEqual(email)
                expect(response.body.firstName).toEqual(firstname)
                expect(response.body.lastName).toEqual(lastname)
                expect(response.body.phone).toEqual(phone)

            })
    })

    it('(E2E) should edit a customer', async () => {
        const adressId = await postAddress(token, address1, address2, city, state, zip)
        const customerId = await postCostumer(token, adressId, email, firstname, lastname, phone)

        await req(API_URL)
            .patch(`/customers/${customerId}`)
            .send({
                "address": {
                    "id": adressId
                },
                "email": email,
                "firstName": `Editado - ${firstname}`,
                "lastName": `Editado - ${lastname}`,
                "phone": phone
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(response => {

                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.address.id).toEqual(adressId)
                expect(response.body.id).toEqual(customerId)
                expect(response.body.email).toEqual(email)
                expect(response.body.firstName).toEqual(`Editado - ${firstname}`)
                expect(response.body.lastName).toEqual(`Editado - ${lastname}`)
                expect(response.body.phone).toEqual(phone)
            })
    })

    it('(E2E) should remove a customer', async () => {
        const adressId = await postAddress(token, address1, address2, city, state, zip)
        const customerId = await postCostumer(token, adressId, email, firstname, lastname, phone)

        await req(API_URL)
            .delete(`/customers/${customerId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {

                expect(response.statusCode).toEqual(200)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.address.id).toEqual(adressId)
                expect(response.body.id).toEqual(customerId)
                expect(response.body.email).toEqual(email)
                expect(response.body.firstName).toEqual(firstname)
                expect(response.body.lastName).toEqual(lastname)
                expect(response.body.phone).toEqual(phone)
            })

        await req(API_URL)
            .get(`/customers/${customerId}`)
            .set('Authorization', `Bearer ${token}`)
            .then(response => {
                expect(response.statusCode).toEqual(404)
                expect(response.body).toBeInstanceOf(Object)
                expect(response.body.message).toEqual(`No resource was found for {\"id\":\"${customerId}\"}`)
            })
    })
})