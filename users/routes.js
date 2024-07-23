const express = require('express');
const router = express.Router();

const { getUserModel } = require('../common/models/User');
const { getTicketModel } = require('../common/models/Ticket');

//Post
router.post('/', async (req, res) => {
    const data = {
        id: req.body.id,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age
    }
    try {
        const User = getUserModel();
        const dataToSave = await User.create(data);
        res.status(200).json(dataToSave);
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//Get All
router.get('/all', async (req, res) => {
    try {
        const User = getUserModel();
        console.log(User);

        const data = await User.findAll();
        console.log(User);

        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID 
router.get('/:id', async (req, res) => {
    try {
        const User = getUserModel();
        const data = await User.findByPk(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID 
router.put('/:id', async (req, res) => {
    try {
        const User = getUserModel();
        const id = req.params.id;

        if (!(await User.findByPk(req.params.id))) {
            res.status(404).json({ message: "User not found" });
        } 

        const updatedData = req.body;    
        const cnt = await User.update(updatedData, {
          where: { id },
          returning: true,
        });

        console.log(cnt);
        // console.log(updatedRows[0]);
    
        // if (cnt[1] > 0) {
            const data = await User.findByPk(req.params.id);
            res.json(data)
        // } 
        // else {
        //     // poorana data and naya data compare karke check karna
        //     // do I really need this? if update same hi kar rhe hai
        //   res.status(404).json({ message: "User not updated" });
        // }
      } 
      catch (error) {
        res.status(500).json({ message: error.message });
      }
})
// look for patch, user not updated wala scene

//Delete by ID
router.delete('/:id', async (req, res) => {
    try {
        const User = getUserModel();
        const Ticket = getTicketModel();
        const id = req.params.id;
        const data = await User.findByPk(id);
        if(data){
            await User.destroy({ where: { id } });
            await Ticket.destroy({where: { userID: id } });
            res.send(`User with id ${data.id}:${data.firstName} has been deleted.`);
        } 
        else{
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;