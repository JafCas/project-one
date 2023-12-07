import React, { useEffect, useState } from "react";
import "./App.css";
import EntryCard from "./components/entry";
import EntriesForm from "./components/form";

export type Entry = {
  id: number;
  title: string;
  content: string;
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
  };

  const handleAddEntry = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:0173/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const newEntry = await response.json();

      setEntries([newEntry, ...entries]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedEntry) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:0173/api/notes/${selectedEntry.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const updatedEntry = await response.json();
      const updatedEntryList = entries.map((entry) => {
        return entry.id === selectedEntry.id ? updatedEntry : entry;
      });

      setEntries(updatedEntryList);
      setTitle("");
      setContent("");
      setSelectedEntry(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedEntry(null);
  };

  const deleteEntry = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    try {
      await fetch(`http://localhost:0173/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log(error);
    }

    const updatedEntries = entries.filter((entries) => entries.id !== noteId);

    setEntries(updatedEntries);
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("http://localhost:0173/api/notes");

        const entries: Entry[] = await response.json();

        setEntries(entries);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEntries();
  }, []);

  return (
    <div className="app-container">
      <input type="search" className="search-bar"/>
      <EntriesForm
        onSubmit={(event) =>
          selectedEntry ? handleUpdate(event) : handleAddEntry(event)
        }
        onCancel={handleCancel}
        title={title}
        content={content}
        isEditMode={!!selectedEntry}
        setContent={setContent}
        setTitle={setTitle}
      />

      <div className="notes-grid">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onClick={() => handleEntryClick(entry)}
            onDelete={(event) => deleteEntry(event, entry.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
