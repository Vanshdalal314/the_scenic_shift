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

  const placeSuggestions = useLocationSearch(location);
  const allSuggestions = [
    ...new Set([...locations.map((l) => l.name), ...placeSuggestions]),
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
    await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
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
          placeholder="Location (e.g. Gangtok, Sikkim)"
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

      <h2 className="text-lg mb-4">Existing photos ({photos.length})</h2>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((p) => (
          <div key={p.id} className="relative">
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
            <input
              type="text"
              list="location-suggestions"
              defaultValue={p.location || ""}
              onBlur={(e) => updatePhotoLocation(p.id, e.target.value)}
              placeholder="Add location"
              className="w-full text-xs border border-black/20 dark:border-white/20 bg-transparent px-2 py-1 rounded mt-1 placeholder:text-black/40 dark:placeholder:text-white/40"
            />
            <button
              onClick={() => handleDelete(p.id)}
              className="text-xs text-red-400 mt-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
