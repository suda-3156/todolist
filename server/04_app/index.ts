// entry point
// const app = express()とか書くところ

import express, { Application } from 'express'
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import { authRouter } from './routes'

const app :Application = express()
const PORT = 8080
const ClientURL = process.env.CLIENT_URL!
export const prisma = new PrismaClient()

const options: cors.CorsOptions = {
  origin: ClientURL,
  credentials: true
}

app.use(cors(options))
app.use(express.json())

app.use("/api/v1", authRouter)

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT)
})