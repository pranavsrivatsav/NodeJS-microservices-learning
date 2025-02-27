const express = require("express");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  console.log(req.body);
  let eventPayload;
  const { type, payload } = req.body;

  if (type === "COMMENT_CREATED") {
    const { commentId, postId, content, status } = payload;
    let updatedStatus = status;
    if (content.includes("orange")) {
      updatedStatus = "DENIED";
    } else updatedStatus = "APPROVED";

    eventPayload = {
      type: "COMMENT_MODERATED",
      payload: {
        postId,
        commentId,
        status: updatedStatus,
      },
    };
  }
  if (eventPayload)
    axios.post("http://events-svc:4005/events", eventPayload).catch();

  res.send('event received');
});

app.listen(4003, () => {
  console.log("listening at 4003");
});
