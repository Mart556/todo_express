const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require('node:fs')

app.get('/', (req, res) => {
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const tasks = JSON.parse(data) || []

        res.render('index', {tasks});
    });
});

app.post('/api/send', (req, res) => {

    const newTaskLabel = req.body.task;
    if (newTaskLabel === '') {
        return res.send({error: 'Lisage korrektne nimi.'})
    }

    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const tasks = JSON.parse(data) || []
        tasks.push({
            id: tasks.length + 1,
            label: req.body.task
        })

        fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                console.error('Error writing to the file:', err);
                return res.status(500).send('Error writing to the file.');
            }

            res.redirect("/")
        });
    });
});

app.delete('/api/delete/:index', (req, res) => {
    const taskId = parseInt(req.params.index, 10);

    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Error reading the file.');
        }

        let tasks = JSON.parse(data) || []
        tasks = tasks.filter(task => task.id !== taskId);
        

        // Write the updated tasks back to the file
        fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                console.error('Error writing to the file:', err);
                return res.status(500).send('Error writing to the file.');
            }

            res.json({ success: true, message: 'Task deleted successfully.' });
        });
    });
});

app.get("/api/delete-tasks", (req, res) => {
    console.log("Delete all tasks request");

    fs.writeFile('./tasks.json', '[]', (err) => {
        if (err) {
            console.error('Error writing to the file:', err);
            return res.status(500).send('Error clearing the file.');
        }

        res.redirect("/");
    });
});

app.get("/api/update-task", (req, res) => {
    const taskId = req.query.id;

    console.log(`Edit task with ID: ${taskId}`);

    res.render('update-task', { taskId: taskId });
});

app.post('/api/edit-task', (req, res) => {
    const taskId = req.query.id;

    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Error reading the file.');
        }

        let tasks = JSON.parse(data) || []
        const taskIndex = tasks.findIndex(task => {
            return task.id == taskId;
        });

        tasks[taskIndex].label = req.body.label;

        fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                console.error('Error writing to the file:', err);
                return res.status(500).send('Error writing to the file.');
            }
            
            res.send({success: true});
        });
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});