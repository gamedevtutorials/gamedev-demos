/*:
 * @plugindesc Displays dynamic actor Faces v2
 * @author Gamedev Tutorials
 *
 * @param Actors Picture Name
 * @desc The name for the face picture which represents the actors Index
 * @default Actors
 *
 *
 */


(function() {

  var parameters = PluginManager.parameters('DynamicFaces');
  var actorPictureName = String(parameters['Actors Picture Name'] || 'Actors');

  var _Window_Base_drawFace = Window_Base.prototype.drawFace;
  Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {

     /*if(faceName == actorPictureName) {
       faceName =  $gameActors.actor(faceIndex+1).faceName();
       faceIndex =  $gameActors.actor(faceIndex+1).faceIndex();
     }*/
     _Window_Base_drawFace.call(this,faceName, faceIndex, x, y, width, height)

  };

  var _Window_Message_loadMessageFace = Window_Message.prototype.loadMessageFace;
  Window_Message.prototype.loadMessageFace = function() {

   if($gameMessage.faceName().indexOf(actorPictureName) == 0) {
     var actorIndex = $gameMessage.faceIndex()+1;

     var postFix = "";
     if($gameMessage.faceName().indexOf(actorPictureName+"_") == 0) {
       postFix = "_"+$gameMessage.faceName().substr((actorPictureName+"_").length);
     }
     var faceName =  $gameActors.actor(actorIndex).faceName()+postFix;
     var faceIndex =  $gameActors.actor(actorIndex).faceIndex();
     $gameMessage.setFaceImage(faceName, faceIndex);
   }

   _Window_Message_loadMessageFace.call(this);

  };

})();
