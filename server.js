const express = require('express');
const app = express();

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.send('hello world')
})

app.listen(3000, () => {
  console.log('Express running on localhost:3000')
})