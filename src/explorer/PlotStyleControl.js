import { useEffect, useState } from "react";
import { Checkbox, InputNumber, Select, Slider } from "../tools/Inputs";

export default function PlotStyleControl({ setPlotStyle }) {
    const [marker_size, setMarkerSize] = useState(5);
    const [marker_opacity, setMarkerOpacity] = useState(1);
    const [colorscale, setColorScale] = useState('bwr');
    const [clamp_colorscale_mean, setClampColorscaleMean] = useState(true);

    useEffect(() => {
        setPlotStyle({
            marker_size: marker_size,
            marker_opacity: marker_opacity,
            colorscale: colorscale,
            clamp_colorscale_mean: clamp_colorscale_mean
         });
    }, [marker_size, marker_opacity, clamp_colorscale_mean, colorscale]);

    return (
        <div className='w-full p-2 mx-auto flex flex-row justify-between items-center'>
            <span className='py-2 max-w-48 [&>span]:grid-cols-6 [&>span>label]:col-span-4 [&>span>input]:col-span-2'>
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
            <span className='py-2 max-w-52 [&>span]:grid-cols-6 [&>span>label]:col-span-3 [&>span>input]:col-span-3'>
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
            <span className='py-2 max-w-44 [&>span>label]:col-span-4 [&>span>select]:col-span-3'>
                <Select
                    id='plot_colorscale'
                    var_name='Colorscale'
                    variables={["bwr", "viridis", "gist_heat"].map((vari) => ({ 'name': vari }))}
                    onChange={setColorScale}
                    value={colorscale}
                />
            </span>
            <span className='py-2 w-80 [&>span>label]:col-span-7 [&>span>input]:col-span-1 [&>span>input]:w-5'>
                <Checkbox
                    id='clamp_colorscale'
                    text='Clamp colorscale center to 0'
                    onChange={setClampColorscaleMean}
                    value={clamp_colorscale_mean}
                />
            </span>
        </div>
    )
}