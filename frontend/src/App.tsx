import React, { useState } from "react";
import NavBar from './components/NavBar'
import AllEntries from './routes/AllEntries'
import NewEntry from './routes/NewEntry'
import EditEntry from './routes/EditEntry'
import { EntryProvider } from './utilities/globalContext'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

export default function App() {
  // Create state variables for dark mode and settings dialog.
  const [darkMode, setDarkMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode); //switch dark mode state when button is toggled.
  };
  const handleDialogOpen = () => {
    setOpenDialog(true); //makes settings dialog appear.
  }
  const handleDialogClose = () => {
    setOpenDialog(false); //makes settings dialog disappear.
  }
  return ( //makes sure that main app wrapper changes according to dark mode theme.
    <section className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
  <Router>
    <EntryProvider>
    <NavBar onSettingsClick={handleDialogOpen} /> 
    {openDialog && (
      <div className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 rounded-lg shadow-lg w-80 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <div className="flex items-center mb-4">
                  <label htmlFor="darkMode" className="mr-2">Dark Mode</label>
                  <input
                    id="darkMode"
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    className="form-checkbox"
                  />
                  </div>
                  <button
                  onClick={handleDialogClose}
                  className="mt-4 bg-blue-400 text-white p-2 rounded hover:bg-blue-500 transition">
                  Close
                </button>
              </div>
      </div>
    )}
      <Routes>
        <Route path="/" element={<AllEntries darkMode={ darkMode }/>}>
        </Route>
        <Route path="create" element={<NewEntry darkMode={ darkMode }/>}>
        </Route>
        <Route path="edit/:id" element={<EditEntry darkMode={ darkMode }/>}>
        </Route>
      </Routes>
    </EntryProvider>
    </Router>
    </section>
  );
}
