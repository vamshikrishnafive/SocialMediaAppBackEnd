//post validator
exports.createPostValidator = (req, res, next) => {
    //check the length of title and make sure it's not title is not empty
    req.check('title', "write a title").notEmpty()
    req.check('title',"Title must be length 4 to 150").isLength({
        min:4,
        max:150
    })
    
    //check the length of body and make sure it's not body is not empty
    req.check('body', "write a body").notEmpty()
    req.check('body',"body must be length 4 to 150").isLength({
        min:4,
        max:2000
    })

    //if errors show the first one as they happen
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error:firstError})
    }

    //procced to next middleware
    next()
}

//user validators
exports.userSignupValidator = (req, res, next) => {
    //check the length of name and make sure it's not name is not empty
    req.check("name", "Name is required").notEmpty()
    
    //check the length of email and make sure it's email format
    req.check("email","Email must be beweet 3 to 32 characters")
       .matches(/.+@.+\..+/)
       .withMessage("Email must be contain @")
       .isLength({
           min:4,
           max:2000
       })
    
    //check the length of password and make sure it's password format
    req.check('password',"Password is required").notEmpty()
    req.check("password")
       .isLength({min:6})
       .withMessage("password must be contain at least 6 characters")
       .matches(/\d/)
       .withMessage("password must contain a number")

    //if errors show the first one as they happen
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error:firstError})
    }

    //procced to next middleware
    next()
}

exports.userSigninValidator = (req, res, next) => {    
    //check the length of email and make sure it's email format
    req.check("email","Email must be beweet 3 to 32 characters")
       .matches(/.+@.+\..+/)
       .withMessage("Email must be contain @")
       .isLength({
           min:4,
           max:2000
       })
    
    //check the length of password and make sure it's password format
    req.check('password',"Password is required").notEmpty()
    req.check("password")
       .isLength({min:6})
       .withMessage("password must be contain at least 6 characters")
       .matches(/\d/)
       .withMessage("password must contain a number")

    //if errors show the first one as they happen
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error:firstError})
    }

    //procced to next middleware
    next()
}
exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");
 
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};