import { useEffect, useState } from "react";
import { InputNumber, Select, Slider } from "../tools/Inputs";

export default function PlotStyleControl({ setPlotStyle }) {
    const [marker_size, setMarkerSize] = useState(5);
    const [marker_opacity, setMarkerOpacity] = useState(1);
    const [colorscale, setColorScale] = useState('bwr');

    useEffect(() => {
        setPlotStyle({ marker_size: marker_size, marker_opacity: marker_opacity, colorscale: colorscale });
    }, [marker_size, marker_opacity, colorscale]);

    return (
        <div className='container p-2 mx-auto flex flex-row justify-evenly align-center'>
            <span className='py-2 max-w-xs [&>span]:grid-cols-6 [&>span>label]:col-span-5 [&>span>input]:col-span-1'>
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
            <span className='py-2 max-w-xs [&>span]:grid-cols-6 [&>span>label]:col-span-3 [&>span>input]:col-span-2'>
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
            <span className='py-2 max-w-xs [&>span>label]:col-span-4 [&>span>select]:col-span-3'>
                <Select
                    id='plot_colorscale'
                    var_name='Colorscale'
                    variables={["bwr", "viridis", "gist_heat"].map((vari) => ({ 'name': vari }))}
                    onChange={setColorScale}
                    value={colorscale}
                />
            </span>
        </div>
    )
}