import { InputMultiRange, Select, InputNumber } from "../tools/Inputs";
import React, { useState, forwardRef, useEffect, createRef, createElement, useRef, useImperativeHandle } from "react";
import { VscEdit } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";

/* holds and renders the dynamic list of filters for the plot */
export const FilterGroup = forwardRef(function FilterGroup({ variables, onChange }, ref) {
    const [_filters, setFilters] = useState([]);
    const [_filt_counter, setFilterCounter] = useState(0);
    const filters = useRef(_filters);

    /* create a filter
     * this uses an incremental counter as the filter index
     * and creates a Filter component
     * and appends to the filters array
     */
    const createFilter = () => {
        filters.current = [...filters.current, createElement(Filter,
            {
                id: _filt_counter,
                key: _filt_counter + "_filter",
                variables: variables,
                removeFilter: removeFilter,
                onChange: onChange,
                ref: createRef()
            })
        ]
        setFilters(filters.current);
        setFilterCounter(_filt_counter + 1);
    }

    /* remove the filter of a given id
     * this simply removes the given element from the array 
     */
    const removeFilter = (id) => {
        var new_filters = [];
        for (var filter of filters.current) {
            if (filter.props.id !== id) {
                new_filters.push(filter);
            }
        }
        filters.current = new_filters;
        setFilters(new_filters);
    }

    /* whenever the filter changes, propogate a call to the parent 
     * Sidebar class to update
     */
    useEffect(() => {
        onChange();
    }, [_filters]);

    /* main driver to filter the data entries
     * this loops through each filter and calls the Filter's checkMetadata function
     */
    const checkMetadata = (metadata) => {
        if (filters.current.length === 0) {
            return true;
        }
        const filter_checks = filters.current.map((filter) => (filter.ref.current.checkMetadata(metadata)));
        return filter_checks.every((value) => (value));
    }

    /* expose the checkMetadata to the parent Sidebar class */
    useImperativeHandle(ref, (metadata) => ({
        checkMetadata
    }));

    return (
        <>
            <section className='container flex flex-col mx-auto my-2 border-2 rounded-xl border-dotted [&>*]:my-2 [&>*]:mx-auto'>
                <button onClick={createFilter} className="min-h-8 w-40 text-white bg-primary-800 hover:bg-primary-600">Add filter</button>
                {[filters.current]}
            </section>
        </>
    )
});

/* individual variable filter */
const Filter = forwardRef(function Filter({ id, variables, removeFilter, onChange }, ref) {
    const [_selected_variable, selectVariable] = useState("");
    const [_filter_mode, setFilterMode] = useState("");
    const [_filter_value, setFilterValue] = useState(null);
    const [_is_locked, setLock] = useState(false);
    const [_is_filled, setFilled] = useState(false);

    /* function to check the metadata using the current filter */
    const checkMetadata = (metadata) => {
        if ((!_is_filled) | (!_is_locked)) {
            return true;
        }

        var value;

        if (_selected_variable.dtype === 'float') {
            value = parseFloat(metadata[_selected_variable.name])
        } else if (_selected_variable.dtype === 'int') {
            value = parseInt(metadata[_selected_variable.name]);
        }

        /* if the filter is a range, then check the minimum and maximum */
        if (_filter_mode === 'range') {
            if ((value >= _filter_value[0]) && (value <= _filter_value[1])) {
                return true;
            } else {
                return false;
            }
        }

        /* if it is a value, then directly check the value of the metadata */
        if (_filter_mode === 'value') {
            if (value === _filter_value) {
                return true;
            } else {
                return false;
            }
        }
    }

    useImperativeHandle(ref, (metadata) => ({
        checkMetadata
    }));

    useEffect(() => {
        if (_filter_value) {
            setFilled(true);
        }
    }, [_filter_value]);

    /* set the default state for the different filter modes */
    useEffect(() => {
        if (_filter_mode !== "") {
            if (!_filter_value) {
                /* if it is a range, set the defualt range to the min and max value of the metadata */
                if (_filter_mode === 'range') {
                    setFilterValue([_selected_variable.minValue, _selected_variable.maxValue]);
                } else if (_filter_mode === 'value') {
                    /* if it is a value, then set this to zero. not the best default, but it works for now */
                    setFilterValue(0);
                }
            }
            setFilled(true);
        } else {
            setFilterValue(null);
            setFilled(false);
        }
    }, [_filter_mode]);

    /* when "submit" is hit, then lock and propagate the change up the tree */
    useEffect(() => {
        if (_is_locked) {
            onChange();
        }
    }, [_is_locked]);

    /* check the values to see if it is filled, and lock the state when submit is hit */
    const checkAndLock = () => {
        if (_is_filled) {
            setLock(true);
        }
    }

    /* handler for clicking on a specific variable from the dropdown */
    const clickVariable = (vari) => {
        var var_index;
        var_index = variables.map((v) => (v.name)).indexOf(vari);
        setFilterMode("");
        selectVariable(variables[var_index]);
    }


    const changeRange = (minValue, maxValue) => {
        setFilterValue([minValue, maxValue]);
    }

    const changeValue = (value) => {
        setFilterValue(value);
    }

    return (
        <div className='w-full flex flex-col p-2 bg-primary-400 border-t-2 border-b-2'>
            <div className='w-full flex flex-row justify-end'>
                {(_is_locked && _is_filled) &&
                    <button onClick={() => setLock(false)} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 text-center rounded-full align-center font-bold text-black hover:bg-white hover:border-black">
                        <VscEdit className="w-full h-4 " />
                    </button>
                }
                <button onClick={() => removeFilter(id)} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white hover:border-black">
                    <RxCross2 className="w-full h-4" />
                </button>
            </div>
            {(!_is_locked || !_is_filled) &&
                <div className='w-fit flex flex-col [&>span]:grid-cols-8 [&>span>label]:col-span-3 [&>span>select]:col-span-5 '>
                    <Select
                        id='filter_variables'
                        var_name='Variable'
                        variables={variables}
                        onChange={clickVariable}
                        value={_selected_variable ? _selected_variable.name : ""}
                    />
                    {(_selected_variable) &&
                        <Select
                            key={_selected_variable.name + "_select_filter_mode"}
                            id='filter_mode'
                            var_name='Filter type'
                            variables={[{ name: "range" }, { name: "value" }]}
                            onChange={setFilterMode}
                            value={_filter_mode}
                        />
                    }
                    {(_selected_variable && _filter_mode) &&
                        <div className='w-full flex flex-col [&>span]:grid-cols-8 [&>span>label]:col-span-3 [&>span>select]:col-span-5 [&>span>input]:col-span-5'>
                            {(_filter_mode === 'range') && (_filter_value) && (
                                (
                                    <div className="filter">
                                        <InputMultiRange
                                            key={_selected_variable.name + "_range"}
                                            minValue={_selected_variable.minValue}
                                            maxValue={_selected_variable.maxValue}
                                            step={_selected_variable.dtype == 'int' ? 1 : 0.01}
                                            type={_selected_variable.dtype.includes('float') ? ('float') : ('int')}
                                            text={'Choose range for ' + _selected_variable.name}
                                            currentMin={_filter_value[0]}
                                            currentMax={_filter_value[1]}
                                            onChange={changeRange}
                                        />
                                    </div>
                                )
                            )}
                            {(_filter_mode === 'value') && (_filter_value != null) && (
                                <InputNumber
                                    key={_selected_variable.name + "_number"}
                                    name={_selected_variable.name}
                                    text={"Value"}
                                    value={_filter_value}
                                    type={_selected_variable.dtype}
                                    minValue={_selected_variable.minValue}
                                    maxValue={_selected_variable.maxValue}
                                    onChange={changeValue}
                                />
                            )}

                        </div>
                    }
                    <button onClick={checkAndLock} className="w-1/3 mx-auto">
                        Submit
                    </button>
                </div>
            }
            {(_is_locked && _is_filled) &&
                <div className='w-full flex flex-col [&>span]:grid-cols-8 [&>span>label]:col-span-3 [&>span>select]:col-span-5 '>
                    <h2 className='font-bold'>
                        Filter for <i>{_selected_variable.name}</i>
                    </h2>
                    {(_filter_mode === "range") && (
                        <>
                            Minimum value: {_filter_value[0]} <br />
                            Maximum value: {_filter_value[1]}
                        </>
                    )}
                    {(_filter_mode === "value") && (
                        <>
                            Value: {_filter_value} <br />
                        </>
                    )}
                </div>
            }
        </div>
    )
});