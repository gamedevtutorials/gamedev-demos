/*:
 * @plugindesc .
 * @author Warliet
 *
 * @param ImageNr
 * @desc Default CharacterImage is Actor1
 * @default 1
 *
 * @param ImageID
 * @desc Default CharacterImageID is 0
 * @default 0
 *
 * @help Facesets have to be named "Actor[n]"
 *
 */
function VFG_change(_CharacterImageNr, _FaceImageNr, _setBattlerImage, ImageID, ImageNr){
 if ($gameSwitches.value(21)){
   $gameActors.actor(1).setCharacterImage(_CharacterImageNr, ImageID);
   $gameActors.actor(1).setFaceImage(_FaceImageNr, ImageID);
   $gameActors.actor(1).setBattlerImage(_setBattlerImage);
   $gamePlayer.refresh();
    }
 }

(function(){

var parameters = PluginManager.parameters('Variable Facegraphic');
var ImageNr = String(parameters['ImageNr'] ||1);
var ImageID = String(parameters['ImageID'] ||0);
var _CharacterImageNr = "Actor" + ImageNr;
var _FaceImageNr = "Actor" + ImageNr;
var _setBattlerImage = "Actor" + ImageNr + "_" + ImageID;

var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'FaceGraphic') {
        switch (args[0]) {
        case 'change':
            VFG_change(_CharacterImageNr, _FaceImageNr, _setBattlerImage, ImageID, ImageNr);
            break;
        }
      }
    };

})();
