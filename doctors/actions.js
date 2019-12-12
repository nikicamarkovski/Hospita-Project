const db = require('../database');
const bcrypt = require('bcryptjs');
const {PasswordValidator}= require('../helper');
var jwt = require('jsonwebtoken');
const {Patient} = require('../Objects');
GetAllDoctorsQuery = () => {
    const query = 'select * from doctor';
    return new Promise((resolve , reject)=>{
        db.query(query,(error , results , fields) =>{
            if(error)reject(error)
            else resolve(results)
        });
    });
};

GetAllDoctors =async (req , res) => {
    try {
        const doctor = await GetAllDoctorsQuery();
        res.status(200).send(doctor);
    } catch (error) {
        res.status(400).send(error)
    }
}
GetAllDoctorsByEmailQuery = (email) => {
    const query = 'select * from doctor where email=? ';
    return new Promise((resolve , reject)=>{
        db.query(query,[email],(error , results , fields) =>{
            if(error)reject(error)
            else resolve(results)
        });
    });
};
UpdateQuery = (pass , email)=> {
    const query = 'update doctor set password = ? where email = ?;'
    return new Promise((resolve, reject) => {
        db.query(query, [pass, email], (error, results, fields) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
};
Update = async (req, res)=>{
    const body = req.body.password
    const passValidator = PasswordValidator(body);
    console.log(passValidator);
    try {
        if (passValidator) {
            const passHash = bcrypt.hashSync(body, 10);
            await UpdateQuery(passHash, req.body.email);
            res.status(200).send("password has been change");
        } else {
            res.status(401).send('you must have numbers in your passwor or its too short')
        }

    } catch (error) {
        res.send(error).status(500);
    }
}
GetOwnPatientsQuery = (id) => {
    const query = 'select * from patient where doctor_id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id], (error, results, fields) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}
GetOwnPatients =async (req , res) => {
    try {
        let tokenData = jwt.verify(req.token, 'login', (error, authorizedData) => {
            return authorizedData
        })
        console.log(tokenData)
        let patients = await GetOwnPatientsQuery(tokenData.user.doctor_id);
        res.send(patients).status(200);

    } catch (error) {
        res.send(error).status(500);
    }
}
CreateDoctorQuery = (doctor , pass)=>{
    const query = 'INSERT INTO doctor (name ,surname, email , password , admin) values (? , ? , ? , ? , ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [doctor.name,doctor.surname,doctor.email , pass , doctor.admin], (error, results, fields) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}
CreateDoctor =async (req , res) => {
    let body =req.body;
    console.log(body);
    try {
        const passHash = bcrypt.hashSync(body.password, 10);
        await CreateDoctorQuery(body , passHash);
        res.send("doctor has been created");
    } catch (error) {
        res.send(error);
    }
}

DeteleDoctorQuery = (id)=>{ 
    const query = 'delete from doctor where doctor_id = ?'
    return new Promise((resolve, reject) => {
        db.query(query, [id], (error, results, fields) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}
DeteleDoctor = async (req , res)=> {
    try {
        await DeteleDoctorQuery(req.params.id);
        res.send("doctor has been deleted");

    } catch (error) {
        res.send(error);
    }   
}


module.exports = {
    GetAllDoctors ,
    GetAllDoctorsByEmailQuery ,
    Update,
    GetOwnPatients ,
    CreateDoctor ,
    DeteleDoctor
}