const router = require('express').Router();
let SensorReading = require('../models/SensorReading');

//get readings from database
router.route('/').get((req, res) => {

  SensorReading.find({})
  .then((readings)=> res.json(readings))
  .catch(err => res.status(400).json('Error: ' + err));

});

//save new reading to database
router.route('/').post((req, res) => {

  const type = req.body.type;
  const value = req.body.value;
  const alert = req.body.alert;

 const newSensorReading = new SensorReading({
   type,
   value,
   alert
 });

   newSensorReading.save()
 .then(() => res.json('new reading added'))
 .catch(err => res.json('Error: ' + err));

});

module.exports = router;