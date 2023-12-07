import { useState } from "react";

const url = "http://localhost:0173/api/notes/";

export type EntryArgs = {
  title: string;
  content: string;
  author: string;
};

type FetchDataParams = {
  id?: number;
  method: string;
  entryBody?: EntryArgs;
};

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let bodyToSent: EntryArgs = {
    title: "",
    content: "",
    author: "",
  };

  const postEntry = async (entryBody: EntryArgs) => {
    const method = "POST";
    bodyToSent = {
      title: entryBody.title,
      content: entryBody.content,
      author: entryBody.author,
    };
    return callAPI({ method, entryBody: bodyToSent });
  };

  const updateEntry = async (id: number, entryBody: EntryArgs) => {
    const method = "PUT";
    bodyToSent = {
      title: entryBody.title,
      content: entryBody.content,
      author: entryBody.author,
    };
    return callAPI({ id, method, entryBody: bodyToSent });
  };

  const deleteEntry = async (id: number) => {
    const method = "DELETE";
    return callAPI({ id, method });
  };

  const callAPI = async ({ id, method, entryBody }: FetchDataParams) => {
    setLoading(true);

    const options = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body:
        entryBody &&
        JSON.stringify({
          title: entryBody.title,
          content: entryBody.content,
          author: entryBody.author,
        }),
    };

    const fetchUrl = id ? `${url}${id}` : url;

    try {
      const response = await fetch(fetchUrl, options);
      const data = await response.json();

      setLoading(false);

      return data;
    } catch (error) {
      setLoading(false);
      setError(`Hubo un error en la solicitud. ${error}`);
    }
  };

  return { loading, error, postEntry, updateEntry, deleteEntry };
};

export default useApi;
