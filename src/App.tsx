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

  const handleSubmit = (event: React.FormEvent) => {
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
  return (
    <div className="app-container">
      <form className="note-form" onSubmit={(event) => handleSubmit(event)}>
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
        <button type="submit">Add Entry</button>
      </form>
      <div className="notes-grid">
        {entries.map((entry) => (
          <div className="note-item" key={entry.id}>
            <div className="notes-header">
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
