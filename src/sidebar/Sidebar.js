import { useEffect, useState } from "react";
import '../css/index.css';
import MetadataPicker from "./MetadataPicker";
import PlotControls from "./PlotControl";
import FilePicker from "./FilePicker";

/* validate the metadata file, which should be list of dictionaries
 * with keys (id, url, metadata) in each dictionary
 */
const validateMetadata = (metadata) => {
    if (!Array.isArray(metadata)) {
        return [];
    }
    const hasKeys = (meta) => (
        ['id', 'url', 'metadata'].every((key) => (
            meta[key] !== undefined
        ))
    );

    // return only the keys that match the filter
    return metadata.filter(hasKeys);
}

export default function Sidebar({ setParentData }) {
    const [file, setFile] = useState(null);
    const [data, setMetadata] = useState([]);
    const [variables, setVariables] = useState([]);
    const [plot_metadata, setPlotMetadata] = useState({});
    const [plot_controls, setPlotControls] = useState({});

    /* read in a file and set the metadata */
    const readFile = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = e => {
            setMetadata(validateMetadata(JSON.parse(e.target.result)));
        }
    }

    /* hook to update the Sidebar class when file is changed */
    useEffect(() => {
        setMetadata([]);
        if ((file !== null)) {
            readFile(file);
        } else {
            setMetadata([]);
        }
    }, [file]);

    /* reset the plotting if the data or variables are bad */
    useEffect(() => {
        if (data.length < 1) {
            setPlotMetadata({});
            setVariables([]);
            setParentData({});
        }
    }, [data])

    /* check the plot metadata and enable plotting after validating */
    useEffect(() => {
        if (data.length === 0) {
            return;
        }

        const _variables = variables.map((vari) => vari.name);
        if ((plot_metadata.x !== undefined) && (plot_metadata.y !== undefined) && (_variables.includes(plot_metadata.x)) && (_variables.includes(plot_metadata.y))) {
            const _plot_data = {
                plot_variables: plot_metadata,
                data: data.map((dat) => (
                    {
                        id: dat.id,
                        url: dat.url,
                        x: dat.metadata[plot_metadata.x],
                        y: dat.metadata[plot_metadata.y],
                        // pass in null values to the color if "None" is selected
                        c: plot_metadata.c == "None" ? null : dat.metadata[plot_metadata.c]
                    }
                ))
            };
            setParentData(_plot_data);
        }
    }, [data, variables, plot_metadata]);

    /* when the data is set, loop through it and get the
     * relevant plotting variables
     */
    useEffect(() => {
        if (data.length > 0) {
            // get the variables from the first data entry
            let _variables = Object.keys(data[0].metadata);

            // loop over the metadata keys and find the minimum and maximum
            let variable_data = _variables.map((variable) => {
                console.log('Getting info for ' + variable);
                let var_data = {};
                var_data.name = variable;

                let variable_sub = data.map((dati) => (dati.metadata[variable]));

                var_data.minValue = var_data.currentMin = Math.min(...variable_sub);
                var_data.maxValue = var_data.currentMax = Math.max(...variable_sub);
                return var_data;
            });

            // filter out non numeric metadata keys
            variable_data = variable_data.filter(
                (vari) => (
                    ((!isNaN(vari.minValue)) || (!isNaN(vari.maxValue)))
                )
            );

            setVariables(variable_data);
        }
    }, [data]);

    return (
        <div id='sidebar' className='min-h-dvh col-span-1 bg-slate-400 flex-auto flex-col'>
            <FilePicker
                setFile={setFile}
            />
            {variables.length > 0 ?
                <MetadataPicker
                    variables={variables}
                    handleChange={setPlotMetadata}
                />
                :
                <></>
            }
            {file !== null ?
                <PlotControls />
                :
                <></>
            }
        </div>
    )
}
