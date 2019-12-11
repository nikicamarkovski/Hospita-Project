const patientsRoutes = require('./pacient/routes');
const express = require('express');
const PatientsTerms = require('./termini/routes');
const Diagnose = require('./symptoms_illness/routes');
const historyOfPatient = require('./patient_illness_drugs/routes');
const order = require('./ordering-medicines/routes');
const drugs = require('./Drugs/routes');
const doctors = require('./doctors/routes');
const router = express.Router();
router.use(historyOfPatient);
router.use(Diagnose);
router.use(PatientsTerms);
router.use(patientsRoutes);
router.use(order);
router.use(drugs);
router.use(doctors);


module.exports = router;