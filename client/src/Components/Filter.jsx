import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FilterContext } from "../Context/FilterContext"
import { useContext } from "react"

export const Filter = () => {
    const { setDisplayfilter } = useContext(FilterContext)

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-950/30 z-50">
                <div className="font-[calibri] w-100 pl-5 pr-5 pt-5 pb-5 shadow rounded-xl bg-white">
                    <div className="flex items-center justify-between">
                        <p className="text-xl">Search filters</p>
                        <button onClick={() => {
                            setDisplayfilter(false)
                        }}>
                            <FontAwesomeIcon icon={faClose} className="hover:text-gray-800 text-xl" />
                        </button>
                    </div>
                    <div className="flex mt-4 w-full justify-between text-[15px]">
                        <div>
                            <p className="text-sm font-semibold border-b-[1px]
                     border-b-gray-300 h-10 w-30">UPLOAD DATE</p>
                            <div className="text-gray-700">
                                <p className="mt-3 hover:text-blue-500 hover:font-semibold">Last year</p>
                                <p className="mt-3 hover:text-blue-500 hover:font-semibold">This week</p>
                                <p className="mt-3 hover:text-blue-500 hover:font-semibold">This month</p>
                                <p className="mt-3 hover:text-blue-500 hover:font-semibold">This year</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold border-b-[1px]
                     border-b-gray-300 h-10 w-30">DURATION</p>
                            <div className="text-gray-700">
                                <p className="mt-3 hover:text-blue-500 hover:font-semibold">Under 10 minutes</p>
                                <p className="mt-3 hover:text-blue-500 hover:font-semibold">10-60 minutes</p>
                                <p className="mt-3 hover:text-blue-500 hover:font-semibold">More than an hour</p>
                                <p className="mt-3 hover:text-blue-500 hover:font-semibold">2-3 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}
