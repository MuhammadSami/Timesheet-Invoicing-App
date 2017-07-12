var nodemailer = require('nodemailer');
var jade = require('jade');
var jadeCompiler = require('./jade_compiler');
var fs = require('fs');


exports.sendHTMLEmail = function(address,subject,content,template_location){
    
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
            user: 'm.samidevs@gmail.com',
            pass: "sjajxqmyuzlapwhb"
            }
        });
        console.log("CONTENT::::::::::::::::::::::::::::::");
        console.log(content);
        var new_content = {"user"  : content[1]};
        
        jadeCompiler.compile(template_location,new_content,function(err,html){
            if(err){
                throw new Error('Problem compiling template(double check relative path): ' + template_location);
            }
            
            // Mail
            var mailOptions = {
                  to: new_content.user.email,
                  from: 'm.samidevs@gmail.com',
                  subject: subject,
                  html: html
                  
            };
            
            transporter.sendMail(mailOptions,function(err,res){
            if(err){
                console.log('[ERROR] Message NOT sent: ', err);
            }
            else {
                console.log('[INFO] Message Sent: ' + res.message);
            }
        });
            
        });

        
        
        
      
};


exports.formatTemplate = function(content){
    
}


