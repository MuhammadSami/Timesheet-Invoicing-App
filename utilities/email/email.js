var nodemailer = require('nodemailer');
var jade = require('jade');
var jadeCompiler = require('./jade_compiler');
var fs = require('fs');


exports.sendHTMLEmail = function(user,subject,content,template_location){
    
        
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'pathfinderprotective@gmail.com',
                pass: "vmmsgfppemfxgbsj"
            }
        });
        
        function add(a, b){
            return a + b;
        };
        
        var total_hours = 0;
        var total_ammount = 0;
        for(var x = 0; x < content.length; x++){
            total_hours += +(content[x].hours);
            total_ammount += +(content[x].amount);
        };
        total_hours.toFixed(2);
        total_ammount.toFixed(2);
        var new_content = {"firstname": user.firstname, "shifts"  : content, "totalhours" : total_hours, "totalamount" : total_ammount};
        
        
        
        console.log(new_content);
        jadeCompiler.compile(template_location,new_content,function(err,html){
            if(err){
                throw new Error('Problem compiling template(double check relative path): ' + template_location);
            }
            
            // Mail
            var mailOptions = {
                  to: user.email,
                  from: 'pathfinderprotective@gmail.com',
                  subject: subject,
                  html: html
                  
            };
            
            transporter.sendMail(mailOptions,function(err,res){
            if(err){
                console.log('[ERROR] Message NOT sent: ', err);
            }
            else {
                console.log('successful sent email to user.');
            }
        });
            
        });

        
        
        
      
};


exports.formatTemplate = function(content){
    
}


