import './index.css'
import Explorer from './Explorer';
import Sidebar from './Sidebar';

function App() {
  return (
    <div className="lg:container box-border lg:mx-auto grid grid-cols-5 gap-4">
      <Sidebar />
      <Explorer />
    </div>
  );
}

export default App;
