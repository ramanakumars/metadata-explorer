import { useCallback, useEffect, useState, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdArrowDropDown } from "react-icons/md";
import throttle from "lodash.throttle";

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
            {is_visible === "visible" &&
                <div className={'flex flex-col flex-nowrap fixed mx-auto z-10 w-3/4 h-3/4 top-1/2 left-1/2 box-border bg-white -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg overflow-hidden border-black border-2'}>
                    <div className='w-full flex flex-row justify-end'>
                        <button onClick={togglePopup} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white hover:border-black">
                            <RxCross2 className="w-full h-4" />
                        </button>
                    </div>

                    <div className="w-full flex flex-col justify-evenly [&>*]:my-2 overflow-hidden">
                        <span>
                            Total number of entries: {data.length}
                        </span>

                        <div className="flex flex-col">
                            <h1 className="font-bold text-md">Variables:</h1>
                            <div className='grid grid-cols-4 gap-4'>
                                {variables.map((variable) => (
                                    <VariableInfo key={variable.name} variable={variable} />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col justify-start box-border overflow-hidden">
                            <h1 className="font-bold text-md">Data:</h1>
                            <DataTable data={data} variables={variables} />
                        </div>
                    </div>
                </div>
            }
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

const DataTable = ({ data, variables }) => {
    const [displayStart, setDisplayStart] = useState(0);
    const [displayEnd, setDisplayEnd] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const table = useRef(null);
    const [height, setHeight] = useState(0);
    const [dataRows, setDataRows] = useState([]);
    const [itemRowHeight, setItemRowHeight] = useState(32);

    const view_height = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );


    useEffect(() => {
        setHeight(data.length * itemRowHeight);
    });

    const offset = view_height; // We want to render more than we see, or else we will see nothing when scrolling fast

    const rowsToRender = Math.floor((view_height + offset) / itemRowHeight);

    const setDisplayPositions = useCallback(
        (scroll) => {
            // we want to start rendering a bit above the visible screen
            const scrollWithOffset = Math.floor(scroll - rowsToRender - offset / 2);

            // start position should never be less than 0
            const displayStartPosition = Math.round(
                Math.max(0, Math.floor(scrollWithOffset / itemRowHeight))
            );

            // end position should never be larger than our data array
            const displayEndPosition = Math.round(
                Math.min(displayStartPosition + rowsToRender, data.length)
            );

            setDisplayStart(displayStartPosition);
            setDisplayEnd(displayEndPosition);
        },
        [data.length]
    );

    useEffect(() => {
        if(!table.current) {
            return;
        }

        const onScroll = throttle(() => {
            const scrollTop = table.current.scrollTop;
            if (data.length !== 0) {
                setScrollPosition(scrollTop);
                setDisplayPositions(scrollTop);
            }
        }, 100);
        table.current.addEventListener("scroll", onScroll);

        return () => {
            if(table.current) {
                table.current.removeEventListener("scroll", onScroll);
            }
        };
    }, [setDisplayPositions, data.length, table]);

    useEffect(() => {
        setDisplayPositions(scrollPosition);
    }, [scrollPosition, setDisplayPositions]);


    useEffect(() => {
        const rows = [];

        rows.push(
            <tr
                key="startRowFiller"
                style={{ height: displayStart * itemRowHeight }}
            ></tr>
        );

        // add the rows to actually render
        for (let i = displayStart; i < displayEnd; ++i) {
            const row = data[i];
            if (row !== undefined) {
                rows.push(
                    <tr key={row.id} className="Row">
                        <td>{row.id}</td>
                        {variables.map((variable) => (
                            <td>{Math.round(row.metadata[variable.name] * 10000) / 10000}</td>
                        ))}
                    </tr>
                );
            }
        }

        // add a filler row at the end. The further up we scroll the taller this will be
        rows.push(
            <tr
                key="endRowFiller"
                style={{ height: (data.length - displayEnd) * itemRowHeight }}
            ></tr>
        );

        setDataRows(rows);
    }, [displayStart, displayEnd]);

    return (
        <table className="mx-2 w-content block text-center [&>*>*]:font-mono border-collapse [&>*>*]:border [&>*>*]:border-black overflow-y-scroll overflow-x-scroll py-2" ref={table}>
            <tr className="[&>th]:min-w-32 font-bold">
                <th scope="col">id</th>
                {variables.map((variable) => (
                    <th scope="col">{variable.name}</th>
                ))}
            </tr>
            <tbody className="[&>*>*]:font-mono border-collapse [&>*>*]:border [&>*>*]:border-black py-2">
                {dataRows}
            </tbody>
        </table>
    )
}