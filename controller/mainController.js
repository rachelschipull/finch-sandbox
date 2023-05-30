const { json } = require("body-parser");
const { response } = require("express");

module.exports = {
    getIndex: (req, res) => {
    res.render("index.ejs", {async: true});
    },

    getData: async (req, res) => {
        try {
        const response = await axios.get('https://finch-sandbox-se-interview.vercel.app/api/employer/company', {
            headers: {
                'Authorization': 'Bearer <token>',
                'Content-type': 'application/json'
                }
        }); 
        const apiData = response.data

        console.log(apiData)

        res.render('index.ejs', { apiData: apiData }) 
        } catch (err) {
        console.log(err);
        res.render('error', {error: 'Failed to load Finch API data'});
    }
    }
    }

