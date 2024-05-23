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
  var implants;
  if (type === "Hybrid") {
    implants = [
      "Mid-grade Amulet Alpha",
      "Mid-grade Amulet Beta",
      "Mid-grade Amulet Gamma",
      "Mid-grade Amulet Delta",
      "Mid-grade Amulet Epsilon",
    ];
  } else {
    implants = [
      "Mid-grade Savior Alpha",
      "Mid-grade Savior Beta",
      "Mid-grade Savior Gamma",
      "Mid-grade Savior Delta",
      "Mid-grade Savior Epsilon",
    ];
  }
  return (
    <>
      <InfoNote>
        {type === "Hybrid"
          ? "Hybrid tagged fits require at least Amulet 1 - 6 to be flown."
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

          <Row>
            <Cell>
              <b>Slot 6</b>
            </Cell>
            {type === "Hybrid" ? (
              <Cell>
              <CopyImplantText toast={toastContext} item={"Mid-grade Amulet Omega"} />
            </Cell>
            ) : (
              <Cell>
                <CopyImplantText toast={toastContext} item={"Mid-grade Savior Omega"} /> if you
                have too much isk.
              </Cell>
            )}
          </Row>

          <HardWires toastContext={toastContext} />
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

function HardWires({ toastContext }) {
  return (
    <>
      <Row>
        <Cell>
          <b>Slot 7</b>
        </Cell>
        <Cell>
          <CopyImplantText toast={toastContext} item={"MR-705"} /> increased tracking.
        </Cell>

        <Cell>
          <CopyImplantText toast={toastContext} item={"MR-706"} /> <br />
          <CopyImplantText toast={toastContext} item={"RA-706"} /> reps will use less cap, for
          <b> logi only pilots.</b>
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
          <CopyImplantText toast={toastContext} item={"MR-805"} /> longer webbing range, for
          <b> vindicator only pilots.</b> (not incursion lp)<br />
          <CopyImplantText toast={toastContext} item={"EM-806"} />{" "}
          increased MWD speed for
          <b> DPS only pilots.</b>
        </Cell>
      </Row>
      <Row>
        <Cell>
          <b>Slot 9</b>
        </Cell>
        <Cell>
          <CopyImplantText toast={toastContext} item={"RF-905"} /> increased rate of fire.
        </Cell>

        <Cell>
          <CopyImplantText toast={toastContext} item={"RF-906"} />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <b>Slot 10</b>
        </Cell>
        <Cell>
          <b>Kronos/Vindicator:</b>
          <br />
          <CopyImplantText toast={toastContext} item={"LH-1005"} /> increased hybrid weapon damage.{" "}
          <br />
          <br />
          <b>Paladin/Nightmare:</b>
          <br />
          <CopyImplantText toast={toastContext} item={"LE-1005"} /> increased energy weapon damage.
        </Cell>
        <Cell>
          <b>Kronos/Vindicator:</b>
          <br />
          <CopyImplantText toast={toastContext} item={"LH-1006"} /> increased hybrid weapon damage.{" "}
          <br />
          <br />
          <b>Paladin/Nightmare:</b>
          <br />
          <CopyImplantText toast={toastContext} item={"LE-1006"} /> increased energy weapon damage.
        </Cell>
      </Row>
    </>
  );
}
