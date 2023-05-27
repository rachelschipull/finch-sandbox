const { json } = require("body-parser");

module.exports = {
    getIndex: (req, res) => {
    res.render("index.ejs", {async: true});
    },

    getData: async (req, res) => {
        try {
        const res = await axios.get('https://finch-sandbox-se-interview.vercel.app/api/employer/company', {
            headers: {
                'Authorization': 'Bearer sandbox-token-aa7ff8d3-4db3-461d-8bc5-e35756ce8baf',
                'Content-type': 'application/json'
                }
        }); 
        const apiData = res.data

        console.log(apiData)

        res.render('index', {
            apiData
        }) 
        } catch (err) {
        console.log(err);
    }
    }
    }

