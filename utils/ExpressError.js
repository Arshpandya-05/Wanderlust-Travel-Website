class ExpressError extends Error {
    constructor (stastusCode,message){
        super();
        this.stastusCode = stastusCode;
        this.message = message;
    }
}

module.exports = ExpressError;