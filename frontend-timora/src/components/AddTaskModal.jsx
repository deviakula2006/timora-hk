import { useRef, useState, useEffect } from "react";

function AddTaskModal({ onClose, onSave, initialData }) {
  // -------- FORM STATE --------
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isCompleted, setIsCompleted] = useState(initialData?.isCompleted || false);

  // -------- EXISTING DATA (EDIT MODE) --------
  const [existingFiles, setExistingFiles] = useState(initialData?.files || []);
  const [existingAudioUrl, setExistingAudioUrl] = useState(initialData?.audioUrl || null);

  // -------- NEW DATA --------
  const [files, setFiles] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);

  // -------- AUDIO STATE --------
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // -------- REMOVE HELPERS --------
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAudio = () => {
    if (audioURL?.startsWith("blob:")) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioBlob(null);
    setAudioURL(null);
  };

  const removeExistingAudio = () => {
    setExistingAudioUrl(null);
  };

  // -------- START RECORDING --------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        blob.name = "voice-note.webm";
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone permission denied");
    }
  };

  // -------- STOP RECORDING --------
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  };

  // -------- SAVE --------
  const handleSave = () => {
    if (!title.trim()) return alert("Task title required");

    stopRecording();

    onSave({
      title,
      description,
      isCompleted,
      files,                 // new files
      audioBlob,             // new audio
      existingFiles,         // remaining old files
      existingAudioUrl       // remaining old audio
    });
  };

  // cleanup blob url
  useEffect(() => {
    return () => {
      if (audioURL?.startsWith("blob:")) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6">

        <h2 className="text-xl font-bold text-purple-700 mb-4">
          {initialData ? "Edit Task" : "Add New Task"}
        </h2>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Task title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded mb-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* EXISTING FILES */}
        {existingFiles.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Attached files</p>
            <ul className="space-y-1">
              {existingFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded text-sm"
                >
                  <span className="truncate">{file.split("/").pop()}</span>
                  <button
                    onClick={() => removeExistingFile(index)}
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FILE UPLOAD */}
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...files, ...e.target.files])}
          className="mb-4"
        />

        {/* NEW FILES PREVIEW */}
        {files.length > 0 && (
          <ul className="mb-4 space-y-1">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded text-sm"
              >
                <span className="truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* EXISTING AUDIO */}
        {existingAudioUrl && !audioBlob && (
          <div className="mb-4 flex items-center gap-3">
            <audio controls src={existingAudioUrl} className="flex-1" />
            <button
              onClick={removeExistingAudio}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        )}

        {/* RECORDING */}
        <div className="mb-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              🎙 Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              ⏹ Stop Recording
            </button>
          )}

          {audioURL && (
            <div className="mt-3 flex items-center gap-3">
              <audio controls src={audioURL} className="flex-1" />
              <button
                onClick={removeAudio}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-3 mb-5">
          <span>Todo</span>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => setIsCompleted(!isCompleted)}
          />
          <span>Completed</span>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white rounded">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddTaskModal;
