import React, { useState } from 'react';

const Availabilities = () => {
  const [name, setName] = useState('');
  const [day, setDay] = useState('1');
  const [timeSlots, setTimeSlots] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const Days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
  const [selectedOption, setSelectedOption] = useState('student');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const handleTimeSlotChange = (event) => {
    const value = event.target.value;
    if (timeSlots.includes(value)) {
      setTimeSlots(timeSlots.filter((slot) => slot !== value));
    } else {
      setTimeSlots([...timeSlots, value]);
    }
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    const newAvailability = { day, timeSlots };
    if(selectedOption==="student"){
    const newStudent = {
      name,
      availabilities: [...students.filter((s) => s.name === name)[0]?.availabilities || [], newAvailability],
    };
    const updatedStudents = students.filter((s) => s.name !== name);
    setStudents([...updatedStudents, newStudent]);
  }
  else{
    const newTutor = {
      name,
      availabilities: [...tutors.filter((s) => s.name === name)[0]?.availabilities || [], newAvailability],
    };
    const updatedTutors = tutors.filter((s) => s.name !== name);
    setTutors([...updatedTutors, newTutor]);
  }

    // TODO: add logic to store the availability data

    console.log(`${name} is available on ${Days[day]} at ${timeSlots.join(', ')}`);
    setDay('1');
    setTimeSlots([]);
    console.log(getAvailabilityArray(students))

  };
  const showPereferenceList=()=>{
    const tutorsList=getAvailabilityArray(tutors)
    const studentsList=getAvailabilityArray(tutors)
    for (const tutor of tutorsList) {
      const preferences = [];
      
      // Loop through each student
      for (const student of studentsList) {
        let commonSlots = 0;
        
        // Calculate the number of common available time slots
        for (const slot of student.availability) {
          if (tutor.availability.includes(slot)) {
            commonSlots++;
          }
        }
        
        // Store the number of common time slots in a dictionary
        preferences.push({ student: student.name, slots: commonSlots });
      }
      
      // Sort the preference list in decreasing order of common time slots
      preferences.sort((a, b) => b.slots - a.slots);
      
      // Print out the preference list for the tutor
      console.log(`${tutor.name}'s preference list:`);
      console.log(preferences); 
    }
    
  }
  function getAvailabilityArray(students) {
    let availabilityArray = [];
    
    students.forEach((student) => {
      let studentAvailability = [];
      
      student.availabilities.forEach((availability) => {
        availability.timeSlots.forEach((timeSlot) => {
          let availabilityCode = availability.day.toString() + timeSlot;
          studentAvailability.push(parseInt(availabilityCode));
        });
      });
      
      availabilityArray.push({name: student.name, availability: studentAvailability});
    });
    
    return availabilityArray;
  }
 
    

  return (
    <div>
      <h1>Enter  Information</h1>
      <div>
      <label>
        <input
          type="radio"
          name="options"
          value="student"
          checked={selectedOption === 'student'}
          onChange={handleOptionChange}
        />
        student
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="options"
          value="tutor"
          checked={selectedOption === 'tutor'}
          onChange={handleOptionChange}
        />
tutor      </label>
      <br />
    </div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <br />
        <label>
          Day:


 <select value={day} onChange={handleDayChange}>
    <option value="0">Monday</option>
    <option value="1">Tuesday</option>
    <option value="2">Wednesday</option>
    <option value="3">Thursday</option>
    <option value="4">Friday</option>
    <option value="5">Saturday</option>
    <option value="6">Sunday</option>
  </select>

        </label>
        <br />
        <label>
          Time Slots:


         

          <br />
          <input type="checkbox" value="0" checked={timeSlots.includes("0")} onChange={handleTimeSlotChange} />
          <label>10:00 AM-11:00 AM</label>
          <br />
          <input type="checkbox" value="1" checked={timeSlots.includes("1")} onChange={handleTimeSlotChange} />
          <label>11:00 AM-12:00 PM</label>
          <br />
          <input type="checkbox" value="2" checked={timeSlots.includes("2")} onChange={handleTimeSlotChange} />
          <label>12:00 PM-1:00 PM</label>
          <br />
          <input type="checkbox" value="3" checked={timeSlots.includes("3")} onChange={handleTimeSlotChange} />
          <label>1:00 PM-2:00 PM</label>
          <br />
          <input type="checkbox" value="4" checked={timeSlots.includes("4")} onChange={handleTimeSlotChange} />
          <label>2:00 PM-3:00 PM</label>
        </label>
        <br />
        <button type="submit">Add availability</button>

      </form>
      <button onClick={showPereferenceList}>
      show preference list</button>      
      <div style={{flexDirection:"row", justifyContent:"space-around"}}>
      <div>
      <h2>Students:</h2>
{students.map((student, index) => (
  <div key={index}>
    <h3>{student.name} is available:</h3>
    <ul>
      {student.availabilities.map((availability, index) => (
        <li key={index}>
          {` ${Days[availability.day]} at the following slots: ${availability.timeSlots.join(', ')}`}
        </li>
      ))}
    </ul>
  </div>
))}
      </div>
      <div>
      <h2>Tutors:</h2>
{tutors.map((tutor, index) => (
  <div key={index}>
    <h3>{tutor.name}is available:</h3>
    <ul>
      {tutor.availabilities.map((availability, index) => (
        <li key={index}>
          {` ${Days[availability.day-1]} at the following slots: ${availability.timeSlots.join(', ')}`}
        </li>
      ))}
    </ul>
  </div>
))}
      </div>
      </div>
    </div>
  );
  
};






export default Availabilities;
