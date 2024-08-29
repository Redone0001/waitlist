import { useApi } from "../../api";
import { InputGroup, Button, Buttons } from "../../Components/Form";
import { Fitout, ImplantOut } from "./FittingSortDisplay";
import { PageTitle } from "../../Components/Page";
import { useLocation, useHistory } from "react-router-dom";
import { usePageTitle } from "../../Util/title";
import { useTheme } from 'styled-components';

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
  const theme = useTheme();
  if (fitData === null) {
    return <em>Loading fits...</em>;
  }

  return (
    <>
      <PageTitle>HQ FITS</PageTitle>
	  <h2 style={{ marginBottom: "1em", fontStyle: "italic", color: "#555" }}>
      Each doctrine has its own color. Do not mix them: Green with Green, Red with Red, etc.
      </h2>
	  <ImplantOut />
      {setTier != null && (
        <Buttons style={{ marginBottom: "0.5em" }}>
          <InputGroup>
            <Button active={tier === "Starter"} onClick={(evt) => setTier("Starter")} style={{ backgroundColor: theme.colors.success.color }}>
              Starter
            </Button>
            <Button active={tier === "Golden"} onClick={(evt) => setTier("Golden")} style={{ backgroundColor: theme.colors.success.color }}>
              Golden
            </Button>
            <Button active={tier === "Standard"} onClick={(evt) => setTier("Standard")} style={{ backgroundColor: theme.colors.success.color }}>
              Standard
            </Button>
            <Button active={tier === "Optimal"} onClick={(evt) => setTier("Optimal")} style={{ backgroundColor: theme.colors.success.color }}>
              Optimal
            </Button>
          </InputGroup>
          <InputGroup>
            <Button active={tier === "Other"} onClick={(evt) => setTier("Other")} style={{ backgroundColor: theme.colors.success.color }}>
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
            <Button active={tier === "VG"} onClick={(evt) => setTier("VG")} style={{ backgroundColor: theme.colors.success.color }}>
              VG refit
            </Button>
			<Button active={tier === "Shield Stormbringer"} onClick={(evt) => setTier("Shield Stormbringer")} style={{ backgroundColor: theme.colors.danger.color }}>
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
            <Button active={tier === "Offensive"} onClick={(evt) => setTier("Offensive")} style={{ backgroundColor: theme.colors.warning.color }}>
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
