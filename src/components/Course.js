import React, { useRef } from 'react';
import useDoubleClick from 'use-double-click';
import { hasConflict, getCourseTerm, getCourseNumber, getCourseMeetingData } from '../utilities/times.js';
import { setData, useUserState } from '../utilities/firebase.js';

const toggle = (x, lst) => (
    lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const reschedule = async (course, meets) => {
  if (meets && window.confirm(`Change ${course.id} to ${meets}?`)) {
    try {
      await setData(`/courses/${course.id}/meets`, meets);
    } catch (error) {
      alert(error);
    }
  }
};

const Course = ({ course, selected, setSelected }) => {
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected);
    const [user] = useUserState();
    const style = {
      backgroundColor: isDisabled? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
    };
    const courseRef = useRef();
    useDoubleClick({
      onSingleClick: () => {
        if (isDisabled === false) setSelected(toggle(course, selected));
      },
      onDoubleClick: () => {
        if (user) reschedule(course, getCourseMeetingData(course));
      },
      ref: courseRef,
      latency: 200
    });
    return (
      <div className="card m-1 p-2" 
        style={style}
        // onClick={isDisabled ? null : () =>  setSelected(toggle(course, selected))}
        ref={courseRef}>
        <div className="card-body">
          <div className="card-title">{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
          <div className="card-text">{ course.title }</div>
        </div>
      </div>
    );
};
  
export default Course;