let ChatEngine = ChatEngineCore.create({
  publishKey: 'pub-c-07f27b10-b5e1-4138-96a0-98dfd040917c',
  subscribeKey: 'sub-c-cc46cbd4-05c6-11e8-ae9e-5e6907e82dc9'
});

const getUsername = () => {
  const animals = ['zebra', 'goat', 'cow', 'pig', 'tiger', 'wolf', 'pony', 'antelope'];
  return animals[Math.floor(Math.random() * animals.length)];
};

const getColor = () => {
  const colors =   ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Teal"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const appendMessage = (username, text) => {

  let message =
    $(`<div class="list-group-item" />`)
      .append($('<strong>').text(username + ': '))
      .append($('<span>').text(text));

  $('#log').append(message);
  $("#log").animate({ scrollTop: $('#log').prop("scrollHeight") }, "slow");
};

let me = ChatEngine.connect(getUsername(), {color: getColor()});

ChatEngine.on('$.ready', (data) => {

    let me = data.me;

    let chat = new ChatEngine.Chat('new-chat');

    chat.on('$.connected', (payload) => {
      appendMessage(me.uuid , 'Connected to chat!');
    });

    chat.on('$.online.here', (payload) => {
      appendMessage('Status', payload.user.uuid + ' is in the channel! Their color is ' + payload.user.state.color + '.');
    });

    chat.on('$.online.join', (payload) => {
      appendMessage('Status', payload.user.uuid + ' has come online! Their color is ' + payload.user.state.color + '.');
    });

    chat.on('message', (payload) => {
      appendMessage(payload.sender.uuid, payload.data.text);
    });

    $("#message").keypress(function(event) {
      if (event.which == 13) {
          chat.emit('message', {
                  text: $('#message').val()
          });
          $("#message").val('');
          event.preventDefault();
      }
    });

});
