const { request } = require("express")
const express = require("express")
const app = express()
const Task = require("./public/src/Task")


app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get("/tasks", (req,res)=>{
    res.send(Task.all)
})
app.post("/tasks", (req,res)=>{
    const task = new Task(req.body.desc)
    res.send()
})
app.post("/tasks/:id/done", (req,res)=>{
    const id = req.params.id
    const task = Task.all.find(task=> task.id == id)
    task.status = 1 
    res.send()
})
app.post("/tasks/:id/delete", (req,res)=>{
    const id = req.params.id
    const idx = Task.all.findIndex(task=> task.id == id)
    Task.all.splice(idx,1)
    res.send()
})
app.post("/tasks/:id/highlight", (req,res)=>{
    const id = req.params.id
    const task = Task.all.find(task=> task.id == id)
    task.highlight = 1 
    res.send()
})

// Initialise To Do list
new Task("Shopping")
new Task("Take bins out")
new Task("Read book")
new Task("Shower")


app.listen(3000, ()=>{
    console.log("server on port 3000")
})
