import { useContext, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Images from "./Images";
import PlotStyleControl from "./PlotStyleControl";
import MetadataViewer from "./MetadataViewer";
import { DataContext, VariableContext } from "../App";


const mean = (val) => (val.reduce((a, b) => (parseFloat(a) + parseFloat(b))) / val.length);

export default function Explorer({ plot_metadata }) {
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
    const { data, _ } = useContext(DataContext);
    const { variables, __ } = useContext(VariableContext);

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
            _data.push({ url: data[idx].url, id: data[idx].id });
        }
        setImageData(_data);
    };

    /* handle the plot reset
     * this function will update the images to the full list when 
     * the selection is reset
     */
    const resetPlotSelection = () => {
        if (data.length > 0) {
            setImageData((
                data.map((dati) => ({ url: dati.url, id: dati.id }))
            ));
        }
    };

    /* create a hover layer to show the image */
    const handleHover = (e) => {
        const hoverlayer = document.getElementsByClassName('hoverlayer')[0];
        const new_child = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        new_child.setAttributeNS('http://www.w3.org/1999/xlink', 'href', data[e.points[0].pointNumber].url[0]);
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
        if ((!data) || (!plot_metadata)) {
            setPlotlyData([]);
            setImageData([]);
            return;
        }
        
        if ((data.length < 1) || (!plot_metadata.x) || (!plot_metadata.y)) {
            setPlotlyData([]);
            setImageData([]);
            return;
        }

        if (data.length > 0) {
            const _data = {
                x: data.map((dati) => (dati.metadata[plot_metadata.x])),
                y: data.map((dati) => (dati.metadata[plot_metadata.y])),
                mode: 'markers',
                type: 'scattergl',
                hoverinfo: 'none',
                marker: {
                    size: plot_style.marker_size,
                    opacity: plot_style.marker_opacity
                }
            };

            if ((plot_metadata.c === "None") || (plot_metadata.c === "")) {
                _data.marker.color = _data.x.map(() => ("dodgerblue"));
                _data.marker.colorbar = undefined;
            } else {
                _data.marker.color = data.map((dati) => (dati.metadata[plot_metadata.c])); //normalize(data.c, plot_style.clamp_colorscale_mean);
                _data.marker.colorscale = plot_style.colorscale;
                _data.marker.cmin = plot_style.clamp_colorscale_mean ? null : Math.min(..._data.marker.color);
                _data.marker.cmax = plot_style.clamp_colorscale_mean ? null : Math.max(..._data.marker.color);
                _data.marker.cmid = plot_style.clamp_colorscale_mean ? 0 : mean(_data.marker.color);
                _data.marker.colorbar = {
                    title: {
                        text: plot_metadata.c,
                        side: 'right'
                    }
                }
            }

            setPlotlyData([_data]);

            setImageData(
                data.map((dati) => ({ url: dati.url, id: dati.id }))
            );

            var _layout = { ...layout };
            _layout.xaxis = { "title": plot_metadata.x, visible: plot_style.x_labels, showgrid: plot_style.x_grid }
            _layout.yaxis = { "title": plot_metadata.y, visible: plot_style.y_labels, showgrid: plot_style.y_grid }
            setLayout(_layout);
        }
    }, [data, plot_style, plot_metadata]);

    return (
        <div id='explorer' className='p-4 col-span-4 overflow-x-hidden flex flex-col'>
            <div className='flex flex-row justify-evenly'>
                <MetadataViewer />
                <PlotStyleControl setPlotStyle={setPlotStyle} />
            </div>
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