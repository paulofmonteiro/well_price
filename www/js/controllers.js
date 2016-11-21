angular.module('starter.controllers', [])

.controller('PriceCtrl', function($scope, $ionicActionSheet, $ionicPopup, $timeout) {
  var self = this;

  $scope.calculationType = 'Escolha o que deseja calcular';
  self.calculationTypeIndex = 0;

  self.calculationTable = [];

  $scope.result = { 'title': 'título do resultado', 'value': 0, 'show': false};

  $scope.fields = [
    { 'label': 'Montante', 'value': null, 'show': true }, 
    { 'label': 'Período', 'value': null, 'show': true },
    { 'label': 'Taxa', 'value': null, 'show': true },
    { 'label': 'Parcela', 'value': null, 'show': false },
    { 'label': 'Amortização', 'value': null, 'show': false },
    { 'label': 'Qual o mês que deseja', 'value': null, 'show': true }  
  ]   

    // Triggered on a button click, or some other target
  $scope.show = function() {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
          { text: '<span class="sheet-button">Valor da Parcela</span>' },
          { text: '<span class="sheet-button">Valor da Amortização' },
          { text: '<span class="sheet-button">Valor da Amortização Acumulada' },
          { text: '<span class="sheet-button">Valor da Amortização Acumulada %' },
          { text: '<span class="sheet-button">Valor do Juros' }
       ],

       titleText: 'Escolha o tipo de calculo que deseja realizar',

       buttonClicked: function(index) {
          var size = $scope.fields.length; 

          switch(index){
            case 0: 
              $scope.calculationType = 'Valor da Parcela';
              self.calculationTypeIndex = index;
              break;

            case 1: 
              $scope.calculationType = 'Valor da Amortização';
              self.calculationTypeIndex = index;
              break;
            case 2: 
              $scope.calculationType = 'Valor da Amortização Acumulada';
              self.calculationTypeIndex = index;
              break;
            case 3: 
              $scope.calculationType = 'Valor da Amortização Acumulada %';
              self.calculationTypeIndex = index;
              break;
            case 4: 
              $scope.calculationType = 'Valor do Juros';
              self.calculationTypeIndex = index;
              break;
          }

          console.log(index);
          return true;
       }
     });

     // For example's sake, hide the sheet after two seconds
     /*$timeout(function() {
       hideSheet();
     }, 10000);*/

   };

   $scope.calculation = function(){
     self.buildTable();
     self.getResult($scope.fields[5].value ? $scope.fields[5].value : 1);
      
      var alertPopup = $ionicPopup.alert({
        title: $scope.result.title,
        template:  $scope.result.value
      });

      alertPopup.then(function(res) {
        $scope.result.show = true;
      });

      console.log(self.calculationTable);
   };

   self.setParcelasFields = function(size){

     for(var i = 0; i < size; i++){
        if($scope.fields[i].label == "Parcela") $scope.fields[i].show = false;
        if($scope.fields[i].label == "Amortização") $scope.fields[i].show = false;

        if($scope.fields[i].label == "Montante") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Período") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Taxa") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Qual o mês que deseja") $scope.fields[i].show = true;

        $scope.fields[i].value = '';
     }

   };

   self.setAmortizacaoFields = function(size){

     for(var i = 0; i < size; i++){
        if($scope.fields[i].label == "Parcela") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Amortização") $scope.fields[i].show = false;

        if($scope.fields[i].label == "Montante") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Período") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Taxa") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Qual o mês que deseja") $scope.fields[i].show = true;

        $scope.fields[i].value = '';
     }

   };

   self.calcParcela = function(){
     var montante = $scope.fields[0].value;
     var periodo = $scope.fields[1].value;
     var taxa = $scope.fields[2].value;

     var result = montante * taxa / (1 - 1 / Math.pow((1 + taxa), periodo));
     return result;
   };

   self.buildTable = function(){
     var size = $scope.fields[1].value;

     var montante =  $scope.fields[0].value;
     var saldoDevedor =  $scope.fields[0].value;
     var periodo = $scope.fields[1].value;
     var taxa = $scope.fields[2].value;
     var parcela = $scope.fields[3].value ? $scope.fields[3].value : self.calcParcela();

     var juros = saldoDevedor * taxa;

     for(var i = 0; i < size; i++){
       

       if(i == 0){
        var juros = saldoDevedor * taxa;
        
        var amortizacao = parcela - juros;
        var amortizacao_porc =amortizacao / montante;
        var amortizacao_acumulada_porc = amortizacao_porc + 0;
        var amortizacao_acumulada_valor =amortizacao;

        var saldoDevedor =saldoDevedor - amortizacao;
      }else{
        var juros = self.calculationTable[i-1].saldo * taxa;
        
        var amortizacao = parcela - juros;
        var amortizacao_porc = amortizacao / montante;
        var amortizacao_acumulada_porc =  amortizacao_porc +  self.calculationTable[i-1].amortizacao_acumulada_porc;
        var amortizacao_acumulada_valor =  amortizacao + self.calculationTable[i-1].amortizacao_acumulada_valor;

        var saldoDevedor = saldoDevedor - amortizacao;
       }        

       self.calculationTable[i] = {
         'saldo': saldoDevedor,
         'juros': juros,
         'amortizacao': amortizacao,
         'amortizacao_porc': amortizacao_porc,
         'amortizacao_acumulada_porc':  amortizacao_acumulada_porc,
         'amortizacao_acumulada_valor': amortizacao_acumulada_valor,
         'parcela': parcela
       }
     }
   };

   self.getResult = function(mes){
     console.log(mes);

     switch(self.calculationTypeIndex){
        case 0:
          $scope.result.value = 'R$' + (self.calculationTable[mes - 1].parcela).toFixed(2);
          $scope.result.title = "Valor da Parcela - " + mes;
          break;
        case 1:
          $scope.result.value = 'R$' + (self.calculationTable[mes - 1].amortizacao).toFixed(2);
          $scope.result.title = "Valor da Amortização - " + mes;
          break;
        case 2:
          $scope.result.value = 'R$' + (self.calculationTable[mes - 1].amortizacao_acumulada_valor).toFixed(2);
          $scope.result.title = "Valor da Amortização Acumulada - " + mes;
          break;
        case 3:
          $scope.result.value = (self.calculationTable[mes - 1].amortizacao_acumulada_porc).toFixed(2) + '%';
          $scope.result.title = "Valor da Amortização Acumulada(%) - " + mes;
          break;
        case 4:
          $scope.result.value = 'R$' + (self.calculationTable[mes - 1].juros).toFixed(2);
          $scope.result.title = "Valor do Juros - " + mes;
          break;
      }
     
   }

})

.controller('SACCtrl', function($scope, $ionicActionSheet, $ionicPopup, $timeout) {
  var self = this;

  $scope.calculationType = 'Escolha o que deseja calcular';
  self.calculationTypeIndex = 0;

  self.calculationTable = [];

  $scope.result = { 'title': 'título do resultado', 'value': 0, 'show': false};

  $scope.fields = [
    { 'label': 'Montante', 'value': null, 'show': true }, 
    { 'label': 'Período', 'value': null, 'show': true },
    { 'label': 'Taxa', 'value': null, 'show': true },
    { 'label': 'Parcela', 'value': null, 'show': false },
    { 'label': 'Amortização', 'value': null, 'show': false },
    { 'label': 'Qual o mês que deseja', 'value': null, 'show': true }  
  ]   

    // Triggered on a button click, or some other target
  $scope.show = function() {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
          { text: '<span class="sheet-button">Valor da Parcela</span>' },
          { text: '<span class="sheet-button">Valor da Amortização' },
          { text: '<span class="sheet-button">Valor da Amortização Acumulada' },
          { text: '<span class="sheet-button">Valor da Amortização Acumulada %' },
          { text: '<span class="sheet-button">Valor do Juros' }
       ],

       titleText: 'Escolha o tipo de calculo que deseja realizar',

       buttonClicked: function(index) {
          var size = $scope.fields.length; 

          switch(index){
            case 0: 
              $scope.calculationType = 'Valor da Parcela';
              self.calculationTypeIndex = index;
              break;

            case 1: 
              $scope.calculationType = 'Valor da Amortização';
              self.calculationTypeIndex = index;
              break;
            case 2: 
              $scope.calculationType = 'Valor da Amortização Acumulada';
              self.calculationTypeIndex = index;
              break;
            case 3: 
              $scope.calculationType = 'Valor da Amortização Acumulada %';
              self.calculationTypeIndex = index;
              break;
            case 4: 
              $scope.calculationType = 'Valor do Juros';
              self.calculationTypeIndex = index;
              break;
          }

          console.log(index);
          return true;
       }
     });

     // For example's sake, hide the sheet after two seconds
     /*$timeout(function() {
       hideSheet();
     }, 10000);*/

   };

   $scope.calculation = function(){
     self.buildTable();
     self.getResult($scope.fields[5].value ? $scope.fields[5].value : 1);
      
      var alertPopup = $ionicPopup.alert({
        title: $scope.result.title,
        template:  $scope.result.value
      });

      alertPopup.then(function(res) {
        $scope.result.show = true;
      });

      console.log(self.calculationTable);
   };

   self.setParcelasFields = function(size){

     for(var i = 0; i < size; i++){
        if($scope.fields[i].label == "Parcela") $scope.fields[i].show = false;
        if($scope.fields[i].label == "Amortização") $scope.fields[i].show = false;

        if($scope.fields[i].label == "Montante") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Período") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Taxa") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Qual o mês que deseja") $scope.fields[i].show = true;

        $scope.fields[i].value = '';
     }

   };

   self.setAmortizacaoFields = function(size){

     for(var i = 0; i < size; i++){
        if($scope.fields[i].label == "Parcela") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Amortização") $scope.fields[i].show = false;

        if($scope.fields[i].label == "Montante") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Período") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Taxa") $scope.fields[i].show = true;
        if($scope.fields[i].label == "Qual o mês que deseja") $scope.fields[i].show = true;

        $scope.fields[i].value = '';
     }

   };

   self.calcAmortizacao = function(){
     var montante = $scope.fields[0].value;
     var periodo = $scope.fields[1].value;     

     var result = montante / periodo;
     return result;
   };

   self.buildTable = function(){
     var size = $scope.fields[1].value;

     var montante =  $scope.fields[0].value;
     var saldoDevedor =  $scope.fields[0].value;
     var periodo = $scope.fields[1].value;
     var taxa = $scope.fields[2].value;
     var amortizacao = $scope.fields[4].value ? $scope.fields[3].value : self.calcAmortizacao();

     var juros = saldoDevedor * taxa;

     for(var i = 0; i < size; i++){
       

       if(i == 0){
        var juros = saldoDevedor * taxa;
        
        var parcela = juros + amortizacao;
        var amortizacao_porc =amortizacao / montante;
        var amortizacao_acumulada_porc = amortizacao_porc + 0;
        var amortizacao_acumulada_valor =amortizacao;

        var saldoDevedor =saldoDevedor - amortizacao;
      }else{
        var juros = self.calculationTable[i-1].saldo * taxa;
        
        var parcela = juros + amortizacao;
        var amortizacao_porc = amortizacao / montante;
        var amortizacao_acumulada_porc =  amortizacao_porc +  self.calculationTable[i-1].amortizacao_acumulada_porc;
        var amortizacao_acumulada_valor =  amortizacao + self.calculationTable[i-1].amortizacao_acumulada_valor;

        var saldoDevedor = saldoDevedor - amortizacao;
       }        

       self.calculationTable[i] = {
         'saldo': saldoDevedor,
         'juros': juros,
         'amortizacao': amortizacao,
         'amortizacao_porc': amortizacao_porc,
         'amortizacao_acumulada_porc':  amortizacao_acumulada_porc,
         'amortizacao_acumulada_valor': amortizacao_acumulada_valor,
         'parcela': parcela
       }
     }
   };

   self.getResult = function(mes){
     console.log(mes);

     switch(self.calculationTypeIndex){
        case 0:
          $scope.result.value = 'R$' + (self.calculationTable[mes - 1].parcela).toFixed(2);
          $scope.result.title = "Valor da Parcela - " + mes;
          break;
        case 1:
          $scope.result.value = 'R$' + (self.calculationTable[mes - 1].amortizacao).toFixed(2);
          $scope.result.title = "Valor da Amortização - " + mes;
          break;
        case 2:
          $scope.result.value = 'R$' + (self.calculationTable[mes - 1].amortizacao_acumulada_valor).toFixed(2);
          $scope.result.title = "Valor da Amortização Acumulada - " + mes;
          break;
        case 3:
          $scope.result.value = (self.calculationTable[mes - 1].amortizacao_acumulada_porc).toFixed(2) + '%';
          $scope.result.title = "Valor da Amortização Acumulada(%) - " + mes;
          break;
        case 4:
          $scope.result.value = 'R$' + (self.calculationTable[mes - 1].juros).toFixed(2);
          $scope.result.title = "Valor do Juros - " + mes;
          break;
      }
     
   }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AboutCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
