import React, {useState} from 'react';
import {CountItem} from './components/CountItem';
import {data as rawData} from './constants';
import FlipMove from 'react-flip-move';


function App() {
  const [data, setData] = useState(rawData);
  console.log(data, 'data')
  return (
    <div className="App">
        <FlipMove>
          {data.sort((a, b) => a.count -b.count).map(item => (
          <CountItem key={item.id} {...item} setData={setData} />
          ))}
        </FlipMove>

    </div>
  );
}

export default App;
