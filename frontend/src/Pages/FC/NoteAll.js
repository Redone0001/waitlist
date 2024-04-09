import React, { useState, useEffect } from 'react';
import { apiCall, errorToaster, useApi } from "../../api";
import { Button, InputGroup, Textarea } from "../../Components/Form";
import { PageTitle } from "../../Components/Page";
import { ToastContext } from "../../contexts";
import { usePageTitle } from "../../Util/title";

export function NoteAll() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noteToDisplay, setNoteToDisplay] = useState('');
    const toastContext = React.useContext(ToastContext);


    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await apiCall('/api/notes/all');
                const data = await response.json();
                setNotes(data.notes);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notes:', error);
                setLoading(false);
                // Display error toast using toastContext
            }
        };

        fetchNotes();
    }, []);

    const handleNoteSelection = (note) => {
        setNoteToDisplay(note);
    };

    return (
        <>
            <PageTitle>All Notes</PageTitle>
            <div>
                <h1>All Notes</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <Textarea
                            style={{ width: "100%" }}
                            value={noteToDisplay}
                            readOnly
                        />
                        {notes.map((note, index) => (
                            <button key={index} onClick={() => handleNoteSelection(note.note)}>
                                Note {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

