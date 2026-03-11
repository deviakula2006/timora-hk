function TaskToggle({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      className={`
        relative w-16 h-8
        flex items-center
        rounded-full cursor-pointer
        transition-all duration-300

        ${
          checked
            ? "bg-gradient-to-r from-purple-500 to-indigo-500"
            : "bg-gray-300"
        }
      `}
    >

      {/* Glow */}
      {checked && (
        <div className="
          absolute inset-0
          rounded-full
          bg-purple-400
          opacity-30
          blur-xl
        " />
      )}

      {/* Knob */}
      <div
        className={`
          absolute top-1 left-1
          w-6 h-6 bg-white
          rounded-full shadow-md
          transition-all duration-300
          ${checked ? "translate-x-8" : ""}
        `}
      />

    </div>
  );
}

export default TaskToggle;
