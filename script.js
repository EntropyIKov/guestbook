'use strict';

const fs = 'filesaver.php';

window.onload = function() {
	var inputName	= $('.Guestbook .CommentInput .input-name')[0];
	var inputMsg	= $('.Guestbook .CommentInput .input-text')[0];
	var submitBtn	= $('.Guestbook .CommentInput .input-submit')[0];
	var recordList	= $('.RecordsContent')[0];

	// Loading records
	var loadAllRecords = function() {
		fetch(fs, {method: 'GET'})
		.then(function(response){
			return response.json();
		})
		.then(function(json){
			if(json['status'] === 200){
				if(json['html']) {
					json['html'].forEach((record) => {
						recordList.innerHTML = record + recordList.innerHTML;
					});
				} else {
					recordList.innerHTML = "<li class='empty-list'>There are no records</li>";
				}
			}
			if(json['status'] === 400) {
				alert('Sorry, server is not available now');
			}
		});
	}();


	// Event listeners
	var submit = function(ex) {
		if(inputName.value && inputMsg.value) {
			let form = new FormData();
			form.append('user', inputName.value);
			form.append('msg', inputMsg.value);
			var promise = fetch(fs, {
				method: 'POST',
				body: form
			})
			.then(function(response){
				return response.json();
			})
			.then(function(json){
				if(json['status'] === 200){ 
					let empty = $('.empty-list')[0];
					if(empty) empty.remove();

					recordList.innerHTML = json['html'][0] + recordList.innerHTML;
					inputMsg.value = '';
					inputName.value = '';
					$('.RecordsContent')[0].scrollTop = 0;
				}
				if(json['status'] === 400) {
					alert('Sorry, server is not available now');
				}
			});
		}
	}

	submitBtn.addEventListener('click', submit);
	inputMsg.addEventListener('keypress', function(e){
		var key = e.which || e.keyCode;
		if (key === 13) { 
			if(!e.shiftKey) {
				submit(e);
			}
		}
	})


}


function $(exp){
	return document.querySelectorAll(exp);
}