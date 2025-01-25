import { InfoNote } from "../../Components/NoteBox";
import { Highlight } from "../../Components/Form";
import { Copyable } from "../../Components/Copy";
import { ToastContext } from "../../contexts";
import React from "react";
import {
  CellHead,
  SmallCellHead,
  Table,
  TableHead,
  Row,
  TableBody,
  Cell,
} from "../../Components/Table";

export function ImplantTable({ type }) {
  const toastContext = React.useContext(ToastContext);
  const implantOptions = {
  Amulet: [
    "Mid-grade Amulet Alpha",
    "Mid-grade Amulet Beta",
    "Mid-grade Amulet Gamma",
    "Mid-grade Amulet Delta",
    "Mid-grade Amulet Epsilon",
    "Mid-grade Amulet Omega",
  ],
  Savior: [
    "High-grade Amulet Alpha",
    "High-grade Amulet Beta",
    "High-grade Amulet Gamma",
    "High-grade Amulet Delta",
    "High-grade Amulet Epsilon",
    "High-grade Amulet Omega",
  ],
  Triglavian: [
    "High-grade Mimesis Alpha",
    "High-grade Mimesis Beta",
    "High-grade Mimesis Gamma",
    "High-grade Mimesis Delta",
    "High-grade Mimesis Epsilon",
    "High-grade Mimesis Omega",
  ],
  default: [
    "",
    "",
    "",
    "",
    "",
    "",
  ],
};

const implants = implantOptions[type] || implantOptions.default;
  return (
    <>
      <InfoNote>
	    {type === "Amulet"
		  ? "Amulet tagged fits require all implants 1 to 6 to be flown."
		  : type === "Savior"
		  ? "Savior tagged fits require all implants to be flown."
		  : type === "Triglavian"
		  ? "Triglavian tagged fits are encourage to fly with Mimesis. Only high grade complete set are acceptable."
		  : "Required for Elite badge on non implant specific ships."}
	  </InfoNote>

      <Table style={{ width: "100%" }}>
        <TableHead>
          <Row>
            <SmallCellHead></SmallCellHead>
            <CellHead>DEFAULT</CellHead>
            <CellHead>ALTERNATIVE (not required and you can get them with incursion lp)</CellHead>
          </Row>
        </TableHead>
        <TableBody>
          {implants.map((currentValue, index) => (
            <ImplantAllRow
              key={index}
              toast={toastContext}
              slot={index + 1}
              implant={currentValue}
            />
          ))}
          <HardWires 
		  toastContext={toastContext} 
		  type=type
		  />
        </TableBody>
      </Table>
    </>
  );
}

function ImplantAllRow({ toast, slot, implant }) {
  return (
    <Row>
      <Cell>
        <b>Slot {slot}</b>
      </Cell>
      <Cell>
        <CopyImplantText toast={toast} item={implant} />
      </Cell>

      <Cell></Cell>
    </Row>
  );
}

function CopyImplantText({ toast, item }) {
  return (
    <Highlight
      onClick={(evt) => {
        Copyable(toast, item);
      }}
    >
      {item}
    </Highlight>
  );
}

function HardWires({ toastContext, type }) {
	const hardwireOptions = {
    Amulet: [
      {
        slot: 7,
        armor: { text: "MR-705", description: "increased tracking." },
        shield: [
			{ text: "MR-706", description: "increased tracking." },
			{ text: "RA-706", description: "reduce cap need for remote reps." },
		],
      },
      {
        slot: 8,
        armor: { text: "EM-805", description: "increased capacitor." },
        shield: [
			{ text: "EM-806", description: "increased capacitor." },
			{ text: "MR-805", description: "increased web range." },
		],
      },
      {
        slot: 9,
        armor: { text: "RF-905", description: "increased rate of fire." },
        shield: { text: "RF-906", description: "increased rate of fire." },
      },
      {
        slot: 10,
        armor: [
          { text: "LH-1005", description: "increased hybrid damage." },
          { text: "LE-1005", description: "increased laser damage." },
        ],
        shield: [
          { text: "LH-1006", description: "increased hybrid damage." },
          { text: "LE-1006", description: "increased laser damage." },
          { text: "HG-1006", description: "increased armor." },
        ],
      },
    ],Savior: [
      {
        slot: 7,
        armor: { text: "MR-705", description: "increased tracking." },
        shield: [
			{ text: "MR-706", description: "increased tracking." },
			{ text: "RA-706", description: "reduce cap need for remote reps" },
		],
      },
      {
        slot: 8,
        armor: { text: "EM-805", description: "increased capacitor." },
        shield: [
			{ text: "EM-806", description: "increased capacitor." },
		],
      },
      {
        slot: 9,
        armor: { text: "RF-905", description: "increased rate of fire." },
        shield: { text: "RF-906", description: "increased rate of fire." },
      },
      {
        slot: 10,
        armor: [
          { text: "LH-1005", description: "increased hybrid damage." },
          { text: "LE-1005", description: "increased laser damage." },
        ],
        shield: [
          { text: "LH-1006", description: "increased hybrid damage." },
          { text: "LE-1006", description: "increased laser damage." },
          { text: "HG-1006", description: "increased armor." },
        ],
      },
    ],Triglavian: [
      {
        slot: 7,
        armor: [
			{ text: "MR-705", description: "increased tracking." },
			{ text: "RA-705", description: "reduce cap need for remote reps." },
			],
        shield: [
			{ text: "MR-706", description: "increased tracking." },
			{ text: "RA-706", description: "reduce cap need for reps." },
		],
      },
      {
        slot: 8,
        armor: { text: "EM-805", description: "increased capacitor." },
        shield: [
			{ text: "EM-806", description: "increased capacitor." },
		],
      },
      {
        slot: 9,
        armor: { text: "RF-906", description: "increased rate of fire." },
        shield: null,
      },
      {
        slot: 10,
        armor: [
          { text: "HG-1005", description: "increased armor." },
        ],
        shield: [
          { text: "HG-1006", description: "increased armor." },
          { text: "HG-1008", description: "increased armor." },
        ],
      },
    ],
    default: [],
  };

  const rows = hardwireOptions[type] || hardwireOptions.default;
  return (
    <>
      <Row>
        <Cell>
          <b>Slot 7</b>
        </Cell>
        <Cell>
          <CopyImplantText toast={toastContext} item={"EM-705"} /> increased agility.
        </Cell>

        <Cell>
          <CopyImplantText toast={toastContext} item={"SM-705"} /> increase shield.
        </Cell>
      </Row>
      <Row>
        <Cell>
          <b>Slot 8</b>
        </Cell>
        <Cell>
          <CopyImplantText toast={toastContext} item={"EM-805"} /> increased capacitor.
        </Cell>

        <Cell>
          <CopyImplantText toast={toastContext} item={"EM-805"} /> increased capacitor.
        </Cell>
      </Row>
      <Row>
        <Cell>
          <b>Slot 9</b>
        </Cell>
        <Cell>
          <CopyImplantText toast={toastContext} item={"HS-905"} /> increased agility.
        </Cell>

        <Cell>
          <CopyImplantText toast={toastContext} item={"HS-905"} /> increased agility.
        </Cell>
      </Row>
      <Row>
        <Cell>
          <b>Slot 10</b>
        </Cell>
        <Cell>
          <b>Armor:</b>
          <br />
          <CopyImplantText toast={toastContext} item={"HG-1005"} /> increased armor.{" "}
          <br />
          <br />
          <b>Optional:</b>
          <br />
          <CopyImplantText toast={toastContext} item={"HG-1006"} /> increased armor.
        </Cell>
        <Cell>
          <b>Shield:</b>
          <br />
          <CopyImplantText toast={toastContext} item={"Shield Command Mindlink"} /> links boost.{" "}
          <br />
        </Cell>
      </Row>
    </>
  );
}