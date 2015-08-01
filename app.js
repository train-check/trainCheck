// TrainCheck for the YRS Festival of Code 2015
// ~ http://hacks.youngrewiredstate.org/events/festival-of-code-2015/traincheck
// credit to Tom S, Alex L, Emmanuel S

var t = {

	global: {

		aspect: 1,
		mobile: false,

		mapType: "hybrid",
		zoom: 13,

		tApiID: "a0e59ecf",
		tApiKey: "3fe1d909796403f73bb74d3c7525b941",

		gApiKey: "AIzaSyCQRywd8lrF9d0CRAcRiqASEg5U3e0f9nU",

		location: "",
		lat: 0,
		lon: 0,

		bounds: {

			n: 0,
			e: 0,
			s: 0,
			w: 0,

			dx: 0,
			dy: 0

		},

		hot: [], // array of bound boxes for detection of hovering over stations.  Also contains station information
		activePie: false,

		detail: false,

		ctx: false,

		r: {

			rTime: new Date(1, 1, 2000, 12,00,00),
			timeout: false,
			delta: 250

		}

	},

	init: function() {

		if ("geolocation" in navigator) {

			// mobile browser user agent detection from 'stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery'
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) t.global.mobile = true;

			if (t.global.mobile) window.scrollTo(0, 1);

			if (window.innerWidth < window.innerHeight) $("#orientWarn").show();

			var canvas = document.getElementById("chart");
			t.global.ctx = canvas.getContext("2d");

			t.handlers();
			
			// bind Google's autocomplete to the location changing thing:
			var autocomplete = new google.maps.places.Autocomplete(document.getElementById("location"));

			t.run();

			$(window).resize(function() {

				// resize latching so I don't make hundreds of calls to the api when resizing

				t.global.r.rTime = new Date();

				if (t.global.r.timeout === false) {

					t.global.r.timeout = true;
					setTimeout(t.resizeEnd, t.global.r.delta);

				}

			});

		} else {

			alert("Your browser does not support geolocation; the app will not work");

		}

	},

	handlers: function() {

		// seperate function for binding event handelrs because there are too many...

		if (t.global.mobile) {

			console.log("binding mobile events");

			$("body").on("taphold", function(e) {

				e.preventDefault();

				// console.log("taphold on body");

				// console.log(e);

				// $.e.special.tap.tapholdThreshold = 10;
				// $.e.special.tap.emitTapOnTaphold = false;

				if (!t.global.detail) t.checkHover(e);

			});

			$("body").on("tap", function(e) {

				if (!t.global.detail) t.checkClick(e);

			});

			$(".mapTypeButton").on("tap", function(e) {

				e.preventDefault();

				$("#" + t.global.mapType).removeClass("active");

				t.global.mapType = $(this).text();
				$(this).addClass("active");

				t.updateMap();

			});

			$("#updateLocation").on("tap", function(e) {

				e.preventDefault();

				t.updateLocation();

			});

			$("#updateZoom").on("tap", function(e) {

				e.preventDefault();

				t.global.zoom = $("#zoom").slider("value");

				t.update();

			});

			$("#showGui").on("tap", function(e) {

				console.log("tap on show gui");

				t.toggleGui();

			});

			$("#closeGui").on("tap", function(e) {

				t.toggleGui();

			})

			$("#closeDetail").on("tap", function(e) {

				$("#detail").hide();
				$("#phone").hide();

				t.global.detail = false;

			});

			$("#phoneSend").on("tap", function(e) {

				t.phoneSend($(this));

			});

			$("#phoneCancel").on("tap", function(e) {

				$("#phone").hide();

			});

			$("#noTrains").on("tap", function(e) {

				$(this).hide();

			});

			$("#orientWarn").on("tap", function(e) {

				$(this).hide();

			});

		} else {

			console.log("binding desktop events");

			$("body").mousemove(function(e) {

				e.preventDefault();

				if (!t.global.detail) t.checkHover(e);

			});

			$("body").click(function(e) {

				if (!t.global.detail) t.checkClick(e);

			});

			$(".mapTypeButton").click(function(e) {

				e.preventDefault();

				$("#" + t.global.mapType).removeClass("active");

				t.global.mapType = $(this).text();
				$(this).addClass("active");

				t.updateMap();

			});

			$("#updateLocation").click(function(e) {

				e.preventDefault();

				t.updateLocation();

			});

			$("#updateZoom").click(function(e) {

				e.preventDefault();

				t.global.zoom = $("#zoom").slider("value");

				t.update();

			});

			$("#showGui").click(function(e) {

				t.toggleGui();

			});

			$("#closeGui").click(function(e) {

				t.toggleGui();

			})

			$("#closeDetail").click(function(e) {

				$("#detail").hide();
				$("#phone").hide();

				t.global.detail = false;

			});

			$("#phoneSend").click(function(e) {

				t.phoneSend($(this));

			});

			$("#phoneCancel").click(function(e) {

				$("#phone").hide();

			});

			$("#noTrains").click(function(e) {

				$(this).hide();

			});

			$("#orientWarn").click(function(e) {

				$(this).hide();

			});

		}

		// key activated events can be bound regardless...

		$("#location").keypress(function(e) {

			if (e.which == 13) t.updateLocation(); // enter on input box

		});

	},

	hash: {

		state: function() {

			return window.location.hash.replace("#", "");

		}, set: function(x) {

			window.location.hash = x;

		}, changed: function() {

			var hash = t.hash.state().split(",");

			t.global.lat = parseFloat(hash[0]);
			t.global.lon = parseFloat(hash[1]);

		}

	},

	resizeEnd: function() {

		if (new Date() - t.global.r.rTime < t.global.r.delta) {

			setTimeout(t.resizeEnd, t.global.r.delta);

		} else {

			t.global.r.timeout = false;
			t.update();

		}

	},

	run: function() {

		if (window.innerHeight < window.innerWidth) t.global.aspect = window.innerHeight / window.innerWidth;

		window.onhashchange = t.hash.changed;

		if (!t.hash.state) navigator.geolocation.getCurrentPosition(t.setPos); // get current location unless a location has been set using the hash (presumably)
		else {

			t.hash.changed();

			t.update(); // needs to be called because hash change shouldn't update, but update is needed here

		}

		t.doGui();

	},

	setPos: function(p) {

		// callback specifically for navigator geolocation method

		t.global.lat = p.coords.latitude;
		t.global.lon = p.coords.longitude;

		t.hash.set(t.global.lat + "," + t.global.lon);

		t.update();

	},

	update: function() {

		if (window.innerWidth < window.innerHeight) $("#orientWarn").show();

		t.updateGui();

		t.updateMap();

		if ($("#detail").is(":visible")) t.updateDetail();

		// approximations based on assumption that lat/lon is linear in the small area projected at zoom level whatever
		// 1 added to the index to halve so following calculations are smaller

		var innerLon = (640 * 360) / (256 * Math.pow(2, t.global.zoom + 1)); // total (delta) longitude across window
		var innerLat = (640 * t.global.aspect * 180) / (256 * Math.pow(2, t.global.zoom + 1)); // delta latitude across window

		t.global.bounds.n = t.global.lat + innerLat;
		t.global.bounds.s = t.global.lat - innerLat;
		t.global.bounds.e = t.global.lon + innerLon;
		t.global.bounds.w = t.global.lon - innerLon;

		t.global.bounds.dx = innerLon * 2;
		t.global.bounds.dy = innerLat * 2;

		$.ajax({

			url: "http://transportapi.com/v3/uk/train/stations/bbox.json?api_key=" + t.global.tApiKey + "&app_id=" + t.global.tApiID + "&maxlat=" + t.global.bounds.n + "&maxlon=" + t.global.bounds.e + "&minlat=" + t.global.bounds.s + "&minlon=" + t.global.bounds.w + "&rpp=25", // don't forget me
			success: t.drawChart,
			dataType: "json"

		});

	},

	updateMap: function() {

		var url = "https://maps.googleapis.com/maps/api/staticmap?center=" + t.global.lat + "," + t.global.lon + "&zoom=" + t.global.zoom + "&size=640x640&scale=4&maptype=" + t.global.mapType;

		$("#map").css({backgroundImage: "url(" + url + ")"});  //remember to change me back you shithead

	},

	updateLocation: function() {

		var a = $("#location").val();

		var a = a.split(",");

		if (a.length == 1 && (a[0] == "here" || a[0] == "me" || a[0] == "near")) {

			// if the user wants to go back to stations near them, then call the navigator's geolocation

			navigator.geolocation.getCurrentPosition(t.setPos);

		} else if (a.length == 2 && !isNaN(a[0].replace(" ", "")) && !isNaN(a[1].replace(" ", ""))) {

			// assume the user has entered geolocation

			t.global.lat = parseFloat(a[0].replace(" ", ""));
			t.global.lon = parseFloat(a[1].replace(" ", ""));

			t.hash.set(t.global.lat + "," + t.global.lon);

			t.update();

		} else {

			// assume the user has entered an address (and hope based Google will recognise it)

			var address = "";

			$.each(a, function(i, v) {

				address += v.replace(" ", "+");

				if (i < a.length - 1) address += ",";

			});

			// address should be a comma seperated address with commas where they were before and a + inplace of spaces

			$.ajax({

				url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + t.global.gApiKey + "",
				success: function(d) {

						t.global.lat = d.results[0].geometry.location.lat;
						t.global.lon = d.results[0].geometry.location.lng;

						t.hash.set(t.global.lat + "," + t.global.lon);

						t.update();

					},
				dataType: "json"

			});

		}

	},

	doGui: function() {

		$("#zoom").slider({

			value: t.global.zoom,
			min: 7,
			max: 16,
			step: 1,

		});

		$("#detail").hide();

		if (t.global.mobile) {

			$("#gui").css({width: window.innerWidth - 80});

			$("#gui").hide();
			$("#showGui").show();

		} else {

			$("#gui").css({width: 400, right: 0});

		}

	},

	updateGui: function() {

		$("#detail").css({width: window.innerWidth - 80});

		if (t.global.mobile || window.innerWidth < 481) $("#gui").css({width: window.innerWidth - 80});
		else $("#gui").css({width: 400});

	},

	toggleGui: function() {

		if ($("#showGui").is(":visible")) {

			// need to open gui and hide showgui

			$("#gui").show();
			$("#showGui").hide();
			$("#detail").hide(); // so they don't overlap and clash
			$("#phone").hide();

			t.global.detail = false;

		} else {

			// opposite

			$("#gui").hide();
			$("#showGui").show();

		}

	},

	drawChart: function(d) {

		console.log(d);

		t.global.hot = [];

		var canvas = document.getElementById("chart");

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = window.innerWidth;
		canvas.style.height = window.innerHeight;

		t.global.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		var w = window.innerWidth;
		var h = window.innerHeight;
		var dy = 0;

		if (w < h) {

			dy = (h - w) / 2;
			h = w;

		}

		if (!d.stations.length) $("#noTrains").show();
		else {

			$.each(d.stations, function(i, val) {

				// originally used to test, this is now a vital part of the infrastructure >.>

				var x = w * (val.longitude - t.global.bounds.w) / t.global.bounds.dx;
				var y = h * (t.global.bounds.n - val.latitude) / t.global.bounds.dy + dy;

				t.global.hot.push({

					index: i,
					// data: val,

					lines: [[]],

					name: val.name,
					code: val.station_code,

					screenX: x,
					screenY: y,

					rat: 1,

					t: y - 25,
					l: x - 25,
					b: y + 25,
					r: x + 25

				});

				$.ajax({

					url: "http://transportapi.com/v3/uk/train/station/" + val.station_code + "///live.json?api_key=" + t.global.tApiKey + "&app_id=" + t.global.tApiID + "&train_status=passenger",
					success: function(d) {

							t.drawPie(d, val, x, y, i);

						},
					dataType: "json"

				});

				// ajax to fake data for live departures since trains don't appear to run at 1am (why the hell not?)

				// $.ajax({

				// 	url: "fauxdata.json",
				// 	success: function(d) {

				// 			t.drawPie(d, val, x, y, i);

				// 		},
				// 	dataType: "json"

				// });
			
			});

		}

	},

	drawPie: function(d, station, x, y, j) {

		console.log(d);

		// d is live data from ajax, station is data about the station from near ajax, x and y are position of pie, j is index in hot of pie
		// status possible values are EARLY, LATE, ON TIME, NO REPORT, ARRIVED, STARTS HERE

		var good = 0;
		var bad = 0;
		var detail;

		$.each(d.departures.all, function(i, val) {

			detail = {

				depart: val.aimed_departure_time,
				actual: val.expected_departure_time,
				dest: val.destination_name,
				code: d.station_code,
				uid: val.train_uid,
				delta: val.best_departure_estimate_mins,
				bus: false

			};

			if (val.status == "EARLY" || val.status == "ON TIME" || val.status == "STARTS HERE") {

				good ++;

				t.global.hot[j].lines[i] = [val.destination_name, true, detail]; // true represents a good line

			} else if (val.status == "LATE" || val.status == "NO REPORT") {

				bad ++;

				t.global.hot[j].lines[i] = [val.destination_name, false, detail];

			} else if (val.status == "BUS") {

				detail.bus = true;

				if (parseFloat(val.expected_departure_time) <= parseFloat(val.aimed_departure_time)) {

					good ++;

					t.global.hot[j].lines[i] = [val.destination_name, true, detail];

				} else {

					bad ++;

					t.global.hot[j].lines[i] = [val.destination_name, false, detail];

				}

			} else {

				t.global.hot[j].lines[i] = [val.destination_name, false, detail]; // for some reason this should help stop the program screwing me over

			}
			// maybe sort out handling of other events (uncategorised is arrived - this will be very rare, however, and will show up as red I think) - it would affect the pie charts

		});

		var ratio = good / (good + bad);
		if ((good == 0) && (bad == 0)) ratio = 0.00001; // if there are no departures - the pie doesn't draw if r=0....
		if (ratio == 0) ratio = 0.0000001;

		t.global.hot[j].rat = ratio;

		// somehow this all draws a doughnut shaped pie chart:

		t.global.ctx.beginPath();
		t.global.ctx.strokeStyle = "rgba(0, 0, 0, 0)";
		t.global.ctx.lineWidth = 15;
		t.global.ctx.arc(x, y, 5, 0, 2 * Math.PI);
		t.global.ctx.stroke();

		t.global.ctx.beginPath();
		t.global.ctx.strokeStyle = "#00FF00";
		t.global.ctx.arc(x, y, 20, (3/2) * Math.PI, Math.PI * ((3/2) + 2 * ratio), false);
		t.global.ctx.stroke();

		t.global.ctx.beginPath();
		t.global.ctx.strokeStyle = "#FF0000";
		t.global.ctx.arc(x, y, 20, Math.PI * ((3/2) + 2 * ratio), Math.PI * (3/2), false);
		t.global.ctx.stroke();

	},

	refreshPies: function() {

		var canvas = document.getElementById("chart");

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.width = window.innerWidth;
		canvas.style.height = window.innerHeight;

		t.global.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		var ratio = 1;
		var x;
		var y;

		$.each(t.global.hot, function(i, pie) {

			ratio = pie.rat
			x = pie.screenX;
			y = pie.screenY;

			if (!pie.large) {

				// pie isn't highlighted (mouse over)

				t.global.ctx.beginPath();
				t.global.ctx.strokeStyle = "rgba(0, 0, 0, 0)";
				t.global.ctx.lineWidth = 15;
				t.global.ctx.arc(x, y, 5, 0, 2 * Math.PI);
				t.global.ctx.stroke();

				t.global.ctx.beginPath();
				t.global.ctx.strokeStyle = "#00FF00";
				t.global.ctx.arc(x, y, 20, (3/2) * Math.PI, Math.PI * ((3/2) + 2 * ratio), false);
				t.global.ctx.stroke();

				t.global.ctx.beginPath();
				t.global.ctx.strokeStyle = "#FF0000";
				t.global.ctx.arc(x, y, 20, Math.PI * ((3/2) + 2 * ratio), Math.PI * (3/2), false);
				t.global.ctx.stroke();

			} else {

				// pie to be drawn bigger
				// also add name and ratio data

				t.global.ctx.beginPath();
				t.global.ctx.strokeStyle = "rgba(0, 0, 0, 0)";
				t.global.ctx.lineWidth = 30;
				t.global.ctx.arc(x, y, 5, 0, 2 * Math.PI);
				t.global.ctx.stroke();

				t.global.ctx.beginPath();
				t.global.ctx.strokeStyle = "#00FF00";
				t.global.ctx.arc(x, y, 30, (3/2) * Math.PI, Math.PI * ((3/2) + 2 * ratio), false);
				t.global.ctx.stroke();

				t.global.ctx.beginPath();
				t.global.ctx.strokeStyle = "#FF0000";
				t.global.ctx.arc(x, y, 30, Math.PI * ((3/2) + 2 * ratio), Math.PI * (3/2), false);
				t.global.ctx.stroke();

				t.drawLines();

			}

		});

	},

	drawLines: function() {

		// console.log(t.global.hot[t.global.activePie]);

		var place;

		var x;
		var y;
		var w = window.innerWidth;
		var h = window.innerHeight;
		var dy = 0;

		if (w < h) {

			dy = (h - w) / 2;
			h = w;

		}

		// console.log(t.global.hot[t.global.activePie].lines);

		$.each(t.global.hot[t.global.activePie].lines, function(i, line) {

			// console.log(line);

			place = line[0].replace(" ", "+") + "+train+station,UK"; // this seems to be consistent in finding the train stations

			$.ajax({

				url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + place, // + "&key=" + t.global.gApiKey + ""
				success: function(d) {

						// console.log(d); // some results might be coming back undefined (some are)

						if (d.results[0]) {

							x = w * (d.results[0].geometry.location.lng - t.global.bounds.w) / t.global.bounds.dx;
							y = h * (t.global.bounds.n - d.results[0].geometry.location.lat) / t.global.bounds.dy + dy;
							
							// console.log(t.global.hot[t.global.activePie]);

							t.drawLine(t.global.hot[t.global.activePie].screenX, t.global.hot[t.global.activePie].screenY, x, y, line[1], i);

						}

					},
				dataType: "json"

			});

		});

	},

	drawLine: function(x, y, dx, dy, gb, j) {

		// x, y represent origin location, dx, dy represent destination location, gb represent good/bad, true = good, j is the index of the lines array that the .each iteration is currently at

		if (gb) t.global.ctx.strokeStyle = "rgba(0, 255, 0, 0.6)";
		else t.global.ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";

		t.global.ctx.lineWidth = 5;
		t.global.ctx.beginPath();
		t.global.ctx.moveTo(x, y);
		t.global.ctx.bezierCurveTo(x + 50 * (Math.random() * 2 - 1), y + 50 * (Math.random() * 2 - 1), dx + 50 * (Math.random() * 2 - 1), dy + 50 * (Math.random() * 2 - 1), dx, dy);
		t.global.ctx.stroke();

		if (j == t.global.hot[t.global.activePie].lines.length - 1) {

			// this needs to be done so that text is drawn on top of the lines

			var pie = t.global.hot[t.global.activePie];

			t.global.ctx.font = "bold 25px Raleway";
			t.global.ctx.strokeStyle = "#000000";
			t.global.ctx.lineWidth = 4;
			t.global.ctx.strokeText(pie.name, x + 5, y - 20);
			t.global.ctx.fillStyle = "#FFFFFF";
			t.global.ctx.fillText(pie.name, x + 5, y - 20);

			var r = Math.round(pie.rat * 100, 0) + "%";

			t.global.ctx.strokeText(r, x + 5, y + 10);
			t.global.ctx.fillText(r, x + 5, y + 10);

		}

	},

	showDetail: function(sta) {

		// passed the data from hot[] for the clicked station

		$("#gui").hide();
		$("#showGui").show();
		$("#detail").show();

		t.global.detail = true;

		$("#detailTitle").text(sta.name);

		console.log(sta);

		$("#detailInfo").empty();
		$("#detailInfo").css({height: "auto"});
		$("#detail").css({height: "auto"});

		if (!sta.lines[0].length) {

			// incase there are no departures

			var info = $("<div/>");
			info.text("no departures from this station currently");

			info.appendTo($("#detailInfo"));

		} else {

			// define these outside the iteration to save on computation maybe

			var info;
			var times;
			var dep;
			var act;
			var img;
			var name;
			var nameText;
			var nameButton;
			var details;

			$.each(sta.lines, function(i, line) {

				info = $("<div/>", {class: "detailRow"});

				times = $("<div/>", {class: "detailTimes"});

				if (line[2].depart && line[2].actual) {

					// sometimes departure times are null

					dep = $("<span/>", {class: "detailDepart"}).append(line[2].depart);
					act = $("<span/>", {class: "detailActual"}).append(line[2].actual);

					if (parseFloat(line[2].actual.replace(":", ".")) <= parseFloat(line[2].depart.replace(":", "."))) act.css({color: "#00FF00"});
					else act.css({color: "#FF0000"});

					times.append(dep).append(" | ").append(act);

				} else {

					times.text("n/a").css({color: "#AAAAAA", "font-weight": "bold"});

				}

				times.appendTo(info);

				name = $("<div/>", {class: "detailNames"});

				if (line[2].bus) img = $("<div/>", {class: "detailBusIcon"});
				else img = img = $("<div/>", {class: "detailTrainIcon"});

				img.appendTo(name);

				nameText = $("<div/>", {class: "detailNameText"});
				nameText.text(line[2].dest);
				nameText.appendTo(name);

				nameButton = $("<div/>", {id: "detailButton" + i, class: "detailNameButton"});
				nameButton.text("keep me updated!");
				nameButton.appendTo(name);
				
				details = {

					code: line[2].code,
					uid: line[2].uid,
					time: line[2].depart,
					delta: line[2].delta

				};

				nameButton.data("info", details);

				if (t.global.mobile) {

					nameButton.on("tap", function(e) {

						t.showPhone($(this));

					});

				} else {

					nameButton.click(function(e) {

						t.showPhone($(this));

					});

				}

				name.appendTo(info);

				if (i == sta.lines.length - 1) info.css({"border-bottom": "none", "margin-bottom": 0, "padding-bottom": 2});

				info.appendTo($("#detailInfo"));

				nameButton.css({left: info.width() - nameButton.width() - 30});

				// console.log(nameButton.position().left);

			});
	
		}

		if ($("#detail").position().top + $("#detail").height() >= window.innerHeight) {

			$("#detail").css({height: window.innerHeight - 160});
			$("#detailInfo").css({height: $("#detail").height() - $("#detailTitle").outerHeight() - $("#closeDetail").outerHeight() - 40});

		}

	},

	updateDetail: function() {

		// the only thing that should need changing is the location of the notification button, and possible the div heights

		$("#detailInfo").css({height: "auto"});
		$("#detail").css({height: "auto"});

		if ($("#detail").position().top + $("#detail").height() >= window.innerHeight) {

			$("#detail").css({height: window.innerHeight - 160});
			$("#detailInfo").css({height: $("#detail").height() - $("#detailTitle").outerHeight() - $("#closeDetail").outerHeight() - 40});

		}

		$("#detailInfo").children(".detailRow").each(function(i, el) {

			$("#detailButton" + i).css({left: $(el).width() - $("#detailButton" + i).width() - 30});

		});

	},

	showPhone: function(div) {

		// console.log("phone");

		$("#phone").show();
		$("#phoneText").text("enter your mobile number below to receive status updates for this departure:");

		$("#phoneSend").data("info", div.data("info"));

	},

	phoneSend: function(div) {

		var data = div.data("info");

		data.number = $("#phoneNumber").val();
		data.percent = JSON.stringify(Math.round(t.global.hot[t.global.activePie].rat * 100, 0)) + "%";
		data.station = t.global.hot[t.global.activePie].name;

		console.log(data);

		// data = JSON.stringify(data);

		$.ajax({

			url: "web/test.php",
			type: "POST",
			data: data,
			// dataType: "json",
			success: function(d) {

					console.log(d);

					$("#phoneText").text("a message has been sent!");

				},
			error: function() {

					$("#phoneText").text("an error has occured.  Please try again...");

				}
			
		});


	},

	checkHover: function(e) {

		// for desktop exclusively - to display information

		var x = e.pageX;
		var y = e.pageY;

		$.each(t.global.hot, function(i, pie) {

			if (t.global.activePie === false) {

				// not on same line to reduce computation, considering an array of up to 25 objects is called every time the mouse moves

				if(t.inBox(x, y, pie)) {

					t.global.activePie = pie.index;
					pie.large = true;

					pie.t -= 15;
					pie.l -= 15;
					pie.b += 15;
					pie.r += 15;

					t.refreshPies();

				}

			} else if (t.global.activePie === i && !t.inBox(x, y, pie)) {

				// mouse has left pie XD

				t.global.activePie = false;
				pie.large = false;

				pie.t += 15;
				pie.l += 15;
				pie.b -= 15;
				pie.r -= 15;

				t.refreshPies();

			}

		});

	},

	checkClick: function(e) {

		// should bring up extra information on desktop

		var x = e.pageX;
		var y = e.pageY;

		$.each(t.global.hot, function(i, pie) {

			if(t.inBox(x, y, pie)) {

				console.log(t.global.hot[i])

				t.showDetail(t.global.hot[i]);

			}

		});

	},

	inBox: function(x, y, box) {

		// expect box with top left bottom and right parameters, by initials...

		if (x >= box.l && x <= box.r && y >= box.t && y <= box.b) return true
		else return false;

	}

};


$(function() {

	t.init();

});