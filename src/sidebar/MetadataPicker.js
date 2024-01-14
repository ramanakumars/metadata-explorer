/* Handles the picking of metadata variables for plotting on specific axes */
import { useState, useEffect } from "react";
import { Select } from "../tools/Inputs";

export default function MetadataPicker({ variables, handleChange }) {
    const [_variables, setVariables] = useState(variables);
    const [_plot_variables, setPlotVariables] = useState({ x: "", y: "", c: "None" });

    /* update the local state when the parent state changes */
    useEffect(() => (
        setVariables(variables)
    ), [variables]);

    /* wrapper function to update parent state variables when
     * variable selection is made
     */
    useEffect(() => (
        handleChange(_plot_variables)
    ), [_plot_variables, handleChange]);

    /* handler for choosing the X axis variable */
    const choosePlotX = (value) => {
        let plot_vars = { ..._plot_variables }
        plot_vars.x = value;
        setPlotVariables(plot_vars);
    }

    /* handler for choosing the Y axis variable */
    const choosePlotY = (value) => {
        let plot_vars = { ..._plot_variables }
        plot_vars.y = value;
        setPlotVariables(plot_vars);
    }
    
    /* handler for choosing the color variable */
    const choosePlotColor = (value) => {
        let plot_vars = { ..._plot_variables }
        plot_vars.c = value;
        setPlotVariables(plot_vars);
    }

    return (
        <div className='sidebarContainer'>
            <Select
                id='x'
                var_name='x'
                variables={_variables}
                onChange={choosePlotX}
                value={_plot_variables.x}
            />
            <Select
                id='y'
                var_name='y'
                variables={_variables}
                onChange={choosePlotY}
                value={_plot_variables.y}
            />
            <Select
                id='c'
                var_name='color'
                variables={[{"name": "None"}, ..._variables]}
                onChange={choosePlotColor}
                value={_plot_variables.c}
            />
        </div>
    );
}