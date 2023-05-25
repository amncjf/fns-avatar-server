import dotenv from 'dotenv'
import fs from 'fs'
import http from 'http'
import https from 'https'
import { app } from './app'

dotenv.config({ debug: false })

const configurations = {
  production: { ssl: true, port: 8787, hostname: 'api.fildomains.com' },
  development: { ssl: false, port: 8787, hostname: 'localhost' },
}

async function startServer() {
  const ssl = process.env.NODE_ENV === 'production'
  const httpServer = ssl ? https.createServer({
    ca: process.env.FNS_AVATAR_CA && fs.readFileSync(process.env.FNS_AVATAR_CA),
    key: process.env.FNS_AVATAR_KEY && fs.readFileSync(process.env.FNS_AVATAR_KEY),
    cert: process.env.FNS_AVATAR_CERT && fs.readFileSync(process.env.FNS_AVATAR_CERT),
  },
  app,
  ): http.createServer(app)

  httpServer.listen(
    { hostname: '0.0.0.0', port: 8787 }
  )

  console.log(
    `🚀 Server ready at http://0.0.0.0:8787`,
  )
}

startServer()
