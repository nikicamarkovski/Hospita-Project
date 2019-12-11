function Patient (name , surname,age,illness , drugs, terms) {
    this.name = name;
    this.surname=surname;
    this.age = age ;
    this.illness = illness;
    this.drugs = drugs;
    this.terms = terms;
}


function Drugs (DrugId , NameOfDrug) {
    this.DrugId = DrugId;
    this.NameOfDrug = NameOfDrug;
};

function Illness (bolest_id , nameofIllness) {
    this.bolest_id = bolest_id;
    this.nameofIllness = nameofIllness;
};

module.exports = {
    Patient ,
    Drugs,
    Illness
}