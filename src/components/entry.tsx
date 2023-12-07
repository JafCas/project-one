import React from "react";
import "../App.css";

import { Entry } from "../App";

type EntryProps = {
  entry: Entry;
  onClick: (entry: Entry) => void;
  onDelete: (event: React.MouseEvent, noteId: number) => void;
};

const EntryCard = ({ entry, onClick, onDelete }: EntryProps) => {
  return (
    <div className="note-item" onClick={() => onClick(entry)}>
      <div
        className="notes-header"
        onClick={(event) => onDelete(event, entry.id)}
      >
        <button>x</button>
      </div>
      <h2>{entry.title}</h2>
      <p>{entry.content}</p>
    </div>
  );
};

export default EntryCard;
