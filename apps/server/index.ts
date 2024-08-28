import dotenv from 'dotenv'
import http from 'http'
import Koa from 'koa'
import 'reflect-metadata'
dotenv.config()

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { koaMiddleware } from '@as-integrations/koa'
import Router from '@koa/router'
import { GraphQLScalarType } from 'graphql'
import { DateTimeResolver } from 'graphql-scalars'
import bodyParser from 'koa-bodyparser'
import send from 'koa-send'
import serve from 'koa-static'
import path from 'path'
import { createClient } from 'redis'
import * as tgql from 'type-graphql'
import { Container } from 'typedi'
import { ServerContext, context } from './src/context'
import { can } from './src/helpers/can'
import { resolvers } from './src/resolvers/index'

const app = new Koa()
const router: Router = new Router()
const httpServer = http.createServer(app.callback())

export const redis = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
})

async function main() {
  const schema = await tgql.buildSchema({
    resolvers,
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    container: Container,
    emitSchemaFile: true,
    authChecker: can,
  })
  const server = new ApolloServer<ServerContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  router.use(bodyParser())
  router.all('/graphql', koaMiddleware(server, { context }))

  app.use(router.routes())

  if(process.env.NODE_ENV == 'production'){
    app.use(serve(path.join(__dirname, '../../client/dist/spa')))
    console.log(path.join(__dirname, '../../client/dist/spa'))
    app.use(async (ctx) => {
      await send(ctx, 'apps/client/dist/spa/index.html', { root: path.join('/usr/src/app/')})
    })
  }

  await new Promise<void>((resolve) => {
    const port = parseInt(process.env.PORT || '3000')
    console.log('Server listening on port ' + port)
    return httpServer.listen({ port }, resolve)
  })

  await redis
    .on('connect', () => console.log('Redis Client Connected'))
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect()
}

main()
