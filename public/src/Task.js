const crypto = require("crypto")

class Task{
    static all = []

    constructor(task){
        this.id = crypto.randomInt(500).toString()
        this.desc = task
        this.status = 0
        this.highlight = 0
        this.constructor.all.push(this)
    }
}
 
module.exports = Task