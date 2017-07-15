var express = require('express');
var Total_Shifts = require('../models/total_shifts');




// Metadata
exports.add_shifts = function(shifts){
    Total_Shifts.create(shifts,function(err,array){
        if(err){
            console.log();
        }
        
        console.log("saved all shifts to TOTAL_SHIFTS");
    });
};





// Query: Shift in a location
exports.shifts_by_location = function(req,res){
    var location = req.query.location;
    
    Total_Shifts.find({'location' : location },function(err,shifts){
        if(err){
            console.log(err);
        }
        
        res.send(shifts);
    });
    
};





