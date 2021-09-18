//Selectors 
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

//Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);


//Functions
//Getting Todos List
function ifExistsTodos(){
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = []
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}

let todos = ifExistsTodos();

function addTodo(event){
    //Prevent form from submint(it cancels submit action from the button)
    event.preventDefault();
    const todoInputValue = todoInput.value;
    //Prevent whitespaces from input
    if((todoInputValue.replace(/\s+/g, ''))==""){
        todoInput.value = "";
        return alert("Entrada com valor vazio");
    }
    createTodo(todoInputValue, false, "creation");
    saveLocalTodos({value:todoInputValue, completed:false});
     //CLEAR TODO INPUT VALUE
     todoInput.value = "";
}

function deleteCheck(event){
    const item = event.target;
    //DELETE TODO
    if(item.classList[0] === "delete-btn"){
        const todoParent = item.parentElement;
        //Deleting Animation 
        todoParent.classList.add("deleted-animation");
        console.log(todoParent.children[0].innerText);
        removeLocalTodos(todoParent)
        //removeLocalTodos(todoParent);
        todoParent.addEventListener('transitionend',function(){
            todoParent.remove();
        }) 
    }

    if(item.classList[0] === "complete-btn"){
        const todoParent = item.parentElement;
        todoParent.classList.toggle("completed");
        const todoValue = todoParent.children[0].innerText;
        const todoIndex = todos.findIndex((todo)=> todo.value === todoValue);
        if(todoParent.classList.contains("completed")){
            todos[todoIndex].completed = true;
            localStorage.setItem('todos', JSON.stringify(todos));
        }else{
            todos[todoIndex].completed = false;
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }
}

function filterTodo(event){
    const todos = todoList.childNodes;
    todos.forEach((function(todo){
            switch(event.target.value){
            case "all":
                todo.style.display = 'flex';
                break;
            case "completed":
                if(todo.classList.contains("completed")){
                    todo.style.display = 'flex';
                }else{
                    todo.style.display = "none";
                }
                break;
                
            case "uncompleted":
                if(!todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }else{
                    todo.style.display = "none";
                } 
                break;
            }
    }))
}


function saveLocalTodos(todo){
    //Adding todo to localstorage
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos(){
    todos.forEach((todo)=>{
        createTodo(todo.value, todo.completed,"gettodos");
    });
}

function createTodo(todoValue, todoCompleted, option){
        //Todo DIV
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        //Verifying if its checked
        if(option === "gettodos"){
            if(todoCompleted == true){
            todoDiv.classList.add('completed');
            }
        }
        // Create LI
        const newTodo = document.createElement('li');
        newTodo.innerText = todoValue;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);
        //CHECK MARK BUTTON
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //DELETE BUTTON
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("delete-btn");
        todoDiv.appendChild(trashButton);
        //Append to list
        todoList.appendChild(todoDiv);
}

function removeLocalTodos(todo){
    //Check if already have todos
    const todoValue = todo.children[0].innerText;
    const todoIndex = todos.findIndex((todo)=> todo.value === todoValue);
    // O slice é melhor do que o delete pois não coloca valores nulos no local do apagado.
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}
