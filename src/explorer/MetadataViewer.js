import { useCallback, useEffect, useState, useRef, useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdArrowDropDown } from "react-icons/md";
import throttle from "lodash.throttle";
import { DataContext, VariableContext } from "../App";

const visibility_states = ['hidden', 'visible']

export default function MetadataViewer({ }) {
    const [is_visible, setVisible] = useState(visibility_states[0]);
    const { data, setMetadata } = useContext(DataContext);
    const { variables, setVariables } = useContext(VariableContext);

    const togglePopup = () => {
        setVisible(visibility_states[+!visibility_states.indexOf(is_visible)]);
    };

    return (
        <>
            <div className={"bg-primary-100 fixed left-0 top-0 bottom-0 right-0 h-full w-full opacity-50 z-10 overflow-clip " + is_visible} onClick={togglePopup}>
                &nbsp;
            </div>
            <div className="flex flex-row justify-center">
                <button onClick={togglePopup} className="min-h-8 w-40 text-white bg-primary-800 hover:bg-primary-600">View data</button>
            </div>
            {is_visible === "visible" &&
                <div className={'flex flex-col flex-nowrap fixed mx-auto z-20 w-3/4 h-5/6 top-1/2 left-1/2 box-border bg-white -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg overflow-hidden border-black border-2'}>
                    <div className='w-full flex flex-row justify-end'>
                        <button onClick={togglePopup} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white hover:border-black">
                            <RxCross2 className="w-full h-4" />
                        </button>
                    </div>

                    <span>
                        Total number of entries: {data.length}
                    </span>

                    <div className="w-full grid grid-cols-5 justify-evenly [&>*]:my-2 z-20 overflow-x-visible overflow-y-hidden">
                        <div id='variable-container' className="flex flex-col col-span-1 overflow-y-scroll scroll-smooth">
                            <h1 className="font-bold text-md">Variables:</h1>
                            <div className='grid grid-cols-1 gap-4'>
                                {variables.map((variable) => (
                                    <VariableInfo key={variable.name} variable={variable} />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center box-border col-span-4 overflow-hidden">
                            <h1 className="font-bold text-md">Data:</h1>
                            <DataTable />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

const VariableInfo = ({ variable }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(open) {
            document.getElementById(variable.name + "_details").scrollIntoView();
        }
    }, [open]);

    return (
        <div id={variable.name + "_details"} className="p-0">
            <div className='bg-secondary-300 my-0 min-h-10 p-2 text-black rounded-sm box-border'>
                <div className="flex flex-row justify-between cursor-pointer" onClick={(e) => {setOpen(!open)}} >
                    <span>{variable.name}</span>
                    <button className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white">
                        <MdArrowDropDown className="w-full h-4" />
                    </button>
                </div>
            </div>
            {open &&
                /* when hovering, display the panel */
                <div className="relative my-0 w-full bg-primary-300 text-black grid grid-cols-2 gap-4 left-0 p-2">
                    <span>Type: </span> <span>{variable.dtype}</span>
                    <span>Minimum:</span> <span>{Math.round(variable.minValue * 10000) / 10000}</span>
                    <span>Maximum: </span> <span>{Math.round(variable.maxValue * 10000) / 10000}</span>
                </div>
            }
        </div>
    )
}


/* adapted from https://www.bekk.christmas/post/2021/2/how-to-lazy-render-large-data-tables-to-up-performance */
const DataTable = ({ }) => {
    const [displayStart, setDisplayStart] = useState(0);
    const [displayEnd, setDisplayEnd] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const table = useRef(null);
    const [dataRows, setDataRows] = useState([]);
    const itemRowHeight = 32; // 32 pixels (defined in index.css)
    const { data, setMetadata } = useContext(DataContext);
    const { variables, setVariables } = useContext(VariableContext);

    const view_height = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );

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
        [data.length, offset, rowsToRender]
    );

    useEffect(() => {
        if (!table.current) {
            return;
        }

        let _table = table.current;

        const onScroll = throttle(() => {
            const scrollTop = _table.scrollTop;
            if (data.length !== 0) {
                setScrollPosition(scrollTop);
                setDisplayPositions(scrollTop);
            }
        }, 50);
        _table.addEventListener("scroll", onScroll);

        return () => {
            if (_table) {
                _table.removeEventListener("scroll", onScroll);
            }
        };
    }, [setDisplayPositions, data.length]);

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
                        <td key={row.id + " id"}>{row.id}</td>
                        {variables.map((variable) => (
                            <td key={row.id + " " + variable.name}>{Math.round(row.metadata[variable.name] * 10000) / 10000}</td>
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
        <table className="mx-2 h-max w-content block text-center [&>*>*>*]:min-w-32 [&>*>*>*]:font-mono border-collapse [&>*>*>*]:border [&>*>*>*]:border-black overflow-y-scroll overflow-x-scroll py-2" ref={table}>
            <thead>
                <tr className="font-bold">
                    <th key='id' scope="col">id</th>
                    {variables.map((variable) => (
                        <th key={variable.name} scope="col">{variable.name}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dataRows}
            </tbody>
        </table>
    )
}