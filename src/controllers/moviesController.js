const db = require("../database/models");
const sequelize = db.sequelize;
const moment = require('moment');

//Otra forma de llamar a los modelos
const Movies = db.Movie;


const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  }, 
  //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
  add: function (req, res) {
    db.Genre.findAll({
      order: ["name"],
    })
      .then((genres) => res.render("moviesAdd", { genres }))
      .catch((error) => console.log(error));
  },
  create: function (req, res) {
    // TODO
    const { title, release_date, genre, rating, awards, length } = req.body;
    db.Movie.create({
      title: title.trim(),
      release_date,
      genre,
      rating,
      awards,
      length,
      genre_id: genre,
    })
      .then((movie) => {
        console.log(movie);
        return res.redirect("/movies");
      })
      .catch((error) => console.log(error));
  },
  edit: function (req, res) {
    // TODO
   let Movie = Movies.findByPk(req.params.id);
   let Genr = db.Genre.findAll({order : ['name']});

   Promise.all([Movie, Genr])
    .then(([Movie,Genr])=>{
        return res.render('moviesEdit', {Movie, Genr, moment: moment})
    })
    .catch(error=>console.log(error))
  },
  update: function (req, res) {
    // TODO
    //return res.send(req.body)
    const { title, release_date, genre, rating, awards, length } = req.body;
    Movies.update(
    {   title: title.trim(),
        release_date,
        genre,
        rating,
        awards,
        length,
        genre_id: genre
    },
    {
        where: {id:req.params.id}
    }
    )
    .then(()=> res.redirect('/movies'))
    .catch(error => console.log(error))
  },
  delete: function (req, res) {
    // TODO
    Movies.findByPk(req.params.id).then((movie) => {
        res.render("moviesDelete.ejs", { movie });
    });

  },
  destroy: function (req, res) {
    // TODO
    Movies.destroy({
        where: { id: req.params.id}
    }).then(()=>{
        res.redirect('/movies')
    })
  }
};

module.exports = moviesController;
