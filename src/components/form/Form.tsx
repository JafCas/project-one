import React from "react";
import "./Form.css";

type FormProps = {
  author: string;
  content: string;
  title: string;
  isEditMode: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
  setAuthor: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

const EntriesForm = ({
  author,
  content,
  title,
  isEditMode,
  onSubmit,
  onCancel,
  setAuthor,
  setContent,
  setTitle,
}: FormProps) => {
  return (
    <form className="note-form" onSubmit={onSubmit}>
      <input
        className="note-input"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
        }}
        placeholder="Content"
        rows={10}
        required
      />
      <input
        className="note-input"
        value={author}
        onChange={(event) => {
          setAuthor(event.target.value);
        }}
        placeholder="Author"
        required
      />
      {isEditMode ? (
        <div className="edit-buttons">
          <button type="submit">Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      ) : (
        <button type="submit">Add Entry</button>
      )}
    </form>
  );
};

export default EntriesForm;
