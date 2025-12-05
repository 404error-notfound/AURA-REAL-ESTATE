export default function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder = "Select an option",
  required = false,
  disabled = false
}) {
  return (
    <div className="w-full flex flex-col items-center">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 text-center">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={disabled}
        className={`max-w-md w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm text-center ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-[#018ABE] focus:border-[#018ABE]'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}