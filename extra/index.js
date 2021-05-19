var dialogElem = document.getElementById('dialog');
var dialogBoxElem = document.getElementById('dialog-box');
var talkBtnElem = document.getElementById('talk_btn');
var timer, counter;
var message = [];
var messageDelay = 3000;
var topicDelay = 2*30000;
var variables = {
    player: 'Darling'
};
var talk = true;
var conversation_start = true;
var first_conversation = false;

function toggleTalk() {
  if (talk === false) {
      setTimeout(loadConversation, 2000);
      talk = true;
      talkBtnElem.innerHTML = 'Disable Talk';
  } else {
      clearText();
      dialogBoxElem.style.opacity = 0;
      talk = false;
      talkBtnElem.innerHTML = 'Enable Talk';
  }
}

function fillVariables(text) {
  return text.replace(/\[.+\]/g, str => `${variables[str.slice(1,-1)]}`)
}

function animateText(text) {
  counter = 1;
  timer = setInterval(() => loadText(text), 30);
}


function loadText(text) {
  dialogElem.innerText = text.substring(0, counter);
  if (counter >= text.length) {
      clearInterval(timer);
  } else {
      counter++;
  }
}

function clearText() {
  clearInterval(timer);
  dialogElem.innerHTML = "";
};

function onSkip() {
  if (talk !== true) {
      return;
  }
  clearText();
  if (message.length) {
      if (dialogBoxElem.style.opacity !== "1") {
         dialogBoxElem.style.opacity = 1;
      }
      var text = fillVariables(message.shift());
      animateText(text);
  } else {
      dialogBoxElem.style.opacity = 0;
  }
}


document.addEventListener('keypress', onSkip);
document.getElementsByTagName('body')[0].addEventListener('click', onSkip);

function getRandomNumber(low, high) {
  return low + Math.floor(Math.random()*high);
}

function rotateMessages() {
  if (message.length) {
      onSkip();
      setTimeout(rotateMessages, messageDelay);
  } else {
      onSkip();
      setTimeout(loadConversation, topicDelay);
  }
}

function isNewUser() {
  if (typeof(Storage) !== "undefined") {
      // Code for localStorage/sessionStorage.
      if (localStorage.getItem("monika.chr")) {
          return false;
      } else {
          localStorage.setItem('monika.chr','Dont delete my file');
          return true;
      }
  } else {
      // Sorry! No Web Storage support..
      return true;
  }
}

function loadConversation() {
  if (talk !== true) {
      return;
  }
  var topicsList,topic;
  if (conversation_start) {
      conversation_start = false;
      if (first_conversation) {
        first_conversation = false;
        message = intro_conversation;
        rotateMessages();
      } else {
        // load a starter
        var topicsList = Object.keys(conversation_starters);
        topic = topicsList[getRandomNumber(0,topicsList.length)];
        message = conversation_starters[topic];
        rotateMessages();
      }
  } else {
      // load random topic
      topicsList = Object.keys(topics);
      topic = topicsList[getRandomNumber(0,topicsList.length)];
      message = topics[topic];
      rotateMessages();
  }
}

(function() {
  // setTimeout(loadConversation, 2000);
})();

function doFullScreen() {
  console.log('request full screen');
  setTimeout(() => requestFullScreen(document.body), 100);
}

function cancelFullScreen(el) {
  var requestMethod = el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen;
  if (requestMethod) { // cancel full screen.
      requestMethod.call(el);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
          wscript.SendKeys("{F11}");
      }
  }
}

function requestFullScreen(el) {
  // Supports most browsers and their versions.
  var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

  if (requestMethod) { // Native full screen.
      requestMethod.call(el);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
          wscript.SendKeys("{F11}");
      }
  }
  return false;
}

function toggleFull() {
  var elem = document.body; // Make the body go full screen.
  var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);

  if (isInFullScreen) {
      cancelFullScreen(document);
  } else {
      requestFullScreen(elem);
  }
  return false;
}

function onIframe() {
  // console.log(window.parent.app.SSEvents.close());
}

document.addEventListener('keydown', onIframe, false);

// listen for mousemove events
document.addEventListener('mousemove', onIframe, false);

// listen for mouse click events
document.addEventListener('click', onIframe, false);

function getQueryParams() {
  var queryString = {};
  if (window.location.search.split('?').length > 1) {
    var params = window.location.search.split('?')[1].split('&');
    for (var i = 0; i < params.length; i++) {
        var key = params[i].split('=')[0];
        var value = decodeURIComponent(params[i].split('=')[1]);
        queryString[key] = value;
    }
  }
  console.log(queryString);
  // alert(queryString.toString());
  console.log(queryString['sound']);
  if (queryString['sound'] === '1') {
    console.log('add sound');
    var div = document.createElement('div');
    div.innerHTML = '<audio loop autoplay><source src="./audio/m1.ogg" type="audio/ogg"><source src="./audio/m1.mp3" type="audio/mpeg"></audio>';
    document.body.appendChild(div);
  }
  if (queryString['player']) {
    variables.player = queryString.player;
  }
  if (queryString['message_delay'] && queryString['message_delay'] > 0) {
    messageDelay = parseInt(queryString['message_delay']) * 1000;
  }
  if (queryString['topic_delay'] && queryString['topic_delay'] > 0) {
    topicDelay = queryString['topic_delay'];
  }
  if (queryString['first'] === '1') {
    first_conversation = true;
  }
  if (queryString['conversation'] === '1') {
    setTimeout(loadConversation, messageDelay);
  }
  if (queryString['blinking'] === '1') {
    document.getElementsByClassName('bg')[0].classList.add('blink');
  }
  console.log(queryString, messageDelay, topicDelay);
}

getQueryParams();