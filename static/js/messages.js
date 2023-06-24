let input_message = $('#input-message')
let message_body = $('.msg_card_body')
let send_message_form = $('#send-message-form')
const USER_ID = $('#logged-in-user').val()

let firstPersonPictureUrl; // Declare as global variable
let secondPersonPictureUrl; // Declare as global variable
let secondPersonId;
let firstPersonId;

const currentTime = new Date();
const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
const formattedTime = currentTime.toLocaleTimeString([], timeOptions);
const numericDay = currentTime.getDate();
const abbreviatedWeekday = currentTime.toLocaleDateString([], { weekday: 'short' });
const formattedDate = `${numericDay} ${abbreviatedWeekday}`;const formattedDateTime = `${formattedDate}, ${formattedTime}`;

let loc = window.location
let wsStart = 'ws://'

if(loc.protocol === 'https') {
    wsStart = 'wss://'
}
let endpoint = wsStart + loc.host + loc.pathname

var socket = new WebSocket(endpoint)

socket.onopen = async function(e){
    console.log('open', e)
    send_message_form.on('submit', function (e){
        e.preventDefault()
        let message = input_message.val()
        let send_to = get_active_other_user_id()
        let thread_id = get_active_thread_id()

        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to,
            'thread_id': thread_id
        }
        data = JSON.stringify(data)
        socket.send(data)
        $(this)[0].reset()
    })
}

socket.onmessage = async function(e){
    console.log('message', e)
    let data = JSON.parse(e.data)
    let message = data['message']
    let sent_by_id = data['sent_by']
    let thread_id = data['thread_id']
    newMessage(message, sent_by_id, thread_id)
}

socket.onerror = async function(e){
    console.log('error', e)
}

socket.onclose = async function(e){
    console.log('close', e)
}


function newMessage(message, sent_by_id, thread_id) {
	if ($.trim(message) === '') {
		return false;
	}
	let message_element;
	let chat_id = 'chat_' + thread_id
	if(sent_by_id == USER_ID){
    let imgSrc = "";

    if (firstPersonId == USER_ID) {
      imgSrc = firstPersonPictureUrl;
    } else if (secondPersonId == USER_ID) {
      imgSrc = secondPersonPictureUrl;
    }
    
	    message_element = `
			<div class="d-flex mb-4 replied">
				<div class="msg_cotainer_send">
					${message}
					<span class="msg_time_send" style="width: max-content;">${formattedDateTime}</span>
				</div>
				<div class="img_cont_msg">
					<img src="${imgSrc}" class="rounded-circle user_img_msg">
				</div>
			</div>
	    `
    }
	else{
    if (firstPersonId == USER_ID) {
      reciverImgSrc = secondPersonPictureUrl;
    } else if (secondPersonId == USER_ID) {
      reciverImgSrc = firstPersonPictureUrl;
    }
	    message_element = `
           <div class="d-flex mb-4 received">
              <div class="img_cont_msg">
                 <img src="${reciverImgSrc}" class="rounded-circle user_img_msg">
              </div>
              <div class="msg_cotainer">
                 ${message}
              <span class="msg_time" style="width: max-content;">${formattedDateTime}</span>
              </div>
           </div>
        `

    }

    let message_body = $('.messages-wrapper[chat-id="' + chat_id + '"] .msg_card_body')
	message_body.append($(message_element))
    /*message_body.animate({
        scrollTop: $(document).height()
    }, 100);*/
    message_body.scrollTop(message_body[0].scrollHeight);
	input_message.val(null);
}


$('.contact-li').on('click', function (){
    $('.contacts .actiive').removeClass('active')
    $(this).addClass('active')

    // message wrappers
    let chat_id = $(this).attr('chat-id')
    $('.messages-wrapper.is_active').removeClass('is_active')
    $('.messages-wrapper[chat-id="' + chat_id +'"]').addClass('is_active')

    let message_body = $('.messages-wrapper.is_active .msg_card_body');
    message_body.scrollTop(message_body[0].scrollHeight);

})

function get_active_other_user_id(){
    let other_user_id = $('.messages-wrapper.is_active').attr('other-user-id')
    other_user_id = $.trim(other_user_id)
    return other_user_id
}

function get_active_thread_id(){
    let chat_id = $('.messages-wrapper.is_active').attr('chat-id')
    let thread_id = chat_id.replace('chat_', '')
    return thread_id
}


var threadId = get_active_thread_id();

$.ajax({
  url: 'http://localhost:8000/chat/get_picture_url/' + threadId + '/',
  method: 'GET',
  success: function(response) {
    firstPersonPictureUrl = response.first_person_picture_url;
    secondPersonPictureUrl = response.second_person_picture_url; 
    secondPersonId = response.second_person_id;
    firstPersonId = response.first_person_id;

    console.log(response); // Optional: Verify the response
  
    var messages = JSON.parse(response.messages); // Parse the messages array
  
    // Iterate over the messages array
    //messages.forEach(function(message) {
      //var messageText = message.fields.message;
      // Display the message text on the web page
      // Replace this with your logic to append the message text to the chat container
      //console.log(messageText);
      //updateMessageDisplay(messageText, message.fields.sent_by, threadId);
    //});
  
  },
  
  error: function () {
    console.log('Error retrieving picture URL');
  }
});



$(document).ready(function() {
  // Scroll to the last message in the active chat
  var activeChatBody = $('.messages-wrapper.is_active .msg_card_body');
  activeChatBody.scrollTop(activeChatBody[0].scrollHeight);
});





