const db = require('../database');
const {Terms , Patient} = require('../Objects');
var jwt = require('jsonwebtoken');
GetAllTermsQuery = (id) => {
    console.log(id);
    const  query = 'select * from patient join termin on patient.id = termin.pacient_id where patient.id = ?';
  
    return new Promise ((resolve , reject) => {
        db.query(query , [id], (error , results , fields)=> {
            if (error) reject(error);
            else resolve(results);
        });
   });
};

GetAllTerms = async (req , res) => {
    try {
        const result = await GetAllTermsQuery(req.params.id);
        let dbPatient = result[0];
        let patient = new Patient(dbPatient.name , dbPatient.surname , dbPatient.age , []);
        let terms = result.map((x)=>{
            return new Terms(x.pacient_id , x.date);
        });
        patient.terms = terms
      
        res.send(patient).status(200);
    } catch (error) {
        res.send(error).status(500);
    }
}
CreateTermQuery = (term)=> {
    const query = 'INSERT INTO termin(pacient_id , date) VALUES (? ,?)'
    return new Promise ((resolve , reject) => {
         db.query(query , [term.pacient_id , term.date] , (error , results , fields)=>{
                if(error) reject(error);
                else resolve(results);
         })
    })
}
CreateTerm = async (req , res)=> {
    let term = req.body;
    try {
        await CreateTermQuery(term)
        res.send("the term has been created").status(200);
    } catch (error) {
        res.send(error).status(500);
    }
};


DeteleTermQuery = (id) => {
    const query = 'delete from termin where id = ?'
    return new Promise ((resolve , reject) => {
         db.query(query , [id] , (error , results , fields)=>{
                if(error) reject(error);
                else resolve(results);
         })
    })
};
DeteleTerm = async (req , res) => {
   try {
       await DeteleTermQuery(req.params.id);
       res.send("the term has been deleted").status(200);
   } catch (error) {
       res.send(error).status(500);
   }
}


ChangeTermQuery = (term, patient , id) => {
    const query = 'UPDATE termin SET date = ? WHERE termin.pacient_id = ? and termin.id=?';
    return new Promise ((resolve , reject) => {
        db.query(query , [term , patient , id] , (error , results , fields)=>{
               if(error) reject(error);
               else resolve(results);
        })
    });
};
ChangeTerm = async (req , res) => {
    let term = req.body;
   try {

       await ChangeTermQuery( term.date, req.params.patient , req.params.id);
       res.send("the term has been changed").status(200);
   } catch (error) {
       res.send(error).status(500);
   }
}

GetSpecificTermQuery = (patinet , termId) => {
    const query = 'select * from patient join termin on patient.id = termin.pacient_id\
     where patient.id =? and termin.id = ?;'
     return new Promise((resolve , reject)=> {
         db.query(query ,[patinet , termId],(error , results , fields) =>{
             if (error) reject(error);
             else resolve(results)
         })
     })

}

GetSpecificTerm = async (req, res) => {
try {
    const specificTerm = await GetSpecificTermQuery(req.params.patient , req.params.id);
    let term = specificTerm.map((x)=>{
        return new Terms(x.patient_id , x.date);
    })
    res.send(term).status(200);
} catch (error) {
    res.send(error).status(500)
}
}

GetOwnTerms =(id)=>{
    const query = 'select * from termin where pacient_id = ?'
    return new Promise((resolve , reject)=> {
        db.query(query ,[id],(error , results , fields) =>{
            if (error) reject(error);
            else resolve(results)
        })
    })
}
FutureReservedTermsQuery = (id)=> {
    const query = 'select * from termin where date > (select now()) and  pacient_id = ?;'
    return new Promise((resolve , reject)=> {
        db.query(query ,[id],(error , results , fields) =>{
            if (error) reject(error);
            else resolve(results)
        })
    })
}
FutureReservedTerms = async(req , res)=> {
    try {
        let tokenData = jwt.verify(req.token, 'login', (err, authorizedData) => {
            return authorizedData
        })
        const specificTerm = await FutureReservedTermsQuery(tokenData.user.id);
        let terms = specificTerm.map((x)=>{
            return new Terms(x.pacient_id , x.date);
        });
        
        res.send(terms).status(200);
    } catch (error) {
        res.send(error).status(500);
    }
    
}
module.exports = {
    GetAllTerms,
    CreateTerm ,
    DeteleTerm ,
    ChangeTerm ,
    GetSpecificTerm ,
    GetOwnTerms ,
    FutureReservedTerms
}