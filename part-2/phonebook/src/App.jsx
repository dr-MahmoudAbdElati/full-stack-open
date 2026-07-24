import { useEffect, useState } from "react";
import SearchFilter from "./components/SearchFilter";
import AddNew from "./components/AddNew";
import NumberList from "./components/NumberList";
import axios from "axios";
import PhoneBookService from "./components/PhoneBookService";
import Notification from "./components/Notification";

function App() {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [errMessage, setErrMessage] = useState(null);

  useEffect(() => {
    if (!search) {
      PhoneBookService.getAll().then((data) => setPersons(data));
      return;
    }
    const filtered = persons.filter((person) =>
      person.name.toLowerCase().startsWith(search.toLowerCase()),
    );
    setPersons(filtered);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPerson = {
      name: newName.trim(),
      number: newNumber.trim(),
    };

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase(),
    );

    // update existing person
    if (
      existingPerson &&
      window.confirm(
        "Are you sure you want to update; That person is already in the phonebook",
      )
    ) {
      const changePerson = { ...existingPerson, number: newPerson.number };

      PhoneBookService.updatePerson(existingPerson, changePerson)
        .then((updatedPerson) => {
          setPersons((prevPersons) =>
            prevPersons.map((person) =>
              person.id === updatedPerson.id ? updatedPerson : person,
            ),
          );
          setErrMessage(`Updated ${updatedPerson.name} successfully`);
        })
        .catch((err) => {
          console.error(err);
          setErrMessage(
            `Information of ${existingPerson.name} could not be updated`,
          );
        });
      setNewName("");
      setNewNumber("");
      return;
    }

    // add new person
    PhoneBookService.addNew(newPerson)
      .then((addedPerson) => {
        setPersons((prevPersons) => prevPersons.concat(addedPerson));
        setErrMessage(`Added ${addedPerson.name} successfully`);
      })
      .catch((error) => {
        setErrMessage(error.response.data.error);
      });

    setNewName("");
    setNewNumber("");
  };

  return (
    <>
      <h2>Phonebook</h2>
      <Notification errMessage={errMessage} setErrMessage={setErrMessage} />
      <SearchFilter
        search={search}
        handleSearchChange={(e) => setSearch(e.target.value)}
      />
      <h2>add a new</h2>
      <AddNew
        handleAddNew={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <NumberList persons={persons} setPersons={setPersons} />
    </>
  );
}

export default App;
