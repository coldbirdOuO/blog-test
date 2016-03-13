var mongodb = require('./db');

function Post(name, title, post) {
  this.name = name;
  this.title = title;
  this.post = post;
}

module.exports = Post;

//存儲一篇文章及其相關信息
Post.prototype.save = function(callback) {
  var date = new Date();
  //存儲各種時間格式，方便以後擴展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }
  //要存入數據庫的文檔
  var post = {
      name: this.name,
      time: time,
      title: this.title,
      post: this.post
  };
  //打開數據庫
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //讀取posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //將文檔插入posts 集合
      collection.insert(post, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//失敗！返回err
        }
        callback(null);//返回err 為null
      });
    });
  });
};

//讀取文章及其相關信息
Post.get = function(name, callback) {
  //打開數據庫
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //讀取posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //根據query 對象查詢文章
      collection.find(query).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);//失敗！返回err
        }
        callback(null, docs);//成功！以數組形式返回查詢的結果
      });
    });
  });
};