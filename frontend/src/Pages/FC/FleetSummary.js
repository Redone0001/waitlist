import React from "react";
import { AuthContext, ToastContext, EventContext } from "../../contexts";
import { Button, Buttons, InputGroup, NavButton, Select } from "../../Components/Form";
import { Content, Title } from "../../Components/Page";
import { apiCall, errorToaster, toaster, useApi } from "../../api";
import { Cell, CellHead, Row, Table, TableBody, TableHead } from "../../Components/Table";
import { BorderedBox } from "../../Components/NoteBox";
import _ from "lodash";
import { usePageTitle } from "../../Util/title";

const marauders = ["Paladin", "Kronos"];
const logi = ["Nestor", "Guardian", "Oneiros"];
const trig = ["Leshak"];
const drones_boat = ["Eos", "Ishtar", "Rattlesnake"];
const bad = ["Megathron", "Nightmare"];

function coalesceCalls(func, wait) {
  var nextCall = null;
  var timer = null;

  const timerFn = function () {
    timer = setTimeout(timerFn, wait);

    if (nextCall) {
      const [context, args] = nextCall;
      nextCall = null;
      func.apply(context, args);
    }
  };

  // Splay the initial timer, after that use a constant time interval
  timer = setTimeout(timerFn, wait * Math.random());

  return [
    function () {
      nextCall = [this, arguments];
    },
    function () {
      clearTimeout(timer);
    },
  ];
}


export function AllFleetsMembers() {
  const [allFleetInfo, setAllFleetInfo] = React.useState(null);
  const eventContext = React.useContext(EventContext); // Get the event context

  // Fetch fleet data
	const fetchFleetData = React.useCallback(async () => {
	  try {
		const data = await apiCall("/api/fleet/fleet_all", {});
		console.log("API Response:", data);
		setAllFleetInfo(data);  // Set the data into the state
	  } catch (err) {
		console.error("Error fetching fleet data:", err);
		setAllFleetInfo(null);  // Set to null on error
	  }
	}, []);

  React.useEffect(() => {
    // Initial fetch
    fetchFleetData();

    // Setup event listeners
    if (eventContext) {
      const [updateFn, clearUpdateFn] = coalesceCalls(fetchFleetData, 2000);
      eventContext.addEventListener("comp_update", updateFn);
      eventContext.addEventListener("open", updateFn);
      return () => {
        clearUpdateFn();
        eventContext.removeEventListener("comp_update", updateFn);
        eventContext.removeEventListener("open", updateFn);
      };
    }
  }, [fetchFleetData, eventContext]); // Re-run if eventContext or fetchFleetData changes

  if (!allFleetInfo) {
    return <div>Loading...</div>;
  }
  
  const fleetSummaries = allFleetInfo.fleets.map((fleet, fleetIndex) => {
    const summary = {}; // Summary for the fleet
    const cats = { // Categories for the fleet
      Marauder: 0,
      Logi: 0,
      Vindicator: 0,
      "Mega/Night": 0,
      Leshak: 0,
      Drones: 0,
    };
    // Process members of this fleet
    fleet.members.forEach((member) => {
      const shipName = member.ship.name;
      // Update ship count in summary
      if (!summary[shipName]) summary[shipName] = 0;
      summary[shipName]++;
      // Categorize the ship
      if (marauders.includes(shipName)) cats["Marauder"]++;
      if (logi.includes(shipName)) cats["Logi"]++;
      if (shipName === "Vindicator") cats["Vindicator"]++;
      if (bad.includes(shipName)) cats["Mega/Night"]++;
      if (trig.includes(shipName)) cats["Leshak"]++;
      if (drones_boat.includes(shipName)) cats["Drones"]++;
    });
    return { fleetIndex, summary, cats };
  });
  // Log the summaries for each fleet
  fleetSummaries.forEach((fleetData, index) => {
    console.log(`Fleet ${index + 1}:`);
    console.log("Summary:", fleetData.summary);
    console.log("Categories:", fleetData.cats);
  });

  return (
    <>
      {allFleetInfo ? (
      fleetSummaries.map((fleetData, index) => (
        <div key={index}>
          <h3>Fleet {index + 1}</h3>

          {/* Input Group for Fleet Categories */}
          <InputGroup>
            <BorderedBox>Bastion: {fleetData.cats["Marauder"]}</BorderedBox>
            <BorderedBox>Logi: {fleetData.cats["Logi"]}</BorderedBox>
            <BorderedBox>Vindi: {fleetData.cats["Vindicator"]}</BorderedBox>
            <BorderedBox>Shak: {fleetData.cats["Leshak"]}</BorderedBox>
            <BorderedBox>Drones: {fleetData.cats["Drones"]}</BorderedBox>
            <BorderedBox>NBI: {fleetData.cats["Mega/Night"]}</BorderedBox>
          </InputGroup>

          {/* Fleet Ship Summary */}
          <h4>Ship Summary:</h4>
          <Table>
            <TableHead>
              <Row>
                <CellHead>Ship Name</CellHead>
                <CellHead>Count</CellHead>
              </Row>
            </TableHead>
            <TableBody>
              {Object.entries(fleetData.summary)
                .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
                .map(([shipName, count]) => (
                  <Row key={shipName}>
                    <Cell>{shipName}</Cell>
                    <Cell>{count}</Cell>
                  </Row>
                ))}
            </TableBody>
          </Table>
        </div>
      ))
    ) : (
      <p>Loading fleet data...</p>
    )}
    </>
  );
}