window.onload = function () {
    listenEntrantBtn();
    listenModalBody();
};
function getElement(selector) {
	return document.querySelector(selector);
}
function listenEntrantBtn() {
	const elements = document.querySelectorAll('.sign-up-wrapper');
	elements.forEach(element => {
		element.addEventListener('click', fireEntrantModalHacker);
		});
}

function fireEntrantModalHacker(event) {
	listenEntrantSubmit();
	listentModalWrap();
	addHackers();
	const element = getElement('.entrants-modal-wrap');
	if (getComputedStyle(element, null).display === 'none') {
		element.style.display = 'grid';
	}
}

function addHackers(){
	const modalHeader = getElement('.modal-header-top-line');
	const currentCity = document.getElementById("currentCity");
	modalHeader.innerHTML = "<h1>Реєстрація на Prof IT Day</h1>";
	if(!(getElement('#specialization'))){
		const modalForm = getElement('#entrant_form');
		let specInput = document.createElement('input');
		specInput.setAttribute('type', 'hidden');
		specInput.setAttribute('id', 'specialization');
		specInput.setAttribute('name', 'specializations_8');
		specInput.setAttribute('value', 8);
		modalForm.appendChild(specInput);
		console.log(specInput.value);
		// newValue = currentCity.innerHTML;
		// specInput = this.value;
		// specInput.value = this.currentCity.innerHTML;
		// console.dir(newValue);
		// console.dir(currentCity.innerHTML);
	}else{
		let specInput = getElement('#specialization');
		specInput.setAttribute('name', 'specializations_8');
		specInput.setAttribute('value', 8);
	}
}

function onSubmit(event) {
	event.preventDefault();
	grecaptcha.ready(function() {
		grecaptcha.execute('6LcwRRUaAAAAADavxcmw5ShOEUt1xMBmRAcPf6QP', {action:'submit'}).then(function(token) {
		  	const formElement = getElement('#entrant_form');
			if (formElement.checkValidity()) {
				const actionUrl = 'https://intita.com/api/v1/entrant';
				const entrantFormData  = new FormData(formElement);
				entrantFormData.append('g-recaptcha-response', token);
				const http = new XMLHttpRequest();
				http.open('POST', actionUrl, true);
				http.onreadystatechange = function() {
					if(+http.readyState === 4 && +http.status === 201) {
				        entrantSubmitResponse();
				    } else if (+http.status === 400) {
				    	entrantSubmitResponse('Помилка сервера. Зробіть ще одну спробу');
				    }
				}
				http.onload = function() {
					if (+http.status !== 201) {
				    	entrantSubmitResponse('Помилка сервера. Зробіть ще одну спробу');
				    	return;
				  	}
				  	entrantSubmitResponse();
				}
				http.send(entrantFormData);
			} else {
				let index = 0;
				for(let el of formElement.elements) {
					const attrName = el.getAttribute('name');
					if (['first_name', 'last_name', 'email', 'phone', 'city'].includes(attrName)) {
						if (el.value) {
							el.classList.remove('input-error');
						} else {
							el.classList.add('input-error');
							if (index === 0) {el.scrollIntoView()}
							index++;
						}
					}
				}
				
			}
		});
	});
}

function entrantSubmitResponse(errorStr = 'Ваша анкета успішно відправлена') {
	const element = getElement('.entrants-modal-wrap');
	element.click();
	const elementResponse = getElement('#entrants_response');
	if (getComputedStyle(elementResponse, null).display === 'none') {
		const elementOkBtn = getElement('.ok-btn');
		elementOkBtn.addEventListener('click', closeResponseModalFire);
		if (errorStr) {
			const elementAnketeText = getElement('.ankete-text');
			elementAnketeText.innerText = errorStr;
		}
		elementResponse.style.display = 'grid';
	}
	scroll(0,0);
}

function listentModalWrap() {
	const element = getElement('.entrants-modal-wrap');
	element.addEventListener('click', closeModalFire);
}

function listenModalBody() {
	const element = getElement('.entrants-modal');
	element.addEventListener('click', modalBodyPropagation);
}

function modalBodyPropagation(event) {
	event.stopPropagation();
}

function closeModalFire(event) {
	if (getComputedStyle(event.target, null).display === 'grid') {
		event.target.style.display = 'none';
		$('#entrant_form')[0].reset();
	}
}

function closeResponseModalFire(event) {
	const elementResponse = getElement('#entrants_response');
	elementResponse.style.display = 'none';
}

function listenEntrantSubmit() {
	const element = getElement('input[type="submit"]');
	element.addEventListener('click', onSubmit);
}
