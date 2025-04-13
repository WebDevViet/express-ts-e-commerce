export { jsonify } from './jsonify.ts'
export { notFound, errorHandler } from './errorHandlers.ts'

// export const applyMiddlewares = (app: any) => {
//   // parse application/json
//   app.use(jsonify)

//   // catch 404 and forward to error handler
//   app.use(notFound)

//   // error handler
//   app.use(errorHandler)
// }
