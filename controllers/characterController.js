const db = require('../database/models')
const {Op} = require('sequelize')
const getURLBase = req => `${req.protocol}://${req.get('host')}`;



module.exports= {

    // Exercise 3 Challenge

    list : async (req,res)=> {
        db.characters.findAll({
            attributes: ["name", "image"]
        }).then(characters =>{
             let response = {
                 meta : {
                     status: 200,
                     msg: 'ALL CHARACTERS'
                 },
                 data : characters
             }
             res.json(response)
        
             
        }).catch(err =>{
                console.log(err);

                const response = {
                    status : 500,
                    msg : "internal error server"
                }
                res.status(500).json(response);
            })
        // res.send(200,{message: 'probando'})
     },


 /*===============================================================================*/

    // Exercise 4 Challenge (CRUD)


    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/    
     create : async (req,res)=> {
   
        db.characters.create({
            name : req.body.name,
            age: +req.body.age,
            weight: +req.body.weight,
            history: req.body.history,
            image: req.body.image
      
        }).then(newCharacter=>{
            let response = {
                status : 201,
                meta : {
                    url : getURLBase(req) + '/characters/' + newCharacter.id
                },
                message : 'character create'
            }
            return res.status(201).json(response)
       
        }).catch(err =>{
            console.log(err);

            const response = {
                status : 400,
                msg : "character no create"
            }
            res.status(400).json(response);
        })
     },

   /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/ 

     update : async (req,res)=> {
        db.characters.findByPk(req.params.id)
        .then(character=>{
            db.characters.update({
                 name : req.body.name,
                 age: +req.body.age,
                 weight: +req.body.weight,
                 history: req.body.history,
                 image: req.body.image
            },{
                where : {
                    id : req.params.id    
                }  
        
             }).then(characterUpdate=>{
                 const response = {
                     status :200,
                     meta : {
                        url : getURLBase(req) + '/characters/' + character.id
                    },
                     msg : 'character updated '
                 }
                 res.status(200).json(response);
    
             }).catch(err=> { // err update 
                 console.log(err);
                 const response = {
                    status : 500,
                    msg :'internal server error ju-ju'
                }
                res.status(500).json(response)
             })
            
        }).catch(err => { // err question db
            console.log(err);
            const response = {
                status : 500,
                msg : 'character doesnt exist in the API'
            }
            res.status(500).json(response)
        })
     },


  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/ 

     delete : async (req,res) => {
        db.characters.findByPk(req.params.id)

        .then(characterDestroy =>{
            db.characters.destroy({
                where : {
                    id : req.params.id
                }
            })
            const response = {
                status : 200,
                msg : 'character deleted'
            }
            res.status(200).json(response)

        }).catch(err=> { // err update 
                 console.log(err);
                 const response = {
                    status : 500,
                    msg :'internal server error ju-ju'
                }
                res.status(500).json(response)
             })
     },


    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/ 


        // Exercise 5 Detail Character


    detail : async (req,res)=> {  
        db.characters.findByPk(req.params.id,{
            include : [                   // 2 parameter
                { association :'movies',include:[// name association and atributes other model
                    {association: 'genre'} // asociacion de la asociacion
                ]}  
            ]
        }).then(detailCharacter=> {
           const response = {
               status : 200,
               msg : 'character and movie associate',
               data : detailCharacter
           }
           res.status(200).json(response)
        }).catch(err=>{
            console.log(err);
            const response = {
                status: 404,
                msg: 'character no exist'
            }
            res.status(404).json(response)
        })
    },

        // Exercise 6 Challenge Search character

    search : (req,res) => {
        db.characters.findAll({
            attributes: ['name','age','weight'],
  
            include : [{association: 'movies'}],
   
            where: {
                name : {
                    [Op.substring] : req.query.name
                },
                age : {
                    [Op.substring] : req.query.age
                },
                weight : {
                    [Op.substring] : req.query.weight
                }
            }
        }).then(characters=>{
            const response = {
                status : 200,
                msg: 'character search succesfully',
                data : characters
            }
            res.status(200).json(response)
        }).catch(err => {
            const response = {
                status: 404,
                msg : 'Characters not found'
            }
            res.status(404).json(response)
        })
    }
        
}