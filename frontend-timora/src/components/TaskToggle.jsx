function TaskToggle({ checked, onChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          } mt-0.5`}
        />
      </div>
    </label>
  );
}

export default TaskToggle;
