import { createContext, useEffect, useState } from 'react';
import './css/index.css'
import Explorer from './explorer/Explorer';
import Sidebar from './sidebar/Sidebar';
import { create } from 'lodash';

export const DataContext = createContext(null);
export const VariableContext = createContext(null);
export const FileDataContext = createContext(null);

function App() {
  const [data, setData] = useState({});
  const [file_data, setFileData] = useState([]);
  const [variables, setVariables] = useState([]);
  const [plot_metadata, setPlotMetadata] = useState({});

  return (
    <div className="container box-border mx-auto grid auto-rows-fr grid-cols-5 gap-4">
      <FileDataContext.Provider value={{ file_data: file_data, setFileData: setFileData }}>
        <DataContext.Provider value={{ data: data, setMetadata: setData }}>
          <VariableContext.Provider value={{ variables: variables, setVariables: setVariables }}>
            <Sidebar lockPlotMetadata={setPlotMetadata} />
            <Explorer plot_metadata={plot_metadata} />
          </VariableContext.Provider>
        </DataContext.Provider>
      </FileDataContext.Provider>

    </div>
  );
}

export default App;
