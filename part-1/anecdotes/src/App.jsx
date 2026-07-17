import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const votesArray = [0, 0, 0, 0, 0, 0, 0, 0]; // or Array(n).fill(x) -> (n) is length of arr u need and (x) is the value u want for all of the arr elements; in that example n = 8 and x = 0
  // const votesObject = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(votesArray);
  const [starAnecdote, setStarAnecdote] = useState(anecdotes[0]);
  const [starVote, setStarVote] = useState(0);

  const handleNextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVote = () => {
    // don't say votes[selected] += 1; because that will mutate the state directly and React will not re-render the component, so we need to create a copy of the state and then update the copy and then set the state to the copy
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
    setStarAnecdote(anecdotes[copy.indexOf(Math.max(...copy))]);
    setStarVote(Math.max(...copy));
  };

  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNextAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{starAnecdote}</p>
      <p>has {starVote} votes</p>
    </>
  );
};

export default App;
