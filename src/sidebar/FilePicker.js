/*
    The filepicker class will read in a JSON file and validate the metadata
    Called from Sidebar
*/
export default function FilePicker({ setFile }) {
    /* file form submission handler */
    const handleSubmit = (e) => {
        e.preventDefault();
        const file = e.target[0].files[0];
        setFile(file);
    };

    return (
        <div className="sidebarContainer">
            <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="upload">
                <span className="box-border block max-w-full overflow-x-clip">
                    <label htmlFor="file">Upload metadata</label>
                    <input type="file" id="umap" name='umap' accept='application/json' />
                </span>
                <input type="submit" value="Submit" className='submit' />
            </form>
        </div>
    )
}