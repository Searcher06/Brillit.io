import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog, faPlus, faRedo, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle"
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH"
import { faCopy, faPaperPlane, faPlayCircle } from "@fortawesome/free-regular-svg-icons"


let chats = [
    "Vite config error fixing error react",
    "Explain the big bang theory",
    "Vite config error fixing error react",
    "what is the best way to learn javascript",
    "Regex basics in javascript 2025",
    "Vite config error fixing error react",
    "what is the best way to learn javascript",
    "Vite config error fixing error react",
    "How can I improve my time management",
]
chats = chats.concat(chats.slice(0, chats.length))

const conversation = [
    {
        type: "prompt",
        content: "Hi my name is Ahmad Ibrahim"
    },
    {
        type: "response",
        content: "Nice to meet you Ahmad!, how can I help ?"
    },
    {
        type: "prompt",
        content: "Who are you ?"
    },
    {
        type: "response",
        content: "Am a large language model trained on large sets of data"
    },
    {
        type: "prompt",
        content: "Generate a random lorem test"
    },
    {
        type: "response",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit maiores explicabo vel adipisci, fugiat a veniam animi debitis rem deleniti itaque ea quia maxime facilis iure! Ullam facilis quasi modi?Animi autem reprehenderit odit numquam expedita pariatur quam saepe dicta, asperiores natus qui dolores vero ex perspiciatis magnam quos, repellendus ducimus! Fugit molestiae minima suscipit modi doloremque exercitationem porro ad."
    },
    {
        type: "prompt",
        content: "Generate again"
    },
    {
        type: "response",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit maiores explicabo vel adipisci, fugiat a veniam animi debitis rem deleniti itaque ea quia maxime facilis iure! Ullam facilis quasi modi?Animi autem reprehenderit odit numquam expedita pariatur quam saepe dicta, asperiores natus qui dolores vero ex perspiciatis magnam quos, repellendus ducimus! Fugit molestiae minima suscipit modi doloremque exercitationem porro ad."
    },


]

export function Chatbot() {
    return <>
        <section id="wrapper">
            <section id="nav_bar" className="h-14 w-full">
                <div id="top-left-bar"
                    className="flex justify-between items-center fixed h-14  w-[18%] z-10 bg-gray-50">
                    <div className="text-2xl text-blue-600 font-semibold ml-4 mr-5">SynthAi</div>
                    <div className="mr-5">
                        <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600" />
                    </div>
                </div>
                <div id="top-right-bar" className="fixed h-14 w-[82%] z-10 top-0 
                right-0 border-b border-b-gray-300 flex items-center justify-between bg-gray-50">
                    <div className="ml-5 font-[calibri] text-[18px]">
                        <select name="sl" id="sl">
                            <option value="Gemini 4.0">Gemini 4.0</option>
                            <option value="Gemini 2.5">Gemini 2.5 flash</option>
                            <option value="Gemini 1.5 flash">Gemini 1.5 flash</option>
                        </select>
                    </div>
                    <div className="mr-5">
                        <button className="w-25 h-10 bg-blue-600 text-white text-sm rounded-sm font-[calibri]">
                            <FontAwesomeIcon icon={faPlus} /> New chat
                        </button>
                    </div>
                </div>
            </section>
            <section id="sidebar" className="h-lvh w-[18%] fixed bg-gray-50 flex flex-col items-center overflow-x-hidden overflow-y-auto">

                <div id="profile" className=" w-full mt-10 flex justify-between items-center">
                    <div className="flex items-center ml-4">
                        <div className="bg-[url('/src/assets/bot2.jpeg')] w-7 h-7 bg-center bg-cover rounded-full"></div>
                        <span className="text-sm font-sans text-gray-800  pl-1">Ahmad Ibrahim</span>
                    </div>
                    <div className="mr-5">
                        <FontAwesomeIcon icon={faCog} className="text-gray-600" />
                    </div>
                </div>
                <div id="search" className="w-52 mt-4 ml-4 mr-5 flex items-center bg-white rounded-[4px]
                shadow-sm">
                    <FontAwesomeIcon icon={faSearch} className="pl-2 text-gray-600" />
                    <input type="search" className="w-full h-9 outline-0 pl-2 font-[calibri] 
                    text-sm"
                        placeholder="Search for chats" />
                </div>
                <div id="chat_history" className="mt-14 ml-4 mr-5">
                    <p className="text-[12px] font-[calibri] tracking-wider text-gray-500">CHAT HISTORY</p>
                    <div className="text-gray-700 text-[13px] mt-3 h-80 ">
                        {
                            chats.map((current, index) => {
                                return <p key={index}
                                    className="mt-2"
                                >{current.slice(0, 28)}</p>
                            })
                        }
                    </div>
                </div>

            </section>
            <section id="main_content" className="h-lvh pl-[18.5%] w-full flex justify-center ">
                <div id="conversation" className="w-187 mt-8 flex flex-col">
                    {
                        conversation.map((element, index) => {
                            const condition = index === conversation.length - 1 ? "pb-40" : "pb-0"
                            if (element.type === "prompt") {
                                return (
                                    <div key={index} className="w-full flex justify-end mb-4">
                                        <div className="text-[16.5px] font-[calibri] w-[55%] flex justify-end">
                                            <span className="p-4 rounded-b-4xl rounded-tl-4xl bg-blue-100 text-gray-900">{element.content}</span>
                                        </div>
                                    </div>
                                )
                            } else {
                                console.log(condition)
                                return (
                                    <div key={index} className={`w-full text-[16.5px] font-[calibri]  ${condition}`}>
                                        <div className="w-[100%] text-gray-800">
                                            {element.content}
                                        </div>
                                        <div className="mt-1 w-18 flex justify-between text-gray-600">
                                            <button className="hover:text-gray-900"><FontAwesomeIcon icon={faCopy} /></button>
                                            <button className="hover:text-gray-900"><FontAwesomeIcon icon={faPlayCircle} /></button>
                                            <button className="hover:text-gray-900"><FontAwesomeIcon icon={faRedo} /></button>

                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <div className="fixed bottom-10 border-gray-200 border-2 h-28 
                rounded-2xl w-188 z-10 bg-white">
                    <input type="text" className="w-full h-10 outline-0 pl-4 text-base bg-white" placeholder="Ask anything" />
                    <div className="flex items-center justify-between h-20">
                        <button className="pl-4 text-gray-900 hover:text-gray-950">
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </button>
                        <button className="pr-4 text-gray-900 hover:text-blue-600">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>

            </section>
        </section>
    </>
}