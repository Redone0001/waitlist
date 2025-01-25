import { useApi } from "../api";
import { Badge } from "./Badge";
import { InputGroup, Button, Buttons } from "./Form";
import { Col, Row } from "react-awesome-styled-grid";
import { InfoNote } from "./NoteBox";

import styled from "styled-components";
import _ from "lodash";

const SkillDom = {};

SkillDom.Table = styled.div`
  margin-bottom: 2em;
`;

SkillDom.Table.Name = styled.h3`
  border-bottom: solid 2px ${(props) => props.theme.colors.accent2};
  font-weight: bolder;
  padding: 0.75em;
`;

SkillDom.Table.Row = styled.div`
  display: flex;
  padding: 0.5em 0.75em 0.5em 0.75em;
  border-bottom: solid 1px ${(props) => props.theme.colors.accent2};

  &:last-child {
    border-bottom: none;
  }
  &:nth-child(odd) {
    background-color: ${(props) => props.theme.colors.accent1};
  }
  > :last-child {
    margin-left: auto;
  }
`;

const SkillHeader = styled.div`
  height: 36px;
`;

const categoryOrder = [
  "Tank",
  "Engineering",
  "Drones",
  "Navigation",
  "Gunnery",
  "Targeting",
  "Neural Enhancement",
  "Spaceship Command",
];
const knownCategories = new Set(categoryOrder);

const LevelIndicator = ({ current, skill }) => {
  if (current === 5) {
    return <Badge variant="success">{current}</Badge>;
  }

  var nextLevel = null;

  for (const [group, variant] of [
    ["gold", "success"],
    ["elite", "secondary"],
    ["min", "warning"],
  ]) {
    if (group in skill) {
      if (current >= skill[group]) {
        return (
          <Badge variant={variant}>
            {current}
            {nextLevel}
          </Badge>
        );
      }
      nextLevel = ` / ${skill[group]}`;
    }
  }

  for (const [group, variant] of [
    ["min", "danger"],
    ["elite", "warning"],
    ["gold", "secondary"],
  ]) {
    if (group in skill) {
      return (
        <Badge variant={variant}>
          {current}
          {nextLevel}
        </Badge>
      );
    }
  }

  return null;
};

function SkillTable({ title, current, requirements, ids, category, filterMin }) {
  var entries = [];
  category.forEach((skillId) => {
    if (!(skillId in requirements)) {
      return;
    }
    const skill = requirements[skillId];
    if (filterMin) {
      if (!skill.min) return;
      if (skill.min <= current[skillId]) {
        return;
      }
    }

    entries.push(
      <SkillDom.Table.Row key={skillId}>
        {ids[skillId]} <LevelIndicator current={current[skillId]} skill={skill} />
      </SkillDom.Table.Row>
    );
  });

  if (!entries.length) {
    return null;
  }

  return (
    <Col xs={4} sm={4} md={2}>
      <SkillDom.Table>
        <SkillDom.Table.Name>{title}</SkillDom.Table.Name>
        {entries}
      </SkillDom.Table>
    </Col>
  );
}

export function SkillList({ mySkills, shipName, filterMin }) {
  const ids = _.invert(mySkills.ids);

  if (!(shipName in mySkills.requirements)) {
    return <em>No skill information found</em>;
  }

  const categories = [...categoryOrder];
  _.forEach(_.keys(mySkills.categories), (categoryName) => {
    if (!knownCategories.has(categoryName)) {
      categories.push(categoryName);
    }
  });

  return (
    <>
      <Row>
        {categories.map((category) => (
          <SkillTable
            key={category}
            title={category}
            current={mySkills.current}
            requirements={mySkills.requirements[shipName]}
            category={mySkills.categories[category]}
            ids={ids}
            filterMin={filterMin}
          />
        ))}
      </Row>
    </>
  );
}

export function Legend() {}

export function SkillDisplay({ characterId, ship, setShip = null, filterMin = false }) {
  const [skills] = useApi(`/api/skills?character_id=${characterId}`);
  const shipName = ship.toUpperCase();
  const InfoIcon = styled.span`
	  display: inline-block;
	  margin-left: 8px;
	  cursor: pointer;
	  position: relative;
	  color: ${(props) => props.theme.colors.accent3};
	  font-weight: bold;

	  &:hover::after {
		content: "${(props) => props.tooltip}";
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 120%;
		background-color: ${(props) => props.theme.colors.accent3};
		color: #fff;
		padding: 0.5em;
		border-radius: 5px;
		white-space: nowrap;
		font-size: 0.9em;
		z-index: 10;
		opacity: 1;
		visibility: visible;
	  }

	  &:hover::before {
		content: "";
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 100%;
		border-width: 5px;
		border-style: solid;
		border-color: ${(props) => props.theme.colors.accent3} transparent transparent transparent;
		z-index: 10;
	  }

	  &::after,
	  &::before {
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.3s ease, visibility 0.3s ease;
	  }
	`;

  return (
    <>
      {setShip != null && (
        <Buttons style={{ marginBottom: "1em" }}>
          <InputGroup>
            <Button active={ship === "Megathron"} onClick={(evt) => setShip("Megathron")}>
              Megathron
            </Button>
            <Button active={ship === "Vindicator"} onClick={(evt) => setShip("Vindicator")}>
              Vindicator
            </Button>
            <Button active={ship === "Kronos"} onClick={(evt) => setShip("Kronos")}>
              Kronos
            </Button>
            <Button active={ship === "Nightmare"} onClick={(evt) => setShip("Nightmare")}>
              Nightmare
            </Button>
            <Button active={ship === "Paladin"} onClick={(evt) => setShip("Paladin")}>
              Paladin
            </Button>
          </InputGroup>
          <InputGroup>
			<Button active={ship === "Oneiros"} onClick={(evt) => setShip("Oneiros")}>
              Oneiros
            </Button>
            <Button active={ship === "Guardian"} onClick={(evt) => setShip("Guardian")}>
              Guardian
            </Button>
            <Button active={ship === "Nestor"} onClick={(evt) => setShip("Nestor")}>
              Nestor
            </Button>
          </InputGroup>
          <InputGroup>
            <Button active={ship === "Ishtar"} onClick={(evt) => setShip("Ishtar")}>
              Ishtar
            </Button>
            <Button active={ship === "Eos"} onClick={(evt) => setShip("Eos")}>
              Eos
            </Button>
            <Button active={ship === "Rattlesnake"} onClick={(evt) => setShip("Rattlesnake")}>
              Rattlesnake
            </Button>
            <Button active={ship === "Leshak"} onClick={(evt) => setShip("Leshak")}>
              Leshak
            </Button>
          </InputGroup>
          <InputGroup>
            <Button active={ship === "Gila"} onClick={(evt) => setShip("Gila")}>
              Gila
            </Button>
            <Button active={ship === "Basilisk"} onClick={(evt) => setShip("Basilisk")}>
              Basilisk
            </Button>
          </InputGroup>
          <InputGroup>
            <Button active={ship === "Stormbringer"} onClick={(evt) => setShip("Stormbringer")}>
              Stormbringer
            </Button>
            <Button active={ship === "Loki"} onClick={(evt) => setShip("Loki")}>
              Loki logi
            </Button>
          </InputGroup>
        </Buttons>
      )}

      <div style={{ marginBottom: "1em" }}>
      Legend: 
      <Badge variant="danger">Starter</Badge> 
      <Badge variant="warning">
        <a href={`/skills/plans?plan=${shipName}%20BASIC%20PATH`} style={{ color: 'inherit', textDecoration: 'none' }}>
          Basic
        </a>
      </Badge>
      <Badge variant="secondary">
        <a href={`/skills/plans?plan=${shipName}%20ELITE%20PATH`} style={{ color: 'inherit', textDecoration: 'none' }}>
          Elite
        </a>
      </Badge> 
      <Badge variant="success">Elite GOLD</Badge>

      <InfoIcon tooltip="Click 'Basic' or 'Elite' to view the skill plan for this ship.">
        ?
      </InfoIcon>
    </div>
      <SkillHeader>
        {ship === "Nestor" || ship === "Guardian" ? (
          <InfoNote>Basic tier skills are required for logistics.</InfoNote>
        ) : null}
      </SkillHeader>
      {skills ? (
        <SkillList mySkills={skills} shipName={ship} filterMin={filterMin} />
      ) : (
        <p>Loading skill information</p>
      )}
    </>
  );
}
