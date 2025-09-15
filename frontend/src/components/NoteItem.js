import React from "react";

const NoteItem = ({ note, onDelete, onEdit }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{note.title}</h3>
        <div>
          <button style={{ ...styles.button, ...styles.editButton }} onClick={() => onEdit(note)}>
            Edit
          </button>
          <button style={{ ...styles.button, ...styles.deleteButton }} onClick={() => onDelete(note._id)}>
            Delete
          </button>
        </div>
      </div>
      <p style={styles.content}>{note.content}</p>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    color: "#333",
  },
  content: {
    fontSize: "14px",
    color: "#555",
  },
  button: {
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "12px",
    marginLeft: "5px",
    transition: "background 0.2s",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#FF4D4D",
    color: "#fff",
  },
};

export default NoteItem;
