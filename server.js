const express = require('express');
const session = require('express-session');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
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

//Set public folder
app.use(express.static("public"));

//Set up body parser
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

//Set up session middleware
app.use(session({
    secret: 'keyboard-cat',
    resave: false,
    saveUninitialized: false,
}));

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Set bearer strategy
passport.use( new BearerStrategy((token, done) => {

    const user = {
        name: req.session.name,
        email: req.session.email,
    };

    done(null, user);
}));

app.get('/', (req, res) => {
    res.render('index.ejs')
}
)

app.get('/login', (req, res) => {
    res.render('login')
})

//Login and get access_token
app.post('/login', (req, res) => {
    const { name, email, provider } = req.body;

    // Store name and email in the session
    req.session.name = name;
    req.session.email = email;

    // Make the POST request to the API to obtain the access token
    axios.post('https://finch-sandbox-se-interview.vercel.app/api/sandbox/create', {
        provider: provider,
        products: ['company', 'directory', 'individual', 'employment', 'payment', 'pay_statement']
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
        const accessToken = response.data.access_token;
        console.log(accessToken)

        // Store the access token in the session
        req.session.accessToken = accessToken;

        console.log('Access Token:', req.session.accessToken)

        res.redirect('/protected');
        })
        .catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
        });
});

function attachAccessToken(req, res, next) {
    if (req.session.accessToken) {
        req.accessToken = req.session.accessToken;
    }
    next();
}

// Apply the custom middleware to all routes
app.use(attachAccessToken);

//Protected route
app.get('/protected', attachAccessToken, (req, res) => {
    // Access token is valid, handle the request

    // You can use the stored name and email from the session
    const name = req.session.name;
    const email = req.session.email;

    if(req.redirectTriggered) {
        res.send(`Welcome, ${name} (${email})!`)
    } else {
        req.redirectTriggered = true;
    }

    setTimeout(() => {
        res.redirect('/company')
    }, 2000);
});

//Request data from Finch API
app.get('/company', attachAccessToken, async (req, res) => {
    const accessToken = req.accessToken

    try { 
        const company = await axios.get('https://finch-sandbox-se-interview.vercel.app/api/employer/company', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': 'application/json'
            }
        })

        const directory = await axios.get('https://finch-sandbox-se-interview.vercel.app/api/employer/directory', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': 'application/json'
            }
        })

        const companyData = company.data;
        // console.log(companyData);

        const directoryData = directory.data;
        // console.log(directoryData.individuals[0].id)

        res.render('company.ejs', {companyData:companyData, directoryData:directoryData})
    } catch (error) {
        console.log(error);
        res.render('error', {error: 'Failed to fetch Finch API Data'})
    }
})

app.post('/submit', attachAccessToken, async (req, res) => {
    const accessToken = req.accessToken

    try {
        const employeeId = req.body.employeeId;

        const data = {
            requests: [
                {
                    individual_id: employeeId
                }
            ]
        }
        console.log(data)

        const indResponse = await axios.post('https://finch-sandbox-se-interview.vercel.app/api/employer/individual', data, 
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Finch-API-Version': '2020-09-17'
            },
        });

        const empResponse = await axios.post('https://finch-sandbox-se-interview.vercel.app/api/employer/employment', data, 
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Finch-API-Version': '2020-09-17'
            },
        });
        const indData = indResponse.data
        const empData = empResponse.data
        res.render('render', { indData, empData  }); 
    } catch (error) {
        console.log(error);
        res.status(500).send('API request failed')
    }
})

//Run server on local
app.listen(process.env.PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})