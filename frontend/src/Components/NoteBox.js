import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export const Note = styled.div`
  margin: 0 0 0.5em;
  display: flex;
  background-color: ${(props) => props.theme.colors[props.variant].color};
  color: ${(props) => (props.theme.colors[props.variant] || {}).text || props.theme.colors.text};
  border-radius: 5px;
  width: ${(props) => props.width};
  filter: drop-shadow(0px 4px 5px ${(props) => props.theme.colors.shadow});
  padding: 0.1em 0.5em 0.2em;
  vertical-align: middle;
  word-break: break-word;
`;

export const BorderedBox = styled.div`
  background-color: ${(props) => props.bgColor || props.theme.colors.accent1};
  border-radius: 5px;
  border: solid 1px ${(props) => props.theme.colors.accent2};
  padding: 0.4em;
  margin: 0.4em 0;
  color: ${(props) => props.theme.colors.text}; /* Ensure text remains readable */
`;


export function InfoNote({ variant = "secondary", width = "fit-content", children }) {
  return (
    <Note variant={variant} width={width}>
      <div style={{ marginRight: "0.5em" }}>
        <FontAwesomeIcon icon={faExclamationCircle} />
      </div>
      {children}
    </Note>
  );
}
