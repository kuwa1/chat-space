$(document).on('turbolinks:load', function() { 

  
  function buildHTML(message) {
    var image = (message.image.url)? `<image src="${message.image.url}" >`:"";
    var html = `<div class="messages__chat" data-id="${message.id}" >
                  <div class="messages__chat--user">
                    ${message.user_name}
                  </div>
                  <div class="messages__chat--date">
                    ${message.time}
                  </div> 
                  <div class="messages__chat--message">
                    ${message.content}
                  </div>
                    ${image}
                </div>`;
    return html;
  }


  $("#new_message").on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data) {
      var html = buildHTML(data);
      $('.messages').append(html);
      $("form")[0].reset();
      $('.contents__input--send').prop('disabled', false);
      $(".right-messages").animate({scrollTop: $(".right-messages")[0].scrollHeight},"fast");
    })
    .fail(function() {
      alert('エラー');
      $('.contents__input--send').prop('disabled', false);
    })
  });

  var reloadMessages = function () {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      var last_message_id = $('.messages__chat:last').data('id');
      $.ajax({
        url: "api/messages",
        type: 'GET',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
        var insertHTML = '';
        messages.forEach(function(message){
          insertHTML = buildHTML(message);
          $('.messages').append(insertHTML);
          $(".right-messages").animate({scrollTop: $(".right-messages")[0].scrollHeight},"fast");
        })       
      })
      .fail(function() {
        alert("自動更新に失敗しました")
      });
    } else {
      clearInterval(reloadMessages);
    };
  }
  setInterval(reloadMessages, 5000);
});