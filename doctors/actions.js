const db = require('../database');
const bcrypt = require('bcryptjs');
const {PasswordValidator}= require('../helper');
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

module.exports = {
    GetAllDoctors ,
    GetAllDoctorsByEmailQuery ,
    Update
}