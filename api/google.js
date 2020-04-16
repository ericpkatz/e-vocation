
const router = require('express').Router();
const qs = require('querystring');
const axios = require('axios');
const keys = require('./google_keys.json');

const redirect_uri = 'http://localhost:3000/api/google/callback';
const emailScope = 'https://www.googleapis.com/auth/userinfo.email';
const userScope = 'https://www.googleapis.com/auth/userinfo.profile';

router.get('/callback', async (req, res, next) => {
    try {
        const { data } = await axios.post( 'https://accounts.google.com/o/oauth2/v2/auth', {
            code: req.query.code,
            client_id: keys.client.id,
            client_secret: keys.client.secret,
            grant_type: 'authorization_code',
            redirect_uri
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
        }
        console.log(data, values);
    }
    catch (error) {
        next(error);
    }
});

router.get('/:destination', (req, res) => {
    req.session.destination = req.params.destination ? req.params.destination : null;

    res.redirect('/auth/google')
});

router.get('/', (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${qs.stringify({
        response_type: 'code',
        scrope: `${emailScope} ${userScope}`,
        redirect_uri,
        client_id: keys.client.id
    })}`;

    res.redirect(url)
})

module.exports = {router}