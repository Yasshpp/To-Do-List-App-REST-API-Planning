const express = require('express');// import express package

const app = express();//make exprss application
const PORT = 5000;//set port number

app.use(express.json());

// This route checks whether the servr is working or not

app.get('/', (req, res) => {//app.get("/")-> when browser/route sends a rqusest to the server, this code will run
    res.status(200).send("To-Do List API is running");//send response to the browser
});



// /tasks route to get all tasks
app.get('/tasks', (req, res) => {// /tasks handle the request to get all tasks
    //const tasks = [];//create an empty array to store tasks
    res.status(200).json(tasks);});// res.status(200) -> sends success response to the browser, res.json(tasks) -> sends the tasks array as a JSON response});

//Get one task by id
app.get('/tasks/:id', (req, res) => {// /tasks/:id handle the request to get a task by id
    const id = Number(req.params.id);//Take id from the url
    const task = tasks.find(t => t.id === id);//check if the task is present in our list
    if(!task){//iif the task is not there, show error message
        return res.status(404).json({
            message: "Task not found"
        });

    }
    res.status(200).json(task);//if the task is foumd, send its dtails

});



let tasks = [];//for now, tasks stores in the memory  
let nextId = 1;//nextId=1 is used to generate unique id for each task 

// create a new task
app.post('/tasks', (req, res) => {
    console.log("BODY REECIEVED", req.body);
    console.log("CONTENT TYPE", req.headers['content-type']);
    const { title, description } = req.body;//data send through frontend or api is stored in req.body
    console.log("TITLE", title);
    //title is required to create a task
    if (!title || typeof title !== "string" || !title.trim()) {//if title is missing or not a string or empty string, send a bad request response
        return res.status(400).json({//400-> if title is missing, send a bad request response 
            message: "Task title is required"
        });    }

    const newTask = {
        id: nextId++,//generate unique id for each task
        title: title.trim(),//trim() removes whitespace from both ends of a string
        description: description || "",//if description is not provided, set it to an empty string
        completed: false//set completed to false by default
    };

    tasks.push(newTask);//add new task to the tasks array
    res.status(201).json(newTask);//201-> send a success response with the newly created task




});

//update an existing task
app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);//take task id from the url
    const task = tasks.find(t => t.id === id);//find the task we want to update 
    if(!task){//if task is not found, send a 404 response
        return res.status(404).json({
            message: "Task not found"

        });}
//get the new details sent by user
    const { title, description, completed } = req.body;
    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {//check the title is valid
            return res.status(400).json({ message: "Task title is required" });
        }
        task.title = title.trim();
    }
  //save the updated details to the task
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    res.status(200).json(task);//send a success response with the updated task
});

   

//delete a task using its id
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);//takr the task id from the url
    const index = tasks.findIndex(t => t.id === id);//find the task in our list
    if(index === -1){//if task is not found, send a 404 response
        return res.status(404).json({
            message: "Task not found"
        });

    }
    //removee the task from the our list
    tasks.splice(index, 1);//remove the task from thee list
    res.status(200).json({ message: "Task deleted successfully" });//send a success response
});



//Start the server
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
