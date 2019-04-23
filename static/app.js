document.addEventListener('DOMContentLoaded', e => {
	[...document.getElementsByClassName('add-button')].forEach(btn => {
		btn.addEventListener('click', function(e) {
			e.preventDefault()
			console.log('cowabunga', this.getAttribute('data-id'))
			// fetch or ajax
			$.ajax({
				url: 'http://localhost:3000/breweries/' + this.getAttribute('data-id'),
				method: 'POST',
				data: {
					apiId: this.getAttribute('data-beer-apiId'),
					breweryId: this.getAttribute('data-brewery-id'),
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
})