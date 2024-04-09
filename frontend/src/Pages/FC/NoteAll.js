import React, { useState, useEffect } from 'react';
import { useApi} from "../../api";
import { Button, InputGroup, Textarea } from "../../Components/Form";
import { PageTitle } from "../../Components/Page";
import { ToastContext } from "../../contexts";
import { usePageTitle } from "../../Util/title";

export function NoteAll() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [data, refreshFunction] = useApi('/api/notes/all');

    useEffect(() => {
        if (data) {
            setNotes(data.notes);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        refreshFunction();
    }, [refreshFunction]);

    // Function to format date to display only the day in (yyyy-mm-dd) format
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
        return date.toISOString().split('T')[0]; // Extract date part and format it
    };

    return (
        <>
            <PageTitle>All Notes</PageTitle>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Author</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Date</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notes.slice().reverse().map((note, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td colSpan="3" style={{ borderTop: '1px solid #ccc' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{note.author.name}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{formatDate(note.logged_at)}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{note.note}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
