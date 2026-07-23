import axios from "axios";

const baseUrl = "/api/persons/";

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
    .put(`${baseUrl}${targetPerson.id}`, changePerson)
    .then((res) => res.data);
};

const removePerson = (id) => {
  return axios.delete(`${baseUrl}${id}`).then((res) => {
    return res.status;
  });
};

export default { getAll, addNew, removePerson, updatePerson };
