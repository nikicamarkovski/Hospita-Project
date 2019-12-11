
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');



function EmailValidator (email) {
    return email.includes("@" && ".com") && email.length > 10;
} 


function AgeValidator (age) {
    return age > 0  
}
function PasswordValidator (pass){
    for (var i = 0 ; i < pass.length ; i++) {
        if (pass[i]>=0) return true && pass.length > 5 
    } return false
 
}
function CheckQuantityOfDrug (have , need) {
    return have > need 
}
function SamePassword (oldPass , newPass) {
    return oldPass != newPass
}
loginLogic = (user,patient, doctor, pass)=>{

    if(doctor.length != 0){
      user=doctor;
      
    }else if(patient.length != 0){
        user = patient
    
  }else{
    var error = new Error("wrong credentials");
    error.status = 404;
    return error.message
  }
  user = user[0];

  const matchPass = bcrypt.compareSync(pass, user.password);
  console.log(pass);
  console.log(user.password);
  console.log(matchPass);

  if (matchPass) {
      
      var privateKey = 'login'
      
      var token = jwt.sign({user}, privateKey,{ expiresIn: '24h' });
      let userToSend = {
          Name:user.name,
          Email:user.email,
          Token:token
      }
 
      return userToSend
  } else {
      
    return "Wrong Email Or Password";
  
  }
  }

module.exports = {
    EmailValidator ,
    AgeValidator ,
    PasswordValidator ,
    CheckQuantityOfDrug,
    loginLogic ,
    SamePassword ,
  
}


