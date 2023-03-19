import { fragmentTypeAtom } from '../../global-state'
import { useAtom } from 'jotai'

const Dropdown = () => {

    const [fragmentType, setFragmentType] = useAtom(fragmentTypeAtom)

    const handleFragmentTypeChange = (e) => {
        setFragmentType(e.target.value)
    }

    return (
        <select onChange={handleFragmentTypeChange} className="
                hover:bg-zinc-100
                col-span-2
                w-full p-2.5 
                text-black
                bg-white border 
                border-zinc-500
                shadow-sm outline-none 
                appearance-none 
                rounded-md
                ">
            <option>text/plain</option>
            <option>text/markdown</option>
            <option>text/html</option>
            <option>application/json</option>
        </select>
    )
}


export default Dropdown