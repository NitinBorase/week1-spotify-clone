const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../models/Song"); 
const User = require("../models/User"); 

router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { name, thumbnail, track } = req.body;

    if (!name || !thumbnail || !track) {
        return res.status(400).json("Insufficient details to create song");
    }

    const artist = req.user._id; 
    const songDetails = { name, thumbnail, track, artist }; 

    try {
        const createdSong = await Song.create(songDetails);
        return res.status(201).json(createdSong); 
    } catch (error) {
        console.error(error); 
        return res.status(500).json("An error occurred while creating the song");
    }
});

router.get("/get/mysongs", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const currentUser  = req.user;

    try {
        const songs = await Song.find({ artist: currentUser ._id }); 
        return res.status(200).json({ data: songs });
    } catch (error) {
        console.error(error); 
        return res.status(500).json("An error occurred while fetching songs");
    }
});

router.get("/get/artist", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const {artistId} = req.body;
    const artist = await User.find({_id: artistId});
    if(!artist){
        return res.status(404).json("Artist not found");
    }
    const songs = await Song.find({ artist: artistId}); 
    return res.status(200).json({ data: songs });
});

router.get("/get/songname", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const {songName} = req.body;
    
    const songs = await Song.find({ name: songName}); 
    return res.status(200).json({ data: songs });
});

module.exports = router;