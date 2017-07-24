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


// query/hours/location 
// query location,start_date,end_date
// Note Date Format should be  mm/dd/yy

exports.TotalHoursForEachLocationWithDatePeriod = function(req,res){
    var start_date = new Date(req.query.start_date);
    var end_date = new Date(req.query.end_date);

    Total_Shifts.aggregate([
         { $match: { 
             start_date: { $gte: start_date },
             end_date: { $lt: end_date }
            }
         },
        {$group: {
            _id: "$location",
            total: { $sum: "$hours"}
        }}
    ]).
    exec(function(err,result){
        if(err) console.log(err);
        res.render("hoursandsite", {title:"Hours and Site",users: req.user, result: result});
    });
}



// e.g ttps://ausgroup-samiroker.c9users.io/queries/shifts?start_date=08/01/2017&end_date=08/30/2017
exports.AllShiftsWithinDatePeriod = function(req,res){
    var start_date = new Date(req.query.start_date);
    var end_date = new Date(req.query.end_date);
    var condition = "start_date < " + start_date + " && this.end_date > " + end_date;
    Total_Shifts.find(
        { start_date: { $gte: start_date },
             end_date: { $lt: end_date }})
    .exec(function(err,shifts){
        if(err) console.log(err);
        res.render("allinvoices", {title:"All Shifts",users: req.user, shift: shifts});
    });
    
    
}

exports.AllShiftsWithinDatePeriodwithname = function(req,res){
    var start_date = new Date(req.query.start_date);
    var end_date = new Date(req.query.end_date);
    var condition = "start_date < " + start_date + " && this.end_date > " + end_date;
    Total_Shifts.find(
        { start_date: { $gte: start_date },
             end_date: { $lt: end_date }})
    .exec(function(err,shifts){
        if(err) console.log(err);
        res.render("allinvoices", {title:"All Shifts",users: req.user, shift: shifts});
    });
    
    
}

