var Jimp = require("jimp");
var path = require( 'path' );


var source = path.join(__dirname, "public", "VIPAccessCode.png");
var dest = path.join(__dirname, "public");



//Text offsets
var xOffset         = 210;

var title1YOffset   = 60;
var row1YOffset     = 80;

var title2YOffset   = 130;
var row2YOffset     = 150;

var title3YOffset   = 200;
var row3YOffset     = 220;




exports.create = function(text, done) {

    if (!text) {
        text = {
            title1: "ACCESO A SALA VIP:",
            row1 :  "Madrid - Barajas",
            title2: "TITULAR DEL BILLETE:",
            row2:   "Gisela Torres",
            title3: "VALIDO HASTA:",
            row3:   "5 de Diciembre de 2017"
        }
    }





    Jimp.read(source, function (err, image) {
       
        if (err) {
            done(err, null)
        }
        else {

            var filename = new Date().getTime() + ".png";
            var filePath = path.join("public", filename)

            //Image titles in white
            Jimp.loadFont( Jimp.FONT_SANS_16_WHITE ).then(function (font) { 

                image.print(font, xOffset, title1YOffset, text.title1);
                image.print(font, xOffset, title2YOffset, text.title2);
                image.print(font, xOffset, title3YOffset, text.title3);

                //User text in black
                Jimp.loadFont( Jimp.FONT_SANS_16_BLACK ).then(function (font) {

                    image.print(font, xOffset, row1YOffset, text.row1);
                    image.print(font, xOffset, row2YOffset, text.row2);
                    image.print(font, xOffset, row3YOffset, text.row3);

                    image.write(path.join(__dirname, filePath));

                    done(null, filename);

                });

            });

            
        }

    });

};