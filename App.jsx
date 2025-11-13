import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  const API_URL = "http://127.0.0.1:5000/api";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load tasks. Ensure Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    try {
      await axios.post(`${API_URL}/tasks`, {
        title: taskTitle,
        description: taskDescription,
      });
      setTaskTitle("");
      setTaskDescription("");
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, {
        title: editingTask.title,
        description: editingTask.description,
      });
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      if (selectedTask?.id === taskId) setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!selectedTask || !commentText.trim()) return;
    try {
      await axios.post(`${API_URL}/tasks/${selectedTask.id}/comments`, {
        text: commentText,
      });
      setCommentText("");
      const res = await axios.get(`${API_URL}/tasks/${selectedTask.id}`);
      setSelectedTask(res.data);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to add comment");
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await axios.put(`${API_URL}/comments/${commentId}`, {
        text: editingComment.text,
      });
      setEditingComment(null);
      const res = await axios.get(`${API_URL}/tasks/${selectedTask.id}`);
      setSelectedTask(res.data);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
      const res = await axios.get(`${API_URL}/tasks/${selectedTask.id}`);
      setSelectedTask(res.data);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h1>Task & Comment Manager</h1>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="main-content">
          <div className="tasks-panel">
            <h2>Tasks</h2>
            <form onSubmit={handleCreateTask} className="form">
              <input type="text" placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
              <textarea placeholder="Task description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} rows="2" />
              <button type="submit">+ Add Task</button>
            </form>
            {tasks.length === 0 ? (
              <p className="empty-message">No tasks yet. Create one above!</p>
            ) : (
              <div className="tasks-list">
                {tasks.map((task) => (
                  <div key={task.id} className={`task-item ${selectedTask?.id === task.id ? "active" : ""}`} onClick={() => setSelectedTask(task)}>
                    {editingTask?.id === task.id ? (
                      <div>
                        <input value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
                        <textarea value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} rows="2" />
                        <button className="btn-save" onClick={() => handleUpdateTask(task.id)}>Save</button>
                        <button className="btn-cancel" onClick={() => setEditingTask(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <small>{task.comments.length} comments</small>
                        <div className="task-actions">
                          <button className="btn-edit" onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}>Edit</button>
                          <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedTask && (
            <div className="comments-panel">
              <h2>Comments for: {selectedTask.title}</h2>
              <form onSubmit={handleAddComment} className="form">
                <textarea placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} rows="3" required />
                <button type="submit">+ Add Comment</button>
              </form>
              {selectedTask.comments.length === 0 ? (
                <p className="empty-message">No comments yet. Add one above!</p>
              ) : (
                <div className="comments-list">
                  {selectedTask.comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      {editingComment?.id === comment.id ? (
                        <div>
                          <textarea value={editingComment.text} onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })} rows="2" />
                          <button className="btn-save" onClick={() => handleUpdateComment(comment.id)}>Save</button>
                          <button className="btn-cancel" onClick={() => setEditingComment(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div>
                          <p>{comment.text}</p>
                          <small>{new Date(comment.created_at).toLocaleString()}</small>
                          <div className="comment-actions">
                            <button className="btn-edit" onClick={() => setEditingComment(comment)}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
