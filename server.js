const express = require('express');
const session = require('express-session')
const app = express();
const ejs = require('ejs');
const axios = require('axios');
// const routes = require('./routes/main');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000

//Use .env file
require('dotenv').config()

//Use ejs for views
app.set('view engine', "ejs");

//Set main routes
 //app.use('/', routes);

//Set public folder
app.use(express.static("public"));

//Set up body parser
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

//index route
// app.get('/', (req, res) => {
//     res.render('index.ejs');
// })

//Request data from Finch API
const token = process.env.ACCESS_TOKEN

app.get('/', async (req, res) => {
    try { 
        const company = await axios.get('https://finch-sandbox-se-interview.vercel.app/api/employer/company', {
            headers: {
                'Authorization': 'Bearer sandbox-token-aa7ff8d3-4db3-461d-8bc5-e35756ce8baf',
                'Content-type': 'application/json'
            }
        })

        const directory = await axios.get('https://finch-sandbox-se-interview.vercel.app/api/employer/directory', {
            headers: {
                'Authorization': 'Bearer sandbox-token-aa7ff8d3-4db3-461d-8bc5-e35756ce8baf',
                'Content-type': 'application/json'
            }
        })

        const companyData = company.data;
        console.log(companyData);

        const directoryData = directory.data;
        console.log(directoryData.individuals[0].id)

        res.render('index.ejs', {companyData:companyData, directoryData:directoryData})
    } catch (error) {
        console.log(error);
        res.render('error', {error: 'Failed to fetch Finch API Data'})
    }
})

//employee data request
// const data = {
//     requests: [
//         {
//             "individual_id": "5d0b10a1-a09a-430f-81f1-20be735dc5e9"
//         }
//     ]
// }
// axios.post('https://finch-sandbox-se-interview.vercel.app/api/employer/employment', data, {
//             headers: {
//                 'Authorization': 'Bearer sandbox-token-aa7ff8d3-4db3-461d-8bc5-e35756ce8baf',
//                 'Content-type': 'application/json',
//                 'Accept': 'application/json',
//                 'Finch-API-Version': '2020-09-17'
//             },
//         }).then(response => {
//             console.log(response.data)
//         }).catch(error => {
//             console.log(error)
//         })

//Run server on local
app.listen(process.env.PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})