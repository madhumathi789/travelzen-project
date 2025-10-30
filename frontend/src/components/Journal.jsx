import React, { useState, useEffect } from "react";
import API from "../api";
import "./Journal.css";

const Journal = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await API.get("/journals");
    setNotes(res.data);
  };

  const handleNewNote = () => {
    setCurrentNote("new");
    setTitle("");
    setContent("");
  };

  const handleSave = async () => {
    if (currentNote === "new") {
      const res = await API.post("/journals", { title, content });
      setNotes([...notes, res.data]);
    } else {
      const res = await API.put(`/journals/${notes[currentNote]._id}`, {
        title,
        content,
      });
      const updated = [...notes];
      updated[currentNote] = res.data;
      setNotes(updated);
    }
    setCurrentNote(null);
  };

  const handleOpenNote = (index) => {
    setCurrentNote(index);
    setTitle(notes[index].title);
    setContent(notes[index].content);
  };

  const handleDelete = async (id) => {
    await API.delete(`/journals/${id}`);
    setNotes(notes.filter((n) => n._id !== id));
  };

  return currentNote !== null ? (
    <div className="editor-container">
      <button className="back-btn" onClick={() => setCurrentNote(null)}>
        ← Back
      </button>
      <input
        className="note-title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="note-content"
        placeholder="Start writing..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="save-note-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  ) : (
    <div className="journal-container">
      <div className="new-note" onClick={handleNewNote}>
        <span className="plus-icon">+</span>
        <p>Create New Note</p>
      </div>
      {notes.length > 0 && (
        <div className="notes-preview">
          <h3>Saved Notes</h3>
          {notes.map((note, idx) => (
            <div key={idx} className="note-preview-card">
              <div onClick={() => handleOpenNote(idx)}>
                <h4>{note.title}</h4>
                <p>{note.content.substring(0, 50)}...</p>
              </div>
              <button onClick={() => handleDelete(note._id)}>🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
