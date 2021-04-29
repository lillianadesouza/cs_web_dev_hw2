"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        if (!req.body || !req.body.name || !req.body.seasons) {
            res.status(500).send({message: 'name and seasons are required'});
        }
        else {
        Doctor.create(req.body)
            .save()
            .then(doctor => {
                res.status(201).send(doctor);
            })
            .catch(err => {
                res.status(404).send(err);
            });
        }
    });


    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id) //add more
            .then(data => {
                if (data==null) {
                    res.status(404).send({
                        message: 'doctor with id "${req.params.id}" does not exist'
                    });
                }
                else {
                    res.status(200).send(data);
                }
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })


    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        //find and update doctor by id
        Doctor.findOneAndUpdate(
            {'_id': req.params.id},
            //update it
            req.body,
            {new: true}
        )
        .then(data => {
            res.status(200).send(null);
        })
        .catch(err => {
            res.status(404).send({
                message: 'some other error happened',
                err: err
            });
        });
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findOneAndDelete({_id: req.params.id})
            .then(doctor => {
                if (doctor) {
                    res.status(200).send(null);
                }
                else {
                    res.status(404).send({
                        message: 'doctor not found'
                    });
                }
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);

        Companion.find({ 'doctors': {'$in': req.params.id}})
                .then(doctors => {
                    res.status(200).send(doctors);
                })
                .catch(err => {
                    res.status(404).send(err);
                });

    });
    
router.route("/doctors/:id/companions/longest")
    .get((req, res) => {
        console.log("GET /doctors/:id/companions/longest");
        res.status(501).send();
    });

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log("GET /doctors/:id/goodparent");
        
        // const getAllComps = Companion.find({ 'doctors': {'$in': req.params.id}})

        // const getAliveComps = Companion.find({ 'alive': {'$eq': "true"}})

        // const getGoodParent = async() => {
        //     const allComps = await getAllComps();
        //     const aliveComps = await getAliveComps();
        //     if (allComps.length == aliveComps.length) {
        //         res.status(200).send(true);
        //     }
        //     else {
        //         res.status(200).send(false);
        //     }
        //     //compare lengths
        // }
        Companion.find({ 'doctors': {'$in': req.params.id}})
                .then(doctors => {
                    Companion.find({'alive': true,'doctors': {'$in': req.params.id}})
                    .then(goodDoctors => {
                        res.status(200).send(doctors.length === goodDoctors.length);
                    })
                    .catch(err => {
                        res.status(500).send(err);
                    });
                })
                .catch(err => {
                    res.status(404).send(err);
                });

    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        if (!req.body.character || !req.body.name || !req.body.seasons || !req.body.doctors || !req.body.alive) {
            res.status(500).send({message: 'name, character, doctors, seasons, alive are all required'});
        }
        else {
        Companion.create(req.body)
            .save()
            .then(doctor => {
                res.status(201).send(doctor);
            })
            .catch(err => {
                res.status(404).send(err);
            });
        }
        
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        Companion.find({})
        .then(data => {
            data.filter(d => d.doctors.length >= 2);
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(404).send(err);
        });
    });

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id) 
            .then(data => {
                if (data) {
                    res.status(200).send(data);
                }
                else {
                    res.status(404).send({
                        message: 'companion with id "${req.params.id}" does not exist'
                    });
                }
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        res.status(501).send();
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findOneAndDelete({_id: req.params.id})
            .then(companion => {
                if (companion) {
                    res.status(200).send(null);
                }
                else {
                    res.status(404).send({
                        message: 'companion not found'
                    });
                }
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        Companion.findById(req.params.id) 
        .then(data => {
            Doctor.find({'_id': {'$in': data.doctors}})
            .then(doctors => {
                console.log(doctors)
                res.status(200).send(doctors)
            })
            .catch(err => {
                res.status(404).send(err);
            });
        })
        .catch(err => {
            res.status(404).send(err);
        }); 
        
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        
        Companion.findById(req.params.id) 
        .then(data => {
            Companion.find({'seasons': {'$in': data.seasons}, '_id': {'$ne': req.params.id}})
            .then(friends => {
                console.log(friends)
                res.status(200).send(friends)
            })
            .catch(err => {
                res.status(404).send(err);
            }); 
        })
        .catch(err => {
            res.status(404).send(err);
        }); 
    });

//////////////////
// EXTRA CREDIT //
//////////////////
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });

router.route("/doctors/favorites/:id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/:id`);
        res.status(501).send();
    });

router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/favorites/:id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/:id`);
        res.status(501).send();
    });

module.exports = router;