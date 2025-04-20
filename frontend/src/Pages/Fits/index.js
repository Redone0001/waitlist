import { useContext } from "react";
import { useApi } from "../../api";
import { InputGroup, Button, Buttons } from "../../Components/Form";
import { Fitout, ImplantOut } from "./FittingSortDisplay";
import { PageTitle } from "../../Components/Page";
import { useLocation, useHistory } from "react-router-dom";
import { usePageTitle } from "../../Util/title";
import { useTheme } from 'styled-components';	
import { AuthContext, ToastContext } from "../../contexts";

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
  const authContext = useContext(AuthContext);
  const [fitData] = useApi(`/api/fittings`);
  const theme = useTheme();
  if (fitData === null) {
    return <em>Loading fits...</em>;
  }

  return (
    <>
	  <h2 style={{ marginBottom: "1em", fontStyle: "italic", color: "#555" }}>
      Each doctrine has its own color. Do not mix them: Green with Green, Red with Red, etc.
      </h2>
      <PageTitle>Main Armor Doctrine</PageTitle>
	  <h1>HQ Fits</h1>
	  <ImplantOut />
      {setTier != null && (
        <Buttons style={{ marginBottom: "0.5em" }}>
          <InputGroup>
            <Button active={tier === "Starter"} onClick={(evt) => setTier("Starter")} style={{ backgroundColor: theme.colors.success.color }}>
              Starter
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
			{authContext && authContext.access["waitlist-tag:TRAINEE"] && (
			<Button active={tier === "fc only"} onClick={(evt) => setTier("fc only")} style={{ backgroundColor: theme.colors.success.color }}>
              UwU section (fc only)
            </Button>
			)}
          </InputGroup>
        </Buttons>
      )}
	  {tier === "Starter" ? (
        <Fitout data={fitData} tier="Starter" />
      ) : tier === "Standard" ? (
        <Fitout data={fitData} tier="Standard" />
      ) : tier === "Optimal" ? (
        <Fitout data={fitData} tier="Optimal" />
      ) : tier === "fc only" ? (
        <Fitout data={fitData} tier="fc only" />
      ) : tier === "Other" ? (
        <Fitout data={fitData} tier="Other" />
      ) : null}
    </>
  );
}
