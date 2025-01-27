const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', async (req, res) => {
    console.log("inside event creation")
    const payload = req.body;
    events.push(payload);
    await axios.post('http://localhost:4000/events', payload).catch();
    await axios.post('http://localhost:4001/events', payload).catch();
    await axios.post('http://localhost:4002/events', payload).catch();
    await axios.post('http://localhost:4003/events', payload).catch();
    res.status(201).send('event emitted');
});

app.get('/events', (req, res) => {
    console.log('here')
    res.send(events);
})

app.listen(4005, ()=>{
    console.log('listening at 4005...');
})