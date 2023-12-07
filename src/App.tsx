import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import EntryCard from "./components/entry";
import EntriesForm from "./components/form";

export type Entry = {
  id: number;
  title: string;
  content: string;
  author: string;
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [searchText, setSearchText] = useState("");

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const formattedSearchText = searchText.toLocaleLowerCase();
      return (
        entry.title.toLowerCase().includes(formattedSearchText) ||
        entry.content.toLowerCase().includes(formattedSearchText) ||
        entry.author.toLowerCase().includes(formattedSearchText)
      );
    });
  }, [entries, searchText]);

  const cleanUpInputs = () => {
    setTitle("");
    setContent("");
    setAuthor("");
  };

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setAuthor(entry.author);
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
          author,
        }),
      });

      const newEntry = await response.json();

      setEntries([newEntry, ...entries]);
      cleanUpInputs();
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
            author,
          }),
        }
      );

      const updatedEntry = await response.json();
      const updatedEntryList = entries.map((entry) => {
        return entry.id === selectedEntry.id ? updatedEntry : entry;
      });

      setEntries(updatedEntryList);
      cleanUpInputs();
      setSelectedEntry(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    cleanUpInputs();
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
      <input
        value={searchText}
        type="search"
        className="search-bar"
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
      />
      <EntriesForm
        onSubmit={(event) =>
          selectedEntry ? handleUpdate(event) : handleAddEntry(event)
        }
        onCancel={handleCancel}
        author={author}
        title={title}
        content={content}
        isEditMode={!!selectedEntry}
        setAuthor={setAuthor}
        setContent={setContent}
        setTitle={setTitle}
      />

      <div className="notes-grid">
        {filteredEntries.map((entry) => (
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
