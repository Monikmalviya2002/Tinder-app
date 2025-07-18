const validator = require("validator");

function validateSignUpData(req) {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name field should not be empty");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email id");
  }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    
    }
  }

  const validateProfileEditData  =(req)=>{
         const allowedEditFields = ["firstName", "lastName", "emailId","password","skills","about","gender","age"];
 
          const isEditAllowed = Object.keys(req.body).every((field)=> 
            allowedEditFields.includes(field)
          );

          return isEditAllowed;

        };


   





module.exports = {
  validateSignUpData,
  validateProfileEditData
};
