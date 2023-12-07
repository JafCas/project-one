import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import EntryCard from "./components/entry/Entry";
import EntriesForm from "./components/form/Form";
import useApi, { EntryArgs } from "./services/apiCall";

export type Entry = {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: Date;
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [searchText, setSearchText] = useState("");

  const { loading, error, postEntry, updateEntry, deleteEntry } = useApi();

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
    setSelectedEntry(null);
  };

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setAuthor(entry.author);
  };

  const handleAddEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    const sendEntry: EntryArgs = {
      title,
      content,
      author,
    };

    try {
      const newEntry = await postEntry(sendEntry);

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

    const selectedEntryId = selectedEntry.id;
    const sendEntry: EntryArgs = {
      title,
      content,
      author,
    };

    try {
      const selectedEntry = await updateEntry(selectedEntryId, sendEntry);
      const updatedEntryList = entries.map((entry) => {
        return entry.id === selectedEntry.id ? selectedEntry : entry;
      });

      setEntries(updatedEntryList);
      cleanUpInputs();
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    cleanUpInputs();
    
  };

  const handleDelete = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    try {
      await deleteEntry(noteId)
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
        const entries: Entry[] = await response.json()

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
            onDelete={(event) => handleDelete(event, entry.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
