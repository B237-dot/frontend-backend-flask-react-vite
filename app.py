from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Task, Comment

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
CORS(app)

with app.app_context():
    db.create_all()

# ==================== TASK ROUTES ====================

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([t.to_dict() for t in tasks])

@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.json
    if not data or not data.get("title"):
        return jsonify({"error": "Title is required"}), 400
    
    task = Task(title=data["title"], description=data.get("description", ""))
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@app.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    
    if "title" in data:
        task.title = data["title"]
    if "description" in data:
        task.description = data["description"]
    
    db.session.commit()
    return jsonify(task.to_dict())

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"}), 204

# ==================== COMMENT ROUTES ====================

@app.route("/api/tasks/<int:task_id>/comments", methods=["GET"])
def get_comments(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify([c.to_dict() for c in task.comments])

@app.route("/api/tasks/<int:task_id>/comments", methods=["POST"])
def create_comment(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    
    if not data or not data.get("text"):
        return jsonify({"error": "Comment text is required"}), 400
    
    comment = Comment(text=data["text"], task_id=task_id)
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

@app.route("/api/comments/<int:comment_id>", methods=["GET"])
def get_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    return jsonify(comment.to_dict())

@app.route("/api/comments/<int:comment_id>", methods=["PUT"])
def update_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    data = request.json
    
    if not data or not data.get("text"):
        return jsonify({"error": "Comment text is required"}), 400
    
    comment.text = data["text"]
    db.session.commit()
    return jsonify(comment.to_dict())

@app.route("/api/comments/<int:comment_id>", methods=["DELETE"])
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted successfully"}), 204

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
