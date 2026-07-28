"use client";

import { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import { useLocationSearch } from "@/lib/useLocationSearch";

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [album, setAlbum] = useState("landscapes");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const [albums, setAlbums] = useState([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [editingSlug, setEditingSlug] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [bulkLocation, setBulkLocation] = useState("");

  const placeSuggestions = useLocationSearch(location);
  const allSuggestions = [
    ...new Set([
      ...locations.map((l) => l.name),
      ...placeSuggestions.map((p) => p.name),
    ]),
  ];

  useEffect(() => {
    if (authed) {
      loadPhotos();
      loadAlbums();
      loadLocations();
    }
  }, [authed]);

  async function loadLocations() {
    const res = await fetch("/api/locations");
    const { data } = await res.json();
    setLocations(data || []);
  }

  async function registerLocation(name) {
    if (!name || !name.trim()) return;
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Failed to register location:", res.status, err);
    }
  }

  async function bulkSetLocation(newLocation) {
    if (!newLocation.trim()) return;
    await Promise.all(
      [...selectedIds].map((id) =>
        fetch(`/api/photos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: newLocation.trim() }),
        }),
      ),
    );
    await registerLocation(newLocation);
    setBulkLocation("");
    setSelectedIds(new Set());
    loadPhotos();
    loadLocations();
  }

  async function setCover(photoId, albumSlug) {
    await fetch(`/api/albums/${albumSlug}/cover`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo_id: photoId }),
    });
    alert("Cover updated!");
  }

  const [selectedIds, setSelectedIds] = useState(new Set());

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map((p) => p.id)));
    }
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} photo(s)?`)) return;
    await Promise.all(
      [...selectedIds].map((id) =>
        fetch(`/api/photos/${id}`, { method: "DELETE" }),
      ),
    );
    setSelectedIds(new Set());
    loadPhotos();
  }

  async function bulkMove(newAlbum) {
    await Promise.all(
      [...selectedIds].map((id) =>
        fetch(`/api/photos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ album: newAlbum }),
        }),
      ),
    );
    setSelectedIds(new Set());
    loadPhotos();
  }

  function startEdit(a) {
    setEditingSlug(a.slug);
    setEditTitle(a.title);
    setEditDesc(a.description || "");
  }

  async function saveEdit(slug) {
    await fetch(`/api/albums/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDesc }),
    });
    setEditingSlug(null);
    loadAlbums();
  }

  async function loadPhotos() {
    try {
      const res = await fetch("/api/photos");
      const { data } = await res.json();
      setPhotos(data || []);
    } catch (err) {
      console.error("Failed to load photos:", err);
      setPhotos([]);
    }
  }
  async function loadAlbums() {
    const res = await fetch("/api/albums");
    const { data } = await res.json();
    setAlbums(data || []);
    if (data?.[0]) setAlbum(data[0].slug);
  }

  async function handleCreateAlbum(e) {
    e.preventDefault();
    const slug = newAlbumTitle.toLowerCase().trim().replace(/\s+/g, "-");
    await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        title: newAlbumTitle,
        description: newAlbumDesc,
      }),
    });
    setNewAlbumTitle("");
    setNewAlbumDesc("");
    loadAlbums();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setMessage("Wrong password");
    }
  }

  async function uploadOne(file) {
    const isVideo = file.type.startsWith("video/");
    let uploadFile = file;

    if (!isVideo) {
      try {
        uploadFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: "image/jpeg",
        });
      } catch (err) {
        console.warn("Compression failed, uploading original:", err);
        uploadFile = file;
      }
    }

    const signRes = await fetch("/api/sign-upload", { method: "POST" });
    const { timestamp, signature, cloudName, apiKey, folder } =
      await signRes.json();

    const resourceType = isVideo ? "video" : "image";

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: "POST", body: formData },
    );
    const uploaded = await uploadRes.json();
    if (uploaded.error) throw new Error(uploaded.error.message);

    let finalUrl = uploaded.secure_url;
    finalUrl = isVideo
      ? finalUrl.replace(/\.\w+$/, ".mp4")
      : finalUrl.replace(/\.\w+$/, ".jpg");

    await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        album,
        src: finalUrl,
        public_id: uploaded.public_id,
        resource_type: resourceType,
        caption,
        location,
      }),
    });

    setUploadedCount((c) => c + 1);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setMessage("");
    setUploadedCount(0);
    setTotalToUpload(files.length);

    const concurrency = 3;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      const results = await Promise.allSettled(batch.map(uploadOne));
      successCount += results.filter((r) => r.status === "fulfilled").length;
      failCount += results.filter((r) => r.status === "rejected").length;
    }

    if (location.trim()) {
      await registerLocation(location);
    }

    setMessage(
      failCount === 0
        ? `Uploaded ${successCount} file(s) successfully!`
        : `Uploaded ${successCount} file(s), ${failCount} failed.`,
    );
    setFiles([]);
    setCaption("");
    setLocation("");
    loadPhotos();
    loadLocations();
    setUploading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    loadPhotos();
  }

  async function handleDeleteAlbum(slug) {
    if (!confirm(`Delete the "${slug}" album? This only works if it's empty.`))
      return;

    const res = await fetch(`/api/albums/${slug}`, { method: "DELETE" });
    const result = await res.json();

    if (!res.ok) {
      alert(result.error);
      return;
    }

    loadAlbums();
  }

  async function updatePhotoLocation(id, newLocation) {
    await fetch(`/api/photos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: newLocation }),
    });
    if (newLocation.trim()) {
      await registerLocation(newLocation);
      loadLocations();
    }
    loadPhotos();
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-24 px-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-xl">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-black/20 dark:border-white/20 bg-transparent px-4 py-2 rounded placeholder:text-black/40 dark:placeholder:text-white/40"
          />
          <button className="border border-black/30 dark:border-white/30 px-4 py-2 rounded">
            Login
          </button>
          {message && <p className="text-red-400 text-sm">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <datalist id="location-suggestions">
        {allSuggestions.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <form
        onSubmit={handleCreateAlbum}
        className="space-y-3 mb-12 border-b border-black/10 dark:border-white/10 pb-8"
      >
        <h2 className="text-lg">Create New Album</h2>
        <input
          type="text"
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
          placeholder="Album title (e.g. Wildlife)"
          required
          className="w-full border border-black/20 dark:border-white/20 bg-transparent px-4 py-2 rounded placeholder:text-black/40 dark:placeholder:text-white/40"
        />
        <input
          type="text"
          value={newAlbumDesc}
          onChange={(e) => setNewAlbumDesc(e.target.value)}
          placeholder="Short description"
          className="w-full border border-black/20 dark:border-white/20 bg-transparent px-4 py-2 rounded placeholder:text-black/40 dark:placeholder:text-white/40"
        />
        <button className="border border-black/30 dark:border-white/30 px-4 py-2 rounded">
          Create Album
        </button>
      </form>

      <div className="mb-12 border-b border-black/10 dark:border-white/10 pb-8">
        <h2 className="text-lg mb-4">Manage Albums</h2>
        <div className="space-y-3">
          {albums.map((a) => (
            <div
              key={a.slug}
              className="border border-black/10 dark:border-white/10 rounded p-3"
            >
              {editingSlug === a.slug ? (
                <div className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-black/20 dark:border-white/20 bg-transparent px-3 py-1 rounded text-sm"
                  />
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Description"
                    className="w-full border border-black/20 dark:border-white/20 bg-transparent px-3 py-1 rounded text-sm placeholder:text-black/40 dark:placeholder:text-white/40"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(a.slug)}
                      className="text-xs border border-black/30 dark:border-white/30 px-3 py-1 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSlug(null)}
                      className="text-xs text-black/50 dark:text-white/50 px-3 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      {a.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(a)}
                      className="text-xs border border-black/30 dark:border-white/30 px-3 py-1 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(a.slug)}
                      className="text-xs border border-red-400/50 text-red-400 px-3 py-1 rounded hover:bg-red-400 hover:text-black"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-lg">Upload Photo / Video</h2>
      <form onSubmit={handleUpload} className="space-y-4 mb-16">
        <select
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          className="w-full border border-black/20 dark:border-white/20 bg-white dark:bg-black px-4 py-2 rounded"
        >
          {albums.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          list="location-suggestions"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Location"
          className="w-full border border-black/20 dark:border-white/20 bg-transparent px-4 py-2 rounded placeholder:text-black/40 dark:placeholder:text-white/40"
        />

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border border-black/30 dark:border-white/30 px-6 py-2 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            Choose Photo or Video
          </button>
          {uploading && totalToUpload > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-black/60 dark:text-white/60 mb-1">
                <span>Uploading...</span>
                <span>
                  {uploadedCount} / {totalToUpload}
                </span>
              </div>
              <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black dark:bg-white transition-all duration-300"
                  style={{
                    width: `${(uploadedCount / totalToUpload) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="w-full border border-black/20 dark:border-white/20 bg-transparent px-4 py-2 rounded placeholder:text-black/40 dark:placeholder:text-white/40"
        />

        <button
          disabled={uploading}
          className="border border-black/30 dark:border-white/30 px-6 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p className="text-sm text-black dark:text-white">{message}</p>
        )}
      </form>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg">Existing photos ({photos.length})</h2>
        {photos.length > 0 && (
          <label className="flex items-center gap-2 text-xs text-black/60 dark:text-white/60 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === photos.length && photos.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4"
            />
            Select all
          </label>
        )}
      </div>
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 border border-black/20 dark:border-white/20 rounded">
          <span className="text-sm">{selectedIds.size} selected</span>

          <button
            onClick={bulkDelete}
            className="text-xs border border-red-400/40 text-red-400 px-3 py-1.5 rounded hover:bg-red-400 hover:text-black transition-colors"
          >
            Delete selected
          </button>

          <select
            onChange={(e) => e.target.value && bulkMove(e.target.value)}
            className="text-xs border border-black/20 dark:border-white/20 bg-white dark:bg-black px-3 py-1.5 rounded"
          >
            <option value="">Move to album...</option>
            {albums.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.title}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="text"
              list="location-suggestions"
              value={bulkLocation}
              onChange={(e) => setBulkLocation(e.target.value)}
              placeholder="Set location for all..."
              className="text-xs border border-black/20 dark:border-white/20 bg-transparent px-3 py-1.5 rounded placeholder:text-black/40 dark:placeholder:text-white/40"
            />
            <button
              onClick={() => bulkSetLocation(bulkLocation)}
              disabled={!bulkLocation.trim()}
              className="text-xs border border-black/30 dark:border-white/30 px-3 py-1.5 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
        {photos.map((p) => (
          <div key={p.id} className="relative">
            <input
              type="checkbox"
              checked={selectedIds.has(p.id)}
              onChange={() => toggleSelect(p.id)}
              className="absolute top-2 left-2 z-10 w-4 h-4"
            />
            {p.resource_type === "video" ? (
              <video
                src={p.src}
                className="w-full aspect-square object-cover rounded"
                muted
              />
            ) : (
              <img
                src={p.src}
                className="w-full aspect-square object-cover rounded"
              />
            )}
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">
              {p.album}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <svg
                className="w-3 h-3 text-black/50 dark:text-white/50 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                list="location-suggestions"
                defaultValue={p.location || ""}
                onBlur={(e) => updatePhotoLocation(p.id, e.target.value)}
                placeholder="Location"
                className="flex-1 min-w-0 text-xs border border-black/20 dark:border-white/20 bg-transparent px-2 py-1 rounded placeholder:text-black/40 dark:placeholder:text-white/40"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 mt-2">
              <button
                onClick={() => setCover(p.id, p.album)}
                className="flex-1 text-xs border border-black/20 dark:border-white/20 px-2 py-1.5 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                Set as cover
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex-1 text-xs border border-red-400/40 text-red-400 px-2 py-1.5 rounded hover:bg-red-400 hover:text-black transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
