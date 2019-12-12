function Symptom (id ,opis , illness) {
    this.id = id;
    this.opis = opis ;
    this.illness = illness;
}

function Illness (bolest_id , ime) {
    this.bolest_id = bolest_id;
    this.ime = ime;
}

function Patient (name , surname , age , email) {
    this.name = name ; 
    this.surname = surname;
    this.age = age ;
    this.email = email
}

module.exports = {
    Symptom ,
    Illness ,
    Patient
}