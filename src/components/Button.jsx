const Button = ({ disabled = false, text = "", onClick = () => { } }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${disabled ? "cursor-not-allowed bg-gray-200" : "hover:bg-gray-100 bg-purple-300"}  text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow`}>
            {text}
        </button>
    )
}

export default Button
