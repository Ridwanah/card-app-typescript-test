import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";
interface NewEntryProps {
  darkMode: boolean;
}
export default function NewEntry({ darkMode }: NewEntryProps) {
  const emptyEntry: Entry = { title: "", description: "", created_at: new Date(), scheduled_date: new Date() };
  const { saveEntry } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [event.target.name]: event.target.value,
    });
  };
  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    saveEntry(newEntry);
    setNewEntry(emptyEntry);
  };
  return (
    <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 p-8 rounded-md">
      <input
        className={`p-3 rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        type="text"
        placeholder="Title"
        name="title"
        value={newEntry.title}
        onChange={handleInputChange}
      />
      <textarea
        className={`p-3 rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        placeholder="Description"
        name="description"
        value={newEntry.description}
        onChange={handleInputChange}
      />
      <input
        className={`p-3 rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        type="date"
        name="created_at"
        value={new Date(newEntry.created_at).toISOString().split("T")[0]}
        onChange={handleInputChange}
      />
      <input
        className={`p-3 rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
        type="date"
        placeholder="Scheduled Date"
        name="scheduled_date"
        value={new Date(newEntry.scheduled_date).toISOString().split("T")[0]}
        onChange={handleInputChange}
      />
      <button
        onClick={(e) => {
          handleSend(e);
        }}
        className="bg-blue-400 hover:bg-blue-600 font-semibold text-white p-3 rounded-md"
      >
        Create
      </button>
    </section>
  );
}
