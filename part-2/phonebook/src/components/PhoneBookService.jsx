import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons/";

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

const addNew = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((res) => {
    return res.data;
  });
};

const updatePerson = (targetPerson, changePerson) => {
  return axios
    .put(`http://localhost:3001/persons/${targetPerson.id}`, changePerson)
    .then((res) => res.data);
};

const removePerson = (id) => {
  return axios.delete(`${baseUrl}${id}`).then((res) => {
    // console.log(res.data, res.status, "successfully removed");
    return res.data;
  });
};

export default { getAll, addNew, removePerson, updatePerson };
