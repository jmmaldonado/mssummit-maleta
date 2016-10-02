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


bot.dialog('/', [
    function (session) {
        /*
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Microsoft Bot Framework")
            .text("Your bots - wherever your users are talking.")
            .images([
                 builder.CardImage.create(session, "http://docs.botframework.com/images/demo_bot_image.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm the Microsoft Bot Framework demo bot for Facebook. I can show you everything you can use our Bot Builder SDK to do on Facebook.");
        */
        session.beginDialog('/principal');
    },
    function (session, results) {
        // Display menu
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);


bot.dialog('/help', [
    function (session) {
        session.endDialog("Global commands that are available anytime:\n\n* menu - Exits a demo and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What demo would you like to run?", "principal|test|(quit)");
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
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Recipient's Name")
                    .items([
                        builder.ReceiptItem.create(session, "$22.00", "EMP Museum"),
                        builder.ReceiptItem.create(session, "$22.00", "Space Needle")
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Order Number"),
                        builder.Fact.create(session, "VISA 4076", "Payment Method"),
                        builder.Fact.create(session, "WILLCALL", "Delivery Method")
                    ])
                    .tax("$4.40")
                    .total("$48.40")
            ]);
         session.endDialog(msg);
    }
]).reloadAction('reloadPrincipal', null, { matches: /^hola/i });





bot.dialog('/test', [
    
    function (session) {
        session.send("You can send a receipts for facebook using Bot Builders ReceiptCard...");
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Recipient's Name")
                    .items([
                        builder.ReceiptItem.create(session, "$22.00", "EMP Museum").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg")),
                        builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Order Number"),
                        builder.Fact.create(session, "VISA 4076", "Payment Method")
                    ])
                    .tax("$4.40")
                    .total("$48.40")
            ]);
        session.send(msg);

        session.send("Or using facebooks native attachment schema...");
        msg = new builder.Message(session)
            .sourceEvent({
                facebook: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "receipt",
                            recipient_name: "Stephane Crozatier",
                            order_number: "12345678902",
                            currency: "USD",
                            payment_method: "Visa 2345",        
                            order_url: "http://petersapparel.parseapp.com/order?order_id=123456",
                            timestamp: "1428444852", 
                            elements: [
                                {
                                    title: "Classic White T-Shirt",
                                    subtitle: "100% Soft and Luxurious Cotton",
                                    quantity: 2,
                                    price: 50,
                                    currency: "USD",
                                    image_url: "http://petersapparel.parseapp.com/img/whiteshirt.png"
                                },
                                {
                                    title: "Classic Gray T-Shirt",
                                    subtitle: "100% Soft and Luxurious Cotton",
                                    quantity: 1,
                                    price: 25,
                                    currency: "USD",
                                    image_url: "http://petersapparel.parseapp.com/img/grayshirt.png"
                                }
                            ],
                            address: {
                                street_1: "1 Hacker Way",
                                street_2: "",
                                city: "Menlo Park",
                                postal_code: "94025",
                                state: "CA",
                                country: "US"
                            },
                            summary: {
                                subtotal: 75.00,
                                shipping_cost: 4.95,
                                total_tax: 6.19,
                                total_cost: 56.14
                            },
                            adjustments: [
                                { name: "New Customer Discount", amount: 20 },
                                { name: "$10 Off Coupon", amount: 10 }
                            ]
                        }
                    }
                }
            });
            
            session.send("Or using facebooks native attachment schema...");
        
            msg = new builder.Message(session)
            .sourceEvent({
                facebook: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: "Detalles de la maleta",
                            
                                    
                                    buttons:[
                                      {
                                        "type":"web_url",
                                        "url":"www.google.com",
                                        "title":"Detalles",
                                        "webview_height_ratio": "tall"
                                      }          
                                    ]
                                 
                        }
                    }
                }
            });
            session.endDialog(msg);
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