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
server.post('/api/messages', connector.listen());



//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    if (!session.conversationStep | session.conversationStep == 0) {
        console.debug("conversationStep: " + session.conversationStep);
        session.send("Hello World");
        session.conversationStep = 1;
        console.debug("conversationStep: " + session.conversationStep);
    }
    else {
        session.beginDialog('/1');
    }
    
});


bot.dialog('/1', function(Session) {
    console.debug("conversationStep: " + session.conversationStep);
    session.send("Primer step");
    console.debug("conversationStep: " + session.conversationStep);
});