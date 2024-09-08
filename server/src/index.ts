import express, { Application } from 'express'
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import { authRouter, todoRouter } from './v1/routes'

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
app.use("/api/v1", todoRouter)

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT)
})