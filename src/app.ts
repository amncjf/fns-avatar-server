import dotenv from 'dotenv'
import express from 'express'
import pkg from 'body-parser'
import cors from 'cors'
import onRequestPut from './put'
import onRequestGet from './get'
import onRequestOptions from './options'

dotenv.config({ debug: false })

const { json } = pkg
export const app = express()

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
}))

app.use(express.json());

app.get('/:network/:name', onRequestGet);
app.put('/:network/:name', onRequestPut);
app.post('/:network/:name', onRequestPut);
app.options('/:network/:name', onRequestOptions);
