const db = require('../database');
NumberOfMedicationsQuery = (name) => {
    const query = 'select quantity , drug_name from  drugs where  drug_name = ?';
    return new Promise((reject , resolve)=>{
            db.query(query,[name],(error , results , fields)=>{
                if(error) reject(error);
                else resolve(results);
        });
    });
};
NumberOfMedications = async (req , res)=>{
        try {
            const result = await NumberOfMedicationsQuery(req.params.name);
            res.send(result).status(200);
        } catch (error) {
            res.send(error).status(500);
        }
};

PatientsDrugQuery = (quantity , name) => {
     const query ='update drugs set quantity = quantity -  ? where drug_name = ?';
     return new Promise((resolve , reject)=>{
        db.query(query , [quantity,name],(error , result , fields)=>{
            if(error) reject(error);
            else resolve(result);
        });
     });
};

GetDrugQuantity = (name)=> {
    const query ='select quantity from drugs where drug_name=?';
    return new Promise((resolve , reject)=>{
       db.query(query , [name],(error , result , fields)=>{
           if(error) reject(error);
           else resolve(result);
       });
    });
}


module.exports = {
    NumberOfMedications ,
    PatientsDrugQuery ,
    GetDrugQuantity
}