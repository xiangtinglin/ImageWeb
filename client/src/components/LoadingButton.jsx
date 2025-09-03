const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${props.className || ''}`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      <span>{loading ? '處理中...' : children}</span>
    </button>
  );
};


export default LoadingButton;
