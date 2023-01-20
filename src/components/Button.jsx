
const Button = ({ disabled = false, text = "", onClick = () => { } }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${disabled ? "text-zinc-500" : "hover:bg-zinc-300"} bg-zinc-100 text-black font-semibold py-2 px-4 rounded-full`}>
            {text}
        </button>
    )
}

export default Button
