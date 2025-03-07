const express = require('express');
const axios = require('axios');
const {randomBytes} = require('crypto')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const comments = {};

app.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    res.send(comments[postId] ?? []);
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const postId = req.params.id
    const content = req.body?.content;
    const comment = {
        id: commentId,
        content,
        status: 'pending'
    }

    if(comments[postId]){
        comments[postId].push(comment);
    } else {
        comments[postId] = [comment];
    };

    await axios.post('http://events-svc:4005/events', {
        type: 'COMMENT_CREATED',
        payload: {
            commentId,
            postId,
            content,
            status: comment.status
        }
    }).catch()

    res.status(201).send(comments);
})

app.post('/events', async (req, res) => {
    console.log(req.body);
    const {type, payload} = req.body;
    let eventPayload;

    if(type === 'COMMENT_MODERATED') {
        const { postId, commentId, status } = payload;
        const updatedComment = comments[postId].find((comment) => comment.id === commentId);

        updatedComment.status = status;
        eventPayload = {};
        eventPayload.type = 'COMMENT_UPDATED';
        eventPayload.payload = {
            commentId,
            postId,
            content: updatedComment.content,
            status: updatedComment.status
        }
    }
    if(eventPayload)
    await axios.post('http://events-svc:4005/events', eventPayload).catch()

    res.send('event received');
})

app.listen(4001, ()=>{
    console.log('Listening at 4001...');
})