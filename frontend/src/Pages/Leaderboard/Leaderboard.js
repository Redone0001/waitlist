import React from "react";
import _ from "lodash";
import styled from "styled-components";
import { Row, Col } from "react-awesome-styled-grid";
import { useApi } from "../../api";
import { usePageTitle } from "../../Util/title";

// Define styled components for table and grid
const TableWrapper = styled(Col).attrs({ md: 6 })`
  overflow-x: auto;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  text-align: left;
`;

const TableHeader = styled.th`
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.background};
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

// Component to display leaderboard table
function LeaderboardTable({ title, data }) {
  return (
    <TableWrapper>
      <h3>{title}</h3>
      <Table>
        <thead>
          <tr>
            <TableHeader>#</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Hours</TableHeader>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <TableData>{index + 1}</TableData>
              <TableData>{item.name}</TableData>
              <TableData>{item.hours}</TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

// Main component to display leaderboard
export function Leaderboard() {
  usePageTitle("Leaderboard");
  const [leaderboardData] = useApi("/api/leaderboard");

  if (!leaderboardData) {
    return <em>Loading leaderboard data...</em>;
  }

  // Separate the data into 28 days and all-time
  const data28d = leaderboardData.last_28_days || [];
  const dataAllTime = leaderboardData.all_time || [];

  return (
    <Row>
      <LeaderboardTable title="Last 28 Days" data={data28d} />
      <LeaderboardTable title="All Time" data={dataAllTime} />
    </Row>
  );
}
