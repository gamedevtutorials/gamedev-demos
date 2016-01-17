/**
 * Created by Gilles on 09.12.2015.
 */
 /*:
  * @plugindesc You can lower prices in your shops with a variable which shows the discount
  * @author Gilles Meyer (admin@gamedev-tutorials.de)
  *
  * @param Discount Variable
  * @desc Variable Number for the discount (The values inside the variable: 0 = no discount, 100 = free shopping, -100 = doubles the price)
  * @default 10
  *
  * @param Multiple Discount
  * @desc Give Discount on already discounted Goods? (0 = no, 1 = yes)
  * @default 1
  *
  * @param Discount On
  * @desc Is the discount on? (0 = no, 1 = yes)
  * @default 1
  *
  *
  *
  * @help
  */
  


(function() {

  var parameters = PluginManager.parameters('CustomPrices');
  var discountVariable = Number(parameters['Discount Variable'] || 10);
  var giveDiscount = (parameters['Discount On'] == "0") ? false : true;
  var multiDiscount = (parameters['Multiple Discount'] == "0") ? false : true;
  var currentShopOwner = 0;



  function calculateDiscount(price, discount, alreadyDiscount) {
     if(!multiDiscount && alreadyDiscount) return price;

     if(discount  < 0) {
       discount*=-1;
       return Math.round(price + (price/100 * discount));
     } else{
       var newPrice = Math.round(price - (price/100 * discount));
       return (newPrice < 0) ? 0 : newPrice;
     }
  }

  //var _Window_ShopBuy_makeItemList = Window_ShopBuy.prototype.makeItemList;
  Window_ShopBuy.prototype.makeItemList = function() {
      this._data = [];
      this._price = [];
      this._shopGoods.forEach(function(goods) {
          var item = null;
          switch (goods[0]) {
          case 0:
              item = $dataItems[goods[1]];
              break;
          case 1:
              item = $dataWeapons[goods[1]];
              break;
          case 2:
              item = $dataArmors[goods[1]];
              break;
          }
          if (item) {
              this._data.push(item);

              var shopVar = (currentShopOwner != 0) ? currentShopOwner : discountVariable;
              var discount = $gameVariables.value(shopVar);
              if(giveDiscount && discount != 0) {
                this._price.push(calculateDiscount((goods[2] === 0 ? item.price : goods[3]), discount, goods[2] === 0));
              } else {
                this._price.push(goods[2] === 0 ? item.price : goods[3]);
              }

          }
      }, this);
  };

  // PLUGIN COMMANDS


  var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        // insert additional processing details here
        try {
          if(command == "GDT" && args[0] == "Price") {
            setShopOwner(args[1]);
          }
        } catch(e) {}
    };

  var setShopOwner = function(varNumber) {
    currentShopOwner = varNumber;
  };


})();
