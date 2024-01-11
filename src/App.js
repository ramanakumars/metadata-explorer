import { useState } from 'react';
import './css/index.css'
import Explorer from './explorer/Explorer';
import Sidebar from './sidebar/Sidebar';

function App() {
  const [data, setData] = useState({});

  const validateAndSetData = (_data) => {
    if ((_data.data === undefined) || (_data.plot_variables === undefined)) {
      setData([]);
      return;
    }

    const validatedata = (val) => (!isNaN(val.x) && (!isNaN(val.y)));
    const datasub = _data.data.filter(validatedata);

    if (datasub.length > 0) {
      setData({
        plot_variables: _data.plot_variables,
        id: datasub.map((dat) => (dat.id)),
        url: datasub.map((dat) => (dat.url)),
        x: datasub.map((dat) => (dat.x)),
        y: datasub.map((dat) => (dat.y)),
        c: (datasub === null) ? null : datasub.map((dat => (dat.c)))
      });
    }
  }

  return (
    <div className="container box-border mx-auto grid auto-rows-fr grid-cols-5 gap-4">
      <Sidebar
        setParentData={validateAndSetData}
      />
      <Explorer
        data={data}
      />
    </div>
  );
}

export default App;
