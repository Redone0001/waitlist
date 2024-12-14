import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function DPS_calc() {
  const [logData, setLogData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [totals, setTotals] = useState({});

  const onDrop = (acceptedFiles) => {
    let allParsedData = [];

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const listener = extractListener(text);
        const parsedData = parseLogFile(text, listener);
        allParsedData = [...allParsedData, ...parsedData];

        const aggregatedData = aggregateData(allParsedData);
        setLogData(aggregatedData);
        generateChartData(aggregatedData);
        calculateTotals(aggregatedData);
      };
      reader.readAsText(file);
    });
  };

  const extractListener = (text) => {
    const listenerMatch = text.match(/Listener:\s*(.*)/);
    return listenerMatch ? listenerMatch[1].trim() : 'Unknown';
  };

  const parseLogFile = (text, listener) => {
    const lines = text.split('\n');
    const parsedData = [];

    lines.forEach((line) => {
      const match = regex.exec(line);
      if (match) {
        const time = match[1];
        const damage = parseInt(match[2], 10);
        const target = match[3];

        parsedData.push({
          listener,
          time,
          damage,
          target,
          timestamp: new Date(time).getTime() / 1000,
        });
      }
    });

    return parsedData;
  };

  const aggregateData = (data) => {
    const aggregated = {};

    data.forEach((entry) => {
      const intervalStart = Math.floor(entry.timestamp / 60) * 60; // Group by 1-minute intervals

      if (!aggregated[entry.listener]) {
        aggregated[entry.listener] = [];
      }

      const listenerData = aggregated[entry.listener];
      const lastEntry = listenerData[listenerData.length - 1];

      if (lastEntry && lastEntry.time === intervalStart) {
        lastEntry.damage += entry.damage;
      } else {
        listenerData.push({ time: intervalStart, damage: entry.damage });
      }
    });

    return aggregated;
  };

  const generateChartData = (aggregatedData) => {
    const datasets = [];
    const labelsSet = new Set();

    Object.entries(aggregatedData).forEach(([listener, data]) => {
      const formattedData = data.map((entry) => {
        const formattedTime = new Date(entry.time * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        labelsSet.add(formattedTime);
        return { x: formattedTime, y: entry.damage };
      });

      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      datasets.push({
        label: listener,
        data: formattedData,
        borderColor: randomColor,
        backgroundColor: `${randomColor}33`,
        fill: false,
      });
    });

    const labels = Array.from(labelsSet).sort(); // Ensure the labels are sorted chronologically
    setChartData({ labels, datasets });
  };

  const calculateTotals = (aggregatedData) => {
    const totals = {};

    for (const listener in aggregatedData) {
      totals[listener] = aggregatedData[listener].reduce((sum, entry) => sum + entry.damage, 0);
    }

    setTotals(totals);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: '.log, .txt',
  });

  return (
    <div className="DPS">
      <h1>Log File Upload and Graph Visualization</h1>
      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        <p>Drag & Drop some log files here, or click to select files</p>
      </div>

      {chartData && (
        <div style={styles.chartContainer}>
          <Line
            data={chartData}
            options={{
              scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { title: { display: true, text: 'Damage' } },
              },
            }}
          />
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Toon name</th>
            <th>Total Damage</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(totals).map(([listener, damage]) => (
            <tr key={listener}>
              <td>{listener}</td>
              <td>{damage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  dropzone: {
    border: '2px dashed #007bff',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    width: '80%',
    margin: 'auto',
  },
  chartContainer: {
    width: '80%',
    margin: '20px auto',
    height: '400px',
  },
  table: {
    width: '80%',
    margin: '20px auto',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  },
};

const regex = /\[ (\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}) \] \(combat\) .*?<b>(\d+)<\/b> .*?to<\/font> <b><color=0xffffffff>([\w\s]+)<\/b>/;
