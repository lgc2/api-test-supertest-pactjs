import 'dotenv/config'
import axios from 'axios'
import addressesData from '../data/addresses-payload.json'

const baseUrl = `http://localhost:${process.env.MOCK_PORT}`

export const addressesList = async () => {
    return await axios.post(`${baseUrl}/graphql`, addressesData, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc0OTMyMzg3LCJleHAiOjE2NzUxMDUxODd9.COeWXrdT3qncc36cxpBs44gM5TAIdrBpvvrK8sFCg1k',
            "Content-Type": 'application/json'
        }
    })
}