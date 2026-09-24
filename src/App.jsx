import { useEffect, useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

function Header(){
  return <h1>!-Family-Workout-!</h1>
}

function WorkoutForm({form, setForm, setWorkouts, workouts, error, setError}) {
  function handleSubmit(event){
    event.preventDefault()
    if(form.name.trim() === ""){
      setError("Workout Name Required Pal")
      return
    }

    if (form.duration < 1) {
      setError("Workout Duration Must Be Atleast 1 Minute")
      return
    }

    setError("")

    setWorkouts([...workouts,
      {
        id: workouts.length + 1,
        name: form.name,
        duration: form.duration,
        completed: false
      }
    ])

    setForm({
      name: "",
      duration: ""
    })
  }
  return(
    <div className="workout-form-container">
      <form onSubmit={handleSubmit}>
        <label> Add Workout </label>
        <input 
          type="text" 
          placeholder="      Add Workout Here..."
          value={form.name}
          onChange={(event) => {
            setForm({ ...form, name: event.target.value})
            setError("")
          }}
        />
        <br />
        <label> Add Duration </label>
        <input 
          type="number"
          placeholder="      Add Duration Here... "
          value={form.duration}
          onChange={(event) => {
            setForm({ ...form, duration: Number(event.target.value)})
            setError("")
          }}
        />
        <br />
        {error && <p>{error}</p>}
        <button type="submit">Add Workout</button>
      </form>
    </div>
  )
}

function WorkoutStats( {totalWorkouts, completedWorkouts, remainingWorkouts, totalWorkoutTime, remainingWorkoutTime,} ){ 
  return(
    <>
     <div className="workout-stats-container">
       <h3>Total Workouts: {totalWorkouts}</h3>    
       <h3>Completed Workouts: {completedWorkouts}</h3>
       <h3>Remaining Workouts: {remainingWorkouts}</h3>
       <h3>totalWorkoutTime: {totalWorkoutTime} Mins</h3>
       <h3>Total Remaining Time: {remainingWorkoutTime} Mins</h3>
     </div>
    </>
  )
}

function WorkoutSummary( {workouts} ){
  const totalWorkouts = workouts.length
  const completedWorkouts = workouts.filter(workout => workout.completed).length
  const remainingWorkouts = workouts.filter(workout => !workout.completed).length
  const totalWorkoutTime = workouts.reduce((total, workout) => {
    return total + workout.duration
  }, 0)
  const completedWorkoutList = workouts.filter(workout => !workout.completed)
  const remainingWorkoutTime = completedWorkoutList.reduce((total, workout) => {
    return total + workout.duration
  }, 0)

  return(
    <WorkoutStats totalWorkouts={totalWorkouts} 
    totalWorkoutTime={totalWorkoutTime}
    completedWorkouts={completedWorkouts}
    remainingWorkouts={remainingWorkouts}
    remainingWorkoutTime={remainingWorkoutTime}
    />
  )
}

function WorkoutList({workouts, setWorkouts}){
  return(
    workouts.map((workout) =>{
      return(
        <div key={workout.id} className="workout"> 
          <WorkoutCard workout={workout} setWorkouts={setWorkouts} workouts={workouts}/>
        </div>
      )  
    })
  )
}

function WorkoutCard({workout, setWorkouts, workouts}){
  return(
    <div className="workout-card">
      <h2>{workout.name}</h2>
      <h4>{workout.duration} Mins</h4>
      <button onClick={() => setWorkouts(workouts.map(work => {
        if(work.id === workout.id){
          return(
            {...work,
              completed: !work.completed
            }
          )
        }
        return work

      }))} className="complete-btn">{!workout.completed ? "Mark Complete": " UnCompleted" }</button>

      {workout.completed && <p>completed</p>}

      <button onClick={() => setWorkouts(workouts.filter((work) => workout.id !== work.id))} className="delete-btn">Delete Workout</button>

    </div>
  )
}

function App() {
  const [workouts, setWorkouts] = useState(JSON.parse(localStorage.getItem(("workouts"))) ?? [
    {
      id:1,
      name: "Morning Run",
      duration: 30,
      completed: false
    },

    {
      id:2,
      name: "Press-Ups",
      duration: 20,
      completed: false
    },

    {
      id:3,
      name: "Sit-Ups",
      duration: 20,
      completed: false
    }
    
  ])

  const [form, setForm] = useState({
    name: "",
    duration: ""
  })

  const [error, setError] = useState("")

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts))
  },[workouts])

  return(
    <>
    
      <Header/>
  
      <WorkoutForm 
        form={form}
        setForm={setForm}
        workouts={workouts}
        setWorkouts={setWorkouts}
        error={error}
        setError={setError}
      />

      <WorkoutList 
        workouts={workouts}
        setWorkouts={setWorkouts}
      />
    
      <WorkoutSummary workouts={workouts} />
    
    </>
  )
}
export default App;
