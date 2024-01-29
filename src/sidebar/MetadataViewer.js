import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdArrowDropDown } from "react-icons/md";

const visibility_states = ['hidden', 'visible']

export default function MetadataViewer({ data, variables }) {
    const [is_visible, setVisible] = useState(visibility_states[0]);

    const togglePopup = () => {
        setVisible(visibility_states[+!visibility_states.indexOf(is_visible)]);
    };

    return (
        <>
            <div className={"bg-primary-100 absolute left-0 top-0 w-full h-screen opacity-50 z-10 " + is_visible} onClick={togglePopup}>
                &nbsp;
            </div>
            <div className="flex flex-row justify-center">
                <button onClick={togglePopup} className="min-h-8 w-40 text-white bg-primary-800 hover:bg-primary-600">View data</button>
            </div>
            <div className={'fixed mx-auto z-10 w-1/2 h-3/4 top-1/2 left-1/2 box-border bg-white -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg overflow-y-scroll border-black border-2 ' + is_visible}>
                <div className='w-full flex flex-row justify-end'>
                    <button onClick={togglePopup} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white hover:border-black">
                        <RxCross2 className="w-full h-4" />
                    </button>
                </div>

                <div className="w-full flex flex-col justify-evenly">
                    <span>
                        Total number of entries: {data.length}
                    </span>

                    Variables:
                    <div className='grid grid-cols-4 gap-4'>
                        {variables.map((variable) => (
                            <VariableInfo key={variable.name} variable={variable} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const VariableInfo = ({ variable }) => {
    const [open, setOpen] = useState(false);

    const toggleInfo = () => {
        setOpen(!open);
    }

    return (
        <div className='bg-secondary-300 min-h-10 p-2 text-black relative rounded-sm'>
            <div className="flex flex-row justify-between">
                <span>{variable.name}</span>
                <button onClick={toggleInfo} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white hover:border-black">
                    {open ?
                        <RxCross2 className="w-full h-4" />
                        :
                        <MdArrowDropDown className="w-full h-4" />
                    }
                </button>
            </div>
            {open &&
                <div className="absolute w-full m-0 bg-primary-300 text-black grid grid-cols-2 gap-4 z-20 left-0 top-10 p-2 rounded-br-lg rounded-bl-lg">
                    <span>Type: </span> <span>{variable.dtype}</span>
                    <span>Minimum:</span> <span>{Math.round(variable.minValue * 10000) / 10000}</span>
                    <span>Maximum: </span> <span>{Math.round(variable.maxValue * 10000) / 10000}</span>
                </div>
            }
        </div>
    )
}