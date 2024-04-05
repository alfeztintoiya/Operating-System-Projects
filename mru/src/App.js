import React, { useState } from 'react';
import './mru.css';

const MRU = () => {
  const [referenceString, setReferenceString] = useState('');
  const [numSlots, setNumSlots] = useState('');
  const [hits, setHits] = useState(0);
  const [faults, setFaults] = useState(0);
  const [steps, setSteps] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInput = () => {
    if (!referenceString || !numSlots) {
      setErrorMessage('Please provide a reference string and number of slots.');
      return;
    }

    setErrorMessage('');
    setHits(0);
    setFaults(0);
    setSteps([]);

    let frames = Array.from({ length: parseInt(numSlots) }, () => -1); // Initialize frames with -1

    let pageFaults = 0;

    // Split reference string by spaces and convert to array of integers
    const pages = referenceString.split(' ').map(Number);
    let currentSteps = [];

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      let isFound = false;
      let currentFrame = [...frames]; // Copy current frames

      for (let i = 0; i < frames.length; i++) {
        if (frames[i] === pages[pageIndex]) {
          isFound = true;
          setHits(prevHits => prevHits + 1);
          break;
        }
      }

      if (!isFound) {
        let hasFreeFrame = false;

        for (let i = 0; i < frames.length; i++) {
          if (frames[i] === -1) {
            hasFreeFrame = true;
            frames[i] = pages[pageIndex];
            pageFaults++;
            break;
          }
        }

        if (!hasFreeFrame) {
          let lastUse = Array.from({ length: frames.length }, (_, i) => {
            for (let p = pageIndex; p >= 0; p--) {
              if (pages[p] === frames[i]) {
                return p;
              }
            }
            return -1;
          });

          let victim = 0;

          for (let i = 0; i < frames.length; i++) {
            if (lastUse[i] > lastUse[victim]) {
              victim = i;
            }
          }

          frames[victim] = pages[pageIndex];
          pageFaults++;
        }
      }

      currentSteps.push(currentFrame);
    }

    setSteps(currentSteps);
    setFaults(pageFaults);
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
          placeholder="Example: 1 2 3 1 4 5 2 1 2 6 7 3 2"
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="results">
        <p>Total Hits: {hits}</p>
        <p>Total Page Faults: {faults}</p>
      </div>
      <div className="steps-container">
        {steps.map((step, stepIndex) => (
          <div key={stepIndex} className="step">
            <p>Step {stepIndex + 1}</p>
            <div className="slots-container">
              {step.map((slot, index) => (
                <div key={index} className="slot">
                  {slot === -1 ? '-' : slot}
                </div>
              ))}
            </div>
            {step.isHit && <p className="hit-message">Hit</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MRU;
