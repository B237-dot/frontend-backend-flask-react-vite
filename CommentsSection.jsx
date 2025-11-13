import React, { useState, useEffect } from "react";
import { getComments, addComment, updateComment, deleteComment } from "../api";

export default function CommentSection({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    const data = await getComments(taskId);
    setComments(data);
  };

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    await addComment(taskId, newComment);
    setNewComment("");
    loadComments();
  };

  const handleUpdate = async (id) => {
    await updateComment(id, editingText);
    setEditingId(null);
    loadComments();
  };

  const handleDelete = async (id) => {
    await deleteComment(id);
    loadComments();
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h4>Comments</h4>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            {editingId === c.id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => handleUpdate(c.id)}>Save</button>
              </>
            ) : (
              <>
                {c.text}
                <button onClick={() => { setEditingId(c.id); setEditingText(c.text); }}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <input
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={handleAdd}>Add Comment</button>
    </div>
  );
}