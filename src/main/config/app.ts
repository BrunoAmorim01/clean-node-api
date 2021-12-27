import setUpMiddlewares from './middlewares'
import setUpRoutes from './routes'
import setUpSwagger from './config-swagger'
import express from 'express'

const app = express()
setUpSwagger(app)
setUpMiddlewares(app)
setUpRoutes(app)

export default app
