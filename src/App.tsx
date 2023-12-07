import React, { useState } from "react";
import "./App.css";

type Entry = {
  id: number;
  title: string;
  content: string;
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 1,
      title: "note title",
      content: "content 1",
    },
    {
      id: 2,
      title: "note title",
      content: "content 2",
    },
    {
      id: 3,
      title: "note title",
      content: "content 3",
    },
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
  };

  const handleAddEntry = (event: React.FormEvent) => {
    event.preventDefault();
    const newEntry: Entry = {
      id: entries.length + 1,
      title: title,
      content: content,
    };
    setEntries([newEntry, ...entries]);
    setTitle("");
    setContent("");
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedEntry) {
      return;
    }

    const updatedEntry: Entry = {
      id: selectedEntry.id,
      title: title,
      content: content,
    };

    const updatedEntryList = entries.map((entry) => {
      return entry.id === selectedEntry.id ? updatedEntry : entry;
    });

    setEntries(updatedEntryList);
    setTitle("");
    setContent("");
    setSelectedEntry(null);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedEntry(null);
  };

  const deleteEntry = (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    const updatedEntries = entries.filter((entries) => entries.id !== noteId);

    setEntries(updatedEntries);
  };

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(event) =>
          selectedEntry ? handleUpdate(event) : handleAddEntry(event)
        }
      >
        <input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          placeholder="title"
          required
        ></input>
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
          placeholder="content"
          rows={10}
          required
        ></textarea>
        {selectedEntry ? (
          <div className="edit-buttons">
            <button
              type="submit"
              onSubmit={(event) => {
                handleUpdate(event);
              }}
            >
              Save
            </button>
            <button onClick={handleCancel}>cancel</button>
          </div>
        ) : (
          <button type="submit">Add Entry</button>
        )}
      </form>
      <div className="notes-grid">
        {entries.map((entry) => (
          <div
            className="note-item"
            key={entry.id}
            onClick={() => handleEntryClick(entry)}
          >
            <div
              className="notes-header"
              onClick={(event) => {
                return deleteEntry(event, entry.id);
              }}
            >
              <button>x</button>
            </div>
            <h2>{entry.title}</h2>
            <p>{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
