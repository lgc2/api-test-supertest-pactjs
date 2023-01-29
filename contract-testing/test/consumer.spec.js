import 'dotenv/config'

import { Pact } from "@pact-foundation/pact"
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers'
import { userList } from '../request/user.request'

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
    })

    afterAll(() => mockProvider.finalize())
    afterEach(() => mockProvider.verify())

    it('should return user list', async () => {

        userList().then(response => {
            const { firstName, lastName } = response.data.data.items[1]

            expect(response.status).toEqual(200)
            expect(firstName).toBe("lg")
            expect(lastName).toBe("c2")
        })
    })
})