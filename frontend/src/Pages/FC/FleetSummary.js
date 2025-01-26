import React from "react";
import { AuthContext, ToastContext } from "../../contexts";
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


export function AllFleetsMembers() {
  const authContext = React.useContext(AuthContext);
  const [allFleetInfo, setAllFleetInfo] = React.useState(null);
  React.useEffect(() => {
    setAllFleetInfo(null);
    apiCall("/api/fleet/fleet_all", {})
      .then((data) => {
    console.log("API Response:", data); // Log the full response
    setAllFleetInfo(data); // Set the state
  })
      .catch((err) => setAllFleetInfo(null)); // What's error handling?
  }, []);
  console.log(allFleetInfo)

  if (!allFleetInfo) {
    return null;
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
      <br />
      <Title>Fleet composition</Title>
      {allFleetInfo ? (
      fleetSummaries.map((fleetData, index) => (
        <div key={index}>
          <h3>Fleet {index + 1}</h3>

          {/* Input Group for Fleet Categories */}
          <InputGroup>
            <BorderedBox>Marauders: {fleetData.cats["Marauder"]}</BorderedBox>
            <BorderedBox>Logistics: {fleetData.cats["Logi"]}</BorderedBox>
            <BorderedBox>Vindicators: {fleetData.cats["Vindicator"]}</BorderedBox>
            <BorderedBox>Leshak: {fleetData.cats["Leshak"]}</BorderedBox>
            <BorderedBox>Drones: {fleetData.cats["Drones"]}</BorderedBox>
            <BorderedBox>Megathron/Nightmare: {fleetData.cats["Mega/Night"]}</BorderedBox>
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