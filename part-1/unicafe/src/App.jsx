import { useEffect, useState } from "react";

// Button component
const Button = ({ good, neutral, bad, setGood, setNeutral, setBad }) => {
  const handleClick = (e) => {
    const attribute = e.target.getAttribute("text");

    if (attribute === "good") {
      setGood(good + 1);
    } else if (attribute === "neutral") {
      setNeutral(neutral + 1);
    } else if (attribute === "bad") {
      setBad(bad + 1);
    }
  };
  return (
    <>
      <button onClick={handleClick} text="good">
        good
      </button>
      <button onClick={handleClick} text="neutral">
        neutral
      </button>
      <button onClick={handleClick} text="bad">
        bad
      </button>
    </>
  );
};

// StatisticLine component
const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} </td>
    </tr>
  );
};

// Statistics component
const Statistics = ({ good, neutral, bad }) => {
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  useEffect(() => {
    const total = good + neutral + bad;
    setAll(total);

    if (total > 0) {
      setAverage((good - bad) / total);
      setPositive((good / total) * 100);
    }
  }, [good, neutral, bad]);

  return all > 0 ? (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive + " " + "%"} />
        </tbody>
      </table>
    </>
  ) : (
    <>
      <h2>statistics</h2>
      <p>no feedback given</p>
    </>
  );
};

// App component
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <h1>give feedback</h1>
      <Button
        good={good}
        neutral={neutral}
        bad={bad}
        setGood={setGood}
        setNeutral={setNeutral}
        setBad={setBad}
      />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
