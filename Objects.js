function Patient (ime , prezime, age , terms) {
    this.ime = ime ;
    this.prezime = prezime;
    this.age = age;
    this.terms = terms;
}

function Terms (id , date) {
    this.id =id;
    this.date = date;
}

module.exports = {
    Patient ,
    Terms
}


