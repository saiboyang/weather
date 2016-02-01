$(function(){
	//localStorage.clear();
	var cityDefault = "Paris",
	countryDefqult = "FR",
	citySelected = {},
	detailsArr = [],
	ContentLeft = '',
	cityCountyArr = [];
	var cityCountyName = cityDefault+","+countryDefqult;
	var newContent = '';

	if(!localStorage.getItem('citiesSelected')) {
		$.ajax({
			type: "GET",
			url:"http://api.openweathermap.org/data/2.5/weather",
			dadaType:"json",
			data:{
				q: cityCountyName,
				appid:"44db6a862fba0b067b1930da0d769e98"
			},
			success: function(data){
				cityCountyArr.push({
					id: data.id,
					name : data.name,
					country : data.sys.country
				});
				localStorage.setItem('citiesSelected',  JSON.stringify(cityCountyArr));
			    newContent += '<li>' + data.name + '</li>'; // Display times on page 
				ContentLeft = '<div class="col-md-6"><ul>' + newContent + '</ul></div>';
				getDetail(data,0);
			},
			error:function(error){
				alert($.parseJSON(error.responseText));
			}
		});
	}
	else {
		var IdArr = [];
		cityCountyArr = localStorage.getItem('citiesSelected');
		IdArr = JSON.parse(cityCountyArr).map(function(value) { return value.id; });
		$.ajax({
			type: "GET",
			url:"http://api.openweathermap.org/data/2.5/group",
			dadaType:"json",
			data:{
				id: IdArr.join(),
				units: "metric",
				appid:"44db6a862fba0b067b1930da0d769e98"
			},
			success: function(data){
				detailsArr = data;
			    for (var i = 0; i < data.list.length; i++) {      
			      	newContent += '<li><div class="col-md-6">' + data.list[i].name+"&nbsp;("+data.list[i].sys.country+')</div>';
			      	newContent += '<div class="col-md-4">' +data.list[i].main.temp+'<i class="wi wi-celsius"></i></div>';
			      	newContent += '<div class="col-md-2">' +addIconWeather(data.list[i].weather[0].main)+'</div>';
			      	newContent += '</li>';
			    }
			    ContentLeft = '<div class="col-md-6"><ul id = "listLeft">' + newContent + '</ul></div>';
			    $('#list').html(ContentLeft);
			    getDetail(detailsArr.list[0],0);

				$("ul#listLeft li").on('click', function(){
					//e.preventDefault();
					//$(".selected").removeClass('selected');
					var index = $( "li" ).index( this );
					getDetail(detailsArr.list[index],index);
				});
				$("ul#listLeft li").on('mouseover', function(){
					var $this = $(this); 
					$this.addClass('hot');
				});
				$("ul#listLeft li").on('mouseout', function(){
					var $this = $(this); 
					$this.removeClass('hot');
				});

			},
			error:function(error){
				alert($.parseJSON(error.responseText));
			}
		});
	};

	function getDetail (citySelected,index){
		var newContent ='';
		newContent += ContentLeft;
		newContent += '<div class="col-md-6"><ul id = "listRight">';
		newContent += '<li><div class="col-md-8">Lever<i class="wi wi-sunrise"></i> : </div>';
		newContent += '<div class="col-md-4">' + DateFormat(new Date(citySelected.sys.sunrise*1000))+ '</div>';
		newContent += '<li><div class="col-md-8">Coucher<i class="wi wi-sunset"></i> : </div>';
		newContent += '<div class="col-md-4">' +  DateFormat(new Date(citySelected.sys.sunset*1000))+ '</div>';
		newContent += '<li><div class="col-md-8">Temp&egrave;rature maximale : </div><div class="col-md-4">';
		newContent += citySelected.main.temp_max+ '<i class="wi wi-celsius"></i></div>';
		newContent += '<li><div class="col-md-8">Temp&egrave;rature minimale:</div><div class="col-md-4">';
		newContent += citySelected.main.temp_min + '<i class="wi wi-celsius"></i></div>';
		newContent += '<li><div class="col-md-8">humidit&egrave;<i class="wi wi-humidity"></i> : </div>';
		newContent += '<div class="col-md-4">' +citySelected.main.humidity+ '%</div>';
		newContent += '<li><div class="col-md-8">Vent<i class="wi wi-windy"></i> : </div><div class="col-md-4">';
		newContent += citySelected.wind.speed+ 'm/s</div>';
		newContent += '<li><div class="col-md-8">Ressentie</div><div class="col-md-4">';
		newContent += citySelected.wind.deg + '&deg;</div>';
		newContent += '</ul></div>';
		
		$('#list').html(newContent); // Display times on page 
		$('ul#listLeft li').eq(index).addClass('selected');
		addIconWeather(citySelected.weather.main);

		$("li").on('click', function(e){
			e.preventDefault();
			var index = $( "li" ).index( this );
			getDetail(detailsArr.list[index],index);
			$('ul#listLeft li').eq(index).addClass('selected');
		});
		$("ul#listLeft li").on('mouseover', function(){
			var $this = $(this); 
			$this.addClass('hot');
		});
		$("ul#listLeft li").on('mouseout', function(){
			var $this = $(this); 
			$this.removeClass('hot');
		});
	};

	function DateFormat(date){
		hour = "" + date.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  		minute = "" + date.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  		var newformat = hour + " : " + minute;
  		return newformat;
	}
		

	function addIconWeather (typeWeather){
		switch(typeWeather){
			case "Thunderstorm":
	        	return "<i class=\'wi wi-thunderstorm\'></i>";
	        break;
		    case "Snow":
		        return "<i class=\'wi wi-snow\'></i>";
		        break;
		    case "Drizzle":
		        return "<i class=\'wi wi-drizzle\'></i>";
		        break;
		    case "Rain":
		        return "<i class=\'wi wi-rain\'></i>";
		        break;
	        case "Snow":
		        return "<i class=\'wi wi-snow\'></i>";
		        break;
	        case "Atmosphere":
		        return typeWeather;
		        break;
	        case "Clear":
		        return "<i class=\'wi wi-day-sunny\'></i>";
		        break;
	        case "Clouds":
		        return "<i class=\'wi wi-cloudy\'></i>";
		        break;
		     /*TODO*/
		    /*default:
		        default return typeWeather*/
		};
	};
	
});