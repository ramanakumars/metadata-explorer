import { useEffect, useState } from "react";

export default function Sidebar({ }) {
    const [filename, setFilename] = useState(null);
    const [plot_metadata, setMetadata] = useState([]);
    const [plot_controls, setPlotControls] = useState({});

    useEffect(() => setFilename('hi.json'), []);

    return (
        <div id='sidebar' className='h-dvh col-span-1 bg-slate-400 flex-auto flex-col'>
            <div className="container">
                {filename === null ?
                    <FilePicker />
                    :
                    <div className="container p-4">
                        {filename}
                    </div>
                }
            </div>
            <div className="container">
                {filename !== null ?
                    <MetadataPicker />
                    :
                    <></>
                }
            </div>
            <div className="container">
                {filename !== null ?
                    <PlotControls />
                    :
                    <></>
                }
            </div>
        </div>
    )
}

function FilePicker({ }) {
    return (
        <div className='container p-4'>
            Filepicker
        </div>
    )
}

function MetadataPicker({ }) {
    return (
        <div className='container p-4'>
            MetadataPicker
        </div>
    )
}

function PlotControls({ }) {
    return (
        <div className='container p-4'>
            Plot Controls
        </div>
    )
}