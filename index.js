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



//=========================================================
// Bots Dialogs
//=========================================================




bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hola Gisela, ¿Cómo estás?");
    },
    
    
    function (session, results) {
        builder.Prompts.text(session, "¡Vaya! ¿En que te puedo ayudar?");
    },
    
    
    function (session, results) {
        builder.Prompts.text(session, "¿De tu último vuelo a Seattle MS2313?");
    },
    
    
    function (session, results) {
        session.send("No te preocupes, voy a localizarla por ti");
        sleep(5);
        session.send("La he encontrado y está de camino al punto de entrega que seleccionaste");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("<table><tr><td>Vuelo:</td><td>MS2313</td></tr><tr><td>Destino:</td><td>Palacio de congresos, Paseo de la Castellana 17, Madrid.</td></tr><br/>The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
            ]);
        session.send(msg);
    }
]);



function sleep(seconds) {
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while(waitTill > new Date()){}
}


/*
bot.dialog('/startConversation', function(session) {
    console.log("EO2");
    session.send("Hello World");
    continueConversation(session);
    session.beginDialog('/secondStep');
});


bot.dialog('/secondStep', function(session) {
    session.send("Primer step");
    endConversation(session);
});


function getConversationStep(session) {
    var conversationDialogs = [
        "/startConversation",
        "secondStep"
    ];
    
    if (!session.privateConversationData.conversationStep)
        return conversationDialogs[0];
    else
        return conversationDialogs[session.privateConversationData.conversationStep];  
};

function continueConversation(session) {
    session.privateConversationData.conversationStep = session.privateConversationData.conversationStep + 1;
}

function endConversation(session) {
    session.privateConversationData.conversationStep = 0;
    session.endDialog();
}

*/