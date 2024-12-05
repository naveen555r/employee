const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors =require('cors')
const multer=require('multer')
const Employee = require('../backend/models/employee')
const path = require('path')
const jwtSecret = 'your_jwt_secret';


const app = express()
app.use(cors())
app.use(express.json()); // Add this to parse JSON bodies


mongoose.connect('mongodb://localhost:27017/employee')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check credentials
  if (username === 'admin' && password === 'pass123') {
      const token = jwt.sign({ username }, jwtSecret, { expiresIn: '7h' });
      res.json({ token });
  } else {
      res.status(401).send('Invalid credentials');
  }
});

// Ensure that the uploads directory exists and is accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory for storing files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Name the file with a timestamp to avoid duplicates
    }
});
const upload = multer({ storage: storage });


app.get('/api/employees', async (req, res) => {
    console.log('Received employee data:', req.body);
    try {
        const employees = await Employee.find(); // Fetch all employee data
        res.status(200).json(employees); // Send data as JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch employee data' });
    }
});
app.post('/api/employees', upload.single('profileImage'), async (req, res) => {
    const { firstName, lastName, department,designation,dateOfJoining, salary } = req.body;
    const profileImage = req.file ? req.file.path : null; // Handle file upload
    // Convert dateOfJoining to a Date object to ensure correct format
    const formattedDateOfJoining = dateOfJoining ? new Date(dateOfJoining) : null;

    const newEmployee = new Employee({
        firstName,
        lastName,
        department,
        designation,
        dateOfJoining:formattedDateOfJoining,
        salary,
        profileImage
    });

    try {
        await newEmployee.save();
        res.status(201).json(newEmployee); // Return the newly created employee as a response
    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});
// Edit an existing employee
app.put('/api/employees/:id', upload.single('profileImage'), async (req, res) => {
    const { firstName, lastName, age, salary } = req.body;
    const profileImage = req.file ? req.file.path : null;
  
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, age, salary, profileImage },
        { new: true }
      );
      res.json(updatedEmployee);
    } catch (err) {
      res.status(500).send('Error updating employee');
    }
  });
  
  // Delete an employee
  app.delete('/api/employees/:id', async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).send('Error deleting employee');
    }
  });


const PORT=8000
app.listen(PORT,()=>console.log('server is running'))