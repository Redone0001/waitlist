import React from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../contexts";
import logoImage from "./logo.png";
import logoXmasImage from "./logo_xmas.png";
import styled from "styled-components";
import { InputGroup, Select, NavButton } from "../Components/Form";
import { EventNotifier } from "../Components/Event";
import { ThemeSelect } from "../Components/ThemeSelect";
import { NavLinks, MobileNavButton, MobileNav } from "./Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, fa-headphones-simple, faUserGroup } from "@fortawesome/free-brands-svg-icons";

const NavBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 1em;
  margin-bottom: 1em;
  @media (max-width: 480px) {
    padding: 0.2em;
    justify-content: space-between;
  }
`;
NavBar.Header = styled.div`
  display: flex;
  @media (max-width: 480px) {
    width: 100%;
    border-bottom: 3px solid;
    margin-bottom: 1em;
    padding-bottom: 0.2em;
  }
`;

NavBar.LogoLink = styled(NavLink).attrs((props) => ({
  activeClassName: "active",
}))`
  margin-right: 2em;
  flex-grow: 0;
  line-height: 0;
  @media (max-width: 480px) {
    margin-right: unset;
    margin-left: auto;
  }
`;
NavBar.Logo = styled.img`
  width: 150px;
  filter: ${(props) => props.theme.logo.filter};
`;
NavBar.Menu = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-grow: 1;
`;
NavBar.Link = styled(NavLink).attrs((props) => ({
  activeClassName: "active",
}))`
  padding: 1em;
  color: ${(props) => props.theme.colors.accent4};
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.accent1};
  }
  &.active {
    color: ${(props) => props.theme.colors.active};
  }
`;
NavBar.End = styled.div`
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  > :not(:last-child) {
    @media (max-width: 480px) {
      margin-bottom: 0.4em;
    }
  }
`;
NavBar.Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 480px) {
    display: none;
  }
`;
NavBar.Name = styled.div`
  margin-right: 2em;
  @media (max-width: 480px) {
    margin-right: 0em;
    width: 100%;
  }
`;


export function Menu({ onChangeCharacter, theme, setTheme, sticker, setSticker }) {
  const [isOpenMobileView, setOpenMobileView] = React.useState(false);
  const logoSrc = theme === "Xmas" ? logoXmasImage : logoImage;
  return (
    <AuthContext.Consumer>
      {(whoami) => (
        <NavBar>
          <NavBar.Header>
            <MobileNavButton isOpen={isOpenMobileView} setIsOpen={setOpenMobileView} />
            <NavBar.LogoLink to="/">
              <NavBar.Logo src={logoSrc} alt="The Beancursion Fleet" />
            </NavBar.LogoLink>
          </NavBar.Header>
          <NavBar.Menu>
            <NavBar.Main>
              <NavLinks whoami={whoami} />
            </NavBar.Main>
            <NavBar.End>
              {whoami && (
                <>
                  <NavBar.Name>
                    <InputGroup fixed>
                      <Select
                        value={whoami.current.id}
                        onChange={(evt) =>
                          onChangeCharacter && onChangeCharacter(parseInt(evt.target.value))
                        }
                        style={{ flexGrow: "1" }}
                      >
                        {whoami.characters.map((character) => (
                          <option key={character.id} value={character.id}>
                            {character.name}
                          </option>
                        ))}
                      </Select>
                      <NavButton exact to="/auth/start/alt">
                        +
                      </NavButton>
                    </InputGroup>
                  </NavBar.Name>
                </>
              )}
              <InputGroup fixed>
                <EventNotifier />
                <AButtonAlt title="Group" href="https://www.pandemic-horde.org/settings/groups/open">
                  <FontAwesomeIcon icon={faUserGroup} />
                </AButtonAlt>
                <AButtonAlt title="Discord" href="https://www.pandemic-horde.org/settings/discord/join">
                  <FontAwesomeIcon icon={faDiscord} />
                </AButtonAlt>
                <AButtonAlt title="Mumble" href="https://www.pandemic-horde.org/settings/mumble/join">
                  <FontAwesomeIcon icon={fa-headphones-simple} />
                </AButtonAlt>
                <ThemeSelect
                  theme={theme}
                  setTheme={setTheme}
                  sticker={sticker}
                  setSticker={setSticker}
                />
                {whoami ? (
                  <NavButton exact to="/auth/logout" variant="secondary">
                    Log out
                  </NavButton>
                ) : (
                  <NavButton exact to="/auth/start" variant="primary">
                    Log in
                  </NavButton>
                )}
              </InputGroup>
            </NavBar.End>
            <MobileNav isOpen={isOpenMobileView} whoami={whoami} />
          </NavBar.Menu>
        </NavBar>
      )}
    </AuthContext.Consumer>
  );
}
