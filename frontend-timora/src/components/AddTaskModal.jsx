import { useEffect, useRef, useState } from "react";

function AddTaskModal({ onClose, onSave, initialData }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);

  const [existingRecordings, setExistingRecordings] = useState([]);
  const [removedRecordings, setRemovedRecordings] = useState([]);

  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [isCompleted, setIsCompleted] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  /* ===== PREFILL ===== */
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setExistingFiles(initialData.attachments || []);
      setExistingRecordings(initialData.recordings || []);
      setIsCompleted(initialData.isCompleted || false);
    }
  }, [initialData]);

  /* ===== FILES ===== */
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (existingFiles.length + files.length + selected.length > 10) {
      alert("Maximum 10 files allowed");
      return;
    }
    setFiles(prev => [...prev, ...selected]);
  };

  const removeNewFile = (i) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingFile = (i) => {
    const removed = existingFiles[i];
    setExistingFiles(prev => prev.filter((_, idx) => idx !== i));
    setRemovedFiles(prev => [...prev, removed]);
  };

  /* ===== RECORDING ===== */
  const startRecording = async () => {
    if (existingRecordings.length + (audioBlob ? 1 : 0) >= 3) {
      alert("Maximum 3 recordings allowed");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = e => audioChunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    recorder.start();
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const removeExistingRecording = (i) => {
    const removed = existingRecordings[i];
    setExistingRecordings(prev => prev.filter((_, idx) => idx !== i));
    setRemovedRecordings(prev => [...prev, removed]);
  };

  /* ===== SAVE ===== */
  const handleSave = () => {
    onSave({
      title,
      description,
      files,
      audioBlob,
      removedFiles: removedFiles.filter(f => f?.fileUrl),
      removedRecordings: removedRecordings.filter(r => r?.fileUrl),
      isCompleted
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Task" : "Add Task"}
        </h2>

        <input className="w-full border p-2 rounded mb-3"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea className="w-full border p-2 rounded mb-3"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <p className="text-xs text-gray-500">Max 10 files</p>
        <input type="file" multiple onChange={handleFileChange} />

        {existingFiles.map((f, i) => (
          <div key={i} className="flex justify-between bg-gray-100 p-2 mt-2 rounded">
            <span>{f.fileName}</span>
            <button onClick={() => removeExistingFile(i)}>Remove</button>
          </div>
        ))}

        {files.map((f, i) => (
          <div key={i} className="flex justify-between bg-gray-100 p-2 mt-2 rounded">
            <span>{f.name}</span>
            <button onClick={() => removeNewFile(i)}>Remove</button>
          </div>
        ))}

        <p className="text-xs text-gray-500 mt-4">Max 3 recordings</p>

        {!isRecording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop ({recordingTime}s)</button>
        )}

        {audioBlob && (
          <div className="mt-2">
            <audio controls src={URL.createObjectURL(audioBlob)} />
            <button onClick={() => setAudioBlob(null)}>Remove</button>
          </div>
        )}

        {existingRecordings.map((r, i) => (
          <div key={i} className="mt-2">
            <audio controls src={`http://localhost:9000${r.fileUrl}`} />
            <button onClick={() => removeExistingRecording(i)}>Remove</button>
          </div>
        ))}

        <div className="flex gap-4 my-4">
          <label><input type="radio" checked={!isCompleted} onChange={() => setIsCompleted(false)} /> Todo</label>
          <label><input type="radio" checked={isCompleted} onChange={() => setIsCompleted(true)} /> Completed</label>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
