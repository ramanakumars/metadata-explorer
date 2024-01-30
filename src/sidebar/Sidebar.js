import { useEffect, useState, useRef, useContext } from "react";
import '../css/index.css';
import MetadataPicker from "./MetadataPicker";
import FilePicker from "./FilePicker";
import { FilterGroup } from "../explorer/VariableFilters";
import { DataContext, VariableContext } from "../App";


// from https://stackoverflow.com/questions/12467542/how-can-i-check-if-a-string-is-a-float
function checkFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?(e[+-]\d)?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

function checkInt(val) {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

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

export default function Sidebar({ lockPlotMetadata }) {
    const [file, setFile] = useState(null);
    const [file_data, setFileMetadata] = useState([]);
    const { _, setMetadata } = useContext(DataContext);
    const { variables, setVariables } = useContext(VariableContext);
    const [plot_metadata, setPlotMetadata] = useState({});
    const [filters, updateFilters] = useState(0);

    const filter_group = useRef(null);

    /* read in a file and set the metadata */
    const readFile = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = e => {
            setFileMetadata(validateMetadata(JSON.parse(e.target.result)));
        }
    }

    /* hook to update the Sidebar class when file is changed */
    useEffect(() => {
        setFileMetadata([]);
        if ((file !== null)) {
            readFile(file);
        } else {
            setFileMetadata([]);
        }
    }, [file]);

    /* reset the plotting if the data or variables are bad */
    useEffect(() => {
        if (file_data.length < 1) {
            setPlotMetadata({});
            setVariables([]);
            lockPlotMetadata({});
        }
    }, [file_data])

    /* check the plot metadata and enable plotting after validating */
    useEffect(() => {
        if (file_data.length === 0) {
            return;
        }

        if (!filter_group.current) {
            return;
        }

        setMetadata(file_data.filter(_dat => filter_group.current.checkMetadata(_dat.metadata)));

        const _variables = variables.map((vari) => vari.name);
        if ((plot_metadata.x !== undefined) && (plot_metadata.y !== undefined) && (_variables.includes(plot_metadata.x)) && (_variables.includes(plot_metadata.y))) {
            lockPlotMetadata(plot_metadata);
        }
    }, [file_data, variables, plot_metadata, filters]);

    /* when the data is set, loop through it and get the
     * relevant plotting variables
     */
    useEffect(() => {
        if (file_data.length > 0) {
            // get the variables from the first data entry
            let _variables = Object.keys(file_data[0].metadata);

            // loop over the metadata keys and find the minimum and maximum
            let variable_data = _variables.map((variable) => {
                console.log('Getting info for ' + variable);
                let var_data = {};
                var_data.name = variable;

                let variable_sub = file_data.map((dati) => ("" + dati.metadata[variable]));

                var_data.minValue = var_data.currentMin = Math.min(...variable_sub);
                var_data.maxValue = var_data.currentMax = Math.max(...variable_sub);

                if (variable_sub.every(checkInt)) {
                    var_data.dtype = 'int'
                } else if (variable_sub.every(checkFloat)) {
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
    }, [file_data]);

    useEffect(() => {
        if (variables.length < 1) {
            return;
        }

        const metadataIsValid = (meta) => (
            variables.every((variable) => {
                return !isNaN(meta.metadata[variable.name]);
            })
        );

        setMetadata(file_data.filter(metadataIsValid));

    }, [variables]);

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
            {(file && (variables.length > 0)) ?
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
