import 'dotenv/config'

import { Pact } from "@pact-foundation/pact"
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers'
import { userList } from '../request/user.request'
import { addressesList } from '../request/addresses.request'

const mockProvider = new Pact({
    consumer: 'ebac-demo-store-admin',
    provider: 'ebac-demo-store-server',
    port: parseInt(process.env.MOCK_PORT),
    log: resolve(process.cwd(), 'logs', 'pact.log'),
    dir: resolve(process.cwd(), 'pacts', 'pact1.json')
})

const mockProvider2 = new Pact({
    consumer: 'ebac-demo-store-admin-2',
    provider: 'ebac-demo-store-server-2',
    port: 4433,
    log: resolve(process.cwd(), 'logs', 'pact2.log'),
    dir: resolve(process.cwd(), 'pacts', 'pact2.json')
})

describe('Consumer Test', () => {

    // beforeAll(async () => {

    // })

    afterAll(() => mockProvider.finalize())
    afterEach(() => mockProvider.verify())

    it('should return user list', async () => {
        await mockProvider.setup().then(() => {
            mockProvider.addInteraction({
                uponReceiving: 'a request',
                withRequest: {
                    method: 'POST',
                    path: '/graphql',
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc0OTMyMzg3LCJleHAiOjE2NzUxMDUxODd9.COeWXrdT3qncc36cxpBs44gM5TAIdrBpvvrK8sFCg1k',
                        "Content-Type": 'application/json'
                    },
                    body: {
                        "operationName": "users",
                        "variables": {},
                        "query": "query users($where: UserWhereInput, $orderBy: UserOrderByInput, $skip: Float, $take: Float) {\n  items: users(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    createdAt\n    firstName\n    id\n    lastName\n    roles\n    updatedAt\n    username\n    __typename\n  }\n  total: _usersMeta(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    count\n    __typename\n  }\n}\n"
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": 'application/json; charset=utf-8'
                    },
                    body: {
                        "data": {
                            "items": [
                                {
                                    "createdAt": somethingLike("2023-01-15T20:45:43.726Z"),
                                    "firstName": null,
                                    "id": somethingLike("clcxuk3al059048u1s3bjatuk"),
                                    "lastName": null,
                                    "roles": ["user"],
                                    "updatedAt": somethingLike("2023-01-15T20:45:43.726Z"),
                                    "username": somethingLike("admin"),
                                    "__typename": somethingLike("User")
                                },
                                {
                                    "createdAt": somethingLike("2023-01-15T20:45:43.726Z"),
                                    "firstName": somethingLike("lg"),
                                    "id": somethingLike("clcxuk3al059048u1s3bjatuk"),
                                    "lastName": somethingLike("c2"),
                                    "roles": ["user"],
                                    "updatedAt": somethingLike("2023-01-15T20:45:43.726Z"),
                                    "username": somethingLike("lgc2"),
                                    "__typename": somethingLike("User")
                                }
                                // { min: 2 }
                            ],
                            "total": {
                                "count": "2",
                                "__typename": "MetaQueryPayload"
                            }
                        }
                    }

                }
            })
        })

        userList().then(response => {
            const { firstName, lastName } = response.data.data.items[1]

            expect(response.status).toEqual(200)
            expect(firstName).toBe("lg")
            expect(lastName).toBe("c2")
        })
    })

    it('should return addresses list', async () => {
        await mockProvider2.setup().then(() => {
            mockProvider2.addInteraction({
                uponReceiving: 'a request',
                withRequest: {
                    method: 'POST',
                    path: '/graphql',
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc0OTMyMzg3LCJleHAiOjE2NzUxMDUxODd9.COeWXrdT3qncc36cxpBs44gM5TAIdrBpvvrK8sFCg1k',
                        "Content-Type": 'application/json'
                    },
                    body: {
                        "operationName": "addresses",
                        "query": "query addresses($where: AddressWhereInput, $orderBy: AddressOrderByInput, $skip: Float, $take: Float) {\n  items: addresses(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    address_1\n    address_2\n    city\n    createdAt\n    id\n    state\n    updatedAt\n    zip\n    customers {\n      id\n      __typename\n    }\n    __typename\n  }\n  total: _addressesMeta(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    count\n    __typename\n  }\n}\n",
                        "variables": {}
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        "Content-Type": 'application/json; charset=utf-8'
                    },
                    body: {
                        "data": {
                            "items": eachLike(
                                {
                                    "address_1": somethingLike("Vancouver Street, 63"),
                                    "address_2": somethingLike("Toronto Street, 145"),
                                    "city": somethingLike("Vancouver"),
                                    "createdAt": somethingLike("2023-01-07T21:56:49.262Z"),
                                    "customers": [],
                                    "id": somethingLike("clcmhkp9p0016v8u10od9e744"),
                                    "state": somethingLike("Britsh Columbia"),
                                    "updatedAt": somethingLike("2023-01-07T21:56:49.264Z"),
                                    "zip": somethingLike(123456),
                                    "__typename": somethingLike("Address")
                                },
                                { min: 1 }
                            ),
                            "total": {
                                "count": somethingLike("165"),
                                "__typename": "MetaQueryPayload"
                            }
                        }
                    }

                }
            })
        })

        addressesList().then(response => {
            const { address_1, address_2 } = response.data.data.items[0]

            expect(response.status).toEqual(200)
            expect(address_1).toBe("Vancouver Street, 63")
            expect(address_2).toBe("Toronto Street, 145")
        })
    })
})