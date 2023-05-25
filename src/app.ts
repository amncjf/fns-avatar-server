import dotenv from 'dotenv'
import express from 'express'
import pkg from 'body-parser'
import onRequestPut from './put'
import onRequestGet from './get'

dotenv.config({ debug: false })

const { json } = pkg
export const app = express()

app.use(express.json());

app.get('/:network/:name', onRequestGet);
app.put('/:network/:name', onRequestPut);
