import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

export function Searchbar() {
    return <>
        <div id="search" className="h-11  pl-5 outline-0 w-120 rounded-full flex items-center m-auto mt-5 bg-gray-100
                ">
            <FontAwesomeIcon icon={faSearch} className="pl-2 text-gray-600" />
            <input type="search" className="w-full h-11 outline-0 pl-2 font-[calibri] 
                    text-lg bg-gray-100"
                placeholder="Search" />
            <button className="w-16 bg-blue-600 h-full rounded-r-full ">
                <FontAwesomeIcon icon={faSearch} className="text-white" />
            </button>
        </div>
    </>
}
