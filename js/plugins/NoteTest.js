/*:
 * @plugindesc Test for Notes
 * @author Gamedev Tutorials
 *
 * @param Variable Number
 * @desc Where should the result be saved of the plugin commands?
 * @default 18
 *
 */

if(typeof GDT == "undefined" || typeof GDT.Core == "undefined") {
  throw new Error("Please import GDTCore.js before NoteTest.js");
}


(function() {

  var parameters = PluginManager.parameters('NoteTest');
  var varNumber = parseInt(parameters['Variable Number'] || 18, 10);



  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command.toLowerCase() === 'automat') {
      switch (args[0].toLowerCase()) {
        case 'setprice':
          var price = parseInt(args[1]);
          var index = $gameParty._actors[0];
          var note = $dataActors[index].note;
          if(note != "") {
            var percent = 100;
            var value = GDT.Core.parseTag(note, "Automat");
            if(value) {
              percent += parseInt(value);
            }
            price = price /100 * percent;
          }

          $gameVariables.setValue(varNumber, price);
          break;
      }
    }
  };

})();
