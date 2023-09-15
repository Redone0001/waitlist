import { useApi } from "../../api";
import { InputGroup, Button, Buttons } from "../../Components/Form";
import { Fitout, ImplantOut } from "./FittingSortDisplay";
import { PageTitle } from "../../Components/Page";
import { useLocation, useHistory } from "react-router-dom";
import { usePageTitle } from "../../Util/title";

export function Fits() {
  const queryParams = new URLSearchParams(useLocation().search);
  const history = useHistory();
  var tier = queryParams.get("Tier") || "Starter";
  const setTier = (newTier) => {
    queryParams.set("Tier", newTier);
    history.push({
      search: queryParams.toString(),
    });
  };

  return <FitsDisplay tier={tier} setTier={setTier} />;
}

function FitsDisplay({ tier, setTier = null }) {
  usePageTitle(`${tier} Fits`);
  const [fitData] = useApi(`/api/fittings`);
  if (fitData === null) {
    return <em>Loading fits...</em>;
  }

  return (
    <>
      <PageTitle>HQ FITS</PageTitle>
      {setTier != null && (
        <Buttons style={{ marginBottom: "0.5em" }}>
          <InputGroup>
            <Button active={tier === "Starter"} onClick={(evt) => setTier("Starter")}>
              Starter
            </Button>
            <Button active={tier === "GOLDEN"} onClick={(evt) => setTier("GOLDEN")}>
              GOLDEN
            </Button>
            <Button active={tier === "STANDARD"} onClick={(evt) => setTier("STANDARD")}>
              STANDARD
            </Button>
            <Button active={tier === "OPTIMAL"} onClick={(evt) => setTier("OPTIMAL")}>
              OPTIMAL
            </Button>
          </InputGroup>
          <InputGroup>
            <Button active={tier === "Other"} onClick={(evt) => setTier("Other")}>
              Support
            </Button>
          </InputGroup>
          <InputGroup>
            <Button active={tier === "Antigank"} onClick={(evt) => setTier("Antigank")}>
              Antigank
            </Button>
          </InputGroup>
        </Buttons>
      )}
      <ImplantOut />
      {tier === "Starter" ? (
        <Fitout data={fitData} tier="Starter" />
      ) : tier === "Basic" ? (
        <Fitout data={fitData} tier="Basic" />
      ) : tier === "Advanced" ? (
        <Fitout data={fitData} tier="Advanced" />
      ) : tier === "Elite" ? (
        <Fitout data={fitData} tier="Elite" />
      ) : tier === "Other" ? (
        <Fitout data={fitData} tier="Other" />
      ) : tier === "Antigank" ? (
        <Fitout data={fitData} tier="Antigank" />
      ) : null}
    </>
  );
}
