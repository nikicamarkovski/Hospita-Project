const db = require('../database');
const {Patient , Illness , Drugs} = require('./obj');
var jwt = require('jsonwebtoken');
const drugs = require('../Drugs/actions');
const {CheckQuantityOfDrug} = require('../helper');
const {GetAllTermsQuery, GetOwnTerms} = require('../termini/actions');
const {Terms} = require('../Objects');


GetHistoryOfPatientQuery = (id) => {
    const query = 'select * from patient join patient_illness_drugs on patient.id  = patient_illness_drugs.patient_id\
     join illness on patient_illness_drugs.illness_id = illness.id \
     join drugs on patient_illness_drugs.drug_id = drugs.id where patient.id = ?;'
     return new Promise ((resolve , reject)=>{
        db.query(query ,[id] , (error , results , fields)=>{

            if(error) reject(error);
            else resolve(results);

        });
     });

};

GetHistoryOfPatient =async (req , res) =>  {
        try {
            const result = await GetHistoryOfPatientQuery(req.params.id);
            
            const terms = await GetOwnTerms(result[0].id);
             console.log(terms);
            const dbPatient = result[0];
            const patient = new Patient(dbPatient.name , dbPatient.surname , dbPatient.age , [] , [], []);
            const drugs = result.map((x)=>{
                return new Drugs(x.drug_id , x.drug_name);
            });
            const illness = result.map ((x)=>{
                return new Illness(x.illness_id , x.illness_name);
            })
            patient.drugs = drugs;
            patient.illness = illness;
            const allTerms = terms.map((x)=>{
               return new Terms (x.id , x.date);
            })
            console.log(allTerms);
            patient.terms = allTerms;

            res.send(patient).status(200);
        } catch (error) {
            res.send(error).status(500);
        }
}

CreateHistoryQuery = (body) => {
    console.log(body)
    const query = 'INSERT INTO patient_illness_drugs(patient_id , illness_id , drug_id)\
    VALUES(? , (select id from illness where illness_name = ?) , (select id from drugs where drug_name = ? ))'
    return new Promise((resolve , reject)=>{
       db.query(query , [body.patient , body.illness , body.drug],(error , results , fields) =>{
           if(error) reject(error);
           else resolve(results);
       })
    })
}
CreateHistory = async (req, res) => {
       try {
           let body = req.body;
           const result = await drugs.GetDrugQuantity(body.drug);
           if (CheckQuantityOfDrug(result[0].quantity , body.quantity)) {
            await CreateHistoryQuery(body);
            await drugs.PatientsDrugQuery(body.quantity , body.drug)
           res.send("history has been created");
           } else {
               res.send("there is not enough medicine there are " + result[0].quantity + " from " + body.drug).status(401);
           }

       } catch (error) {
           res.send(error).status(500);
       }
}

GetOwnHistoryQuery = (id) => {

    const query = 'select * from patient join patient_illness_drugs on patient.id  = patient_illness_drugs.patient_id\
    join illness on patient_illness_drugs.illness_id = illness.id \
    join drugs on patient_illness_drugs.drug_id = drugs.id where patient.email = ?;'
    return new Promise((resolve , reject)=>{
       db.query(query , [id],(error , results , fields) =>{
           if(error) reject(error);
           else resolve(results);
       })
    })
}

GetOwnHistory = async (req, res) => {
    

    try {
        let tokenData = jwt.verify(req.token, 'login', (err, authorizedData) => {
            return authorizedData
        })
        const result = await GetOwnHistoryQuery(tokenData.user.email);
        const terms = await GetOwnTerms(tokenData.user.id);
        const dbPatient = result[0];
        const patient = new Patient(dbPatient.name , dbPatient.surname , dbPatient.age , [] , [] ,[]);
        const drugs = result.map((x)=>{
            return new Drugs(x.drug_id , x.drug_name);
        });
        const illness = result.map ((x)=>{
            return new Illness(x.illness_id , x.illness_name);
        });
        const allTerms = terms.map((x)=>{
            return new Terms (x.id , x.date);
         });
     
         patient.terms = allTerms;
        patient.drugs = drugs;
        patient.illness = illness;
  
        res.send(patient).status(200);
    } catch (error) {
        res.send(error).status(500);
    }
}
module.exports = {
    GetHistoryOfPatient ,
    CreateHistory,
    GetOwnHistory
}


