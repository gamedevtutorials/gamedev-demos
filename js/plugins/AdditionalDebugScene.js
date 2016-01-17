Input.keyMapper[79] = 'bigstepdown';
Input.keyMapper[80] = 'bigstepup';

Scene_Map.prototype.isBlaMenuCalled = function() {
    return Input.isTriggered('bigstepdown');
};
