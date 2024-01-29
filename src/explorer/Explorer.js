import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Images from "./Images";
import PlotStyleControl from "./PlotStyleControl";


const mean = (val) => (val.reduce((a, b) => (parseFloat(a) + parseFloat(b))) / val.length);

export default function Explorer({ data }) {
    const [plot_data, setPlotlyData] = useState([]);
    const [image_data, setImageData] = useState([]);
    const [plot_style, setPlotStyle] = useState({
        marker_size: 5,
        marker_opacity: 1.,
        colorscale: 'bwr',
        clamp_colorscale_mean: true
    });
    const [layout, setLayout] = useState({
        hovermode: "closest",
        height: 600
    });

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
                _data.marker.colorbar = undefined;
            } else {
                _data.marker.color = data.c; //normalize(data.c, plot_style.clamp_colorscale_mean);
                _data.marker.colorscale = plot_style.colorscale;
                _data.marker.cmin = plot_style.clamp_colorscale_mean ? null : Math.min(...data.c);
                _data.marker.cmax = plot_style.clamp_colorscale_mean ? null : Math.max(...data.c);
                _data.marker.cmid = plot_style.clamp_colorscale_mean ? 0 : mean(data.c);
                _data.marker.colorbar = {
                    title: {
                        text: data.plot_variables.c,
                        side: 'right'
                    }
                }
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
    }, [data, plot_style]);

    return (
        <div id='explorer' className='p-4 col-span-4 overflow-x-hidden flex flex-col'>
            <PlotStyleControl
                setPlotStyle={setPlotStyle}
            />
            <Plot
                data={plot_data}
                layout={layout}
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