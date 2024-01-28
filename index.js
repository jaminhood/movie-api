const movies = []
let rentedMovies = []

class Movie {
	constructor(title, price, description) {
		this.title = title
		this.price = price
		this.description = description
	}

	// getters
	getTitle() {
		return this.title
	}

	getPrice() {
		return this.price
	}

	getDescription() {
		return this.description
	}

	// setters
	setTitle(title) {
		this.title = title
		return this
	}

	setPrice(price) {
		this.price = price
		return this
	}

	setDescription(description) {
		this.description = description
		return this
	}
}

class MovieApp {
	getMovie(title) {
		return movies.find(movie => movie.getTitle().toLowerCase() === title.toLowerCase())
	}
}

class Admin extends MovieApp {
	uploadMovie(movie) {
		movies.push(movie)
		return this
	}

	removeMovie(title) {
		const movie = this.getMovie(title)

		if (!movie) {
			throw new Error(`404 => ${title} Not Found in movies db`)
		}

		movies.filter(movie => movie.title.toLowerCase() !== title.toLowerCase())
		return this
	}
}

class Customer extends MovieApp {
	constructor(name) {
		super()
		this.name = name
	}

	getRentedMovies() {
		const findCustomer = rentedMovies.find(user => user.name.toLowerCase() === this.name.toLowerCase())

		if (!findCustomer) {
			throw new Error(`404 => No movie was found rented by ${this.name}`)
		}

		return findCustomer.movies
	}

	rentMovie(title) {
		const movie = this.getMovie(title)

		if (!movie) {
			throw new Error(`404 => ${title} Not Found in movies db`)
		}

		const findCustomer = rentedMovies.find(user => user.name.toLowerCase() === this.name.toLowerCase())

		if (!findCustomer) {
			rentedMovies.push({ name: this.name, movies: [this.getMovie(title)] })
			console.log(`~ ${this.name} just rented ${title}`)
			return this
		}

		rentedMovies = rentedMovies.map(user => {
			if (user.name.toLowerCase() === this.name.toLowerCase()) {
				user.movies.push(this.getMovie(title))
			}

			return user
		})

		console.log(`~ ${this.name} just rented ${title}`)
		return this
	}

	returnMovie(title) {
		const findCustomer = rentedMovies.find(user => user.name.toLowerCase() === this.name.toLowerCase())

		if (!findCustomer) {
			throw new Error(`404 => ${this.name} is not recognised`)
		}

		rentedMovies = rentedMovies
			.map(user => {
				if (user.name.toLowerCase() === this.name.toLowerCase()) {
					const findMovie = user.movies.find(movie => movie.getTitle().toLowerCase() === title.toLowerCase())

					if (!findMovie) {
						throw new Error(`404 => ${title} was not rented by ${this.name}`)
					}

					user.movies = user.movies.filter(movie => movie.getTitle().toLowerCase() !== title.toLowerCase())
				}

				return user
			})
			.filter(user => user.movies.length > 0)

		console.log(`~ ${this.name} just returned ${title}`)
		return this
	}
}

try {
	const movie1 = new Movie(`John Wick 1`, 100, `Action Drama`)
	const movie2 = new Movie(`Shadow Hunter`, 100, `Action Drama`)
	const movie3 = new Movie(`Mr. Robot 1`, 100, `Action Drama`)
	const movie4 = new Movie(`Fast & Furious VII`, 100, `Action Drama`)

	const admin = new Admin()
	admin.uploadMovie(movie1).uploadMovie(movie2).uploadMovie(movie3).uploadMovie(movie4).removeMovie(movie4.getTitle())

	const Kenedy = new Customer(`Kenedy`)
	const Ken = new Customer(`Ken`)
	Ken.rentMovie(`Mr. Robot 1`).returnMovie(`Mr. Robot 1`)
	console.log(Kenedy.rentMovie(`John Wick 1`).rentMovie(`Shadow Hunter`).returnMovie(`John Wick 1`).getRentedMovies())
	console.log(rentedMovies)
} catch (e) {
	console.log(e.message)
}
