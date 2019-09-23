window.onload = function () {
    var jsonTasks = new Map()
    var tasks = document.querySelector('.tasks-inner')
    var taskField = document.getElementById('taskField')
    var btnAdd = document.getElementById('btn')
    var submit = document.getElementById('submit')
    var locStore = window.localStorage
    
    submit.addEventListener('click', function() {
        saveJson()
    })

    function saveJson () {
        return fetch('https://api.myjson.com/bins', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify([...jsonTasks])
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            locStore.setItem('myjsonId', data.uri)
            alert('Saved')
        })
    }

    function getJson(uri) {
        fetch(uri).then(function (response) {
            return response.json()
        }).then(function (data) {
            jsonTasks = new Map(data)
            createChecks()
            initTasks(jsonTasks)
        })
    }
 
    function initTasks(jsonTasks) {
        var checkboxes =  document.querySelectorAll(".task-checkbox input")
        for(var i = 0; i < checkboxes.length; ++i) {
            function check() {
                var task = jsonTasks.get(parseInt(this.dataset.id))
                task.done = this.checked
            }
            checkboxes[i].addEventListener('change', check)
        }
    }

    function createChecks() {
        var checkboxTasks = ""
        for (var [key, value] of jsonTasks) {
            checkboxTasks += '<div class="task-checkbox">' +
            '<input type="checkbox"  data-id="' + key + '" id="task-check-' + key + '" name="taskCheck' + key + '"' + (value.done ? 'checked' : '') + '>' +
            '<label class="taskValue strikethrough" for="task-check-' + key + '">' + value.title + '</label>' +
            '</div>'
        }
        tasks.innerHTML = checkboxTasks
    }

    //taskField.addEventListener("kad je enter pritisnut", addTask)
    btnAdd.addEventListener("click", addTask)
    function addTask () {
        var taskValue = taskField.value
        if(taskValue === "") {
            alert('Unesite tekst')
        }

        jsonTasks.set(jsonTasks.size, {
            "title": taskValue,
            "done": false
        })
        createChecks()
        
        initTasks(jsonTasks)
    }

    // first load - check storage and load if needed
    var myjsonId = locStore.getItem('myjsonId')
    if (myjsonId) {
        getJson(myjsonId)
    }
}
