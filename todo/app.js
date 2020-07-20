// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = ""
// ****** EVENT LISTENERS **********
//submit form
form.addEventListener('submit', addItem);
//clear items
clearBtn.addEventListener('click', clearItems);
//load items
window.addEventListener("DOMContentLoaded", setUpItems);

// ****** FUNCTIONS **********
//add Items
function addItem(e){
    e.preventDefault();
    const value = grocery.value
    // console.log(grocery.value);
    const id = new Date().getTime().toString();
    // console.log(id)
    if(value && !editFlag){
        createListItems(id, value);
        //display alert
        displayAlert('item added to the list', 'success');
        //show container
        container.classList.add("show-container")
        //add to local storage
        addToLocalStorage(id, value)
        //set back to default
        setToDefault()   
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('item changed', 'success')
        //edit local storage
        editLocalStorage(editID, value)
        setToDefault()
        console.log('editing')}
    else{
        displayAlert('please enter value', 'danger')   
    }  
}

function displayAlert(text, action){
    //add alert
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    //remove alert
    setTimeout(()=>{
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    },1000)
}

//clear item
function clearItems(){
    const items = document.querySelectorAll('.grocery-item')
    if(items.length > 0){
        items.forEach((item)=>{
            list.removeChild(item);
        })
    }
    container.classList.remove('show-container')
    displayAlert('empty list', 'danger')
    setToDefault()
    localStorage.removeItem('list')
}
//edit function
const editItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling
    //set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id
    submitBtn.textContent = "edit"
}
//delete function
const deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove('show-container')
    }
    displayAlert("item removed", "danger");
    setToDefault()
    removeFromLocalStorage(id)   
}

// set back to default state
function setToDefault(){
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'submit';
    // console.log('set to default');
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
    const grocery = {id, value};
    
    let items = getLocalStorage()
    // console.log(items)
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items))
}
const removeFromLocalStorage = (id) =>{
    let items = getLocalStorage();

    items = items.filter((item)=>{
        if(item.id !== id){
            return item
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}
const editLocalStorage = (id, value) =>{
    let items = getLocalStorage()
    items = items.map((item)=>{
        if(item.id === id){
            item.value = value;
        }
        return item;
    })
    localStorage.setItem('list', JSON.stringify(items));
}
const getLocalStorage = () =>{
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
}



//local storage API
//set Item
//get Item
//remove Item
//save as strings
// localStorage.setItem()
// ****** SETUP ITEMS **********
function setUpItems() {
    let items = getLocalStorage()
    if(items.length > 0){
        items.forEach((item) =>{
            createListItems(item.id, item.value)
        });
        container.classList.add('show-container');
    }
}

function createListItems(id, value) {
    const element = document.createElement("article")
        //add class
        element.classList.add("grocery-item")
        //add id
        const attr = document.createAttribute("data-id")
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="title">${value}</p>
                            <div class="btn-container">
                                <button type="button" class="edit-btn">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button type="button" class="delete-btn">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>`;
                            const deleteBtn = element.querySelector('.delete-btn');
                            const editBtn = element.querySelector('.edit-btn');
                            deleteBtn.addEventListener('click', deleteItem)
                            editBtn.addEventListener('click', editItem)
        //append child
        list.appendChild(element)
}