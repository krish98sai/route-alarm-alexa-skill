var request = require("request")

const apiKey = 'AIzaSyAkVpR8LuBJeZWiJtwBFbF5Zz5wWRn5FHU'
var startLocationNumber
var startLocationStreet
var endLocationNumber
var endLocationStreet
var arrivalTimeArr
var readyTime

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        //var deviceID = event.context.System.device.deviceId
        var deviceID = ""

    if (event.session.application.applicationId !== "amzn1.ask.skill.0d6054d1-5828-42a8-9045-17f84f9d171a") {
        context.fail("Invalid Application ID");
    }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(deviceID, event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
  getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(deviceID, intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if(intentName == "getWakeUp"){
      handleWakeUpResponse(deviceID, intent, session, callback)
    } else if (intentName == "setStartLocation") {
      handleStartLocationResponse(deviceID, intent, session, callback)
    } else if (intentName == "setEndLocation") {
      handleEndLocationResponse(deviceID, intent, session, callback)
    } else if (intentName == "setArrivalTime") {
      handleArrivalTimeResponse(deviceID, intent, session, callback)
    } else if (intentName == "setReadyTime") {
      handleReadyTimeResponse(deviceID, intent, session, callback)
    } else if (intentName == "AMAZON.HelpIntent"){
      handleHelpResponse(deviceID, intent, session, callback)
    } else if (intentName == "AMAZON.CancelIntent"){
      getGoodbyeResponse(callback)
    } else if (intentName == "AMAZON.StopIntent"){
      getGoodbyeResponse(callback)
    } else if (intentName == "startOver") {
      getWelcomeResponse(callback)
    } else {
      throw "Invalid intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
  var speechOutput = "Welcome to route alarm. Please tell me where you are travelling from, by saying, I am starting from, and a street address."
  var reprompt = "Please tell me where you are travelling from, by saying, I am starting from, and a street address."
  var header = "Route Alarm"
  var shouldEndSession = false
  var sessionAttributes = {
    "speechOutput" : speechOutput,
    "repromptText" : reprompt
  }

  callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function getGoodbyeResponse(callback) {
  var speechOutput = "OK, goodbye!"
  var reprompt = "Goodbye."
  var header = "Route Alarm"
  var shouldEndSession = true
  var sessionAttributes = {
    "speechOutput" : speechOutput,
    "repromptText" : reprompt
  }

  callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function handleHelpResponse(deviceID, intent, session, callback){
  var speechOutput = "You can start by telling me what street address you are starting from."
  var reprompt = "Please tell me where you are travelling from, by saying, I am starting from, and a street address."
  var header = "Route Alarm"
  var shouldEndSession = false
  var sessionAttributes = {
    "speechOutput" : speechOutput,
    "repromptText" : reprompt
  }

  callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function handleStartLocationResponse(deviceID, intent, session, callback){
  if(intent.slots.StartLocationNumber.value && intent.slots.StartLocationStreet.value){
    startLocationNumber = intent.slots.StartLocationNumber.value
    startLocationStreet = intent.slots.StartLocationStreet.value.replace(/ /g, "+")
    console.log(startLocationNumber + " " + startLocationStreet)
  }
  else{
    getWelcomeResponse(callback)
  }
  var speechOutput = "Great! Please tell me where you are travelling to, by saying, I am going to, and a street address."
  var reprompt = "Please tell me where you are travelling to, by saying, I am going to, and a street address."
  var header = "Route Alarm"
  var shouldEndSession = false
  var sessionAttributes = {
    "speechOutput" : speechOutput,
    "repromptText" : reprompt
  }

  callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function handleEndLocationResponse(deviceID, intent, session, callback){
  if(intent.slots.EndLocationNumber.value && intent.slots.EndLocationStreet.value){
    endLocationNumber = intent.slots.EndLocationNumber.value
    endLocationStreet = intent.slots.EndLocationStreet.value.replace(/ /g, "+")
  }
  else{
    getWelcomeResponse(callback)
  }
  var speechOutput = "Awesome! What time do you need to get there?"
  var reprompt = "Please tell me what time you need to get there, by saying, I need to get there by, and a time"
  var header = "Route Alarm"
  var shouldEndSession = false
  var sessionAttributes = {
    "speechOutput" : speechOutput,
    "repromptText" : reprompt
  }

  callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function handleArrivalTimeResponse(deviceID, intent, session, callback){
  if(intent.slots.ArrivalTime.value){
    arrivalTimeArr = intent.slots.ArrivalTime.value.split(":")
  }
  else{
    getWelcomeResponse(callback)
  }
  var speechOutput = "Wonderful! How many minutes do you need to get ready?"
  var reprompt = "Please tell me how many minutes you need, by saying, I need, a number, minutes"
  var header = "Route Alarm"
  var shouldEndSession = false
  var sessionAttributes = {
    "speechOutput" : speechOutput,
    "repromptText" : reprompt
  }

  callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function handleReadyTimeResponse(deviceID, intent, session, callback){
  if(intent.slots.ReadyTime.value){
    readyTime = intent.slots.ReadyTime.value*60
  }
  else{
    readyTime = 0
  }

  var tomorrow = new Date()
  var finalDate = new Date(0)
  tomorrow.setDate((new Date()).getDate()+1)
  tomorrow.setHours(0,0,0,0)
  var arrivalTimeSec = (tomorrow.getTime()/1000) + (parseInt(arrivalTimeArr[0])*60*60)+(parseInt(arrivalTimeArr[1])*60)
  console.log("Arrival time in seconds: " + arrivalTimeSec)

  var speechOutput = "ERROR"

  getJSON(finalDate, startLocationNumber, startLocationStreet, endLocationNumber, endLocationStreet, arrivalTimeSec, readyTime, apiKey, function(data){
    if(data != "ERROR") {
      speechOutput = data
      callback(sessionAttributes, buildSpeechletResponse("Route Alarm", speechOutput, speechOutput, true))
    }
  })
    var reprompt = speechOutput
    var header = "Route Alarm"
    var shouldEndSession = true
    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }
  //callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function handleWakeUpResponse(deviceID, intent, session, callback){
  getWelcomeResponse(callback)
}

function url(startLocationNumber, startLocationStreet, endLocationNumber, endLocationStreet, arrivalTimeSec, apiKey){
  return 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + startLocationNumber + '+' + startLocationStreet + '&destinations=' + endLocationNumber + '+' + endLocationStreet + '&arrival_time=' + arrivalTimeSec + '&key=' + apiKey
}

function getJSON(finalDate, startLocationNumber, startLocationStreet, endLocationNumber, endLocationStreet, arrivalTimeSec, readyTime, apiKey, callback){
  console.log(url(startLocationNumber, startLocationStreet, endLocationNumber, endLocationStreet, arrivalTimeSec, apiKey))
  request.get(url(startLocationNumber, startLocationStreet, endLocationNumber, endLocationStreet, arrivalTimeSec, apiKey), function(error, response, body){
    var obj2 = JSON.parse(body);
    console.log(parseInt(obj2.rows[0].elements[0].duration.value))
    console.log("UTC sec to set: " + (arrivalTimeSec - parseInt(obj2.rows[0].elements[0].duration.value) - readyTime))
    finalDate.setUTCSeconds(arrivalTimeSec - parseInt(obj2.rows[0].elements[0].duration.value) - readyTime);
    var hours = finalDate.toString().split(" ")[4].split(":")[0]
    var minutes = finalDate.toString().split(" ")[4].split(":")[1]
    var suffix = (hours >= 12)? 'pm' : 'am';
    hours = (hours > 12)? hours -12 : hours
    console.log("You should set your alarm to " + hours + " " + minutes + " " + suffix)
    callback("You should set your alarm to " + hours + " " + minutes + " " + suffix)
  })
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
      }

}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
  }
