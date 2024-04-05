import React, { useState } from 'react';
import './mru.css';

const MRU = () => {
  const [referenceString, setReferenceString] = useState('');
  const [numSlots, setNumSlots] = useState('');
  const [hits, setHits] = useState(0);
  const [faults, setFaults] = useState(0);
  const [slots, setSlots] = useState([]);

  const handleInput = () => {
    if (!referenceString || !numSlots) {
      alert('Please provide a reference string and number of slots.');
      return;
    }

    setHits(0);
    setFaults(0);
    setSlots(Array.from({ length: parseInt(numSlots) }, () => null));

    let usedSlots = new Set();

    referenceString.split('').forEach((page, index) => {
      if (usedSlots.has(page)) {
        setHits(prevHits => prevHits + 1);
        const updatedSlots = [...slots.filter(slot => slot !== page), page];
        setSlots(updatedSlots);
      } else {
        setFaults(prevFaults => prevFaults + 1);
        const MRUSlotIndex = slots.length - 1;
        const updatedSlots = [...slots];
        updatedSlots[MRUSlotIndex] = page;
        setSlots(updatedSlots);
      }
    });
  };

  return (
    <div className="mru-container">
      <h2>Most Recently Used (MRU) Page Replacement Algorithm</h2>
      <div>
        <label htmlFor="referenceString">Enter Reference String: </label>
        <input
          type="text"
          id="referenceString"
          value={referenceString}
          onChange={(e) => setReferenceString(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="numSlots">Enter Number of Slots: </label>
        <input
          type="number"
          id="numSlots"
          value={numSlots}
          onChange={(e) => setNumSlots(e.target.value)}
        />
      </div>
      <button onClick={handleInput}>Simulate</button>
      <div className="results">
        <p>Total Hits: {hits}</p>
        <p>Total Page Faults: {faults}</p>
      </div>
      <div className="slots-container">
        {slots.map((slot, index) => (
          <div key={index} className="slot">
            {slot !== null ? slot : '-'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MRU;
