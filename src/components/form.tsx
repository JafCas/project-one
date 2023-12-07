import React from "react";
import "../App.css";

type FormProps = {
  content: string;
  title: string;
  isEditMode: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

const EntriesForm = ({
  content,
  title,
  isEditMode,
  onSubmit,
  onCancel,
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
        placeholder="title"
        required
      />
      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
        }}
        placeholder="content"
        rows={10}
        required
      ></textarea>
      {isEditMode ? (
        <div className="edit-buttons">
          <button type="submit">Save</button>
          <button onClick={onCancel}>cancel</button>
        </div>
      ) : (
        <button type="submit">Add Entry</button>
      )}
    </form>
  );
};

export default EntriesForm;
