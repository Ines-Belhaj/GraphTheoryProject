import React, { useState } from 'react';

function stableMatching(studentPrefs, tutorPrefs) {
  const studentCount = studentPrefs.length;
  const tutorCount = tutorPrefs.length;
  const studentEngaged = new Array(studentCount).fill(false);
  const tutorEngaged = new Array(tutorCount).fill(false);
  const tutorAssignments = new Array(tutorCount).fill(null);

  while (studentEngaged.includes(false)) {
    const freeStudentIndex = studentEngaged.indexOf(false);
    const studentPrefsList = studentPrefs[freeStudentIndex];
    let tutorIndex = 0;
    let assigned = false;

    while (!assigned) {
      const preferredTutorIndex = studentPrefsList[tutorIndex];
      const currentAssignment = tutorAssignments[preferredTutorIndex];

      if (!currentAssignment) {
        tutorAssignments[preferredTutorIndex] = freeStudentIndex;
        studentEngaged[freeStudentIndex] = true;
        tutorEngaged[preferredTutorIndex] = true;
        assigned = true;
      } else if (tutorPrefs[preferredTutorIndex].indexOf(freeStudentIndex) < tutorPrefs[preferredTutorIndex].indexOf(currentAssignment)) {
        studentEngaged[currentAssignment] = false;
        tutorAssignments[preferredTutorIndex] = freeStudentIndex;
        studentEngaged[freeStudentIndex] = true;
        assigned = true;
      } else {
        tutorIndex++;
      }
    }
  }

  // Handle unmatched students
  for (let i = 0; i < studentCount; i++) {
    if (!studentEngaged[i]) {
      // Find an available tutor who is available at the same time
      for (let j = 0; j < tutorCount; j++) {
        if (!tutorEngaged[j] && tutorPrefs[j].includes(i)) {
          tutorAssignments[j] = i;
          studentEngaged[i] = true;
          tutorEngaged[j] = true;
          break;
        }
      }
    }
  }

  // Handle unmatched tutors
  for (let i = 0; i < tutorCount; i++) {
    if (!tutorEngaged[i]) {
      // Find an available student who is looking for a tutor
      for (let j = 0; j < studentCount; j++) {
        if (!studentEngaged[j] && studentPrefs[j].includes(i)) {
          tutorAssignments[i] = j;
          studentEngaged[j] = true;
          tutorEngaged[i] = true;
          break;
        }
      }
    }
  }

  return tutorAssignments;
};
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
function setPrefrences (t,s) {
  const finalPrefrences = [];
  const tutorsList=getAvailabilityArray(t)
  const studentsList=getAvailabilityArray(s)
  console.log(tutorsList)
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
    finalPrefrences.push(preferences);
  }
}


const Availabilities = () => {
  const [name, setName] = useState('');
  const [day, setDay] = useState('0');
  const [timeSlots, setTimeSlots] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedOption, setSelectedOption] = useState('student');
  const [pairs,setPairs] = useState([]);
  const [tutorPref, setTutorPref] = useState([]);
  const [studentPref, setStudentPref] = useState([]);


  const Days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
    if (selectedOption === "student") {
      const newStudent = {
        name,
        availabilities: [...students.filter((s) => s.name === name)[0]?.availabilities || [], newAvailability],
      };
      const updatedStudents = students.filter((s) => s.name !== name);
      setStudents([...updatedStudents, newStudent]);
    } else {
      const newTutor = {
        name,
        availabilities: [...tutors.filter((s) => s.name === name)[0]?.availabilities || [], newAvailability],
      };
      const updatedTutors = tutors.filter((s) => s.name !== name);
      setTutors([...updatedTutors, newTutor]);
    }

    // TODO: add logic to store the availability data

    console.log(`${name} is available on ${day} at ${timeSlots.join(', ')}`);
    setDay('0');
    setTimeSlots([]);
  };

  const handleClear = () => {
    setName('');
    setDay('0');
    setTimeSlots([]);
    setStudents([]);
    setTutors([]);
    setSelectedOption('student');
  };

  const handleMatching = () => {

    setTutorPref(setPrefrences(tutors,students));
    setStudentPref(setPrefrences(students,tutors));
    setPairs(stableMatching(studentPref,tutorPref))
    console.log(pairs);
    setStudents([]);
    setTutors([]);
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
        <button type="button" onClick={handleClear}>Clear</button>
        <button type="button" onClick={handleMatching}>Match Tutors and Students</button>

      </form>
      <div style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <div>
          <h2>Students:</h2>
          {students.map((student, index) => (
            <div key={index}>
              <h3>{student.name} is available:</h3>
              <ul>
                {student.availabilities.map((availability, index) => (
                  <li key={index}>
                    {`${Days[availability.day]} at the following slots: ${availability.timeSlots.join(', ')}`}
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
              <h3>{tutor.name} is available:</h3>
              <ul>
                {tutor.availabilities.map((availability, index) => (
                  <li key={index}>
                    {`${Days[availability.day]} at the following slots: ${availability.timeSlots.join(', ')}`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Matches:</h2>
        {Object.entries(pairs).map(([tutorName, student]) => (
          <p key={tutorName}>{tutorName} is paired with {student.name}</p>
        ))}
      </div>
    </div>
  );

};






export default Availabilities;