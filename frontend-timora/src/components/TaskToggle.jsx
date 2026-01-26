function TaskToggle({ checked, onChange }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* TOGGLE */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        {/* TRACK */}
        <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>

        {/* KNOB */}
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
      </label>

      {/* LABEL */}
      <span
        className={`text-xs font-medium ${
          checked ? "text-green-600" : "text-gray-500"
        }`}
      >
        {checked ? "Completed" : "Todo"}
      </span>
    </div>
  );
}

export default TaskToggle;
