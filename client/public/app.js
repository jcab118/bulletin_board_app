$(document).ready(function() {
	$('#orum').on('submit', function(e) {
		e.preventDefault();

var feedBackObj ={
	name: $('#name_input').val
	feedBack: $('#feedBack_input').val

};
console.log(feedBackObj);
console.log(JSON.stringify(feedBackObj));

	$.ajax({
		method:'Post'
		url:'/feedBack'
		dataType: JSON.stringify(feedBackObj),
		contentType: 'application/json'
	}).then(function(resAddFeedBack){
		if(resAddFeedBack === "invaid"){
		alert("Please Enter Feedback...Thank you");
		}
		appendBulletinExpress();
	});
	$('name_input').val("");
	$('feedBack_input').val("");
});

	function appendBulletinExpress(){
		$('#primaryDiv').remove();
		$.ajax({
			method:'GET',
			url:'/feedBack',
		}).then(function(feedBack){
			var primaryDiv = $('<div id="primaryDiv">');
			var clientDiv = xButton, name, feedback; 
			feedBack.rows.sort(function(a, b){
				return a.id - b.id;
			});
			for(var i = 0 ; i < feedBack.rows.length; i++){
				clientDiv=$('<div class = "client_div">');
				xButton=$('<button class ="x_button" data_id=' + feedBack.rows[i].id + '>');
				xButton.text("X");
				name=$('<p class="name">');
				feedback=$('<p class="feedBack" data_id=' + quotes.rows[i].id + '>');
				name.text("Name" + feedBack.rows[i].feedBack);
				clientDiv.append(xButton).append(name).append(feedback);
				primaryDiv.append(clientDiv);
			}
			$('#initial').append(primaryDiv);
		});
	}
		appendBulletinExpress();

	$(document).on('click', '.x-button', function() {
		$.ajax({
			method: 'DELETE',
			url: '/delete_feedBack/' + $(this).data('id'),
		});
		appendBulletinExpress(); 

	$(document).on('click', '.quote', function() {
		$('#modal-input-div').remove(); 
		var feedBackId = $(this).data('id');
		$('#update-quote-modal').modal();

		var inputDiv = $('<div id="modal-input-div">');

		$.ajax({
			method: 'GET', 
			url: '/feedBack',
		}).then(function(feedBack) {
	
			for (var i = 0; i < feedBack.rows.length; i++) {
				if (feedBack.rows[i].id === feedBackId) {

					var textInput = $("<textarea id='feedBack-update-input'>");
					inputDiv.append(textInput);
				}
			}
			var submitButton = $('<button>');
			submitButton.addClass('btn btn-info enter-button');
			submitButton.attr('data-id', feedBackId);
			submitButton.text("Enter");
			inputDiv.append("<br>").append(submitButton);
		});
		$('.modal-body').append(inputDiv);
	});

	$(document).on('click', '.enter-button', function() {
		var updatedfeedBack = $("#feedBack-update-input").val();

		if (updatedfeedBack !== "") {
			$.ajax({
				method: 'PUT',
				url: '/updatedfeedBack/' + $(this).data('id'),
				data: { feedBack: updatedfeedBack },
			}).then(function(feedBackUpdate) {
				appendBulletinExpress();
				$('#update-feedBack-modal').modal('toggle');
			});
		} else {
			alert ('Please Enter Correct Information');
		}
	});
});