import React, { useRef, useState } from 'react'
import "./App.css";

export function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </svg>
  );
}

function TaskItem({ task, index, placeholder, done, OnOff, onEdit, onDelete, onMove, onDrop }) {
  return (
    <li
      className={done ? "task-done" : ""}
      draggable
      onDragStart={() => onMove(index)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDrop(index)}
    >
      <input className="TaskBox"
        type="checkbox"
        checked={done}
        onChange={() => OnOff(index)}
        aria-label={`Mark "${task}" as ${done ? "incomplete" : "complete"}`}
      />
      <textarea className="TaskIn"
        rows={1}
        value={task}
        placeholder={placeholder}
        readOnly={done}
        onChange={(event) => {
          event.currentTarget.style.height = "auto";
          event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
          onEdit(index, event.target.value);
          
        }}
      />
      <button className="DeleteBtn" onClick={() => onDelete(index)}>
        <TrashIcon />
      </button>
    </li>
  );
}

function TaskList({ tasks, placeholders, TaskDone, OnOff, onEdit, onDelete, onMove, onDrop }) {
  if (tasks.length === 0) {
    return <p className="task-list__empty">No tasks yet!</p>;
  }
  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task.text}
          index={index}
          placeholder={placeholders[index % placeholders.length]}
          done={TaskDone[index]}
          OnOff={OnOff}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          onDrop={onDrop}
        />
      ))}
    </ul>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [TaskDone, setTaskDone] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const nextTaskId = useRef(0);
  const placeholders = [
    "What's on your mind?",
    "New task...",
    "What needs to be done?",
    "Got something to remember?",
    "Need to do something?",
    "Egg"
];
  function handleinputChange(event) {
    setNewTask(event.target.value);
}
  function Adding() {

    setTasks(t=>[...t, { id: nextTaskId.current++, text: newTask }]);
    setTaskDone(done => [...done, false]);
    setNewTask("");
}
  function Deleting(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setTaskDone(done => done.filter((_, i) => i !== index));
}
  function Moving(index) {
    setDraggedTaskIndex(index);
}
  function Dropping(dropIndex) {
    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks[draggedTaskIndex];
    updatedTasks.splice(draggedTaskIndex, 1);
    updatedTasks.splice(dropIndex, 0, draggedTask);
    setTasks(updatedTasks);
    setTaskDone(done => {
      const updateddone = [...done];
      const [draggedCompletion] = updateddone.splice(draggedTaskIndex, 1);
      updateddone.splice(dropIndex, 0, draggedCompletion);
      return updateddone;
    });
    setDraggedTaskIndex(null);  
}
  function Editing(index, newText) {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], text: newText };
    setTasks(updatedTasks);
}
  function Toggle(index) {
    setTaskDone(done =>
      done.map((isdone, i) => i === index ? !isdone : isdone)
    );
}
  function Clearing() {
    setTasks([]);
    setTaskDone([]);
}


  return(<div className="DoneIt-App">

    <div className="Header">
      <h1>DoneIt!</h1>
      <h2>Your Personal To-Do List</h2>

      <div>
        <button className="AddBtn" onClick={Adding}>+ Add Task</button>
      </div>
    </div>

    <div className="Tasks-Container">
      <TaskList
        tasks={tasks}
        placeholders={placeholders}
        TaskDone={TaskDone}
        OnOff={Toggle}
        onEdit={Editing}
        onDelete={Deleting}
        onMove={Moving}
        onDrop={Dropping}
      />
      <button className="ClearBtn" onClick={Clearing}>Clear All Task</button>

    </div>
  </div>);
}

export default App;
