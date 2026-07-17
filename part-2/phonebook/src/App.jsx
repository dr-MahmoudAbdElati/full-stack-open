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
      name: newName,
      number: newNumber,
    };

    if (
      persons.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase(),
      ) &&
      window.confirm(
        "Are you sure you want to update; That person is already in the phonebook",
      )
    ) {
      const targetPerson = persons.find((p) => p.name === newPerson.name);
      const changePerson = { ...targetPerson, number: newPerson.number };

      PhoneBookService.updatePerson(targetPerson, changePerson)
        .then((updatedPerson) => {
          // console.log(updatedPerson, "successfully updated");
          setPersons(
            persons.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)),
          );
          setErrMessage(`Updated ${updatedPerson.name} successfully`);
        })
        .catch((err) => {
          setErrMessage(
            `Information of ${targetPerson.name} has already been removed from server`,
          );
        });
      // alert(`${newName} is already added to phonebook`);
      setNewName("");
      setNewNumber("");
      return;
    }

    PhoneBookService.addNew(newPerson).then((addedPerson) => {
      setPersons(persons.concat(addedPerson));
      setErrMessage(`Added ${addedPerson.name} successfully`);
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
