/*:
 * @plugindesc Change of Faceset, Characters and SV_Battler
 * @author Warliet supported by Gamedev Tutorials
 *
 * @param ImageNr
 * @desc Default CharacterImage is Actor1
 * @default 1
 *
 * @param ImageID
 * @desc Default CharacterImageID is 0
 * @default 0
 *
 * @param switchNr
 * @desc Default Switch 001
 * @default 1
 *
 * @help Facesets and Characters have to be named "Actor[x]".
 * For best working a new Actorset should be called "Actor4".
 * For SV_Battler: "Actor[x]_[y]"
 *
 * To change the image in textboxes please install DynamicFaces by Gamedev Tutorials:
 * http://gamedev-tutorials.de/dynamic-faces-dynamische-gesichter/
 */
function VFG_change(_CharacterImageNr, _FaceImageNr, _setBattlerImage, ImageID, ImageNr, switchNr){
 if ($gameSwitches.value(switchNr)){
   $gameActors.actor(1).setCharacterImage(_CharacterImageNr, ImageID);
   $gameActors.actor(1).setFaceImage(_FaceImageNr, ImageID);
   $gameActors.actor(1).setBattlerImage(_setBattlerImage);
   $gamePlayer.refresh();
    }
 }

(function(){

var parameters = PluginManager.parameters('VariableGraphics');
var ImageNr = String(parameters['ImageNr'] ||1);
var ImageID = String(parameters['ImageID'] ||0);
var switchNr = String(parameters['switchNr'] ||1);
var _CharacterImageNr = "Actor" + ImageNr;
var _FaceImageNr = "Actor" + ImageNr;
var _setBattlerImage = "Actor" + ImageNr + "_" + ImageID;

var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'VariableGraphic') {
        switch (args[0]) {
        case 'change':
            VFG_change(_CharacterImageNr, _FaceImageNr, _setBattlerImage, ImageID, ImageNr, switchNr);
            break;
        }
      }
    };

})();
