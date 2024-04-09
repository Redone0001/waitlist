import React, { useState, useEffect } from 'react';
import { apiCall} from "../../api";
import { Button, InputGroup, Textarea } from "../../Components/Form";
import { PageTitle } from "../../Components/Page";
import { ToastContext } from "../../contexts";
import { usePageTitle } from "../../Util/title";

export function NoteAll() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiCall('/api/notes/all');
				console.log(data)
                setNotes(data.notes);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notes:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <PageTitle>All Notes</PageTitle>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {notes.map((note, index) => (
                            <li key={index}>
                                <p><strong>Author:</strong> {note.author.name}</p>
                                <p><strong>Logged At:</strong> {note.logged_at}</p>
                                <p><strong>Note:</strong> {note.note}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

