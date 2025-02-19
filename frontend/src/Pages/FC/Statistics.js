import React from "react";
import _ from "lodash";
import { useApi } from "../../api";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import styled, { ThemeContext } from "styled-components";
import { Row, Col } from "react-awesome-styled-grid";
import { usePageTitle } from "../../Util/title";
import Chart from 'chart.js/auto';

const Graph = styled(Col).attrs({ md: 4 })`
  max-height: 350px;
`;

function makeColor(theme, name) {
  // lol
  var hash = 1546047137;
  for (var i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = hash & 0x7fffffff;

  var hue = hash % 360;
  var sat = ((hash >> 10) % 60) + 30;
  var lum = Math.round(theme.colors.lumFactor * 50);
  return `hsla(${hue}, ${sat}%, ${lum}%, 1)`;
}

function makeOptions(theme, options) {
  return _.merge(
    {},
    {
      maintainAspectRatio: false,
      animation: false,
      color: theme.colors.text,
      backgroundColor: theme.colors.accent1,
      borderColor: theme.colors.accent2,
      plugins: {
        title: {
          color: theme.colors.text,
        },
      },
    },
    options || {}
  );
}

function makeData(theme, data, colorPerLabel) {
  var newData = _.cloneDeep(data);
  if (newData.datasets) {
    for (var dataset of newData.datasets) {
      for (const colorProperty of ["backgroundColor", "borderColor"]) {
        if (!dataset[colorProperty]) {
          if (colorPerLabel) {
            dataset[colorProperty] = newData.labels.map((label) => makeColor(theme, label));
          } else {
            dataset[colorProperty] = makeColor(theme, dataset.label || "");
          }
        }
      }
    }
  }
  return newData;
}

function ThemedBar({ options, data, ...kwargs }) {
  const theme = React.useContext(ThemeContext);
  return (
    <Bar options={makeOptions(theme, options)} data={makeData(theme, data, false)} {...kwargs} />
  );
}

function ThemedLine({ options, data, ...kwargs }) {
  const theme = React.useContext(ThemeContext);
  return (
    <Line options={makeOptions(theme, options)} data={makeData(theme, data, false)} {...kwargs} />
  );
}

function ThemedDoughnut({ options, data, ...kwargs }) {
  const theme = React.useContext(ThemeContext);
  return (
    <Doughnut
      options={makeOptions(theme, options)}
      data={makeData(theme, data, true)}
      {...kwargs}
    />
  );
}

function separateDataLabels(data) {
  const labels = Object.keys(data);
  labels.sort();
  var series = [];
  for (const label of labels) {
    series.push(data[label]);
  }
  return {
    labels,
    data: series,
  };
}

function separateDataLabels2D(data) {
  const separated = separateDataLabels(data);
  var series = {};
  for (var t = 0; t < separated.labels.length; t++) {
    for (const serieName of Object.keys(separated.data[t])) {
      if (!series[serieName]) {
        series[serieName] = new Array(separated.labels.length).fill(null);
      }
      series[serieName][t] = separated.data[t][serieName];
    }
  }
  return {
    labels: separated.labels,
    series: series,
  };
}

function FleetTimeByMonth({ data }) {
  const series = separateDataLabels(data);
  return (
    <ThemedLine
      data={{
        labels: series.labels,
        datasets: [
          {
            label: "Hours",
            data: series.data.map((seconds) => Math.round(seconds / 3600)),
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Total fleet time",
          },
        },
      }}
    />
  );
}

function PilotsByMonth({ data }) {
  const series = separateDataLabels(data);
  return (
    <ThemedLine
      data={{
        labels: series.labels,
        datasets: [
          {
            label: "Pilots",
            data: series.data,
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Pilots seen in fleet",
          },
        },
      }}
    />
  );
}

function FleetTimeByHullMonthPercentage({ data }) {
  const series = separateDataLabels2D(data);

  const datasets = _.map(series.series, (numbers, label) => {
    // Compute the total time for each time period (index) across all hulls
    const totalPerLabel = series.labels.map((label, index) =>
      _.sum(Object.values(series.series).map((seriesNumbers) => seriesNumbers[index] || 0))
    );

    return {
      label: label,
      data: numbers.map((seconds, index) => {
        const total = totalPerLabel[index] || 1; // Prevent division by zero
        return Math.round(((seconds || 0) / total) * 100); // Convert to percentage
      }),
    };
  });

  return (
    <ThemedLine
      data={{
        labels: series.labels,
        datasets: datasets,
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Time in fleet by hull (%)",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const percentage = context.raw; // Raw value represents the percentage
                return `${label}: ${percentage}%`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `${value}%`, // Display percentage on y-axis
            },
            beginAtZero: true
          },
        },
      }}
    />
  );
}


function FleetTimeByFcMonth({ data }) {
  const series = separateDataLabels2D(data);
  return (
    <ThemedLine
      data={{
        labels: series.labels,
        datasets: _.map(series.series, (numbers, label) => ({
          label: label,
          data: numbers.map((seconds) => Math.round(seconds / 3600)),
        })),
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Time in fleet by FC",
          },
        },
      }}
    />
  );
}

function FleetTimeAllFcMonth({ data }) {
  const series = separateDataLabels2D(data);
  
  // Sum all series into a single dataset
  const summedData = series.labels.map((label, index) =>
      _.sum(Object.values(series.series).map((seriesNumbers) => Math.round(seriesNumbers[index]/3600) || 0))
    );

  return (
    <ThemedLine
      data={{
        labels: series.labels,
        datasets: [
          {
            label: "Total FC Hours",
            data: summedData,
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Total fleet availlability by Month",
          },
        },
      }}
    />
  )
}

function FleetTimeByFCMonthPercentage({ data }) {
  const series = separateDataLabels2D(data);

  const datasets = _.map(series.series, (numbers, label) => {
    // Compute the total time for each time period (index) across all hulls
    const totalPerLabel = series.labels.map((label, index) =>
      _.sum(Object.values(series.series).map((seriesNumbers) => seriesNumbers[index] || 0))
    );

    return {
      label: label,
      data: numbers.map((seconds, index) => {
        const total = totalPerLabel[index] || 1; // Prevent division by zero
        return Math.round(((seconds || 0) / total) * 100); // Convert to percentage
      }),
    };
  });

  return (
    <ThemedLine
      data={{
        labels: series.labels,
        datasets: datasets,
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Time in fleet by FC (%)",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const percentage = context.raw; // Raw value represents the percentage
                return `${label}: ${percentage}%`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `${value}%`, // Display percentage on y-axis
            },
            beginAtZero: true
          },
        },
      }}
    />
  );
}

function XByHullMonth({ data }) {
  const series = separateDataLabels2D(data);

  const datasets = _.map(series.series, (numbers, label) => {
    // Compute the total X'es for each month across all hulls
    const totalPerMonth = series.labels.map((__, index) =>
      _.sum(Object.values(series.series).map((seriesNumbers) => seriesNumbers[index] || 0))
    );

    return {
      label: label,
      data: numbers.map((count, index) => {
        const total = totalPerMonth[index] || 1; // Prevent division by zero
        return Math.round(((count || 0) / total) * 100); // Convert to percentage
      }),
    };
  });

  return (
    <ThemedLine
      data={{
        labels: series.labels,
        datasets: datasets,
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "X'es by hull (%)",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const percentage = context.raw; // Raw value represents the percentage
                return `${label}: ${percentage}%`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `${value}%`, // Display percentage on y-axis
            },
            beginAtZero: true,
          },
        },
      }}
    />
  );
}


function TimeSpentInFleetByMonth({ data }) {
  const series = separateDataLabels2D(data);
  return (
    <ThemedBar
      data={{
        labels: series.labels,
        datasets: _.map(series.series, (numbers, label) => ({
          label: label,
          data: numbers.map((num) => num || 0),
        })),
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Distribution of time in fleet",
          },
        },
      }}
    />
  );
}

function XVsTimeByHull28d({ data }) {
  const series = separateDataLabels2D(data);
  return (
    <ThemedBar
      data={{
        labels: series.labels,
        datasets: _.map(series.series, (numbers, label) => ({
          label: label,
          data: numbers.map((num) => Math.round((num || 0) * 1000) / 10),
        })),
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Time vs X'es in percentages (28d)",
          },
        },
      }}
    />
  );
}

function XByHull28d({ data }) {
  const series = separateDataLabels(data);
  return (
    <ThemedDoughnut
      data={{
        labels: series.labels,
        datasets: [
          {
            data: series.data,
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "X'es by hull (28d)",
          },
        },
      }}
    />
  );
}

function TimeSpentByHull28d({ data }) {
  const series = separateDataLabels(data);
  return (
    <ThemedDoughnut
      data={{
        labels: series.labels,
        datasets: [
          {
            data: series.data.map((seconds) => Math.round((seconds || 0) / 3600)),
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Time in fleet by hull (28d)",
          },
        },
      }}
    />
  );
}

function TimeSpentByFC90d({ data }) {
  const series = separateDataLabels(data);
  return (
    <ThemedDoughnut
      data={{
        labels: series.labels,
        datasets: [
          {
            data: series.data.map((seconds) => Math.round((seconds || 0) / 3600)),
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Fleet time by fc (90d)",
          },
        },
      }}
    />
  );
}

export function Statistics() {
  usePageTitle("Statistics");
  const [statsData] = useApi("/api/stats");

  if (!statsData) {
    return <em>Loading statistics...</em>;
  }

  return (
    <Row>
      <Graph>
        <FleetTimeByMonth data={statsData.fleet_seconds_by_month} />
      </Graph>
      <Graph>
        <PilotsByMonth data={statsData.pilots_by_month} />
      </Graph>
      <Graph>
        <FleetTimeByHullMonthPercentage data={statsData.fleet_seconds_by_hull_by_month} />
      </Graph>
      <Graph>
        <XByHullMonth data={statsData.xes_by_hull_by_month} />
      </Graph>
      <Graph>
        <XByHull28d data={statsData.xes_by_hull_28d} />
      </Graph>
      <Graph>
        <TimeSpentByHull28d data={statsData.fleet_seconds_by_hull_28d} />
      </Graph>
      <Graph>
        <FleetTimeByFcMonth data={statsData.fleet_seconds_by_fc_by_month} />
      </Graph>
      <Graph>
        <FleetTimeByFCMonthPercentage data={statsData.fleet_seconds_by_fc_by_month} />
      </Graph>
      <Graph>
        <TimeSpentByFC90d data={statsData.fleet_seconds_by_fc_90d} />
      </Graph>
      <Graph>
        <FleetTimeAllFcMonth data={statsData.fleet_seconds_by_fc_by_month} />
      </Graph>
    </Row>
  );
}
