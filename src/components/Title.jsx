
const Title = ({ text = "", textColor = "text-black" }) => {
    return <h1 className={`text-5xl mb-10 font-semibold ${textColor}`}>{text}</h1>

}


export default Title