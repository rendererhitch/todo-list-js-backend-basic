const express = require('express')
const fs = require('fs').promises;

const { v4:uuidv4 } = require('uuid'); 
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
    res.status(200).sendFile(__dirname+"/index.html");
})

app.get('/todos', async (req, res)=>{
    const valInc = await fs.readFile('./incomplete.json', 'utf-8', function(err, data){
        if(err){
            console.log(err);
        } else{
            return data;
        }
    })
    const valC = await fs.readFile('./complete.json', 'utf-8', function(err, data){
        if (err){
            console.log(err);
        } else{
            return data;
        }
    })
    const incompleteTasks = JSON.parse(valInc);
    const completedTasks = JSON.parse(valC);

    res.status(200).json({
        incomp:incompleteTasks,
        comp: completedTasks
    });
})

app.post('/', async (req, res)=>{
    const task = req.body.task;
    const time = req.body.time;
    const id = uuidv4();
    const valInc = await fs.readFile('./incomplete.json', 'utf-8', function(err, data){
        if(err){
            console.log(err);
        } else{
            return data;
        }
    })
    const incompleteTasks = JSON.parse(valInc);
    const updatedTasks = incompleteTasks;
    updatedTasks.push({
        id: id,
        task: task,
        time: time
    })
    const data = updatedTasks;
    
    fs.writeFile('./incomplete.json', JSON.stringify(data, null, 2), 'utf-8', function(err){
        if (err){
            console.log(err);
        }
    })

    res.status(200).json({
        id: id,
        task: task,
        time: time
    })
})

app.put('/', async (req, res)=>{
    const id = req.body.id;
    const valInc = await fs.readFile('./incomplete.json', 'utf-8', function(err, data){
        if(err){
            console.log(err);
        } else{
            return data;
        }
    })
    const valC = await fs.readFile('./complete.json', 'utf-8', function(err, data){
        if (err){
            console.log(err);
        } else{
            return data;
        }
    })
    const incompleteTasks = JSON.parse(valInc);
    const completedTasks = JSON.parse(valC);
    let index;
    for (let i=0; i<incompleteTasks.length; i++){
        if (id===incompleteTasks[i].id){
            index = i;
            break;
        }
    }
    const com = incompleteTasks[index];

    incompleteTasks.splice(index, 1);

    const newComplete = completedTasks;

    newComplete.push(com);
    const newIncomplete = incompleteTasks;
    
    fs.writeFile('./complete.json', JSON.stringify(newComplete, null, 2), 'utf-8', function(err){
        if (err){
            console.log(err);
        }
    });
    fs.writeFile('./incomplete.json', JSON.stringify(newIncomplete, null, 2), 'utf-8', function(err){
        if (err){
            console.log(err);
        }
    })
    res.json(com);
})

app.delete('/', async function(req, res){
    const id = req.body.id;
    const valInc = await fs.readFile('./incomplete.json', 'utf-8', function(err, data){
        if(err){
            console.log(err);
        } else{
            return data;
        }
    })
    const incompleteTasks = JSON.parse(valInc);
    let index;
    for (let i=0; i<incompleteTasks.length; i++){
        if (id===incompleteTasks[i].id){
            index = i;
            break;
        }
    }
    const del = incompleteTasks[index];
    incompleteTasks.splice(index, 1);
    const newIncomplete = incompleteTasks;
    fs.writeFile('./incomplete.json', JSON.stringify(newIncomplete, null, 2), 'utf-8', function(err){
        if (err){
            console.log(err);
        }
    })
    res.json(del);
})

app.listen(4000);