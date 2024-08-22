import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const myServer = express();
const portUsed = 3000;

myServer.use(express.static('public'));
myServer.use(bodyParser.urlencoded({ extended: true }));


myServer.get('/', (req, res) => {
    res.render('index.ejs');
});

myServer.post('/subscribe', async (req, res) => {
    const { email, name, phone } = req.body;
    const apiKey = '52ac35dc42406c3306f10a7fe5f811c4-us14';
    const listId = '39530507b8';
    const apiUrl = `https://us14.api.mailchimp.com/3.0/lists/${listId}/members`;

    const data = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
            FNAME: name,
            PHONE: phone
        }
    };

    const options = {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        await axios.post(apiUrl, data, options);
        res.render('success.ejs');
    } catch (error) {
        let errorMessage = error.response && error.response.data && error.response.data.detail
            ? error.response.data.detail
            : 'An error occurred. Please try again.';

        errorMessage = errorMessage.replace(/Use PUT to insert or update list members\./, 'Kindly use a different email.');

        res.render('failure.ejs', { error: errorMessage });
    }
});



myServer.listen(portUsed, () => {
    console.log(`Server is running on port ${portUsed}`);
});
