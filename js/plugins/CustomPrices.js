/**
 * Created by Gilles on 09.12.2015.
 */

$customPrice = null;

DataManager._databaseFiles.push({ name: '$customPrice',  src: 'Actors.json', "path" : "" });

DataManager.loadDatabase = function() {
    var test = this.isBattleTest() || this.isEventTest();
    var prefix = test ? 'Test_' : '';
    for (var i = 0; i < this._databaseFiles.length; i++) {
      var name = this._databaseFiles[i].name;
      var src = this._databaseFiles[i].src;
      var path = this._databaseFiles[i].path;
      this.loadDataFile(name, prefix + src, path);
    }
    if (this.isEventTest()) {
      this.loadDataFile('$testEvent', prefix + 'Event.json');
    }
};

  DataManager.loadDataFile = function(name, src, path) {
    var xhr = new XMLHttpRequest();
    var url = (typeof path == "string" ? path : 'data/') + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
      if (xhr.status < 400) {
        window[name] = JSON.parse(xhr.responseText);
        DataManager.onLoad(window[name]);
      }
    };
    xhr.onerror = function() {
      DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
  };

(function() {

  function editGoods(goods) {

  }

var _Scene_Shop_create = Scene_Shop.prototype.create;
Scene_Shop.prototype.create = function() {
  this._goods
  _Scene_Shop_create.call(this);
};

})();
