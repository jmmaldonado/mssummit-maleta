var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: "a08029b9-9f5c-4bca-b607-ac5e622175ac",
    appPassword: "Ypwf6YGLPC2pPhtJsEVNbsK"
});
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
server.post('/api/messages', connector.listen());


bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));


//=========================================================
// Bots Dialogs
//=========================================================

var debug = false;

bot.dialog('/', [
    function (session) {
        
        if (debug) {
            session.beginDialog('/help');
        }
        else {
            session.replaceDialog('/principal');    
        }        
    },
    function (session, results) {
        // Display menu
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Always say goodbye
        session.send("Estoy a tu disposición para cualquier cosa que necesites. ¡Disfruta del día!");
    }
]);


bot.dialog('/help', [
    function (session) {
        session.endDialog("Estoy en modo debug!!");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "Qué diálogo quieres seguir?", "principal|test|(quit)");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });




bot.dialog('/principal', [
    
    //Hola
    function (session) {
        if (debug) {
            session.send("Estoy en modo debug!!");
            session.send("Puedes volver al comienzo del dialogo diciendo: hola ");
        }
        builder.Prompts.text(session, "Hola Gisela, ¿Cómo estás?");
    },
    
    //Pues la verdad es que estoy algo nerviosa.
    function (session, results) {
        builder.Prompts.text(session, "¡Vaya, lo lamento! ¿En qué puedo ayudarte?");
    },
    
    //Vengo de un viaje y han perdido mi maleta.
    function (session, results) {
        builder.Prompts.choice(session, "¿De tu último vuelo a Seattle MS2313?", "si|no");
    },
    
    // Si, ese es.
    function (session, results) {
        session.send("No te preocupes, voy a tratar de localizar tu equipaje, dame unos instantes por favor");
        
        setTimeout( function() { 
            
            session.send("La he encontrado y está de camino al punto de entrega que seleccionaste"); 
            var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://botmaletajmm.azurewebsites.net/initialMap.png"
            }]);
            session.send(msg);
            builder.Prompts.text(session, "<b>Origen: </b>Madrid Barajas - Terminal 4<br/><b>Destino: </b>Palacio de congresos de Madrid. Paseo de la Castellana, 99, 28046 Madrid<br/><b>Tiempo estimado de llegada: </b>: 25 minutos");
            
        }, 10000);        
    },
    
    //Ha debido haber algún error, no estoy en ese palacio de congresos. ¿Es posible cambiar la dirección de entrega?
    function (session, results) {
        
        session.send("El equipaje todavía está en <b>reparto</b>, creo que podemos hacer algo");
        builder.Prompts.choice(session, "¿Prefieres darme una nueva dirección o tu localización actual?", "dirección|localización");
        
    },
    
    //Selecciona ubicación
    function (session, results) {
        builder.Prompts.text(session, "Genial, si me envías tu ubicación la compartiré con el repartidor");
    },
    
    //Compartir coordenadas
    function (session, result) {
        builder.Prompts.text(session, "De acuerdo, te he localizado en el Palacio Municipal de Congresos. ¿Algún dato adicional?");
    },
    
    //No, eso es todo
    function (session, results) {
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://botmaletajmm.azurewebsites.net/finalMap.png"
            }]);
        session.send(msg);
        session.send("Dirección de entrega: Palacio municipal de congresos. Avenida Capital de España Madrid,  7  - 28042 - Madrid");
        session.send("Persona de contacto: Gisela Torres");
        builder.Prompts.choice(session, "¿Es correcto?", "si|no");
    },
    
    //si
    function (session, results) {
        session.send("De acuerdo, ya he compartido el destino actualizado con el equipo de reparto");
        session.send("El tiempo estimado de entrega según bing maps es de <b>12 minutos</b>");
        session.send("Lamento mucho el incoveniente que te hemos ocasionado, en compensación nos gustaría ofrecerte un código de acceso para nuestra sala VIP de Madrid Barajas para tu próximo vuelo.");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://botmaletajmm.azurewebsites.net/qrCode.png"
            }]);
        session.send(msg);
        session.endDialog("Estoy a tu disposición para cualquier cosa que necesites. ¡Disfruta del día!");
    }
    
    
]).reloadAction('reloadPrincipal', null, { matches: /^hola/i });





bot.dialog('/test', [
    
    function (session) {
        
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://botmaletajmm.azurewebsites.net/initialMap.png"
            }]);
        session.endDialog(msg);
        
        
    }
]);

