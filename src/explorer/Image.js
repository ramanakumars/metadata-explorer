import React, { useState, useEffect } from "react";

export default function Image({metadata}) {
    const [followUrl, setFollowURL] = useState('');

    return (
        <span key={metadata.id + "_span"} className="col-span-1">
            {metadata.url.length === 1 &&
            <SingleImage
                id={metadata.id}
                url={metadata.url}
            />
            }
        </span>
    );
}

function SingleImage({ url, id }) {
    return (
        <img
            key={id + "_img"}
            src={url}
            alt={id}
            title={id}
        />
    )
}