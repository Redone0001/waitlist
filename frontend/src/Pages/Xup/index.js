import React, { useEffect, useState } from "react";
import { ToastContext, AuthContext } from "../../contexts";
import { addToast } from "../../Components/Toast";
import { apiCall, errorToaster, useApi } from "../../api";
import { Button, Buttons, InputGroup, NavButton, Textarea, Select } from "../../Components/Form";
import { useLocation } from "react-router-dom";
import { Content, PageTitle } from "../../Components/Page";
import { FitDisplay, ImplantDisplay } from "../../Components/FitDisplay";
import _ from "lodash";
import { Box } from "../../Components/Box";
import { Modal } from "../../Components/Modal";

import howToX from "./howtox.png";
import { usePageTitle } from "../../Util/title";

const exampleFit = String.raw`
[Vindicator, Vindicator]
Shadow Serpentis Damage Control
Centum A-Type Multispectrum Energized Membrane
Centum A-Type Multispectrum Energized Membrane
Federation Navy Magnetic Field Stabilizer
Federation Navy Magnetic Field Stabilizer
Federation Navy Magnetic Field Stabilizer
Federation Navy Magnetic Field Stabilizer

Core X-Type 500MN Microwarpdrive
Federation Navy Stasis Webifier
Federation Navy Stasis Webifier
Federation Navy Stasis Webifier
Large Micro Jump Drive

Neutron Blaster Cannon II
Neutron Blaster Cannon II
Neutron Blaster Cannon II
Neutron Blaster Cannon II
Neutron Blaster Cannon II
Neutron Blaster Cannon II
Neutron Blaster Cannon II
Neutron Blaster Cannon II

Large Hybrid Locus Coordinator II
Large Explosive Armor Reinforcer II
Large Hyperspatial Velocity Optimizer II



'Augmented' Ogre x5

Null L x10000
Nanite Repair Paste x2000
Void L x20000
Agency 'Pyrolancea' DB7 Dose III x1
Standard Drop Booster x10
Quafe Zero Classic x1
Agency 'Pyrolancea' DB3 Dose I x10
Agency 'Pyrolancea' DB5 Dose II x10
`.trim();

async function xUp({ character, eft, toastContext, waitlist_id, alt }) {
  await apiCall("/api/waitlist/xup", {
    json: { eft: eft, character_id: character, waitlist_id: parseInt(waitlist_id), is_alt: alt },
  });

  addToast(toastContext, {
    title: "Added to waitlist.",
    message: "Your X has been added to the waitlist!",
    variant: "success",
  });

  if (window.Notification) {
    Notification.requestPermission();
  }
}

export function Xup() {
  usePageTitle("X-up");
  const toastContext = React.useContext(ToastContext);
  const authContext = React.useContext(AuthContext);
  const queryParams = new URLSearchParams(useLocation().search);
  const [eft, setEft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [alt, setAlt] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(authContext.current.id);
  const [selectedCharacterName, setSelectedCharacterName] = useState(authContext.current.name);
  const waitlist_id = queryParams.get("wl");

  // Fetch implants whenever selectedCharacter changes
  const [implants] = useApi(`/api/implants?character_id=${selectedCharacter}`);

  useEffect(() => {
    setSelectedCharacter(authContext.current.id); // Set initial character
	setSelectedCharacterName(authContext.current.name);
  }, [authContext.current.id,authContext.current.name]);

  if (!waitlist_id) {
    return <em>Missing waitlist information</em>;
  }

  return (
    <>
      {reviewOpen && (
        <Modal open={true} setOpen={(evt) => null}>
          <Box>
            <XupCheck waitlistId={waitlist_id} setOpen={setReviewOpen} />
          </Box>
        </Modal>
      )}

      <div style={{ display: "flex" }}>
        <Content style={{ flex: 1 }}>
          <h2>X-up with fit(s)</h2>
          <Textarea
            placeholder={exampleFit}
            rows={15}
            onChange={(evt) => setEft(evt.target.value)}
            value={eft}
            style={{ width: "100%", marginBottom: "1em" }}
          />

          <InputGroup>
            <Select
              value={selectedCharacter}
              onChange={(evt) => setSelectedCharacter(parseInt(evt.target.value))} // Update selected character
              style={{ flexGrow: "1" }}
            >
              {authContext.characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </Select>
            <Button
              variant="success"
              onClick={(evt) => {
                setIsSubmitting(true);
                errorToaster(
                  toastContext,
                  xUp({
                    character: selectedCharacter, // Use selected character
                    eft,
                    toastContext,
                    waitlist_id,
                    alt,
                  }).then((evt) => setReviewOpen(true))
                ).finally(() => setIsSubmitting(false));
              }}
              disabled={eft.trim().length < 50 || !eft.startsWith("[") || isSubmitting}
            >
              X-up
            </Button>
          </InputGroup>

          <h2>How to X up?</h2>
          <img
            src={howToX}
            alt="On the bottom left of the Fitting window you will find a copy button"
          />
        </Content>
        <Box style={{ flex: 1 }}>
          {implants ? (
            <ImplantDisplay
              implants={implants.implants}
              name={`Your implants:`}
            />
          ) : null}
        </Box>
      </div>
    </>
  );
}

function XupCheck({ waitlistId, setOpen }) {
  const authContext = React.useContext(AuthContext);
  const [xupData] = useApi(`/api/waitlist?waitlist_id=${waitlistId}`);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false); 
    } else if (event.key === "Enter") {
      window.location.href = `/waitlist?wl=${waitlistId}`;
    }
  };
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown); 
    };
  }, []); 

  if (!xupData) {
    return <em>Loading</em>;
  }

  const myEntry = _.find(
    xupData.waitlist,
    (entry) => entry.character && entry.character.id === authContext.account_id
  );

  return (
    <>
      <PageTitle>Fit review</PageTitle>
      <em>
        You are now on the waitlist! These are the fits you x-ed up with, please check to make sure
        you have everything and adjust your fit if needed.
      </em>
      {myEntry.fits.map((fit) => (
        <Box key={fit.id}>
          <FitDisplay fit={fit} />
        </Box>
      ))}
      <Buttons>
        <NavButton variant="primary" to={`/waitlist?wl=${waitlistId}`}>
          Yes, looks good
        </NavButton>
        <Button variant="secondary" onClick={(evt) => setOpen(false)}>
          No, go back to update my fit
        </Button>
      </Buttons>
    </>
  );
}
