const express = require('express');
const Contact = require('../models/Contact');
const xlsx = require('xlsx');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// this api store user contact info..
router.post('/contactus', async (req, res) => {
    const { customerName, contactNumber, emailAddress, pincode, address, city, dist } = req.body;

    try {
        // Cheak a mobile number
        const existingContact = await Contact.findOne({ contactNumber });
        if (existingContact) {
            return res.status(400).json({ message: 'Contact with this phone number already exists' });
        }

        // Create a new contact
        const contact = new Contact({
            customerName,
            contactNumber,
            emailAddress,
            pincode,
            address,
            city,
            dist,
        });

        // Save the contact 
        await contact.save();

        // Create or append to the Excel file
        const filePath = path.join(__dirname, '../contacts.xlsx');

        // Check if the file already exists
        let workbook;
        if (fs.existsSync(filePath)) {
            workbook = xlsx.readFile(filePath);
        } else {
            workbook = xlsx.utils.book_new();
            const newWorksheet = xlsx.utils.json_to_sheet([]);
            xlsx.utils.book_append_sheet(workbook, newWorksheet, 'Contacts');
        }

        // Prepare data for the new row
        const newRow = {
            Name: customerName,
            PhoneNumber: contactNumber,
            Email: emailAddress,
            Pincode: pincode,
            Address: address,
            City: city,
            Dist: dist,
        };

        // Append the new row to the existing worksheet
        const worksheet = workbook.Sheets['Contacts'];
        const existingData = xlsx.utils.sheet_to_json(worksheet);
        const updatedData = [...existingData, newRow];
        const updatedWorksheet = xlsx.utils.json_to_sheet(updatedData);
        workbook.Sheets['Contacts'] = updatedWorksheet;

        // Write the updated workbook to file
        xlsx.writeFile(workbook, filePath);

        // Respond with success
        res.status(201).json({success: true,  message: 'Contact data saved  successfully', data: contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false , message:  'Error saving contact data', error });
    }
});

module.exports = router;
