/*:
 * @plugindesc Displays detailed statuses of enemies.
 * @author Yoji Ojima
 *
 * @param Profile Label
 * @desc Label for Profile
 * @default Profile
 *
 * @param Hunger Label
 * @desc Label for Hunger
 * @default Hunger
 *
 * @param Pets Label
 * @desc Label for Pets
 * @default PETS
 *
 * @param Obedience Label
 * @desc Label for Obedience
 * @default Obedience
 *
 * @param Feed Label
 * @desc Label for Feed
 * @default Feed
 *
 * @param OK Sound Effect
 * @desc Sound Effect when using Pet Food (NULL for no sound)
 * @default Decision1
 *
 * @param Pet Food Item Index
 * @desc Index number of the Item which should be Pet Food
 * @default 5
 *
 */

var parameters = PluginManager.parameters('Window_Pet');
var profileLabel = String(parameters['Profile Label'] || 'Profile');
var hungerLabel = String(parameters['Hunger Label'] || 'Hunger');
var petsLabel = String(parameters['Pets Label'] || 'PETS');
var feedLabel = String(parameters['Feed Label'] || 'Feed');
var obedienceLabel = String(parameters['Obedience Label'] || 'Obedience');
var decisionSound = String(parameters['OK Sound Effect'] || 'Decision1');
var petFoodIndex = parseInt(parameters['Pet Food Item Index'] || 5);

//-----------------------------------------------------------------------------
// Window_Our
//
// The window for displaying the party's gold.

function Window_Pet() {
    this.initialize.apply(this, arguments);
}

Window_Pet.prototype = Object.create(Window_Selectable.prototype);
Window_Pet.prototype.constructor = Window_Pet;

Window_Pet.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._formationMode = false;
    this._pendingIndex = -1;



    this._statusWindow = new Window_PetStatus(240, 0);
     this._statusMenu = new Window_PetStatusMenu(0,100);
     this._statusMenu.deactivate();
     this._statusMenu.hide();
    this.loadImages();
    this.refresh();
};

Window_Pet.prototype.windowWidth = function() {
    return Graphics.boxWidth - 240;
};

Window_Pet.prototype.windowHeight = function() {
    return Graphics.boxHeight;
};

Window_Pet.prototype.maxItems = function() {
    return this.getPets().length;

};

Window_Pet.prototype.getPets = function() {

    return $gameParty.getPets();
};

Window_Pet.prototype.itemHeight = function() {
    var clientHeight = this.height - this.padding * 2;
    return Math.floor(clientHeight / this.numVisibleRows());
};

Window_Pet.prototype.numVisibleRows = function() {
    return 3;
};

Window_Pet.prototype.loadImages = function() {
    this.getPets().forEach(function(actor) {
        ImageManager.loadCharacter(actor.characterName());
    }, this);
};

Window_Pet.prototype.refresh = function() {
    this.loadImages();
    Window_Selectable.prototype.refresh.call(this);
};

Window_Pet.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + 180;
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x2, y);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    //this.drawActorClass(actor, x2, y);
    this.drawActorHunger(actor, x, y + lineHeight * 1, width2-20);
    this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
    this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
};

Window_Base.prototype.drawActorHunger = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.textColor(30);
    var color2 = this.textColor(31);
    this.drawGauge(x, y+this.lineHeight(), width, ((actor.hunger||50) / (this.mhunger||100)), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(hungerLabel, x, y, this.textWidth(hungerLabel));
    this.drawCurrentAndMax(actor.hunger, actor.mhunger||100, x-60, y+this.lineHeight(), width,
      this.hpColor(actor), this.normalColor());
};

Window_Base.prototype.drawActorObedience = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.textColor(29);
    var color2 = this.textColor(28);
    this.drawGauge(x, y+this.lineHeight(), width, ((actor.obedience||1) / (this.mobedience||10)), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(obedienceLabel, x, y, this.textWidth(obedienceLabel));
    this.drawCurrentAndMax(actor.obedience, actor.mobedience||10, x-60, y+this.lineHeight(), width,
      color1, color2);
};

Window_Pet.prototype.drawItem = function(index) {
    this.drawItemBackground(index);
    this.drawItemImage(index);
    this.drawItemStatus(index);
};

Window_Pet.prototype.drawItemBackground = function(index) {
  Window_MenuStatus.prototype.drawItemBackground(index);
};



Window_Pet.prototype.drawItemImage = function(index) {
    var actor = this.getPets()[index];
    var rect = this.itemRect(index);

    if($gameParty.getActivePets().length > 0 && $gameParty.getActivePets()[0].actorId() == actor.actorId()) {
      this.drawIcon(15, rect.x+5, (rect.y+rect.height/2)-30);
    }

    this.drawActorCharacter(actor,rect.x+80, rect.y+rect.height/2);
    this.changePaintOpacity(true);
};

Window_Pet.prototype.drawItemStatus = function(index) {
    var actor = this.getPets()[index];
    var rect = this.itemRect(index);
    var x = rect.x + 162;
    var y = rect.y + 10;
    var width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
};

Window_Pet.prototype.processOk = function() {
    if(this.index() >= 0) {
        this._selectedPet = this.getPets()[this.index()];
        Window_Selectable.prototype.processOk.call(this);
    }
};

Window_Pet.prototype.showStatusWindow = function() {
    this._showStatus = true;
    this._statusWindow.show();
    this._statusMenu.show();
    this.hide();
    //this._statusWindow.activate();
    this._statusMenu.activate();
    this.deactivate();
};

Window_Pet.prototype.statusWindow = function() {
    return this._statusWindow;
};

Window_Pet.prototype.statusMenu = function() {
    return this._statusMenu;
};

Window_Pet.prototype.closeStatusWindow = function() {
    this._showStatus = false;
    this._statusWindow.hide();
    //this._statusWindow.deactivate();
    this._statusMenu.hide();
    this._statusMenu.deactivate();
    this.activate();
    this.show();
};

Window_Pet.prototype.isCurrentItemEnabled = function() {
    if (this._formationMode) {
        var actor = this.getPets()[this.index()];
        return actor && actor.isFormationChangeOk();
    } else {
        return true;
    }
};

Window_Pet.prototype.selectLast = function() {
    this.select($gameParty.menuActor().index() || 0);
};

Window_Pet.prototype.formationMode = function() {
    return this._formationMode;
};

Window_Pet.prototype.setFormationMode = function(formationMode) {
    this._formationMode = formationMode;
};

Window_Pet.prototype.pendingIndex = function() {
    return this._pendingIndex;
};

Window_Pet.prototype.setPendingIndex = function(index) {
    var lastPendingIndex = this._pendingIndex;
    this._pendingIndex = index;
    this.redrawItem(this._pendingIndex);
    this.redrawItem(lastPendingIndex);
};

Window_Pet.prototype.pet = function() {
    return this.getPets()[this.index()];
};


/*
 *   WINDOW PET STATUS
 */

function Window_PetStatus() {
    this.initialize.apply(this, arguments);
}

Window_PetStatus.prototype = Object.create(Window_Base.prototype);
Window_PetStatus.prototype.constructor = Window_PetStatus;

Window_PetStatus.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

Window_PetStatus.prototype.setActivePet = function(pet) {
    this._pet = pet;
    this.refresh();
};

Window_PetStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth-240;
};

Window_PetStatus.prototype.windowHeight = function() {
    return Graphics.boxHeight;
};

Window_PetStatus.prototype.refresh = function() {
    this.contents.clear();

    if(this._pet) this.drawPet();
};

Window_PetStatus.prototype.drawPet = function()  {
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    var petName = this._pet.name();

    this.drawActorCharacter(this._pet, this.windowWidth()/2-20, 50);

    this.changeTextColor(this.textColor(20));
    this.drawText(petName, this.windowWidth()/2 - (this.textWidth(petName))-20, 65, width, false);
    //this.drawActorLevel(this._pet, this.windowWidth()/2 + (this.textWidth(petName)), 65);
    this.changeTextColor(this.normalColor());
    this.drawText(TextManager.levelA+": "+this._pet.level, this.windowWidth()/2 + (this.textWidth(petName)/2 - 30), 65, width, false);

    this.changeTextColor(this.textColor(1));
    this.drawText(profileLabel, x, 120, width, false);

    this.changeTextColor(this.normalColor());
    this.drawText(this._pet.profile(), x, 120 + this.lineHeight(), width, false);

    var yHunger = 120 + (this.lineHeight()*3);

    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorHunger(this._pet, x, yHunger, width2);
    this.drawActorObedience(this._pet, x+width2 + 50, yHunger, width2);
    this.drawPetSkills(x, yHunger + 100);
};

Window_PetStatus.prototype.drawPetSkills = function(x,y) {
    var skills = this._pet.skills();

    this.changeTextColor(this.systemColor());
    this.drawText("Skills",x, y, this.textWidth("Skills"), false);

    y += (this.lineHeight()*1) + 5;

    for(var i=0; i < skills.length; i++) {
        var skill = skills[i];
        this.changeTextColor(this.textColor(25));
        this.drawIcon(skill.iconIndex, x+15, y);
        this.drawText(skill.name,x+25+Window_Base._iconWidth, y, this.textWidth(skill.name), false);

        this.changeTextColor(this.normalColor());
        this.drawText(skill.description,x+(25+Window_Base._iconWidth), y + this.lineHeight(), this.textWidth(skill.description), false);

        y += this.lineHeight()*2;
    }
};


//----------------------------------------------------------------------------
// Window_PetsChoose
//
function Window_PetStatusMenu() {
    this.initialize.apply(this, arguments);
}

Window_PetStatusMenu.prototype = Object.create(Window_Command.prototype);
Window_PetStatusMenu.prototype.constructor = Window_PetStatusMenu;

Window_PetStatusMenu.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.makeCommandList();
    this.selectLast();
};


Window_PetStatusMenu.prototype.setActivePet = function(pet) {
    this._pet = pet;
    this.refresh();
};
Window_PetStatusMenu._lastCommandSymbol = null;

Window_PetStatusMenu.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_PetStatusMenu.prototype.windowWidth = function() {
    return 240;
};

Window_PetStatusMenu.prototype.windowHeight = function() {
    return 200;
};

Window_PetStatusMenu.prototype.numVisibleRows = function() {
    return 3;
};

Window_PetStatusMenu.prototype.makeCommandList = function() {
    this.addMainCommands();

};



Window_PetStatusMenu.prototype.addMainCommands = function() {

    this.addCommand(feedLabel+" ("+$gameParty.numItems($gameParty.getPetFood())+")", 'feed', true, "feed");
    this.addCommand("Select", 'selectPet', true, "selectPet");
    //this.callHandler("feed");

};

Window_PetStatusMenu.prototype.commandFeed = function() {
    this._pet.consumeFood(this._pet);
    this.refresh();
};

Window_PetStatusMenu.prototype.commandSelectPet = function() {
  $gameParty.setActivePet(this._pet.actorId());
  this.refresh();
};

Window_PetStatusMenu.prototype.processOk = function() {
    Window_PetStatusMenu._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_PetStatusMenu.prototype.selectLast = function() {
    this.selectSymbol(Window_PetStatusMenu._lastCommandSymbol);
};








//-----------------------------------------------------------------------------
// Window_PetsLabel
//
// The window for displaying the Pets Label.

function Window_PetsLabel() {
    this.initialize.apply(this, arguments);
}

Window_PetsLabel.prototype = Object.create(Window_Base.prototype);
Window_PetsLabel.prototype.constructor = Window_PetsLabel;

Window_PetsLabel.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

Window_PetsLabel.prototype.windowWidth = function() {
    return 240;
};

Window_PetsLabel.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_PetsLabel.prototype.refresh = function() {
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    this.drawText(this.value(), x, 0, width, false);
};

Window_PetsLabel.prototype.value = function() {
    return petsLabel;
};


Window_PetsLabel.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};


// ####### Game_Actor /////

Game_Actor.prototype.hunger = 50;
Game_Actor.prototype.obedience = 1;

Game_Actor.prototype.addObedience = function(o) {
    this.obedience += o;
    if(this.obedience < 0) this.obedience = 0;
    if(this.obedience > 10) this.obedience = 10;
};

Game_Actor.prototype.addHunger = function(h) {
    this.hunger += h;
    if(this.hunger < 0) this.hunger = 0;
    if(this.hunger > 100) this.hunger = 100;
};

Game_Party.prototype.getPetFood = function() {
    var petFood = $dataItems[petFoodIndex];
    return petFood;
};

Game_Party.prototype.getPets = function() {
    var pets = [];
    $gameParty.allPartyMembers().forEach(function (actor) {
        if($dataActors[actor.actorId()].meta.pet == "1") {
            pets.push(actor);
        }
    });
    return pets;
};

Game_Party.prototype.getActivePets = function() {
    var activePets = [];
    this.getPets().forEach(function(actor) {
        if($dataActors[actor.actorId()].meta.no_battle != "1") {
            activePets.push(actor);
        }
    });
    return activePets;
};

Game_Party.prototype.setActivePet = function(id) {
  this.getPets().forEach(function(actor) {
    $dataActors[actor.actorId()].meta.no_battle = "1";
    if(actor.actorId() == id) {
      $dataActors[actor.actorId()].meta.no_battle = "0";
    }
  });
};

Game_Party.prototype.getPetFoodNum = function() {
    var num = this.numItems(this.getPetFood());
    return num;
};

var _Game_Party_maxBattleMembers = Game_Party.prototype.maxBattleMembers;
Game_Party.prototype.maxBattleMembers = function() {
    var size = _Game_Party_maxBattleMembers.call(this);
    return size+(this.getActivePets().length);
};

Game_Actor.prototype.consumeFood = function(actor) {
    if($gameParty.getPetFoodNum() > 0) {
        this.beforeConsumeFood(actor);
        $gameParty.loseItem($gameParty.getPetFood(),1, false);
        actor.addHunger(10);

    }
};

Game_Actor.prototype.beforeConsumeFood = function(actor) {
    if(decisionSound == "NULL") return false;
    AudioManager.playSe({name: decisionSound, volume: 90, pitch: 100, pan: 0});
};

Game_Actor.prototype.isHungry = function() {
  if(this.hungerStrike || this.hunger < this.getPetFoodConsume()) {
    this.hungerStrike = true;
    return true;
  }
  return false;
};

Game_Actor.prototype.isStubborn = function() {
  var randomNum = Math.floor(Math.random()*101) + (this.getPetObediencePercentLevel());
  console.log("WILLENSKRAFT FUER PET: "+randomNum);
  return (randomNum < this.getPetObediencePercent());
};

Game_Actor.prototype.wantsToFight = function() {
  if(!this.isPet()) return true;
  return (!this.isHungry() && !this.isStubborn());
}

var _Game_Actor_makeActions = Game_Actor.prototype.makeActions;
Game_Actor.prototype.makeActions = function() {
  Game_Battler.prototype.makeActions.call(this);
  if (this.numActions() > 0) {
    this.setActionState('undecided');
  } else {
    this.setActionState('waiting');
  }
  if(this.isPet() && !this.wantsToFight()) {
    this.makeStubbornPetAction.call(this);
  }
  if (this.isAutoBattle()) {
    this.makeAutoBattleActions();
  } else if (this.isConfused()) {
    this.makeConfusionActions();
  }
};

Game_Actor.prototype.makeStubbornPetAction = function() {
  for (var i = 0; i < this.numActions(); i++) {
    console.log("set action");
    this.action(i).setGuard();
  }
  this.setActionState('waiting');
};


Game_Actor.prototype.getPetFoodConsume = function() {
  return (this.foodConsumePerFight) ? this.foodConsumePerFight : 5;
};

Game_Actor.prototype.lowerHunger = function() {
  if(!this.hungerStrike) {
    this.hunger -= this.getPetFoodConsume();
    this._foodRoundCount = 0;
  }
};

Game_Actor.prototype.isPet = function() {
  return $dataActors[this.actorId()].meta.pet == "1";
};

Game_Actor.prototype.getPetObediencePercent = function() {
  return 100;
};

Game_Actor.prototype.getPetObediencePercentLevel = function() {
  var levelMap = [
    0,
    0,
    5,
    15,
    20,
    30,
    40,
    55,
    60,
    80,
    100
  ];

  return  levelMap[this.obedience];
};

Game_Actor.prototype.getObedienceAfterBattle = function() {
  var levelMap = [
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ];

  return  levelMap[this.obedience];
};

Game_Actor.prototype.getFoodDecreaseBattles = function() {
  return this._foodDecreaseBattles || 3;
}

Game_Actor.prototype.battleCount = function() {
  return this._battleCount;
};

Game_Actor.prototype.foodRoundCount = function() {
  return this._foodRoundCount;
};

Game_Actor.prototype.checkForHunger = function() {
  if(this._foodRoundCount >= this.getFoodDecreaseBattles()) {
    this.lowerHunger();
  }
};

Game_Actor.prototype.checkForObedience = function() {
  if(this.battleCount() >= this.getObedienceAfterBattle()) {
    this.obedience++;
    this.onObedienceRaise();
  }
};

Game_Actor.prototype.onObedienceRaise = function() {
  // Overwrite me
};

var _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
  if(typeof this._battleCount != "number") { this._battleCount = 0;}
  this._battleCount++;
  _Game_Battler_onBattleEnd.call(this);
};

Game_Party.prototype.onBattlePetEnd = function() {
  this.getActivePets().forEach(function(pet) {
    if(typeof pet._foodRoundCount != "number") { pet._foodRoundCount = 0;}
    if(typeof pet._battleCount != "number") { pet._battleCount = 0;}

    if(!pet.hungerStrike) {
      pet._foodRoundCount++;
      pet._battleCount++;
      pet.checkForHunger();
      pet.checkForObedience();
    }

    pet.hungerStrike = false;

  });
};


var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
  _Scene_Battle_terminate.call(this);
  $gameParty.onBattlePetEnd();
};
