document.addEventListener('DOMContentLoaded', e => {
	[...document.getElementsByClassName('add-button')].forEach(btn => {
		btn.addEventListener('click', function(e) {
			e.preventDefault()
			this.className = 'btn-floating waves-effect waves-light teal accent-4 right'
			$(this).find('i:first').text('check')
			console.log('GOT HERE; MAKING CALL ')
			// fetch or ajax
			$.ajax({
				url: 'https://beer-savor.herokuapp.com/breweries/' + this.getAttribute('data-id'),
				method: 'POST',
				data: {
					breweryApiId: this.getAttribute('data-brewery-id'), 
			      	breweryName: this.getAttribute('data-brewery-name'), 
			      	established: this.getAttribute('data-brewery-established'),  
			      	breweryImageUrl: this.getAttribute('data-brewery-imageUrl'), 
			      	long: this.getAttribute('data-brewery-long'), 
			      	lat: this.getAttribute('data-brewery-lat'), 
			      	website: this.getAttribute('data-brewery-website'), 
			      	description: this.getAttribute('data-brewery-description'),  
			      	isInBusiness: this.getAttribute('data-brewery-isInBusiness'), 
			      	status: this.getAttribute('data-brewery-status'), 
					apiId: this.getAttribute('data-beer-apiId'),
					name: this.getAttribute('data-beer-name'),
					style: this.getAttribute('data-beer-style'),
					imageUrl: this.getAttribute('data-beer-image'),
					ibu: this.getAttribute('data-beer-ibu'),
					abv: this.getAttribute('data-beer-abv'),
					availability: this.getAttribute('data-beer-availability')
				}
			})
			.success(res => {
				console.log('success', res)
			})
			.fail(err => {
				console.log('fail', err)
				// if response status is 401 then 
				location.href = '/auth/login'
			})
		})
	})
	if (document.getElementById('add-brewery')) {
		document.getElementById('add-brewery').addEventListener('click', function(e) {
			e.preventDefault()
			this.className = 'btn-floating halfway-fab waves-effect waves-light teal accent-4 right'
			$(this).find('i:first').text('check')
			// fetch or ajax
			$.ajax({
				url: 'https://beer-savor.herokuapp.com/breweries/' + this.getAttribute('data-id'),
				method: 'POST',
				data: {
					breweryApiId: this.getAttribute('data-brewery-id'), 
			      	breweryName: this.getAttribute('data-brewery-name'), 
			      	established: this.getAttribute('data-brewery-established'),  
			      	breweryImageUrl: this.getAttribute('data-brewery-imageUrl'), 
			      	long: this.getAttribute('data-brewery-long'), 
			      	lat: this.getAttribute('data-brewery-lat'), 
			      	website: this.getAttribute('data-brewery-website'), 
			      	description: this.getAttribute('data-brewery-description'),  
			      	isInBusiness: this.getAttribute('data-brewery-isInBusiness'), 
			      	status: this.getAttribute('data-brewery-status')
				}
			})
			.success(res => {
				console.log('success', res)
			})
			.fail(err => {
				console.log('fail', err)
				// if response status is 401 then 
				location.href = '/auth/login'
			})
		})
	}
	[...document.getElementsByClassName('remove-beer')].forEach(btn => { 
		btn.addEventListener('click', function(e) {
			e.preventDefault()
			this.parentNode.className = 'pink-text lighten-1 center-align'
			this.parentNode.textContent = 'REMOVED FROM SAVED BEERS'
			// fetch or ajax
			$.ajax({
				url: 'https://beer-savor.herokuapp.com/profile/beers/',
				method: 'DELETE',
				data: {
					id: this.getAttribute('data-beer-id')
				}
			})
			.success(res => {
				console.log('success', res)
			})
			.fail(err => {
				console.log('fail', err)
				// if response status is 401 then 
				// location.href = '/auth/login'
			})
		})
	});
	[...document.getElementsByClassName('remove-brewery')].forEach(btn => { 
		btn.addEventListener('click', function(e) {
			e.preventDefault()
			this.parentNode.className = 'pink-text lighten-1 center-align'
			this.parentNode.textContent = 'REMOVED FROM SAVED BREWERIES'
			// fetch or ajax
			$.ajax({
				url: 'https://beer-savor.herokuapp.com/profile/breweries/',
				method: 'DELETE',
				data: {
					id: this.getAttribute('data-brewery-id')
				}
			})
			.success(res => {
				console.log('success', res)
			})
			.fail(err => {
				console.log('fail', err)
				// if response status is 401 then 
				// location.href = '/auth/login'
			})
		})
	})
})