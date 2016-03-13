var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//存儲用戶信息
User.prototype.save = function(callback) {
  //要存入數據庫的用戶文檔
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };
  //打開數據庫
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//錯誤，返回err 信息
    }
    //讀取users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//錯誤，返回err 信息
      }
      //將用戶數據插入users 集合
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//錯誤，返回err 信息
        }
        callback(null, user[0]);//成功！err 為null，並返回存儲後的用戶文檔
      });
    });
  });
};

//讀取用戶信息
User.get = function(name, callback) {
  //打開數據庫
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//錯誤，返回err 信息
    }
    //讀取users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//錯誤，返回err 信息
      }
      //查找用戶名（name鍵）值為name 一個文檔
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失敗！返回err 信息
        }
        callback(null, user);//成功！返回查詢的用戶信息
      });
    });
  });
};