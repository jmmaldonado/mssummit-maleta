
var VIPCode = require("./vipcode");

var vipcodetext = {
    title1: "ACCESO A SALA VIP:",
    row1 : "Madrid - Barajas",
    title2: "TITULAR DEL BILLETE:",
    row2: "Gisela Torres",
    title3: "VALIDO HASTA:",
    row3: "5 de Diciembre de 2017"
}

VIPCode.create(null, function(err, filePath) {
    if (err) {
        console.error(err);
    }
    else {
        console.log(filePath);
    }
});

