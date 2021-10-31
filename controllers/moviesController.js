const db = require('../database/models')
const {Op} = require('sequelize')
const getURLBase = req => `${req.protocol}://${req.get('host')}`;


module.exports = {
    


       // Exercise 7 && 10 Challenge

    list : (req,res) => {
        db.movies.findAll({
            attributes : ['title','release','image'],
            where : {
                title : {
                    [Op.substring] : req.query.title ? req.query.title : ""
                },
                genderId : {
                    [Op.substring] : req.query.genre ? req.query.genre : ""
                } 
            },
            order : [
                ["title",req.query.order && req.query.order.toUpperCase() == "DESC" ? req.query.order : "ASC"]
            ]
        }).then(movies => {
            const response = {
                status : 200,
                msg : 'All movies',
                data: movies
            }
            res.status(200).json(response)
        }).catch(err => {
            const response = {
                status : 500,
                msg :'internal error server'
            }
            res.status(500).json(response)
        })
    },

 /*============================================*/  

      // Exercise 8 Challenge

    
    detail : (req,res) => {
        db.movies.findByPk(req.params.id,{
            include : [
                { association : "genre",},
                { association : "characters"},
            ]

        }).then(movie => {
            const response  ={
                meta : {
                    status: 200,
                    msg :'Detail movie and characters',
                },
                data : movie
            }
            res.status(200).json(response)
        }).catch(err => {
            console.log(err);
            const response = {
                status: 500,
                msg: 'Internal server error'
            }
            res.status(500).json(response)
        })


    },



/*============================================*/

    // Exercise 9 Challenge (CRUD)

    
    create : async (req,res)=> {
   
        db.movies.create({
            title : req.body.title,
            score : +req.body.score,
            release : req.body.release,
            image : req.body.image,
            genreId : +req.body.genreId
      
        }).then(newMovie=>{
            let response = {
                status : 201,
                meta : {
                    url : getURLBase(req) + '/characters/' + newMovie.id
                },
                message : 'movie create'
            }
            return res.status(201).json(response)
       
        }).catch(err =>{
            console.log(err);

            const response = {
                status : 400,
                msg : "movie no create"
            }
            res.status(400).json(response);
        })
     },


/*============================================*/


     update : async (req,res)=> {
        db.movies.findByPk(req.params.id)
        .then(movie=>{
            db.movies.update({
                title : req.body.title,
                score : +req.body.score,
                release : req.body.release,
                image : req.body.image,
                genreId : +req.body.genreId
            },{
                where : {
                    id : req.params.id    
                }  
        
             }).then(movieUpdated=>{
                 const response = {
                     status :200,
                     meta : {
                        url : getURLBase(req) + '/characters/' + movieUpdated.id
                    },
                     msg : 'movie updated '
                 }
                 res.status(200).json(response);
    
             }).catch(err=> { // err update 
                 console.log(err);
                 const response = {
                    status : 500,
                    msg :'internal server error '
                }
                res.status(500).json(response)
             })
            
        }).catch(err => { // err question db
            console.log(err);
            const response = {
                status : 500,
                msg : 'movie doesnt exist in the API'
            }
            res.status(500).json(response)
        })
     },


 /*============================================*/


     delete : async (req,res) => {
        db.movies.findByPk(req.params.id)

        .then(movieDestroy =>{
            db.movies.destroy({
                where : {
                    id : req.params.id
                }
            })
            const response = {
                status : 200,
                msg : 'movie deleted'
            }
            res.status(200).json(response)

        }).catch(err=> { // err update 
                 console.log(err);
                 const response = {
                    status : 500,
                    msg :'internal server error'
                }
                res.status(500).json(response)
             })
     },


}