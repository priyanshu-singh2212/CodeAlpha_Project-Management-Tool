import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../socket";

function CommentModal({
  showCommentModal,
  setShowCommentModal,
  selectedTask,
}) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // ================= FETCH COMMENTS =================
  useEffect(() => {
    if (!selectedTask?._id) return;

    const fetchComments = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await api.get(
          `/comments/${selectedTask._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComments(res.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    fetchComments();
  }, [selectedTask?._id]);

  // ================= SOCKET LISTENERS =================
  useEffect(() => {
    if (!selectedTask?._id) return;

    const handleNewComment = (comment) => {
      if (comment.taskId === selectedTask._id) {
        setComments((prev) => [comment, ...prev]);
      }
    };

    const handleCommentDeleted = ({ commentId }) => {
      setComments((prev) =>
        prev.filter((c) => c._id !== commentId)
      );
    };

    const handleCommentUpdated = (updatedComment) => {
      setComments((prev) =>
        prev.map((c) =>
          c._id === updatedComment._id
            ? updatedComment
            : c
        )
      );
    };

    socket.on("newComment", handleNewComment);
    socket.on("commentDeleted", handleCommentDeleted);
    socket.on("commentUpdated", handleCommentUpdated);

    return () => {
      socket.off("newComment", handleNewComment);
      socket.off("commentDeleted", handleCommentDeleted);
      socket.off("commentUpdated", handleCommentUpdated);
    };
  }, [selectedTask?._id]);

  // ================= ADD COMMENT =================
  const handleAddComment = async () => {
    try {
      if (!content.trim()) return;

      const token = sessionStorage.getItem("token");

      await api.post(
        "/comments/create",
        {
          content,
          taskId: selectedTask._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= DELETE COMMENT =================
  const handleDeleteComment = async (commentId) => {
    try {
      const token = sessionStorage.getItem("token");

      await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // UI update (important)
      setComments((prev) =>
        prev.filter((c) => c._id !== commentId)
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= UPDATE COMMENT =================
  const handleUpdateComment = async (commentId) => {
    try {
      const token = sessionStorage.getItem("token");

      await api.put(
        `/comments/${commentId}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  if (!showCommentModal || !selectedTask) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Comments - {selectedTask.title}</h2>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                borderBottom: "1px solid #ddd",
                marginBottom: "10px",
                paddingBottom: "10px",
              }}
            >
              <strong>{comment.userId?.name || "User"}</strong>

              {editingCommentId === comment._id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  <button onClick={() => handleUpdateComment(comment._id)}>
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{comment.content}</p>

                  <button
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditContent(comment.content);
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDeleteComment(comment._id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleAddComment}>Add Comment</button>

          <button onClick={() => setShowCommentModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;