import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import NoteItem from "../components/NoteItem";
import {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
  upgradeTenant,
} from "../services/api";
import { jwtDecode } from "jwt-decode";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [tenantSlug, setTenantSlug] = useState("");
  const [role, setRole] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

   const checkLimit = useCallback(
    (notesArray) => {
      if (role === "Member" && notesArray?.length >= 3) setLimitReached(true);
      else setLimitReached(false);
    },
    [role]
  );
  
  // Fetch notes from backend
  const fetchNotes = useCallback(async () => {
    try {
      const data = await getNotes();
      setNotes(data || []);
      checkLimit(data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setNotes([]);
      setLimitReached(false);
    }
  }, [checkLimit]);

 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setTenantSlug(decoded.tenantSlug);
      setRole(decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1));
    }
    fetchNotes();
  }, [fetchNotes]);

  // Add or update a note
  const handleAddOrUpdateNote = async () => {
    if (!title || !content) return;

    if (role === "Member" && limitReached && !editingNoteId) {
      alert("Note limit reached. Upgrade to Pro to add more notes.");
      return;
    }

    try {
      if (editingNoteId) {
        const updatedNote = await updateNote(editingNoteId, title, content);
        setNotes(notes.map((n) => (n._id === editingNoteId ? updatedNote : n)));
        setEditingNoteId(null);
      } else {
        const newNote = await createNote(title, content);
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        checkLimit(updatedNotes);
      }
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Failed to add/update note:", err);
      alert(err.response?.data?.error || "Failed to add/update note");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      const updatedNotes = notes.filter((n) => n._id !== id);
      setNotes(updatedNotes);
      checkLimit(updatedNotes);
    } catch (err) {
      console.error("Failed to delete note:", err);
      alert(err.response?.data?.error || "Failed to delete note");
    }
  };

  const handleEdit = (note) => {
    setEditingNoteId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpgrade = async () => {
    if (!tenantSlug) {
      alert("Tenant information not loaded yet.");
      return;
    }
    if (role !== "Admin") {
      alert("Only Admin can upgrade the subscription.");
      return;
    }

    try {
      await upgradeTenant(tenantSlug);
      setLimitReached(false);
      fetchNotes();
      alert("Tenant upgraded to Pro!");
    } catch (err) {
      console.error("Failed to upgrade tenant:", err);
      alert(err.response?.data?.error || "Upgrade failed");
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "30px",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ color: "#5C59E8", marginBottom: "20px" }}>Your Notes</h2>

        {/* Add/Edit note form */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              flex: "1 1 200px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              flex: "2 1 300px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleAddOrUpdateNote}
            disabled={role === "Member" && limitReached && !editingNoteId}
            style={{
              flex: "1 1 150px",
              minWidth: "150px",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: editingNoteId ? "#FFA500" : "#5C59E8",
              color: "#fff",
              cursor:
                role === "Member" && limitReached && !editingNoteId
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {editingNoteId ? "Update Note" : "Add Note"}
          </button>
        </div>

        {role === "Member" && limitReached && !editingNoteId && (
          <div style={{ color: "red", marginBottom: "20px" }}>
            Free plan limit reached. Only Admin can upgrade to Pro.
          </div>
        )}

        {role === "Admin" && (
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={handleUpgrade}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#28a745",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Upgrade Tenant to Pro
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {notes.length > 0 ? (
            notes.map((note) => (
              <NoteItem
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <p style={{ color: "#555" }}>No notes yet. Start adding some!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NotesPage;
