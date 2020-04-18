
const router = require('express').Router();
const qs = require('querystring');
const axios = require('axios');
require('dotenv').config('../.env');


const redirect_uri = 'http://localhost:3000/api/google/callback';
const emailScope = 'https://www.googleapis.com/auth/userinfo.email';
const userScope = 'https://www.googleapis.com/auth/userinfo.profile';

console.log(process.env.GOOGLE_CLIENT_ID)

router.get('/callback', async (req, res, next) => {
    try {
        const { data } = await axios.post( 'https://www.googleapis.com/oauth2/v4/token', {
            code: req.query.code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri,
        });
        const { data: _user } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${data.access_token}`,
                },
        });
        const values = {
            googleId: _user.id,
            email: _user.email,
            firstName: _user.given_name,
            lastName: _user.family_name,
            location: _user.locale
        };
        console.log(_user)
        
        res.redirect('/#/');
    }
    catch (error) {
        next(error);
    }
});

//not sure if this needed as there is no specific destination
router.get('/:destination', (req, res) => {
    req.session.destination = req.params.destination ? req.params.destination : null;

    res.redirect('/api/google')
});

router.get('/', (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${qs.stringify({
        response_type: 'code',
        scope: `${emailScope} ${userScope}`,
        redirect_uri,
        client_id: process.env.GOOGLE_CLIENT_ID
    })}`;

    res.redirect(url)
})

module.exports = {router}