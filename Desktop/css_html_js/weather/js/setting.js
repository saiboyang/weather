$(function() {
  
  var citiesSelected = localStorage.getItem("citiesSelected");
  citiesSelected = JSON.parse(citiesSelected);

  function showListOfCities (){
    var newContent = "";
    for (var i = 0; i < citiesSelected.length; i++) { 
        newContent += '<li>' + citiesSelected[i].name+"("+citiesSelected[i].country+')</li>';
    }
    $("ul").html(newContent);
  }

  showListOfCities();

  function addCity(city){
    $.ajax({
      type: "GET",
      url:"http://api.openweathermap.org/data/2.5/weather",
      dadaType:"json",
      data:{
        q: city,
        appid:"44db6a862fba0b067b1930da0d769e98"
      },
      beforeSend:function(XMLHttpRequest){
        $("form").after('<div class="notice" id="loading">Validation de la ville en cours</div>');
      },
      success: function(data){
        if(data.name.toLowerCase() == city.toLowerCase()){
          citiesSelected.push({
            id: data.id,
            name : data.name,
            country : data.sys.country
          });
          localStorage.setItem('citiesSelected',  JSON.stringify(citiesSelected));
          $("ul").prepend('<li>' + data.name+"("+data.sys.country+')</li>');
          $("#loading").empty();
          $('input:text').val("");
        }else{
          $("form").after('<p class="notice" id="noresultat">Aucun r&egrave;sultant</p>');
          $("#loading").remove();
        }
        
      },
      error:function(error){
        $("#loading").empty();
        /*TODO*/
      }
    });
  }

  // SETUP
  var $list, $newItemForm, $newItemButton;
  var item = '';                                 
  $list = $('ul');                               
  $newItemForm = $('#newItemForm');              
  $newItemButton = $('#newItemButton');          

  $('li').hide().each(function(index) {          // Hide list items
    $(this).fadeIn(1600);                        // Then fade them in
  });


  // SETUP FORM FOR NEW ITEMS
  $newItemButton.show();                         
  $newItemForm.hide();                           
  $('#showForm').on('click', function() {        
    $newItemButton.hide();                       
    $newItemForm.show();                         
  });

  // ADDING A NEW LIST ITEM
  $newItemForm.on('submit', function(e) {       
    e.preventDefault();                      
    $("#loading").remove();
    $("#noresultat").remove();
    var cityName = $('input:text').val();
    var index = citiesSelected.map(function (value) {
      return value.name.toLowerCase();
    }).indexOf(cityName.toLowerCase());
    if(index == -1) addCity(cityName);
    else  $("form").after('<p class="notice" id="loading">Vueillez vous saisir une nouvelle ville</p>');
  });

  // CLICK HANDLING - USES DELEGATION ON <ul> ELEMENT
  $list.on('click', 'li', function() {
    var $this = $(this);               // Cache the element in a jQuery object
    var complete = $this.hasClass('complete');  

    if (complete === true) {      
      $this.animate({                  
        opacity: 0.0,
        paddingLeft: '+=180'
      }, 500, 'swing', function() {    
        $this.remove();
        var newArr = $this.text().split("("); 
        var index = citiesSelected.map(function (value) {return value.name.toLowerCase();})
        .indexOf(newArr[0].toLowerCase());
        citiesSelected.splice(index,1);
        localStorage.setItem('citiesSelected',  JSON.stringify(citiesSelected));
      });
    }
  });                                  // End of event handler

  $list.on('mouseover', 'li', function() {
    var $this = $(this);              
    item = $this.text();             
    if(citiesSelected.length > 1) $this.addClass('complete');
  });                                  // End of event handler

  $list.on('mouseout', 'li', function() {
    var $this = $(this);              
    $this.removeClass('complete');
  });                                  // End of event handler

});