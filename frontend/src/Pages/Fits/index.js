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
	  <ImplantOut />
      {setTier != null && (
        <Buttons style={{ marginBottom: "0.5em" }}>
          <InputGroup>
            <Button active={tier === "Starter"} onClick={(evt) => setTier("Starter")}>
              Starter
            </Button>
            <Button active={tier === "Golden"} onClick={(evt) => setTier("Golden")}>
              Golden
            </Button>
            <Button active={tier === "Standard"} onClick={(evt) => setTier("Standard")}>
              Standard
            </Button>
            <Button active={tier === "Optimal"} onClick={(evt) => setTier("Optimal")}>
              Optimal
            </Button>
          </InputGroup>
          <InputGroup>
            <Button active={tier === "Other"} onClick={(evt) => setTier("Other")}>
              Support
            </Button>
          </InputGroup>
        </Buttons>
      )}
	  {tier === "Starter" ? (
        <Fitout data={fitData} tier="Starter" />
      ) : tier === "Golden" ? (
        <Fitout data={fitData} tier="Golden" />
      ) : tier === "Standard" ? (
        <Fitout data={fitData} tier="Standard" />
      ) : tier === "Optimal" ? (
        <Fitout data={fitData} tier="Optimal" />
      ) : tier === "Other" ? (
        <Fitout data={fitData} tier="Other" />
      ) : null}
	  <PageTitle>VG reFITS</PageTitle>
      {setTier != null && (
        <Buttons style={{ marginBottom: "0.5em" }}>
          <InputGroup>
            <Button active={tier === "VG"} onClick={(evt) => setTier("VG")}>
              VG refit
            </Button>
			<Button active={tier === "Shield Stormbringer"} onClick={(evt) => setTier("Shield Stormbringer")}>
              VG Stormbringer Doctrine
            </Button>
          </InputGroup>
        </Buttons>
      )}
	  {tier === "VG" ? (
        <Fitout data={fitData} tier="VG" />
      ) : tier === "Shield Stormbringer" ? (
        <Fitout data={fitData} tier="Shield Stormbringer" />
      ) : null}
	  <PageTitle>Offensive FITS</PageTitle>
      {setTier != null && (
        <Buttons style={{ marginBottom: "0.5em" }}>
          <InputGroup>
            <Button active={tier === "Offensive"} onClick={(evt) => setTier("Offensive")}>
              Offensive
            </Button>
          </InputGroup>
        </Buttons>
      )}
      {tier === "Offensive" ? (
        <Fitout data={fitData} tier="Offensive" />
      ) : null}
    </>
  );
}
