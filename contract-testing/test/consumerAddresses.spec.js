import 'dotenv/config'

import { Pact } from "@pact-foundation/pact"
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers'
import { addressesList } from '../request/addresses.request'

const mockProvider = new Pact({
    consumer: 'ebac-demo-store-admin',
    provider: 'ebac-demo-store-server',
    port: parseInt(process.env.MOCK_PORT),
    log: resolve(process.cwd(), 'logs', 'pact.log'),
    dir: resolve(process.cwd(), 'pacts')
})

describe('Consumer Test', () => {

    beforeAll(async () => {
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
                                    // "customers": somethingLike([{id: "clcqsdt6z0105hgu1nezw5159", __typename: "Customer"}]),
                                    "id": somethingLike("clcmhkp9p0016v8u10od9e744"),
                                    "state": somethingLike("Britsh Columbia"),
                                    "updatedAt": somethingLike("2023-01-07T21:56:49.264Z"),
                                    "zip": somethingLike(123456),
                                    "__typename": somethingLike("Address")
                                },
                                { min: 1 }
                            ),
                            "total": {
                                // "count": somethingLike("165"),
                                "__typename": "MetaQueryPayload"
                            }
                        }
                    }

                }
            })
        })
    })

    afterAll(() => mockProvider.finalize())
    afterEach(() => mockProvider.verify())

    it('should return addresses list', () => {

        addressesList().then(response => {
            const { address_1, address_2 } = response.data.data.items[0]

            expect(response.status).toEqual(200)
            expect(address_1).toBe("Vancouver Street, 63")
            expect(address_2).toBe("Toronto Street, 145")
        })
    })
})