

const state = {
    tasks: []
}



//Form to add a new Task
function buttonOption(task) {
if(task.status===0){
    return `<button class="btn btn-success mx-3 btn-sm d-inline" onclick="app.run('done', ${task.id})">Done</button>`
} else {
    return `<button class="btn btn-danger mx-3 btn-sm d-inline" onclick="app.run('delete', ${task.id})">Delete</button>`
}
}


const view = state => `
    <section class="col">
        <h2>Tasks</h2>
            ${state.tasks.map(task => ` 
            <div id="${task.id}" draggable="true" ondragstart="app.run('dragStart', event)" class="card my-3">
                <div class="card-header">    
                    <li class= "${task.status ? 'done d-inline' : 'd-inline'} ${task.highlight ? 'highlight':''}" >${task.desc}</li>
                    ${buttonOption(task)} </div> </div>`).join("")}
        <form class="form-inline float-right ml-3" onsubmit="event.preventDefault(); app.run('add',this)">
            <input name="desc" class="form-control form-inline" type="text" placeholder="Add a task" required />
            <button class="btn form-control form-inline btn-dark btn-sm ml-3">Add</button>
        </form>
    </section>
    
    <section class="col">
    <h2>Drag/Drop</h2>
    <div ondragover="event.preventDefault()" ondrop="app.run('drop',event)" class="card my-3 delete">
        <div class="text-center card-header">
            <li class="text-center d-inline pt-3">Delete</li>
            <div class=" card-body">
            <li class=" p-3 important" ondragover="event.preventDefault()" ondrop="app.run('highlight',event)">Mark as important</li>
            </div>
        </div>
    </div>
    </section>


`

// Updates occur on the server
const update = {
    add: (state,form) =>{
        const data = new FormData(form)
        const task = data.get('desc')
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"desc": task})
        }
        fetch('/tasks', postRequest).then(()=> app.run('getTasks'))
        return state
    },
    done: (state, id)=>{
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(`/tasks/${id}/done`, postRequest).then(()=> app.run('getTasks'))
        return state
    },
    delete: (state, id) =>{
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(`/tasks/${id}/delete`, postRequest).then(()=> app.run('getTasks'))
        return state
    },
    dragStart: (state, event) =>{
        event.dataTransfer.setData('text', event.target.id) //our ID is a string, therefore passing 'text'
        return state
    },
    drop: (state,event)=>{
        event.preventDefault()
        const id = event.dataTransfer.getData('text')
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(`/tasks/${id}/delete`, postRequest).then(()=> app.run('getTasks'))
        return state
    },
    highlight: (state,event)=>{
        event.preventDefault()
        event.stopPropagation()
        const id = event.dataTransfer.getData('text')
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(`/tasks/${id}/highlight`, postRequest).then(()=> app.run('getTasks'))
        
        return state
    },
    getTasks: async (state) =>{
        //makes get request to the server using FETCH
        state.tasks = await fetch("/tasks").then(res => res.json())
        return state
    }

}


app.start('app', state, view, update) //app.run requires these three objects, the first argument is the ID of the HTML element

app.run('getTasks')