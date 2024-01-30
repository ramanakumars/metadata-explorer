import { createContext, useEffect, useState } from 'react';
import './css/index.css'
import Explorer from './explorer/Explorer';
import Sidebar from './sidebar/Sidebar';

export const DataContext = createContext(null);
export const VariableContext = createContext(null);

function App() {
  const [data, setData] = useState({});
  const [variables, setVariables] = useState([]);
  const [plot_metadata, setPlotMetadata] = useState({});

  // useEffect(() => {
  //   if ((data.data === undefined) || (data.plot_variables === undefined)) {
  //     setPlotMetadata([]);
  //     return;
  //   }

  //   const validatedata = (val) => (!isNaN(val.x) && (!isNaN(val.y)));
  //   const datasub = data.data.filter(validatedata);

  //   if (datasub.length > 0) {
  //     setPlotMetadata({
  //       plot_variables: data.plot_variables,
  //       id: datasub.map((dat) => (dat.id)),
  //       url: datasub.map((dat) => (dat.url)),
  //       x: datasub.map((dat) => (dat.x)),
  //       y: datasub.map((dat) => (dat.y)),
  //       c: (datasub === null) ? null : datasub.map((dat => (dat.c)))
  //     });
  //   }
  // }, [data]);

  return (
    <div className="container box-border mx-auto grid auto-rows-fr grid-cols-5 gap-4">
      <DataContext.Provider value={{ data: data, setMetadata: setData }}>
        <VariableContext.Provider value={{ variables: variables, setVariables: setVariables }}>
          <Sidebar lockPlotMetadata={setPlotMetadata}/>
          <Explorer plot_metadata={plot_metadata} />
        </VariableContext.Provider>
      </DataContext.Provider>

    </div>
  );
}

export default App;
