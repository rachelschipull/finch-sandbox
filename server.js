const express = require('express');
const app = express();
const ejs = require('ejs');
const axios = require('axios');
const routes = require('./routes/main');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000

require('dotenv').config()

app.set('view engine', "ejs");
let ejsOptions = {
    async:true
};
app.use('/', routes);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

//Request data from Finch API
const token = process.env.ACCESS_TOKEN
// axios.get('https://finch-sandbox-se-interview.vercel.app/api/employer/company', {
//     headers: {
//         'Authorization': 'Bearer sandbox-token-aa7ff8d3-4db3-461d-8bc5-e35756ce8baf',
//         'Content-type': 'application/json'
//     }
// })
//     .then(res => {
//         console.log(res.data.legal_name);
//         console.log(res.data.locations)
//     })
//     .catch(error => {
//         console.log(error);
//     });

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})