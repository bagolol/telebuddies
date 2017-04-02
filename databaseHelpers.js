module.exports = {
    isEmailDuplicated: function(model, email) {
        return model.find({ email: email }, function (err, docs) {
            if(docs.length) {
                return true
            }else {
                return false
            }
        })
    }
}
