import { useState } from "react";

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};
const Header = (props) => {
  return <h1>{props.course}</h1>;
};
const Content = ({ parts }) => {
  const content = parts.map((part) => <Part key={part.id} part={part} />);
  return <>{content}</>;
};
const Total = ({ parts }) => {
  const sum = (total, part) => total + part.exercises;
  return <b>total of {parts.reduce(sum, 0)} exercises</b>;
};
const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

const Courses = ({ courses }) => {
  const courseList = courses.map((course) => (
    <Course key={course.id} course={course} />
  ));
  return <>{courseList}</>;
};

export default Courses;
