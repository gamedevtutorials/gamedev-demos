function Scene_Our() {
    this.initialize.apply(this, arguments);
}

Scene_Our.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Our.prototype.constructor = Scene_Our;

Scene_Our.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Our.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._petsLabelWindow = new Window_PetsLabel(0,0);
    this._petWindow = new Window_Pet(this._petsLabelWindow.width, 0);

    this._petsLabelWindow.show();
    this._petWindow.show();

    this._petWindow.activate();

    this._petWindow.setHandler('ok',    this.commandOk.bind(this));
    this._petWindow.statusMenu().setHandler("feed", this._petWindow.statusMenu().commandFeed.bind(this._petWindow.statusMenu()));
    this._petWindow.statusMenu().setHandler("selectPet", this._petWindow.statusMenu().commandSelectPet.bind(this._petWindow.statusMenu()));


    this.addWindow(this._petsLabelWindow);
    this.addWindow(this._petWindow);
    this._petWindow.statusWindow().hide();
    this._petWindow.statusMenu().hide();
    this.addWindow(this._petWindow.statusWindow());
    this.addWindow(this._petWindow.statusMenu());


};

Scene_Our.prototype.commandOk = function() {
  this._petWindow.statusWindow().setActivePet(this._petWindow.pet());
  this._petWindow.statusMenu().setActivePet(this._petWindow.pet());
  this._petWindow.showStatusWindow(this);
};


Scene_Our.prototype.update = function() {
  if(Input.isTriggered("escape")||Input.isTriggered("cancel")) {
    if(this._petWindow._showStatus) {
      this._petWindow.closeStatusWindow();
    } else {
      SceneManager.goto(Scene_Map);
    }
  }
 this._petWindow.refresh();
  Scene_MenuBase.prototype.update.call(this);
};

(function() {

  Input.keyMapper[80] = "petMenu"; // p
  Input.gamepadMapper[8] = "petMenu";

  var _Scene_Map_updateScene = Scene_Map.prototype.updateScene;
  Scene_Map.prototype.updateScene = function() {
    _Scene_Map_updateScene.call(this);

    if(Input.isTriggered("petMenu")) {
      SceneManager.goto(Scene_Our);
    }
  };


})();
