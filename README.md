# Metadata Explorer

Metadata plotter and explorer built in React. Currently hosted [here](https://ramanakumars.com/metadata/).

## Running locally
To run the app locally, you need to download Node. You can find the appropriate installation for your system [here](https://nodejs.org/en/download). Once node is downloaded, switch to the repository root on your local clone and install the packages using:

```
npm i
```

Then, launch the app using
```
npm start
```

This will load the app on `localhost:3000`. 


## JSON format
The input JSON format is a list of objects, which each requires specific keywords. For each entry in the list, these are:
```
id: the unique ID of each entry
url: list of URLs corresponding to images for each entry. For single images this needs to be a list of one value
metadata: object containing all the metadata values for the entry.
```

For example, a sample JSON format is:

```
[
    {
        "id": "77312217",
        "url": [
            "https://panoptes-uploads.zooniverse.org/subject_location/b3230bef-068f-4de6-b90b-d605149225b4.png"
        ],
        "metadata": {
            "latitude": 51.961,
            "perijove": 16,
            "longitude": 102.754
        }
    },
    ...
]
```

