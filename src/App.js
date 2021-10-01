import './App.css';
// import React from 'react';
import React, { useState, useEffect } from 'react'; //useState() is called a Hook, because it hooks into the internals of the React system

const schedule = {
  "title": "CS Courses for 2018-2019",
  "courses": {
    "F101" : {

      "id" : "F101",
      "meets" : "MWF 11:00-11:50",
      "title" : "Computer Science: Concepts, Philosophy, and Connections"
    },
    "F110" : {
      "id" : "F110",
      "meets" : "MWF 10:00-10:50",
      "title" : "Intro Programming for non-majors"
    },
    "S313" : {
      "id" : "S313",
      "meets" : "TuTh 15:30-16:50",
      "title" : "Tangible Interaction Design and Learning"
    },
    "S314" : {
      "id" : "S314",
      "meets" : "TuTh 9:30-10:50",
      "title" : "Tech & Human Interaction"
    }
  }
};

const Banner = props => (
  <h1>{props.title}</h1>
)

const CourseList = ({ courses }) => {
  //we need the term state in both the celector and the list of courses
  //So this is the state(line 39)
  const [term, setTerm] = useState('Fall');

  //filter the courses by term 
  const termCourses = Object.values(courses).filter(course => term === getCourseTerm(course));
  
  return (
    <>
      <TermSelector term={term} setTerm={setTerm}/>
      <div className="course-list">
      { termCourses.map(course => <Course key={course.id} course={ course } />) }
      </div>
    </>
  );
};
//JSX syntax only allows one component to be returned
//The empty element syntax <> is a way to return several components as one
// without creating an unnecessary HTML element, such as a div

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const TermButton = ({term, setTerm, checked}) => (
  <>
    <input type="radio" id={term} className="btn-check" checked={checked} autoComplete="off"
      onChange={() => setTerm(term)} />
    <label class="btn btn-success m-1 p-2" htmlFor={term}>
    { term }
    </label>
  </>
);

//The term selector is a row of buttons
const TermSelector = ({term, setTerm}) => (
  //In bootstrap, CSS class "btn-group" can be used to make a row of butons
  <div className="btn-group">
  { 
    Object.values(terms).map(value => (
      <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
    ))
  }
  </div>
);

const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
);

const Course = ({ course }) => (
  <div className="card m-1 p-2">
    <div className="card-body">
      <div className="card-title">{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
      <div className="card-text">{ course.title }</div>
    </div>
  </div>
);


const App = () => {
  const [schedule, setSchedule] = useState();
  const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(json);
    }
    fetchSchedule();
  }, []);
// React re-renders very frequentlyly, but we don't want to do a fatch everytime the component is updated
// That could get our app kicked off a network service for voilating service limits
// So pass an array of those variables as the second argument.
//      -if no argument, React runs the function on all updates
//      -if empty list is given, React runs the function only when the component is first added



  if (!schedule) return <h1>Loading schedule...</h1>;

  return (
    <div className="container">
      <Banner title={ schedule.title } />
      <CourseList courses={ schedule.courses } />
    </div>
  );
};
export default App;
