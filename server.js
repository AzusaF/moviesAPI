/************************************************************************ *********
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *
* Name: ___Azusa Fukuda____ Student ID: ___109697219___ Date: ____11/30/2022_____
* Cyclic Link: _____________https://moviesapi.cyclic.app/________________________
* ********************************************************************************/

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
   res.json({message: "API is Listening"});
});

// CREATE movie
app.post("/api/movies", async (req,res)=>{
   try{
     let result = await db.addNewMovie(req.body);
     res.status(201).json(result);
   }catch(err){
     res.status(500).json({message: err.message});
   }
});

// READ ALL movies
app.get("/api/movies", async (req,res)=>{
   try{
      var page = req.query.page;
      var perPage = req.query.perPage;
      req.query.title ? title = req.query.title :title = null;
      let result = await  db.getAllMovies(page, perPage, title);
      res.json(result);
   }catch(err){
      res.status(500).json({message: err.message});
   }
});

// READ ONE movie BY ID
app.get("/api/movies/:id", async (req,res)=>{
   try{  
     let result = await db.getMovieById(req.params.id);

     if(result){
      res.json(result);
     }else{
      res.status(404).json({message: `movie ${req.params.id} not found`});
     }

   }catch(err){
      res.status(500).json({message: err.message});
   }
});

// UPDATE movie BY ID
app.put("/api/movies/:id", async (req,res)=>{
   try{  
      let result = await db.updateMovieById(req.body, req.params.id);
      res.json(result);
   }catch(err){
      res.status(500).json({message: err.message});
   }
});

// DELETE movie BY ID
app.delete("/api/movies/:id", async (req,res)=>{
   try{  
      await db.deleteMovieById(req.params.id);
      res.status(204).end();
   }catch(err){
      res.status(404).json({message: err.message});
   }
 });

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
   app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`); 
   });
}).catch((err)=>{
   console.log(err);
});