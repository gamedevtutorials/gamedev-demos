/*:
 * @plugindesc Loads Text which can be accessed in the Message Window via \text[filename, key] or \text[key] for default file
 * @author Gilles Meyer - Gamedev-Tutorials
 *
 * @param Default File Name
 * @desc The default file name which should be loaded on start into $dataText.defaultText (if empty. no file will be loaded)
 * @default defaultText.json
 *
 * @param Text Data Folder
 * @desc The folder where all the textes are loaded from
 * @default data/texts
 *
 *
 * @help
 * First you need to load the files. You can do this by plugin commands.
 * The defaultText.json is always loaded.
 * ########################
 * -----------------------------
 * Load a default file:
 * -----------------------------
 * TextLoader load myFile.json
 *
 * -----------------------------
 * Load into specific namespace:
 * -----------------------------
 * TextLoader load mySpace myFile2.json
 *
 * ########################
 *
 * After you loaded the texts, you can use them in Messages like this
 *
 *
 * ########################
 * -----------------------------
 * Use a default value:
 * -----------------------------
 * \text[myKey]
 *
 * -----------------------------
 * Use a value from a namespace:
 * -----------------------------
 * \text[mySpace, myKey]
 *
 *
 * ################################
 *
 * EXAMPLE:
 *
 * Plugin Command
 * -----------------------------
 * // Change language from english to german
 * TextLoader load german.json
 * -----------------------------
 *
 * Message in RPG Maker
 * -----------------------------
 * \text[say hi to actor]
 *
 * or
 *
 * \text[default, hello world]
 *
 * -----------------------------
 *
 * german.json
 * -----------------------------
 * {
 *   "say hi to actor" : "Hallo \N[1]!",
 *   "hello world" : "Hallo Welt"
 * }
 *
 * -----------------------------
 *
 */




$dataText = [];

GDT = (typeof GDT == "undefined") ? {} : GDT;
GDT.TL = {};
GDT.TL._folder = "data";

GDT.TL.doRequest = function(name, src) {
  var xhr = new XMLHttpRequest();
  var url = GDT.TL._folder+'/' + src;
  xhr.open('GET', url);
  xhr.overrideMimeType('application/json');
  xhr.onload = function() {
    if (xhr.status < 400) {
      $dataText[name] = JSON.parse(xhr.responseText);
      //DataManager.onLoad($dataText[name]);
    }
  };
  xhr.onerror = function() {
    DataManager._errorUrl = DataManager._errorUrl || url;
  };
  $dataText[name] = null;
  xhr.send();
};

GDT.TL.load = function(variable, file) {
  if(!variable && !file) return false;

  if(typeof file != "string") {
    file = variable;
    variable = "default";
  }
  if(file.indexOf(".") < 0) {
    file += ".json";
  }

  GDT.TL.doRequest(variable, file);
};


GDT.TL.text = function(args, optKey) {
  var file,key;

  var splitted = (optKey) ? [args, optKey] : args.split(",");
  if(splitted.length == 1) {
    file = "defaultText";
    key = splitted[0].trim();
  } else {
    file = splitted[0].trim();
    key = splitted[1].trim();
  }
  var value = "";
  try {
   value = $dataText[file][key];
  } catch(e) {}

  return value;
};



(function() {


  var parameters = PluginManager.parameters('TextLoader');
  var defaultText = String(parameters['Default File Name']);
  GDT.TL._folder = String(parameters['Text Data Folder'] || "data");


  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command.toLowerCase() === 'textloader') {
      switch (args[0]) {
        case 'load':
          GDT.TL.load.apply(this,[].splice.call(arguments[1],1));
          break;
      }
    }
  };


  var _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {

    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');

    text = text.replace(/\x1bText\[([A-z ]+)\]/gi, function() {
      return GDT.TL.text(arguments[1]);
    }.bind(this));

    text = text.replace(/\x1bText\[([A-z ]+,[A-z ]+)\]/gi, function() {
      return GDT.TL.text(arguments[1]);
    }.bind(this));

    return _Window_Base_convertEscapeCharacters.call(this,text);

  };

  var _DataManager_loadDatabase = DataManager.loadDatabase;
  DataManager.loadDatabase = function() {
    _DataManager_loadDatabase.call(this);
    if(defaultText) {
      GDT.TL.load("defaultText",defaultText);
    }

  };





})();
