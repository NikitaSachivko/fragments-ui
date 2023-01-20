
const Button = ({ disabled = false, text = "", onClick = () => { } }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${disabled ? "text-zinc-500" : "hover:bg-zinc-300 text-black"} bg-zinc-100 font-semibold py-2 px-4 rounded-full`}>
            {text}
        </button>
    )
}

export default Button
