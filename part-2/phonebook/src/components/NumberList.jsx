import axios from "axios";
import PhoneBookService from "./PhoneBookService";

const NumberList = ({ persons, setPersons }) => {
  const handleRemove = (person) => {
    return () => {
      const id = person.id;
      if (
        window.confirm("❌Are you sure your want to delete that person ❓❗")
      ) {
        PhoneBookService.removePerson(id)
          .then((status) => {
            if (status === 204)
              setPersons(persons.filter((p) => p.id !== person.id));
          })
          .catch((err) => console.log(err));
      }
      return;
    };
  };

  return (
    <ul>
      {persons.map((person, i) => (
        <li key={i}>
          {person.name}: {person.number}
          <button onClick={handleRemove(person)}>remove</button>
        </li>
      ))}
    </ul>
  );
};

export default NumberList;
