import React, { useState, useEffect, useRef } from "react";
import Image from './Image'
import { Select } from "../tools/Inputs";
// import { LoadingPage } from '../util/LoadingPage'


function download(content, fileName, mimeType) {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
        return navigator.msSaveBlob(new Blob([content], { type: mimeType }), fileName);
    } else if ('download' in a) { //html5 A[download]
        var csvData = new Blob([content], { type: mimeType });
        var csvUrl = URL.createObjectURL(csvData);
        a.href = csvUrl;
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        return true;
    } else { //do iframe dataURL download (old ch+FF):
        var f = document.createElement('iframe');
        document.body.appendChild(f);
        f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);

        setTimeout(function () {
            document.body.removeChild(f);
        }, 333);
        return true;
    }
}

export default function Images({ data, render_type }) {
    const [currentPage, setPage] = useState(0);
    const [visibleData, setVisibleData] = useState([]);
    const [npages, setnPages] = useState(0);
    const [nimages, setnImages] = useState(32);
    const [grid_class, setGridClass] = useState('grid grid-cols-8 gap-2');

    const loadingDiv = useRef(null);

    const grid_classes = {
        4: 'grid grid-cols-1 gap-2',
        8: 'grid grid-cols-2 gap-2',
        16: 'grid grid-cols-4 gap-2',
        32: 'grid grid-cols-8 gap-2',
        64: 'grid grid-cols-8 gap-2'
    }

    useEffect(() => {
        setnPages(Math.ceil(data.length / nimages));
        setPage(0);
        setGridClass(grid_classes[nimages]);
    }, [data, nimages]);

    useEffect(() => {
        const startind = nimages * currentPage;
        const endind = parseInt(startind) + parseInt(nimages);
        const data_subset = data.slice(startind, endind);
        setVisibleData(data_subset);
    }, [data, nimages, currentPage]);

    const prevPage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentPage > 0) {
            setPage(currentPage - 1);
        }
    }

    const nextPage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentPage < npages - 1) {
            setPage(currentPage + 1);
        }
    }

    // const getExport = () => {
    // 	loadingDiv.current.enable();
    //     console.log('Getting data for ' + data.length + ' subjects');
    //     var fields = Object.keys(data[0])
    //     var replacer = (key, value) => ( value === null ? '' : value );
    //     Promise.all(data.map(function(row){
    //       return fields.map(function(fieldName) {
    //         return JSON.stringify(row[fieldName], replacer)
    //       }).join(',')
    //     })).then((csv) => {
    //         csv.unshift(fields.join(',')) // add header column
    //         csv = csv.join('\r\n');
    //         download(csv, 'data.csv', 'text/csv')
    //         loadingDiv.current.disable();
    //     })

    // }

    if (data.length > 0) {
        return (
            <div
                className={
                    "container mx-auto min-h-svh"
                }
            >
                <div className="image-controls container flex flex-row justify-around align-center">
                    <div className='image-page'>
                        Page: <button onClick={prevPage}>&laquo;</button>
                        {currentPage + 1} / {npages}
                        <button onClick={nextPage}>&raquo;</button>
                    </div>
                    <div className="num-images-control">
                        <Select
                            id='num_images'
                            var_name='# images per page'
                            variables={[4, 8, 16, 32, 64].map((vari) => ({'name': vari}))}
                            onChange={setnImages}
                            value={nimages}
                        />
                    </div>
                </div>
                <div className={grid_class}>
                    {visibleData.map(data => (
                        <Image
                            key={data.id + "_" + render_type}
                            metadata={data}
                        />
                    ))}
                </div>

                {/* <div className="subject-export-container">
                        <button onClick={getExport}>Export subjects</button>
                    </div> */}
            </div>
        )
    } else {
        return (<></>)
    }
}