import React from "react";
import "./Entry.css";

import { Entry } from "../../App";

type EntryProps = {
  entry: Entry;
  isSelected: boolean;
  onClick: (entry: Entry) => void;
  onDelete: (event: React.MouseEvent, noteId: number) => void;
};

const EntryCard = ({ entry, onClick, onDelete, isSelected }: EntryProps) => {
  const publishDate = new Date(entry.publishDate).toDateString();
  const previewContent = entry.content.substring(0, 69);
  return (
    <div
      className={`note-item ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(entry)}
    >
      <div
        className="notes-header"
        onClick={(event) => onDelete(event, entry.id)}
      >
        <button>x</button>
      </div>
      <h2>{entry.title}</h2>
      <p>{entry.author}</p>
      <p>{publishDate}</p>
      <p>{previewContent}...</p>
    </div>
  );
};

export default EntryCard;
