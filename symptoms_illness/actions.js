const db = require('../database');

const{Symptom , Illness} = require('./obj')
DiagnoseQuery = (desc) =>{
    
    const query = 'select * from symptoms join symptoms_illness on symptoms.id= symptoms_illness.symptom_id \
    join illness on symptoms_illness.illness_id=illness.id where symptoms.description = ?';

     return new Promise((resolve , reject) =>{ 
           
      db.query(query ,[desc] ,(error , results , fields)=>{
            if (error) reject(error)
            else resolve(results) ;
      });
      
     });    
     
 };

Diagnose = async (req , res) => {
 try {
   var result = await DiagnoseQuery(req.params.desc);
   let dbSymptom = result[0];
   let patient = new Symptom(dbSymptom.id , dbSymptom.description,[]);
   let illness = result.map((x)=>{
       return new Illness(x.illness_id , x.illness_name);
   });
   
   patient.illness = illness
     res.send(patient).status(200);
 } catch (error) {
     res.send(error).status(500)
 };
 };


 module.exports= {
    Diagnose
 }







