import { useEffect, useState, useRef } from "react";
import '../css/index.css';
import MetadataPicker from "./MetadataPicker";
import FilePicker from "./FilePicker";
import { FilterGroup } from "../explorer/VariableFilters";

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
    const [filters, updateFilters] = useState(0);

    const filter_group = useRef(null);

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

        const _data = data.filter(_dat => filter_group.current.checkMetadata(_dat.metadata));

        const _variables = variables.map((vari) => vari.name);
        if ((plot_metadata.x !== undefined) && (plot_metadata.y !== undefined) && (_variables.includes(plot_metadata.x)) && (_variables.includes(plot_metadata.y))) {
            const _plot_data = {
                plot_variables: plot_metadata,
                data: _data.map((dat) => (
                    {
                        id: dat.id,
                        url: dat.url,
                        x: dat.metadata[plot_metadata.x],
                        y: dat.metadata[plot_metadata.y],
                        // pass in null values to the color if "None" is selected
                        c: plot_metadata.c === "None" ? null : dat.metadata[plot_metadata.c]
                    }
                ))
            };
            setParentData(_plot_data);
        }
    }, [data, variables, plot_metadata, filters]);

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

                const checkFloat = (value) => (parseFloat(value) === value);
                const checkInt = (value) => (parseInt(value) === value);

                if (variable_sub.every(checkInt)) {
                    var_data.dtype = 'int'
                } else if(variable_sub.every(checkFloat)) {
                    var_data.dtype = 'float';
                } else {
                    var_data.dtype = null;
                }
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
        <div id='sidebar' className='min-h-dvh col-span-1 bg-primary-400 text-black flex-auto flex-col px-2'>
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
                <FilterGroup
                    ref={filter_group}
                    variables={variables}
                    onChange={() => updateFilters(Math.random())}
                />
                :
                <></>
            }
        </div>
    )
}
