const express = require('express')

const PORT = 3300

const app = express()

app.get('/', (req, res) => res.send('Hello from my own server' ));


app.listen(PORT, () => console.log(`Server Started on port ${PORT}`))







                                    