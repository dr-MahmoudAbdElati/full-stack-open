import { useEffect, useState } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [countriesToDisplay, setCountriesToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchCountries = async () => {
        const response = await axios.get(
          "https://studies.cs.helsinki.fi/restcountries/api/all",
        );
        setCountries(response.data);
        setIsLoading(false);
      };
      fetchCountries();
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, []);

  useEffect(() => {
    if (searchFilter === "") return;

    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchFilter.toLowerCase()),
    );
    setCountriesToDisplay(filteredCountries);
  }, [searchFilter]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div>
        find countries{" "}
        <input
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>
      {searchFilter && (
        <CountryList
          countriesToDisplay={countriesToDisplay}
          setCountriesToDisplay={setCountriesToDisplay}
        />
      )}
    </>
  );
}

export default App;
