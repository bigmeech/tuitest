var express = require('express');
var router = express.Router();
var UserModel = require(__('models/User'));
var mongoose = require(__('lib/database'));
var _ = require('lodash');
var auth = require(__('lib/authentication'));




router
    .route('/')
    .all(auth.checkAuth, auth.checkRoles)
    .get(fetchUsers)
    .put(createUser)
    .post(updateUser)
    .delete(removeUser);

router
    .route('/:id')
    .all(auth.checkAuth, auth.checkRoles)
    .get(fetchUser)
    .post(updateUser)
    .delete(removeUser)
    .put(updateUser); //puts can do updates as well depending on context


function createUser(req, res, next){
  var User = new UserModel();
  User = _.merge(User, req.body);
  User.save(function(err, AddedUser){
    if(err){
      if(err.code === 11000)
        return res.status(400).json({error:true, message:'Duplicate entries not allowed!'});
      else
        return res.status(404).json(err);
    }
    return res.json(AddedUser.toObject());
  });
}

function removeUser(req, res, next){
  var id = mongoose.Types.ObjectId(req.query.id);
  UserModel.remove({_id : id}, function(err, User){
    if(err) return res.status(404).json(err);
    return res.json({ error:false, message:"User deleted successfully" })
  })
}

function fetchUser(req, res, next){
  var params = req.params;
  UserModel.findOne(params, function(err, User){
    if(err) return res.status(404).json(err);
    return res.json(User);
  })
}

function fetchUsers(req, res, next){
    UserModel.find({}, function(err, Users){
        if(err) return res.status(404).json(err);
        else{
            var UserCollection = Users.map(function(user){
                return _.omit(user.toObject(),'hash');
            });
            return res.json(UserCollection);
        }
    })
}

function updateUser(req, res, next) {
  var data = req.body;
  UserModel.update({ _id:data._id }, data, { upsert:true }, function(err, UpdatedUser){
    if(err) return res.status(404).json(err);
    return res.json({ error: false, message:'update successful', payload:UpdatedUser });
  });
}

module.exports = router;
