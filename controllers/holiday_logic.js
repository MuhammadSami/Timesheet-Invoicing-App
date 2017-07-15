var Holiday = require('../models/holiday');



exports.get_holidays = function(req,res){
    Holiday.find({},'date',function(err,holidays){
        if(err){
            console.log(err);
        }
        res.send(holidays);
    });
};

// { start-date : 'date',end-date:'date','year':2007}
exports.check_holiday = function(req,res){
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var year = req.body.year;
    Holiday.find({'year':year}).where('this.date === ' + start_date + ' || ' + 'this.date === ' + start_date)
    .exec(function(err,holiday){
        if(err){
            console.log(err);
        }
        var response = { "date" : holiday.date , "name" : holiday.name };
        return res.send(response);
    });
};


// { 'date':Date,'name':'Walid's Holiday,'year':2007 }
exports.add_holiday = function(req,res){
    var date = req.body.date+" ";
    var name = req.body.name+" ";
    var year = req.body.year+" ";
    var holidays = [];
    var dArray = date.split(",");
    var nArray = name.split(",");
    var yArray = year.split(",");

    for(var x  =0; x < dArray.length; x++){
         holidays.push(new Holiday({date: dArray[x], name: nArray[x], year: yArray[x]}));
    }
    

    
    Holiday.create(holidays,function(err){
        if(err){
            console.log(err);
        }
        req.flash("success", "Public Holidays have been added");
        res.redirect("/");
    });
};

// query 
exports.get_holidays_in_year = function(req,res){
    var year = req.query.year;
    
    Holiday.findOne({'year':year}, function(err,holidays){
        if(err){
            console.log(err);
        }
        res.send(holidays);
    });
};










