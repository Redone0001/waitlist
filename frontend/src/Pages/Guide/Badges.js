import React from "react";
import { Box } from "../../Components/Box";
import { Modal } from "../../Components/Modal";
import { Title, Content } from "../../Components/Page";
import styled from "styled-components";
import { ImplantOut } from "../Fits/FittingSortDisplay";
import { NavButton, InputGroup } from "../../Components/Form";
import { InfoNote } from "../../Components/NoteBox";

import { BadgeDOM, BadgeModal } from "../../Components/Badge";
import { usePageTitle } from "../../Util/title";

const BadgeDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const BadgeImages = {};
function importAll(r) {
  r.keys().forEach((key) => (BadgeImages[key] = r(key)));
}
importAll(require.context("./badges", true, /\.(jpg|png)$/));

function BadgeButton({ name, img, children }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      {modalOpen ? (
        <Modal open={true} setOpen={setModalOpen}>
          <Box>
            <BadgeModal>
              <BadgeModal.Title>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={BadgeImages[img]}
                    alt={name}
                    style={{ width: "1.8em", marginRight: "0.5em" }}
                  />
                </div>
                <Title>{name} &nbsp;</Title>
              </BadgeModal.Title>
              {children}
            </BadgeModal>
          </Box>
        </Modal>
      ) : null}

      <BadgeDOM>
        <a onClick={(evt) => setModalOpen(true)}>
          <BadgeDOM.Content>
            <BadgeDOM.Icon>
              <img src={BadgeImages[img]} alt={name} style={{ width: "1.5em" }} />
            </BadgeDOM.Icon>
            {name}
          </BadgeDOM.Content>
        </a>
      </BadgeDOM>
    </>
  );
}

export function BadgeData() {
  usePageTitle("Badges");
  return (
    <>
      <Content style={{ marginBottom: "2em" }}>
        <h1>Badges</h1>
        <p>
          <b>This page is still under review, read it for your general knowledge but the content is not yet adapted to the beancursion SIG. Contact Jakaja Cain on discord if you have any question/update)</b>
        </p>
        <h2>What are badges for?</h2>
        <p>
          {" "}
          Badges are a tool mostly for FCs to quickly see what the fleet composition looks like and
          to check a pilots fitting meets requirements. To join Elite fleets you must have the Elite
          badge on TS and on the waitlist. Specialist badges are not required for any pilot but are
          there if you wish to upgrade further, specialist badges come with perks of priority invite
          to elite fleets.
        </p>

        <p>
          Badge assignment on the website (for specialist badges) can be done by
          any FC.
        </p>
        <Title>Implant Badges</Title>
        <BadgeDisplay>
          <ImplantOut />
        </BadgeDisplay>
        <Title>Tier Badge</Title>
        <BadgeDisplay>
          <BadgeButton name="Starter Pilot" img={"./starter.png"}>
            Pilot is new to Beancurison & Incursions. <br />
            To get rid of the starter tag you need to do the following:
            <br />
            <br />
            <Content>
              <ul>
                <li>Standard fit or better</li>
                <li>Basic tier skills or better for the applicable ship</li>
              </ul>
            </Content>
            <br />
            <InputGroup>
              <NavButton to={`/skills`}>Check your skills</NavButton>
              <NavButton to={`/guide/upgrade`}>Upgrade guide & policy</NavButton>
            </InputGroup>
          </BadgeButton>
          <BadgeButton name="Elite" img={"./e.png"}>
            <b>Allows you to join elite fleets</b>
            <br />
            This badge 
            <br />
            Requirements to aquire the elite badge are:
            <br />
            <br />
            <Content>
              <ul>
              
                <li>Optimal fit</li>
                <li>Elite skills or better for the applicable ship</li>
              </ul>
            </Content>
            <InfoNote>You must be scanned by an FC to aquire the badge so reach to your favorite FC</InfoNote>
            <br />
            <InputGroup>
              <NavButton to={`/skills`}>Check your skills</NavButton>
              <NavButton to={`/guide/upgrade`}>Upgrade guide & policy</NavButton>
            </InputGroup>
          </BadgeButton>
          <BadgeButton name="Elite Gold" img={"./egold.png"}>
            This badge is optional
            <br />
            Requirements to get elite gold badge are: <br />
            <br />
            <Content>
              <ul>
                <li>Elite badge for the applicable ship</li>
                <li>Elite gold skills or better for the applicable ship</li>
              </ul>
            </Content>
            <br />
            <NavButton to={`/skills`}>Check your skills</NavButton>
          </BadgeButton>
        </BadgeDisplay>
        <Title>Specialist Badges</Title>
        <BadgeDisplay>
          <BadgeButton name="Logi Specialist" img={"./l.png"}>
            <b>Show to FC that you are a trusted Logi</b>
            <br />
            Requirements to get logistics specialist badge are:
            <br />
            <br />
            <Content>
              <ul>
                <li>Elite skills for Nestor</li>
                <li>Minimum of 20 hours in a logi</li>
                <li>You need to be able to call out reps correctly</li>
                <li>You need to know where to position the logi on every site</li>
                <li>After you ask for your badge, FC will discuss and check your behaviour in fleet</li>
              </ul>
            </Content>
            <br />
            <InputGroup>
              <NavButton to={`/skills?ship=Nestor`}>Check your skills</NavButton>
              <NavButton to={`/pilot`}>Logged Logi hours</NavButton>
            </InputGroup>
          </BadgeButton>
          <BadgeButton name="Bastion Specialist" img={"./bastion.png"}>
            <b>Gives priority invite to elite fleet</b>
            <br />
            This badge is optional
            <br />
            Requirements to get bastion specialist badge are: <br />
            <br />
            <Content>
              <ul>
                <li>Elite badge for a Bastion-capable ship</li>
                <li>You know the position for you ship on every waves of every site</li>
                <li>Minimum of 20 hour in a bastion ship</li>
                <li>Able to call when you can bastion</li>
              </ul>
            </Content>
            <InfoNote>
              Contact an FC to verify your calls and apply the badge on the website.
              Badge can be viewed on pilot page.
            </InfoNote>
          </BadgeButton>
          <BadgeButton name="Web Specialist" img={"./wv.png"}>
            <b>Gives priority invite to elite fleet</b>
            <br />
            This badge is optional
            <br />
            Requirements to get web specialist badge are: <br />
            <br />
            <Content>
              <ul>
                <li>Elite badge pre-requisites for a Vindicator</li>
                <li>Minmatar Battleship skill level 5</li>
                <li>You know the position for you ship on every waves of every site</li>
                <li>You know both the HHH and DDD role</li>
              </ul>
            </Content>
            <InfoNote>
              Contact an FC to verify and apply the badge on the website.
              Badge can be viewed on pilot page.
            </InfoNote>
          </BadgeButton>
          <BadgeButton name="Multibox Specialist" img={"./m.png"}>
            <b>Allow you to get your own squad in fleet and access to special fit for you only</b>
            <br />
            This badge is optional
            <br />
            Requirements to get web specialist badge are: <br />
            <br />
            <Content>
              <ul>
                <li>Being able to multibox 10+ account in HQ fleet</li>
                <li>All those account have the minimal skill for their ship</li>
              </ul>
              <br />The list of ship allowed for alt :<br />
              <ul>
                <li>Ishtar or Eos</li>
                <li>Any standard / Optimal fit</li>
              </ul>
            </Content>
            <InfoNote>
              Contact an FC to verify and apply the badge on the website.
              Badge can be viewed on pilot page.
            </InfoNote>
          </BadgeButton>
        </BadgeDisplay>
        <Title>FC Badges</Title>
        <BadgeDisplay>
          <BadgeButton name="Training FC" img={"./trainee.png"}>
            Only allowed to take a fleet into sites with
            SRP cover provided an FC with the badge relevant to the site is in the fleet. <br />
            <br />
            <p style={{ marginBottom: "0.5em" }}>Find out more about becoming a trainee FC here:</p>
            <NavButton to={`/guide/fctraining`}>FC Training Program</NavButton>
          </BadgeButton>
          <BadgeButton name="HQ FC" img={"./hq.png"}>
            Permitted to run fleets and to take a fleet into Headquarters, Assault
            and Vanguard sites with SRP cover.
          </BadgeButton>
          <BadgeButton name="FC Trainer" img={"./trainer.png"}>
            Permitted to run fleets and to take a fleet into Headquarters, Assault
            and Vanguard sites with SRP cover. <br />
            <br />
            Can promote Trainee FC&apos;s to full FC tags and conduct validation fleets for
            trainee FC&apos;s.
          </BadgeButton>
          <BadgeButton name="Council" img={"./c.png"}>
            Member of the Beancursion council, which makes decisions that impact the SIG. <br />
            <br />
            Permitted to run fleets and to take a fleet into Headquarters, Assault
            and Vanguard sites with SRP cover. <br />
            <br />
            Can promote Full FC&apos;s to FC Trainer and Trainee FC&apos;s to full FC tags and
            conduct validation fleets for trainee FC&apos;s.
          </BadgeButton>
        </BadgeDisplay>
      </Content>
    </>
  );
}
