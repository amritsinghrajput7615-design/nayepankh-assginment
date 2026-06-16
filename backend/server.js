require('dotenv').config();
const app = require('./src/app');

const generate = require('./src/controllers/coo')
generate.generate();



















const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server is running on ${port} `)
})