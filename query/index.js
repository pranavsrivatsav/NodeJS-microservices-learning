const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const samplePosts = {
  "55d2774d": {
    id: "55d2774d",
    title: "Demo",
    comments: [
      {
        id: "f2f3ee93",
        content: "comment one",
      },
      {
        id: "ca55b11e",
        content: "comment two",
      },
    ],
  },
  "939ef719": {
    id: "939ef719",
    title: " eden 2",
    comments: [],
  },
};

const posts = {};

function processEvents ({type, payload}) {
  console.log("processing event", type, payload)
  switch (type) {
    case "POST_CREATED":
      posts[payload.id] = { ...payload, comments: [] };
      break;
    case "COMMENT_CREATED": {
      const {postId, commentId, content, status} = payload;
      posts[postId].comments.push({
        id: commentId,
        content,
        status
      });
      break;
    }
    case "COMMENT_UPDATED": {
      const {postId, commentId, content, status} = payload;
      const updatedCommentIndex = posts[postId].comments.findIndex((comment) => comment.id === commentId);
      let updatedComment = posts[postId].comments[updatedCommentIndex];

      updatedComment = {
        ...updatedComment,
        content,
        status
      }
      
      posts[postId].comments[updatedCommentIndex] = updatedComment;
    }
    default: {
    }
  }
}

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  console.log('incoming event', req.body);
  const event = req.body;
  processEvents(event);

  console.dir(posts);
  res.send('event received');
});

app.listen(4002, async () => {
  console.log("Listening at 4002");

  const response = await axios.get('http://events-svc:4005/events').catch((err)=>{data:[]});
  console.log(response.data)
  const events = response.data;

  for(const event of events) {
    processEvents(event);
  }

  console.log("Finished processing events in the store");
});
