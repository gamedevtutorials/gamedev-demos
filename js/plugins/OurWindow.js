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
    //this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
};

Window_PetsLabel.prototype.value = function() {
    return "PETS";
};


Window_PetsLabel.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};
