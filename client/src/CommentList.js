import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    const status = comment.status.toUpperCase();
    return <li key={comment.id}>{
      status === 'APPROVED' 
        ? comment.content 
        : status === 'PENDING'
        ? '<AWAITING MODERATION>'
        : '<DENIED APPROVAL>' }</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
