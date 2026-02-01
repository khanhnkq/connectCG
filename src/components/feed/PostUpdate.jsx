import { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  X,
  Globe,
  Users,
  Lock,
  ChevronDown,
} from "lucide-react";
import { uploadImage } from "../../utils/uploadImage";

export default function PostUpdate({ post, onUpdate, onCancel }) {
  // State
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [existingMedia, setExistingMedia] = useState([]); // Array of URL strings or objects
  const [newFiles, setNewFiles] = useState([]);
  const [showVisMenu, setShowVisMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Initialize state from props
  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setVisibility(post.visibility || "PUBLIC");
      // Ensure we have a consistent format for existing media
      setExistingMedia(post.mediaItems || []);
    }
  }, [post]);

  // Handle selecting new files
  const handleSelectNewFiles = (e) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArr]);
      e.target.value = ""; // Reset input
    }
  };

  // Handle removing media
  const handleRemoveMedia = (index, isNewFile) => {
    if (isNewFile) {
      setNewFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle Save
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // 1. Upload new files
      let newUploadedUrls = [];
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map((file) =>
          uploadImage(file, "posts"),
        );
        newUploadedUrls = await Promise.all(uploadPromises);
      }

      // 2. Merge media
      // Extract URL strings from existingMedia if they are objects
      const oldUrls = existingMedia.map((item) =>
        typeof item === "string" ? item : item.url,
      );
      const finalMediaUrls = [...oldUrls, ...newUploadedUrls];

      // 3. Prepare payload
      const updatedData = {
        content: content,
        visibility: visibility,
        mediaUrls: finalMediaUrls,
      };

      // 4. Call parent update handler
      await onUpdate(post.id, updatedData);

      // onCancel will be called by parent or we can call it here if parent doesn't handle closing
      // But typically parent handles closing after successful update promise resolves
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-200">
      {/* HEADER ROW: Avatar + Name + Visibility */}
      <div className="flex gap-3 mb-3">
        {/* We can reproduce the avatar/name layout here if we want strict visual parity, 
            but usually editing happens "in place". 
            Let's keep it simple: just the visibility selector aligned right or inline. */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {/* If we want to show "Editing" text, make it subtle */}
            <span className="text-sm font-semibold text-primary">
              Editing Post
            </span>

            {/* Visibility Selector */}
            <div className="relative">
              <button
                onClick={() => setShowVisMenu(!showVisMenu)}
                className="flex items-center gap-1 text-[10px] sm:text-xs bg-surface-main px-2 py-0.5 rounded-full border border-border-main text-text-secondary hover:text-primary transition-colors hover:border-primary/30"
              >
                {visibility === "PUBLIC" && <Globe size={10} />}
                {visibility === "FRIENDS" && <Users size={10} />}
                {visibility === "PRIVATE" && <Lock size={10} />}
                <span className="font-medium">{visibility}</span>
                <ChevronDown size={10} />
              </button>

              {showVisMenu && (
                <div className="absolute left-0 top-full mt-1 w-32 bg-surface-main border border-border-main shadow-xl rounded-lg z-50 overflow-hidden py-1">
                  {["PUBLIC", "FRIENDS", "PRIVATE"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setVisibility(mode);
                        setShowVisMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-background-main text-text-main flex items-center gap-2"
                    >
                      {mode === "PUBLIC" && <Globe size={12} />}
                      {mode === "FRIENDS" && <Users size={12} />}
                      {mode === "PRIVATE" && <Lock size={12} />}
                      {mode}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TEXT AREA - Frameless, looking like normal text */}
          <textarea
            className="w-full p-0 bg-transparent border-none text-text-main focus:ring-0 resize-none text-[15px] leading-relaxed placeholder:text-text-secondary/50 min-h-[80px]"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            autoFocus
          />
        </div>
      </div>

      {/* MEDIA PREVIEW */}
      {(existingMedia.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 mb-4">
          {/* Old Media */}
          {existingMedia.map((item, idx) => (
            <div
              key={`old-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden group border border-border-main"
            >
              <img
                src={item.url || item}
                alt="old media"
                className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
              <button
                onClick={() => handleRemoveMedia(idx, false)}
                className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 backdrop-blur-sm"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {/* New Media */}
          {newFiles.map((file, idx) => (
            <div
              key={`new-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden group border-2 border-primary/50"
            >
              <img
                src={URL.createObjectURL(file)}
                alt="new media"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemoveMedia(idx, true)}
                className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 backdrop-blur-sm"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Quick Add Placeholder (optional, if we want to add more) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-border-main flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors group text-text-secondary hover:text-primary"
          >
            <ImageIcon size={20} />
            <span className="text-[10px] font-medium mt-1">Add</span>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <input
        type="file"
        multiple
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={handleSelectNewFiles}
      />

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-border-main/40">
        {/* Left: Add Media Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-text-secondary hover:text-green-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-green-500/10 group"
        >
          <div className="p-1 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
            <ImageIcon size={14} className="text-green-600" />
          </div>
          <span className="text-xs font-medium">Add Photo</span>
        </button>

        {/* Right: Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-1.5 text-xs font-semibold text-text-secondary hover:bg-background-main hover:text-text-main rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-1.5 text-xs font-bold bg-primary text-white rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 transform active:scale-95"
          >
            {isSaving && (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
