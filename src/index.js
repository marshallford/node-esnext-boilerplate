import { createServer } from 'http'

const url = 'localhost'
const port = 3000

// ESnext is currently ES7, lets verify that we have access to ES7 features

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
console.log([1, 2, 3].includes(2))

createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end('Hello World')
}).listen(port, url)

console.log(`Server running at http://${url}:${port}`)
