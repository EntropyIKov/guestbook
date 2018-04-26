'use strict';

const fs = 'filesaver.php';

window.onload = function() {
	var inputName	= $('.guestbook__name');
	var inputMsg	= $('.guestbook__message');
	var submitBtn	= $('.guestbook__submit');
	var recordList	= $('.guestbook__content');


	function addRecord(record) {
		recordList.prepend("\
			<div class='guestbook__record'>\
				<div>\
					<span class='guestbook__record-user'>" + record.user + "</span>\
			 		<span class='guestbook__record-msg'>" + record.msg + "</span>\
				</div>\
			 	<span class='guestbook__record-date' server-time='" + record.time + "'>" + record.date + "</span>\
			</div>");
	}

	// Loading records
	var loadAllRecords = function() {
		fetch(fs, {method: 'GET'})
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			if(json['status'] === 200){
				if(json['response']) {
					json['response'].forEach((record) => {
						addRecord(record);
					});
				} else {
					recordList.append("<div class='guestbook__record_empty'>There are no records</div>");
				}
			}
			if(json['status'] === 400) {
				alert(json['error']);
				recordList.append("<div class='guestbook__record_empty'>There are no records</div>");
			}
		});
	}();


	// Event listeners
	var submit = function(ex) {
		if(inputName.val() && inputMsg.val()) {
			let form = new FormData();
			form.append('user', inputName.val());
			form.append('msg', inputMsg.val());
			var promise = fetch(fs, {
				method: 'POST',
				body: form
			})
			.then(function(response){
				return response.json();
			})
			.then(function(json){
				if(json['status'] === 200){ 
					$('.guestbook__record_empty').remove();
					addRecord(json['response']);
					inputMsg.val('');
					inputName.val('');
					$('.guestbook__content').scrollTop();
				}
				if(json['status'] === 400) {
					alert(json['error']);
				}
			});
		}
	}

	$('.guestbook').on('click', '.guestbook__submit', submit);
	$('.guestbook').on('keypress', '.guestbook__message', function(e) {
		var key = e.which || e.keyCode;
		if (key === 13) { 
			if(!e.shiftKey) {
				submit(e);
			}
		}
	});
	$('.guestbook').on('keypress', '.guestbook__name', function(e) {
		var key = e.which || e.keyCode;
		if (key === 13) { 
			submit(e);
		}
	});
}