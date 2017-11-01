const express = require('express')
const app = express()
const port = 3000

app.get('/bundle.js', (request, response) => {
  response.sendFile(__dirname+'/dist/bundle.js')
})
  
app.get('/', (request, response) => {
  response.sendFile(__dirname+'/dist/index.html')
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
