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
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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

	const { getRootProps, getInputProps } = useDropzone({ onDrop });


  const extractListener = (text) => {
    const listenerMatch = text.match(/Listener:\s*(.*)/);
    return listenerMatch ? listenerMatch[1].trim() : 'Unknown';
  };

  const parseLogFile = (text, listener) => {
    const lines = text.split('\n');
    const parsedData = [];

    lines.forEach((line) => {
      const match_dps = regex_dps.exec(line);
      const match_reps = regex_reps.exec(line);
      if (match_dps) {
        const time = match_dps[1];
        const damage = parseInt(match_dps[2], 10);
        const target = match_dps[3];

        parsedData.push({
          listener,
          time,
          damage,
          target,
          timestamp: new Date(time).getTime() / 1000,
		  type: "Damage",
        });
      }
	  if (match_reps) {
        const time = match_dps[1];
        const reps = parseInt(match_dps[2], 10);
        const target = match_dps[3];

        parsedData.push({
          listener,
          time,
          reps,
          target,
          timestamp: new Date(time).getTime() / 1000,
		  type: "Repair",
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
	const hour_option = {
		hour12: false,
		hour: '2-digit',
        minute: '2-digit',
	}

    // Collect all unique labels (timestamps)
    Object.values(aggregatedData).forEach((data) => {
      data.forEach((entry) => {
        const formattedTime = new Date(entry.time * 1000).toLocaleTimeString([], hour_option);
        labelsSet.add(formattedTime);
      });
    });

    const labels = Array.from(labelsSet).sort(); // Ensure the labels are sorted chronologically

    // Process each listener's data
    Object.entries(aggregatedData).forEach(([listener, data]) => {
      const dataMap = new Map(
        data.map((entry) => {
          const formattedTime = new Date(entry.time * 1000).toLocaleTimeString([], hour_option);
          return [formattedTime, entry.damage];
        })
      );

      const formattedData = labels.map((label) => ({
        x: label,
        y: dataMap.get(label) || 0, // Default to 0 if no data for the time point
      }));

      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      datasets.push({
        label: listener,
        data: formattedData,
        borderColor: randomColor,
        backgroundColor: `${randomColor}33`,
        fill: false,
      });
    });

    setChartData({ labels, datasets });
  };

  const calculateTotals = (aggregatedData) => {
    const totals = {};

    for (const listener in aggregatedData) {
      totals[listener] = aggregatedData[listener].reduce((sum, entry) => sum + entry.damage, 0);
    }

    setTotals(totals);
  };

  const handleFilter = () => {
  if (!startTime || !endTime) {
    alert('Please set both start and end times.');
    return;
  }

  // Convert the start and end times into "HH:MM" format for comparison
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  const filteredData = {};

  for (const listener in logData) {
    filteredData[listener] = logData[listener].filter((entry) => {
      const entryMinutes = timestampToMinutes(entry.time);
      return entryMinutes >= startMinutes && entryMinutes <= endMinutes;
    });
  }

  generateChartData(filteredData);
  calculateTotals(filteredData);
};

	// Helper function to convert "HH:MM" strings into minutes since midnight
	const parseTimeToMinutes = (time) => {
	  const [hours, minutes] = time.split(':').map(Number);
	  return hours * 60 + minutes;
	};

	// Helper function to convert a timestamp into minutes since midnight
	const timestampToMinutes = (timestamp) => {
	  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
	  return date.getHours() * 60 + date.getMinutes();
	};


  return (
    <div className="DPS">
      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        <p>Drag & Drop some log files here, or click to select files</p>
      </div>

      <div style={styles.filterContainer}>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button onClick={handleFilter}>Apply Filter</button>
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
  filterContainer: {
    width: '80%',
    margin: '20px auto',
    display: 'flex',
    justifyContent: 'column',
    gap: '10px',
  },
  chartContainer: {
    width: '100%',
    margin: '20px auto',
    height: '600px',
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

const regex_dps = /\[ (\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}) \] \(combat\) <color=0xff00ffff><b>(\d+)<\/b> .*?to<\/font> <b><color=0xffffffff>([\w\s]+)<\/b>/;
const regex_reps = /\[ (\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}) \] \(combat\) <color=0xffccff66><b>(\d+)<\/b>.*?to <\/font><b>.*?<b>([\w\s]+)<\/b>/;
