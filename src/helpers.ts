import { Response } from "express";import { ReadableStream } from "stream/web";export const corsHeaders = {  "Access-Control-Allow-Origin": "*",  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",  "Access-Control-Allow-Headers": "Content-Type",};export const makeResponse = async (  res: Response,  body: string | ReadableStream<Uint8Array> | undefined,  status: number,  headers?: Record<string, any>) => {  res.set({    ...corsHeaders,    ...(headers || {}),  })  if (typeof body === "string") {    return res.status(status).send(JSON.stringify({ message: body }));  }  const reader = body && body.getReader()  while (reader) {    const { value, done } = await reader.read()    if (value)      res.write(value)    if (done) {      res.end()      return    }  }  res.status(404).send(JSON.stringify({ message: `not found` }));};