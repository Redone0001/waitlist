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
    useApi("/api/fleet/fleet_all")
      .then(setAllFleetInfo)
      .catch((err) => setAllFleetInfo(null)); // What's error handling?
  });
  console.log(allFleetInfo)

  if (!allFleetInfo) {
    return null;
  }

  return (
    <>
      <br />
      <Title>Fleet composition</Title>
      
    </>
  );
}