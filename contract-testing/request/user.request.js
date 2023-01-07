import 'dotenv/config'
import axios from 'axios'
import data from '../data/payload.json'

const baseUrl = `http://localhost:${process.env.MOCK_PORT}`

export const userList = async () => {
    return await axios.post(`${baseUrl}/graphql`, data, {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjcyNjg5MjMxLCJleHAiOjE2NzI4NjIwMzF9.jENYhK92NNpLGBBkmbXhF9ya6x2cykNOOkHhSZJD2mk',
            "Content-Type": 'application/json'
        }
    })
}