const express = require('express');
const axios = require('axios');
const {randomBytes} = require('crypto')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
})

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const title = req.body?.title;
    const post = {
        id,
        title,
    }
    posts[id] = post;

    await axios.post('http://events-svc:4005/events', {
        type: 'POST_CREATED',
        payload: post
    }).catch();
    res.status(201).send(post);
})

app.post('/events', (req, res) => {
    console.log("Received event", req.body);
    res.send('event received');
})

app.listen(4000, ()=>{
    console.log("v22")
    console.log('Listening at 4000');
})