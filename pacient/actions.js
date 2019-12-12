const db = require('../database');
const { AgeValidator, EmailValidator, PasswordValidator ,loginLogic , SamePassword} = require('../helper');
const doctors = require('../doctors/actions');
var jwt = require('jsonwebtoken');
var rn = require('random-number');
const { Patient, Illness, Drugs } = require('../patient_illness_drugs/obj');
const bcrypt = require('bcryptjs');
GetAllPatientsQuery = () => {
    const query = 'SELECT * FROM patient';
    return new Promise((resolve, reject) => {

        db.query(query, (error, results, fields) => {
            if (error) reject(error)
            else resolve(results);
        });
    });
};
GetAllPatients = async (req, res) => {
    try {
     
        var patients = await GetAllPatientsQuery();
        res.send(patients).status(200);
    } catch (error) {
        res.send(error).status(500);
    }
}

GetSpecificPatientQuery = (id) => {
    const query = 'SELECT * FROM patient where id = ?'
    return new Promise((resolve, reject) => {
        db.query(query, [id], (error, results, fields) => {

            if (error) reject(error)
            else resolve(results);

        });
    });
};
GetSpecificPatient = async (req, res) => {

    try {
        const specificPatient = await GetSpecificPatientQuery(req.params.id);

        if (specificPatient.length == 0) {

            res.send("nema pacient so takvo id").status(403);

        } else {
            res.send(specificPatient).status(200);
        }

    } catch (error) {
        res.send(error).status(500);
    }
}
GetPatientByEmail = (email) => {
    
    const query = 'select * from patient where email =? ';
    return new Promise((resolve, reject) => {
        db.query(query, [email], (error, results, fields) => {
            if (error) reject(error)
            else resolve(results);
        })
    })
}
NewPatientQuery = (patient, pass , doctor_id) => {
    const query = 'INSERT INTO patient(name , surname , age , email , password , doctor_id) VALUES(?, ?, ? , ? , ?,?) ';
    return new Promise((resolve, reject) => {
        db.query(query, [patient.name, patient.surname, patient.age, patient.email, pass, doctor_id], (error, results, fields) => {
            if (error) reject(error)
            else resolve(results);
        })
    })
}

NewPatient = async (req, res) => {
    let body = req.body;

    try {
        const isExist = await GetPatientByEmail(body.email)
        console.log(isExist);
        if (isExist.length === 0) {

            if (EmailValidator(body.email) && AgeValidator(body.age) && PasswordValidator(body.password)) {
                let tokenData = jwt.verify(req.token, 'login', (error, authorizedData) => {
                    return authorizedData
                });
                let doctor_id = tokenData.user.doctor_id;
                const passHash = bcrypt.hashSync(body.password, 10);
                await NewPatientQuery(body, passHash , doctor_id);
                res.send("Patient was created").status(200);
            } else {
                res.send("Check your age , Email and password").status(401);
            }
        } else {
            res.send("wrong email").status(403);
        }

    } catch (error) {
        res.send(error).status(500);
    }
};

DetelePatientQuery = (id) => {
    const query = ' DELETE FROM patient WHERE id= ?';
    return new Promise((resolve, reject) => {

        db.query(query, [id], (error, results, fields) => {
            if (error) reject(error)
            else resolve(results);
        });
    });
};
DetelePatient = async (req, res) => {
    try {
        const patient = await GetSpecificPatientQuery(req.params.id);
        
        let tokenData = jwt.verify(req.token, 'login', (error, authorizedData) => {
         return authorizedData
     });
     if (tokenData.user.doctor_id == patient[0].doctor_id) {
        await DetelePatientQuery(req.params.id);
        res.send("patient has been deleted").status(200);
     } else {
         res.send("not your patient");
     }
    } catch (error) {
        res.send(error).status(500);
    };
};

UpdatePatientQuery = (pass, email) => {
    const query = 'update patient set password = ? where email = ?;'
    return new Promise((resolve, reject) => {
        db.query(query, [pass, email], (error, results, fields) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
};

UpdatePatient = async (req, res) => {
 
    const body = req.body;
    console.log(body);
    try {
        const patient = await GetPatientByEmail(body.email);
        const matchPass = bcrypt.compareSync(body.password, patient[0].password);
     

      if (matchPass && patient.length > 0 ){
        const passValidator = PasswordValidator(body.newpassword);
        const samePass = SamePassword(body.password , body.newpassword);
        if (passValidator && samePass) {
            const passHash = bcrypt.hashSync(body.newpassword, 10);
            await UpdatePatientQuery(passHash, req.body.email)
            res.send("password has been change").status(200);
        } else {
            res.send('check if the password is the same and you must have numbers or its too short').status(401)
        }
    } else {
        res.send("wrong email or password");
    } 

 

    } catch (error) {
        res.send(error).status(500);
    }
}

GetPatientByEmailQuery = (email) => {
    const query = 'select * from patient join patient_illness_drugs on patient.id  = patient_illness_drugs.patient_id\
    join illness on patient_illness_drugs.illness_id = illness.id \
    join drugs on patient_illness_drugs.drug_id = drugs.id where patient.email = ?';

    return new Promise((resolve, reject) => {
        db.query(query, [email], (error, results, fields) => {
            if (error) reject(error)
            else resolve(results);
        })
    })
};

Login=async(req,res)=>{
    let pass = req.body.password;
    let email = req.body.email;
 
      try {
        let user;
        let doctor = await doctors.GetAllDoctorsByEmailQuery(email);
        let  patient = await GetPatientByEmailQuery(email);
        
        let login = loginLogic(user,patient,doctor , pass);
      
        res.send(login).status(500);
    
    } catch (error) {
        res.status(500).send(error);
        
    }
}

module.exports = {
    GetAllPatients,
    GetSpecificPatient,
    NewPatient,
    DetelePatient,
    UpdatePatient,
    GetSpecificPatientQuery,
    Login
}







