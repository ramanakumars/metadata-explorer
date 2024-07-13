import { useEffect, useRef, useState } from "react";
import { Checkbox, InputNumber, Select, Slider } from "../tools/Inputs";
import Draggable from "react-draggable";
import { RxCross2 } from "react-icons/rx";
import { FiMove } from "react-icons/fi";

const visibility_states = ['hidden', 'visible']

export default function PlotStyleControl({ setPlotStyle }) {
    const [marker_size, setMarkerSize] = useState(5);
    const [marker_opacity, setMarkerOpacity] = useState(1);
    const [colorscale, setColorScale] = useState('bwr');
    const [clamp_colorscale_mean, setClampColorscaleMean] = useState(true);
    const [x_labels, toggleXLabels] = useState(true);
    const [y_labels, toggleYLabels] = useState(true);
    const [x_grid, toggleXGrid] = useState(true);
    const [y_grid, toggleYGrid] = useState(true);
    const [axis_limits, toggleAxisLimits] = useState(false);

    const [is_visible, setVisible] = useState(visibility_states[0]);
    const [positions, setPositions] = useState(null);

    const nodeRef = useRef(null);

    useEffect(() => {
        setPlotStyle({
            marker_size: marker_size,
            marker_opacity: marker_opacity,
            colorscale: colorscale,
            clamp_colorscale_mean: clamp_colorscale_mean,
            x_labels: x_labels,
            y_labels: y_labels,
            x_grid: x_grid,
            y_grid: y_grid,
            axis_limits: axis_limits
        });
    }, [marker_size, marker_opacity, clamp_colorscale_mean, colorscale, x_labels, y_labels, x_grid, y_grid, axis_limits]);

    const togglePopup = () => {
        setVisible(visibility_states[+!visibility_states.indexOf(is_visible)]);
    };

    const handleDrag = (e, ui) => {
        setPositions({x: ui.x, y: ui.y});
    };

    return (
        <>
            <div className="flex flex-row justify-center">
                <button onClick={togglePopup} className="min-h-8 w-40 text-white bg-primary-800 hover:bg-primary-600">Open plot controls</button>
            </div>
            {is_visible === "visible" &&
                <Draggable nodeRef={nodeRef} positionOffset={{x: '-50%', y: '-50%'}} position={positions} handle="strong" onDrag={handleDrag}>
                    <div ref={nodeRef} className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 box-border w-1/4 min-h-1/2 z-10 bg-secondary-200 p-4 mx-auto rounded-xl border-dotted border-4 border-black'>
                        <div className="w-full flex flex-row flex-nowrap items-center contents-center justify-between">
                            <strong className='cursor-move'>
                                <FiMove className="w-4 h-4" />
                            </strong>
                            <div className='flex flex-row justify-end'>
                                <button onClick={togglePopup} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white hover:border-black">
                                    <RxCross2 className="w-full h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-start p-2">
                            <h1>Marker options</h1>
                            <span className='py-2 w-full [&>span]:grid-cols-6 [&>span>label]:col-span-3 [&>span>input]:col-span-3'>
                                <InputNumber
                                    minValue={1}
                                    maxValue={20}
                                    value={marker_size}
                                    text="Marker size"
                                    name="marker_size"
                                    type="int"
                                    onChange={setMarkerSize}
                                />
                            </span>
                            <span className='py-2 w-full [&>span]:grid-cols-6 [&>span>label]:col-span-3 [&>span>input]:col-span-3'>
                                <Slider
                                    minValue={0.01}
                                    maxValue={1}
                                    value={marker_opacity}
                                    text="Marker opacity"
                                    name="marker_opacity"
                                    type="float"
                                    onChange={setMarkerOpacity}
                                />
                            </span>
                        </div>
                        <div className="w-full flex flex-col justify-start p-2">
                            <h1>Colorscales</h1>
                            <span className='py-2 w-full [&>span]:grid-cols-6 [&>span>label]:col-span-3 [&>span>select]:col-span-3'>
                                <Select
                                    id='plot_colorscale'
                                    var_name='Colorscale'
                                    variables={["bwr", "Viridis", "Hot", "YlOrRd", "Jet"].map((vari) => ({ 'name': vari }))}
                                    onChange={setColorScale}
                                    value={colorscale}
                                />
                            </span>
                            <span className='py-2 w-full [&>span]:grid-cols-6 [&>span>label]:col-span-3 [&>span>input]:col-span-3'>
                                <Checkbox
                                    id='clamp_colorscale'
                                    text='Clamp middle to 0'
                                    onChange={setClampColorscaleMean}
                                    value={clamp_colorscale_mean}
                                />
                            </span>
                        </div>
                        <div className="w-full flex flex-col justify-start p-2">
                            <h1>Axes</h1>
                                <div className="grid grid-cols-2 [&>span]:grid-cols-4 [&>span>label]:col-span-3 [&>span>input]:col-span-1">
                                    <Checkbox
                                        id='x_labels'
                                        text='X-axis labels'
                                        onChange={toggleXLabels}
                                        value={x_labels}
                                    />
                                    <Checkbox
                                        id='y_labels'
                                        text='Y-axis labels'
                                        onChange={toggleYLabels}
                                        value={y_labels}
                                    />
                                </div>
                                <div className="grid grid-cols-2 [&>span]:grid-cols-4 [&>span>label]:col-span-3 [&>span>input]:col-span-1">
                                    <Checkbox
                                        id='x_grid'
                                        text='X-axis grid'
                                        onChange={toggleXGrid}
                                        value={x_grid}
                                    />
                                    <Checkbox
                                        id='y_grid'
                                        text='Y-axis grid'
                                        onChange={toggleYGrid}
                                        value={y_grid}
                                    />
                                </div>
                                <div className="[&>span]:grid-cols-4 [&>span>label]:col-span-3 [&>span>input]:col-span-1">
                                    <Checkbox
                                        id='axis_limits'
                                        text='Force axis limits to entire data'
                                        onChange={toggleAxisLimits}
                                        value={axis_limits}
                                    />
                                </div>
                        </div>
                    </div>
                </Draggable>
            }
        </>
    )
}