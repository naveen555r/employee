const mongoose = require('mongoose');

// Define employee schema
const employeeSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50, // Assuming a reasonable limit for first name
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 50, // Assuming a reasonable limit for last name
        },
        
        salary: {
            type: Number,
            required: true,
            min: 0, // Salary must be non-negative
        },
        profileImage: {
            type: String, // Path or URL to the profile image
            
        },
        department: {
            type: String,
            required: true, // Assuming the department field is mandatory
            trim: true,
            minlength: 2,
            maxlength: 100, // Assuming a reasonable limit for department name
        },
        designation: {
            type: String,
            required: true, // Assuming the designation field is mandatory
            trim: true,
            minlength: 2,
            maxlength: 100, // Assuming a reasonable limit for designation name
        },
        dateOfJoining: {
            type: Date,
            required: true, // Assuming this field is mandatory
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

// Create model from schema
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
