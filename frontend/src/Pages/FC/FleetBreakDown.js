import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function FleetAndAlts() {
  const [fleetMembers, setFleetMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const authContext = React.useContext(AuthContext);

  useEffect(() => {
    const fetchFleetMembers = async () => {
      try {
        const response = await axios.get(`/api/fleet/members?character_id=${authContext.current.id}`);
        setFleetMembers(response.data.members);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fleet members:', error);
        setLoading(false);
      }
    };

    fetchFleetMembers();
  }, []);

  const fetchAltsForFleetMember = async (member) => {
    try {
      const response = await axios.get(`/api/pilot/alts?character_id=${member.id}`);
      return { ...member, alts: response.data };
    } catch (error) {
      console.error('Error fetching alts for member:', member.name, error);
      return { ...member, alts: [] };
    }
  };

  useEffect(() => {
    if (fleetMembers.length > 0) {
      const fetchAltsForAllMembers = async () => {
        const promises = fleetMembers.map(member => fetchAltsForFleetMember(member));
        const results = await Promise.all(promises);
        setFleetMembers(results);
      };

      fetchAltsForAllMembers();
    }
  }, [fleetMembers]);

  return (
    <div>
      <h1>Fleet Members and Alts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {fleetMembers.map(member => (
            <li key={member.id}>
              <strong>{member.name}</strong> - {member.ship.name}
              <ul>
                {member.alts && member.alts.length > 0 ? (
                  member.alts.map(alt => (
                    <li key={alt.id}>{alt.name}</li>
                  ))
                ) : (
                  <li>No alts found</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}