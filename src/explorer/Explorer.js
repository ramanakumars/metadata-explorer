import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Images from "./Images";
import PlotStyleControl from "./PlotStyleControl";

const normalize = (val) => {
    const min = Math.min(...val);
    const max = Math.max(...val);
    const scale = max - min;

    return val.map((v) => ((v - min) / scale));
}

const colorscales = {
    'bwr': [
        [0, 'rgb(0, 0, 255)'],
        [0.5, 'rgb(255, 255, 255)'],
        [1, 'rgb(255, 0, 0)']
    ],
    'viridis': [
        [0.000, "rgb(68, 1, 84)"],
        [0.111, "rgb(72, 40, 120)"],
        [0.222, "rgb(62, 74, 137)"],
        [0.333, "rgb(49, 104, 142)"],
        [0.444, "rgb(38, 130, 142)"],
        [0.556, "rgb(31, 158, 137)"],
        [0.667, "rgb(53, 183, 121)"],
        [0.778, "rgb(109, 205, 89)"],
        [0.889, "rgb(180, 222, 44)"],
        [1.000, "rgb(253, 231, 37)"]
    ]
};

export default function Explorer({ data }) {
    const [plot_data, setPlotlyData] = useState([]);
    const [image_data, setImageData] = useState([]);
    const [plot_style, setPlotStyle] = useState({marker_size: 5, marker_opacity: 1., colorscale: 'bwr'});
    const [layout, setLayout] = useState({
        hovermode: "closest",
        height: 600
    });
    const [revision, setRevision] = useState(0);

    /* handle the plot selection
     * this function will update the images based on the selection 
     */
    const handlePlotSelect = (e) => {
        const _data = [];
        if (e === undefined) {
            return;
        }

        for (var i = 0; i < e.points.length; i++) {
            const idx = e.points[i].pointNumber;
            _data.push({ url: data.url[idx], id: data.id[idx] });
        }
        setImageData(_data);
    };

    /* handle the plot reset
     * this function will update the images to the full list when 
     * the selection is reset
     */
    const resetPlotSelection = () => {
        if ((data.x.length > 0) && (data.y.length > 0)) {
            setImageData((
                data.url.map((url, i) => ({ url: url, id: data.id[i] }))
            ));
        }
    };

    /* create a hover layer to show the image */
    const handleHover = (e) => {
        const hoverlayer = document.getElementsByClassName('hoverlayer')[0];
        const new_child = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        new_child.setAttributeNS('http://www.w3.org/1999/xlink', 'href', data.url[e.points[0].pointNumber][0]);
        new_child.setAttribute('x', e.event.pointerX);
        new_child.setAttribute('y', e.event.pointerY);
        new_child.setAttribute('width', 100);
        if (hoverlayer.childElementCount > 0) {
            hoverlayer.replaceChild(new_child, hoverlayer.childNodes[0]);
        } else {
            hoverlayer.appendChild(new_child);
        }
    }

    /* remove the hover layer created */
    const handleUnHover = (e) => {
        const hoverlayer = document.getElementsByClassName('hoverlayer')[0];
        if (hoverlayer.childElementCount > 0) {
            hoverlayer.removeChild(hoverlayer.childNodes[0]);
        }
    }

    useEffect(() => {
        if ((data.x === undefined) || (data.y === undefined)) {
            setPlotlyData({});
            setImageData([]);
            return;
        }

        if ((data.x.length > 0) && (data.y.length > 0)) {
            const _data = {
                x: data.x,
                y: data.y,
                mode: 'markers',
                type: 'scattergl',
                hoverinfo: 'none',
                marker: {
                    size: plot_style.marker_size,
                    opacity: plot_style.marker_opacity
                }
            };

            if ((data.plot_variables.c === "None") || (data.plot_variables.c === "")) {
                _data.marker.color = _data.x.map(() => ("dodgerblue"));
            } else {
                _data.marker.color = normalize(data.c);
                _data.marker.colorscale = colorscales[plot_style.colorscale];
            }

            setPlotlyData([_data]);

            setImageData((
                data.url.map((url, i) => ({ url: url, id: data.id[i] }))
            ));

            var _layout = { ...layout };
            _layout.xaxis = { "title": data.plot_variables.x }
            _layout.yaxis = { "title": data.plot_variables.y }
            setLayout(_layout);
        }
    }, [data]);

    useEffect(() => {
        if ((plot_data[0] === undefined)) {
            return;
        }
        if ((plot_data[0].x.length > 0) && (plot_data[0].y.length > 0)) {
            const _plot_data = plot_data[0];
            _plot_data.marker.size = plot_style.marker_size;
            _plot_data.marker.opacity = plot_style.marker_opacity;
            if ((data.plot_variables.c !== "None") && (data.plot_variables.c !== "")) {
                _plot_data.marker.colorscale = colorscales[plot_style.colorscale];
            }
            setPlotlyData([_plot_data]);
        }
    }, [plot_style]);

    useEffect(() => {
        if ((plot_data[0] === undefined)) {
            return;
        }

        if ((plot_data[0].x.length > 0) && (plot_data[0].y.length > 0)) {
            setRevision(revision + 1);
        }
    }, [data, plot_data, layout]);


    return (
        <div id='explorer' className='p-4 col-span-4 overflow-x-hidden flex flex-col'>
            <PlotStyleControl
                setPlotStyle={setPlotStyle}
            />
            <Plot
                data={plot_data}
                layout={layout}
                revision={revision}
                onHover={handleHover}
                onUnhover={handleUnHover}
                onSelected={handlePlotSelect}
                onDeselect={resetPlotSelection}
            />
            <Images
                data={image_data}
                render_type={'select'}
            />
        </div >
    )
}