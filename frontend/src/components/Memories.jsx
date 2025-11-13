import React, { useState, useEffect } from "react";
import API from "../api";
import "./Memories.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-backdrop">
    <div className="confirmation-modal">
      <p className="modal-message">{message}</p>
      <div className="modal-actions">
        <button onClick={onCancel} className="modal-cancel-btn">
          Cancel
        </button>
        <button onClick={onConfirm} className="modal-confirm-btn">
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
);

const Memories = () => {
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await API.get("/memories");
      setAlbums(res.data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const addAlbum = async () => {
    if (!newAlbum.trim()) return;
    try {
      const newEntry = { name: newAlbum, location, description, images: [] };
      await API.post("/memories", newEntry);
      setNewAlbum("");
      setLocation("");
      setDescription("");
      fetchAlbums();
    } catch (error) {
      console.error("Error adding album:", error);
    }
  };

  const deleteAlbum = (name, id) => {
    setConfirmState({
      type: "album",
      id,
      name,
      message: `Are you sure you want to delete the album "${name}" and all its photos? This cannot be undone.`,
    });
  };

  const deletePhoto = (index) => {
    setConfirmState({
      type: "photo",
      index,
      message: "Are you sure you want to delete this photo?",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmState) return;

    if (confirmState.type === "album") {
      try {
        await API.delete(`/memories/${confirmState.id}`);
        setSelectedAlbum(null);
        fetchAlbums();
      } catch (error) {
        console.error("Error deleting album:", error);
      }
    } else if (confirmState.type === "photo") {
      const index = confirmState.index;
      const updatedImages = selectedAlbum.images.filter((_, i) => i !== index);
      try {
        await API.put(`/memories/${selectedAlbum._id}`, {
          ...selectedAlbum,
          images: updatedImages,
        });
        setSelectedAlbum({ ...selectedAlbum, images: updatedImages });
        fetchAlbums();
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
    setConfirmState(null);
  };

  const handleCancelAction = () => setConfirmState(null);

  // ✅ Fixed: Instantly show uploaded images
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const res = await API.put(
        `/memories/${selectedAlbum._id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Instantly update UI with new photos
      setSelectedAlbum(res.data);
      setAlbums((prev) =>
        prev.map((album) =>
          album._id === res.data._id ? res.data : album
        )
      );
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const goBack = () => setSelectedAlbum(null);

  return (
    <div className="memories-container">
      {confirmState && (
        <ConfirmationModal
          message={confirmState.message}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}

      {!selectedAlbum ? (
        <>
          <h2>My Travel Albums</h2>

          <div className="add-album">
            <input
              type="text"
              placeholder="Album name (e.g., Goa Trip)"
              value={newAlbum}
              onChange={(e) => setNewAlbum(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={addAlbum}>Add Album</button>
          </div>

          <div className="album-grid">
            {albums.length === 0 && <p className="no-photos">No albums yet.</p>}
            {albums.map((album, index) => (
              <div key={index} className="album-card">
                <div
                  onClick={() => setSelectedAlbum(album)}
                  style={{ cursor: "pointer" }}
                >
                  {album.images[0] ? (
                    <img
                      src={`${API.defaults.baseURL}${album.images[0]}`}
                      alt={album.name}
                      className="album-cover"
                    />
                  ) : (
                    <div className="album-placeholder">📷</div>
                  )}
                  <p className="album-name">{album.name}</p>
                  {album.location && <p className="album-location">📍 {album.location}</p>}
                  {album.description && (
                    <p className="album-description">{album.description}</p>
                  )}
                </div>
                <button
                  className="delete-album-btn"
                  onClick={() => deleteAlbum(album.name, album._id)}
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="album-view-container">
          <button className="back-btn" onClick={goBack}>
            ← Back to Albums
          </button>

          <h2 className="album-detail-title">{selectedAlbum.name}</h2>

          <div className="upload-section">
            <label className="upload-btn">
              ➕ Add Pictures
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </label>
          </div>

          <div className="photo-grid">
            {selectedAlbum.images.length > 0 ? (
              selectedAlbum.images.map((img, i) => (
                <div key={i} className="photo-card">
                  <img
                    src={`${API.defaults.baseURL}${img}`}
                    alt={`memory-${i}`}
                  />
                  <button
                    className="delete-photo-btn"
                    onClick={() => deletePhoto(i)}
                  >
                    🗑
                  </button>
                </div>
              ))
            ) : (
              <p className="no-photos">
                No photos added yet. Use the "Add Pictures" button above.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Memories;
