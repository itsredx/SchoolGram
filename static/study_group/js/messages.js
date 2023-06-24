$(document).ready(function () {
  let inputMessage = $('#input-message');
  let messageBody = $('.msg_card_body');
  let sendMessageForm = $('#send-message-form');
  const userId = $('#logged-in-user').val();

  let loc = window.location;
  let wsStart = 'ws://';

  if (loc.protocol === 'https:') {
    wsStart = 'wss://';
  }

  let endpoint = wsStart + loc.host + loc.pathname;

  var socket = new WebSocket(endpoint);

  socket.onopen = function (e) {
    console.log('WebSocket connection established.');
    sendMessageForm.on('submit', function (e) {
      e.preventDefault();
      let message = inputMessage.val();
      let sendTo = getActiveOtherUserId();
      let threadId = getActiveThreadId();

      let data = {
        message: message,
        sent_by: userId,
        send_to: sendTo,
        thread_id: threadId
      };

      data = JSON.stringify(data);
      socket.send(data);
      sendMessageForm[0].reset();
    });
  };

  socket.onmessage = function (e) {
    console.log('WebSocket message received:', e);
    let data = JSON.parse(e.data);
    let message = data.message;
    let sentById = data.sent_by;
    let threadId = data.thread_id;
    newMessage(message, sentById, threadId);
  };

  socket.onerror = function (e) {
    console.log('WebSocket error:', e);
  };

  socket.onclose = function (e) {
    console.log('WebSocket connection closed:', e);
  };

  function newMessage(message, sentById, threadId) {
    if ($.trim(message) === '') {
      return false;
    }

    let messageElement;
    let chatId = 'chat_' + threadId;

    if (sentById === userId) {
      messageElement = `
        <div class="d-flex mb-4 replied">
          <div class="msg_cotainer_send">
            ${message}
            <span class="msg_time_send">8:55 AM, Today</span>
          </div>
          <div class="img_cont_msg">
            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBgaGBcXFxgXFxgdFxcXHRcXGhcYHSggGBolHRYVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGyslHyUtLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAECBwj/xABBEAABAwIDBAgFAgQDCAMAAAABAAIRAyEEEjEFQVFhBhMicYGRobEyUsHR8ELhBxQjcjOS8RUWNENigqKyU3OE/8QAGgEAAgMBAQAAAAAAAAAAAAAAAAECAwQFBv/EACkRAAICAgEDBAIBBQAAAAAAAAABAhEDIRIEMUEFEyJRMjNhFCNxgeH/2gAMAwEAAhEDEQA/APTNFyK00S4QVU0lKQFAoUAQRr7igO3F9b2t6uOSXFwBxkeoFfY4rRJ7QD/2Q==">
          </div>
        </div>`;
    } else {
      messageElement = `
        <div class="d-flex mb-4">
          <div class="img_cont_msg">
            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBgaGBcXFxgXFxgdFxcXHRcXGhcYHSggGBolHRYVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGyslHyUtLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAECBwj/xABBEAABAwIDBAgFAgQDCAMAAAABAAIRAyEEEjEFQVFhBhMicYGRobEyUsHR8ELhBxQjcjOS8RUWNENigqKyU3OE/8QAGgEAAgMBAQAAAAAAAAAAAAAAAAECAwQFBv/EACkRAAICAgEDBAIBBQAAAAAAAAABAhEDIRIEMUEFEyJRMjNhFCNxgeH/2gAMAwEAAhEDEQA/APTNFyK00S4QVU0lKQFAoUAQRr7igO3F9b2t6uOSXFwBxkeoFfY4rRJ7QD/2Q==">
          </div>
          <div class="msg_cotainer">
            ${message}
            <span class="msg_time">8:40 AM, Today</span>
          </div>
        </div>`;
    }

    $(`#${chatId}`).append(messageElement);
    messageBody.scrollTop(messageBody[0].scrollHeight);
  }

  function getActiveOtherUserId() {
    // Return the active user's ID to whom the message will be sent
    return 'other-user-id';
  }

  function getActiveThreadId() {
    // Return the active thread ID
    return 'thread-id';
  }
});
