import { Content } from "../Components/Page";
import { NavLink } from "react-router-dom";
import { NavButton, InputGroup } from "../Components/Form";

export function Home() {
  return (
    <>
      <InputGroup>
        <NavButton to={`/guide/rules`}>Rules</NavButton>
        <NavButton to={`/legal`}>Legal</NavButton>
      </InputGroup>
      <Content>
        <h2>Welcome to The Beancursion</h2>

        <p>
          Hello fellow bean, we would like to introduce you to the SIG Beancursion. 
          We are a new-bro friendly group where all are welcome. We
          have affordable starter fits, and we can help make you space rich, all we ask in return is
          you follow our upgrade policy to help the SIG excel and follow the rules!
        </p>
        <p>
          Beancursion is an armor doctrine incursion SIG. We run Vanguards (15 person),
          Assaults (30 person), and Headquarters (60 person) Incursion sites.
        </p>
        <p>
          Check out our <NavLink to="/guide">Guides</NavLink> section for all the information you
          need to get started, see <NavLink to="/guide/newbro">new-bro guide</NavLink>,{" "}
          <NavLink to="/guide/xup">first fleet guide</NavLink> etc, also join the in-game chat
          channel <em>Sansha Containment Service</em>, where you will find the mailing lists for fits and other
          usual information in the MOTD (message of the day), we look forward to flying with you!
        </p>
        <h3>What are Incursions?</h3>
        <p>
          Incursions are automated events introduced with the Incursion expansion in which the NPC
          faction known as the Sansha&apos;s Nation, led by Sansha Kuvakei, invade space in an
          attempt to conquer it for themselves. Capsuleers must fight off Sansha&apos;s forces in
          order to return the contested space back to an area which can be safely occupied.
        </p>
        <p>
          Incursions are high-end PvE fleet content, well above that of regular level four missions,
          where you can earn upwards of 200mil ISK/h on average. The introduction of incursions to
          the game added some much-needed fleet content in highsec space. It also gives people a
          very controlled environment to train up their skills as a logistics pilot, as well as
          giving people a feel for organized fleets. Incursion fleets rely on buffers and resists
          supported by logistics ships in order to survive. The NPCs you face in incursions use
          electronic warfare, capacitor warfare as well as playing on speed and signature to their
          advantage and this helps to teach you many of the ingame mechanics you may face.
        </p>
      </Content>
    </>
  );
}
