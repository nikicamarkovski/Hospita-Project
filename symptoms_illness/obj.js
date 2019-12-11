function Symptom (id ,opis , illness) {
    this.id = id;
    this.opis = opis ;
    this.illness = illness;
}

function Illness (bolest_id , ime) {
    this.bolest_id = bolest_id;
    this.ime = ime;
}


module.exports = {
    Symptom ,
    Illness
}