import * as debug from "./debug-lib"

export default function handler(lambda) {
  return function (event, context) {
    return (
      Promise.resolve()
        // Start debugger
        .then(() => debug.init(event, context))
        // run the lambda
        .then(() => lambda(event, context))
        .then((responseBody) => [200, responseBody])
        .catch((e) => {
          debug.flush(e)
          return [500, { error: e.message }]
        })
        .then(([statusCode, body]) => ({
          statusCode,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(body),
        }))
        .finally(debug.end)
    )
  }
}
