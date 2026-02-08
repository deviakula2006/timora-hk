import { useEffect, useRef, useState } from "react";

function AddTaskModal({ onClose, onSave, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");
const [description, setDescription] = useState(initialData?.description || "");
const [isCompleted, setIsCompleted] = useState(
  initialData?.isCompleted ?? false
);

  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);

  const [existingRecordings, setExistingRecordings] = useState([]);
  const [removedRecordings, setRemovedRecordings] = useState([]);

  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);


  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  /* ================= PREFILL ================= */
  useEffect(() => {
  if (initialData) {
    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setIsCompleted(initialData.isCompleted ?? false);

    setExistingFiles(initialData.attachments || []);
    setExistingRecordings(initialData.recordings || []);

    setFiles([]);
    setAudioBlob(null);
    setRemovedFiles([]);
    setRemovedRecordings([]);
  }
}, [initialData]);



  /* ================= FILES ================= */
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const total = existingFiles.length + files.length + selected.length;

    if (total > 10) {
      alert("Maximum 10 files allowed");
      return;
    }
    setFiles(prev => [...prev, ...selected]);
  };

  const removeNewFile = (i) => {
    const copy = [...files];
    copy.splice(i, 1);
    setFiles(copy);
  };

  const removeExistingFile = (i) => {
    const copy = [...existingFiles];
    const removed = copy.splice(i, 1)[0];
    setExistingFiles(copy);
    setRemovedFiles(prev => [...prev, removed]);
  };

  /* ================= RECORDING ================= */
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

    recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    recorder.start();
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(t => t + 1);
    }, 1000);

    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const removeExistingRecording = (i) => {
    const copy = [...existingRecordings];
    const removed = copy.splice(i, 1)[0];
    setExistingRecordings(copy);
    setRemovedRecordings(prev => [...prev, removed]);
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    onSave({
      title,
      description,
      files,
      audioBlob,
      removedFiles,
      removedRecordings,
      isCompleted
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-5">
          {initialData ? "Edit Task" : "Add Task"}
        </h2>

        {/* TITLE */}
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Description"
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {/* FILES */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Attachments (max 10)</p>
          <input type="file" multiple onChange={handleFileChange} />

          {[...existingFiles].map((f, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-100 mt-2 px-3 py-2 rounded">
              <span className="text-sm">{f.fileName}</span>
              <button onClick={() => removeExistingFile(i)} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          ))}

          {files.map((f, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-100 mt-2 px-3 py-2 rounded">
              <span className="text-sm">{f.name}</span>
              <button onClick={() => removeNewFile(i)} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* RECORDINGS */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Voice Notes (max 3)</p>

          {!isRecording ? (
            <button onClick={startRecording} className="bg-purple-600 text-white px-4 py-2 rounded">
              Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="bg-red-500 text-white px-4 py-2 rounded">
              Stop ({recordingTime}s)
            </button>
          )}

          {audioBlob && (
            <div className="flex justify-between items-center bg-gray-100 mt-2 p-2 rounded">
              <audio controls src={URL.createObjectURL(audioBlob)} />
              <button onClick={() => setAudioBlob(null)} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          )}

          {existingRecordings.map((r, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-100 mt-2 p-2 rounded">
              <audio controls src={`http://localhost:9000${r.fileUrl}`} />
              <button onClick={() => removeExistingRecording(i)} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* STATUS */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2">
            <input type="radio" checked={!isCompleted} onChange={() => setIsCompleted(false)} />
            Todo
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={isCompleted} onChange={() => setIsCompleted(true)} />
            Completed
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-purple-600 text-white px-5 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
