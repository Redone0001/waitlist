import React, { useState, useEffect } from 'react';
import { AuthContext } from "../../contexts";

export function FleetAndAlts() {
  const [fleetMembers, setFleetMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authContext = React.useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fleet members
        const fleetResponse = await fetch(`/api/fleet/members?character_id=${authContext.current.id}`);
        if (!fleetResponse.ok) {
          throw new Error('Failed to fetch fleet members.');
        }
        const fleetData = await fleetResponse.json();
        const members = fleetData.members;

        // Fetch alts for all fleet members
        const altPromises = members.map(member => fetch(`/api/pilot/alts?character_id=${member.id}`).then(response => response.json()));
		const altResults = Object.fromEntries(await Promise.all(altPromises.map(async (promise, index) => [members[index].name, await promise])));

		// Organize alt data into a dictionary by member ID
		const altsInFleet = {};
		Object.entries(altResults).forEach(([memberName, alts]) => {
		  altsInFleet[memberName] = alts.filter(alt => Object.prototype.hasOwnProperty.call(altResults, alt.name));
		});

        setFleetMembers(altsInFleet);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [authContext.current.id]);

  return (
    <div>
      <h1>Fleet Members and Their Alts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
  {Object.entries(fleetMembers).map(([memberName, alts]) => (
    <li key={memberName}>
      <h2><strong>{memberName}</strong></h2>
      <ul>
        {alts.map(alt => (
          <li key={alt.id}>
            {alt.name}
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>
      )}
    </div>
  );
}
