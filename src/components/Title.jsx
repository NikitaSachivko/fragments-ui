
const Title = ({ text = "", textColor = "text-purple-900" }) => {
    return <h1 className={`text-5xl mb-10 font-semibold ${textColor}`}>{text}</h1>

}


export default Title