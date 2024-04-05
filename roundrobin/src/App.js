import React, { useState } from 'react';
import './RoundRobin.css';

function RoundRobinScheduler() {
  const [processes, setProcesses] = useState([
    { name: '', arrivalTime: 0, burstTime: 0, originalBurstTime: 0 }
  ]);
  const [quantumTime, setQuantumTime] = useState('');
  const [completedProcesses, setCompletedProcesses] = useState([]); // Corrected variable name
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState('');
  const [avgWaitingTime, setAvgWaitingTime] = useState('');
  const [ganttChart, setGanttChart] = useState([]);

  const handleProcessChange = (e, index) => {
    const newProcesses = [...processes];
    newProcesses[index].name = e.target.value;
    setProcesses(newProcesses);
  };

  const handleArrivalTimeChange = (e, index) => {
    const newArrivalTimes = [...processes];
    newArrivalTimes[index].arrivalTime = parseInt(e.target.value);
    setProcesses(newArrivalTimes);
  };

  const handleBurstTimeChange = (e, index) => {
    const newBurstTimes = [...processes];
    newBurstTimes[index].burstTime = parseInt(e.target.value);
    newBurstTimes[index].originalBurstTime = parseInt(e.target.value);
    setProcesses(newBurstTimes);
  };

  const handleQuantumTimeChange = (e) => {
    setQuantumTime(parseInt(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    let remainingProcesses = [...processes];
    let completionProcesses = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let quantum = quantumTime;
    let ganttChart = [];

    while (remainingProcesses.length > 0) {
      let process = remainingProcesses.shift();
      let executionTime = Math.min(process.burstTime, quantum);
      process.burstTime -= executionTime;
      currentTime += executionTime;

      if (process.burstTime === 0) {
        process.burstTime = process.originalBurstTime;
        process.completionTime = currentTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.originalBurstTime;
        totalTurnaroundTime += process.turnaroundTime;
        totalWaitingTime += process.waitingTime;
        completionProcesses.push(process);
      } else {
        remainingProcesses.push(process);
      }

      ganttChart.push({ process: process.name, start: currentTime - executionTime, end: currentTime });
    }

    const avgWaiting = totalWaitingTime / completionProcesses.length; // Corrected variable name
    const avgTurnaround = totalTurnaroundTime / completionProcesses.length; // Corrected variable name

    setAvgTurnaroundTime(avgTurnaround);
    setAvgWaitingTime(avgWaiting);
    setCompletedProcesses(completionProcesses); // Corrected function name
    setGanttChart(ganttChart);
  };

  const renderResults = () => {
    return (
      <div>
        <h2>Results</h2>
        <table>
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              <th>Completion Time</th>
              <th>Turnaround Time</th>
              <th>Waiting Time</th>
            </tr>
          </thead>
          <tbody>
            {completedProcesses.map((process, index) => (
              <tr key={index}>
                <td>{process.name}</td>
                <td>{process.arrivalTime}</td>
                <td>{process.originalBurstTime}</td>
                <td>{process.completionTime}</td>
                <td>{process.turnaroundTime}</td>
                <td>{process.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Average Waiting Time: {avgWaitingTime} ms</p>
        <p>Average Turnaround Time: {avgTurnaroundTime} ms</p>
      </div>
    );
  };

  
  function renderGanttChart() {
    if (!ganttChart || ganttChart.length === 0) {
      // Handle case where ganttChart is undefined or empty
      console.error("Gantt chart is undefined or empty");
      return;
    }
  
    const totalExecutionTime = ganttChart[ganttChart.length - 1].end - ganttChart[0].start;
  
    if (isNaN(totalExecutionTime)) {
      // Handle case where totalExecutionTime is NaN
      console.error("Total execution time is not a number");
      return;
    }
  
    const ganttChartElement = document.getElementById("gantt-chart");
  
    if (!ganttChartElement) {
      // Handle case where gantt-chart element is not found
      console.error("Element with id 'gantt-chart' not found");
      return;
    }
  
    ganttChartElement.innerHTML = ganttChart
      .map((block, index) => {
        const blockExecutionTime = block.end - block.start;
        return `<div class="gantt-block" style="flex: ${
          blockExecutionTime / totalExecutionTime
        }">
                  <div class="gantt-block-inner">${block.process}</div>
                  <div class="${index === 0 ? "gantt-block-time-first" : "gantt-block-time"}" >
                    ${index === 0 ? `<p>${block.start}</p>` : ""}
                    <p>${block.end}</p>
                  </div>
                </div>`;
      })
      .join("");
  }
  
  

  return (
    <div className="container">
      <h1>Round Robin CPU Scheduling</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="quantumTime">Quantum Time:</label>
          <input type="number" id="quantumTime" value={quantumTime} onChange={handleQuantumTimeChange} required />
        </div>
        <div className="btn">
          <button type="button" onClick={() => {
            setProcesses([...processes, { name: '', arrivalTime: 0, burstTime: 0, originalBurstTime: 0 }]);
          }}>
            Add Process
          </button>
        </div>

        {processes.map((process, index) => (
          <div key={index} className="input-container">
            <label htmlFor={`process${index}`}>Process {index + 1}:</label>
            <input
              type="text"
              id={`process${index}`}
              value={process.name}
              onChange={(e) => handleProcessChange(e, index)}
              required
            />
            <label htmlFor={`arrivalTime${index}`}>Arrival Time:</label>
            <input
              type="number"
              id={`arrivalTime${index}`}
              value={process.arrivalTime}
              onChange={(e) => handleArrivalTimeChange(e, index)}
              required
            />
            <label htmlFor={`burstTime${index}`}>Burst Time:</label>
            <input
              type="number"
              id={`burstTime${index}`}
              value={process.burstTime}
              onChange={(e) => handleBurstTimeChange(e, index)}
              required
            />
          </div>
        ))}
        <div className="btn">
          <button type="submit">Calculate</button>
        </div>
      </form>

      {renderResults()}
      {renderGanttChart()}
    </div>
  );
}

export default RoundRobinScheduler;