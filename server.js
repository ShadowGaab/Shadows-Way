// Just Dance Connect Core
// v2.0 (DEVLAB_35969486-e94d-47ef-99f4-7a20be886e5c)
// This server code is private and is never meant to be used in another mod.

const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();
const connectedapp = express();

app.use(express.json());
app.use(require("express-useragent").express());

const CustomDB = require("./DATABASE/COLLECTABLES.json");
const Quest = require("./DATABASE/QUESTDB.json");
const Bosses = require("./DATABASE/wdf/bosses.json");
const QJSONCarousel = require("./DATABASE/quest.json");
const v1 = require("./v1/config.json");
const v2 = require("./v2/services.json");
const v3 = require("./V3/users/0/user.json");
const DM = require("./DATABASE/DM_BLOCK.json");
const SKUConstants = require("./SKU/sku-constant.json");
const WDF = require("./DATABASE/wdf/room-asign.json");
const Ping = require("./DATABASE/PINGNOTIF.json");

const upsell = require("./DATABASE/upsell-video.json");
const CarouselPackages = require("./DATABASE/carpack.json");
const RoomPC = require("./DATABASE/wdf/jd2017pc_room.json");
const Time = require("./DATABASE/server-time.json");
const Subs = require("./V3/users/0/subs.json");
const Avatars = require("./DATABASE/avatars.json");
var room = "MainJD2017";
var prodwsurl = "https://prod.just-dance.com";
var bosses = require("./DATABASE/wdf/v1/ccu.json");
var ccu = require("./DATABASE/wdf/bosses.json");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Tiles = require("./home/v1/tiles.json");
const AliasDB = require("./aliasdb/v1/aliases.json");
const axios = require("axios").default;

var Cat1 = [];
var Cat2 = [];
var Cat3 = [];
var Cat4 = [];

var arraybeta = [];

var party;
var coop;
var sweat;
var search;





var jdconnect = {
    interactiveconfig: {
        playerseason: {
            isseasonactive: true,
            seasonnumber: 2,
            seasonname: "Surreal",
            seasonplaylist: ["BadHabits", "Womanizer", "Daisy", "Dance", "Malibu", "LoveMeAgain", "BreakMyHeart", "CantHoldDLC"]
        },
        wdfoverwrite: {
            wdfoverwriteenabled: false,
            wdfoverwritehappyhour: '{"__class":"HappyHoursInfo","start":1615651200,"end":1615653000,"running":false}',
            wdfoverwritelist: ["BlackWidow", "Finesse"]
        },
		playlists: {
			partyplaylist: ["Timber"],
			top20playlist: []
		},
        songs: {
            customsongsonly: true
        }
    },
    core: {
        currenauths: [],
        currentbeta: [],

        // DO NOT MODIFY THIS LINE WITHOUT PERMISSION
        beta_uplayers: [
            "ShadowGaab",
            "justdancingsam",
            "litenitee",
            "MeowMeowMeyo",
            "liorandron123",
            "NicolasPlayz",
            "AlexPokeguy4",
            "StevenSBJD1702",
            "justAJdance",
            "itayblanka",
            "GoldHGSS"
        ],

        requestcheck: function (request) {
            // PC, Switch, Switch, Switch, WiiU, WiiU, WiiU
            if (
                request.useragent.source ==
                "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static" ||
                request.useragent.source ==
                "UbiServices_SDK_HTTP_Client_4.2.21_NNX64" ||
                request.useragent.source ==
                "UbiServices_SDK_HTTP_Client_2017.Final.4_SWITCH64" ||
                request.useragent.source == "UbiServices_SDK_2017.Final.28_SWITCH64" ||
                request.useragent.source ==
                "UbiServices_SDK_HTTP_Client_2017.Final.4_WIIU" ||
                request.useragent.source == "UbiServices_SDK_2017.Final.28_WIIU" ||
                request.useragent.source == "UbiServices_SDK_HTTP_Client_4.2.9_WIIU" ||
                request.useragent.source == "UbiServices_SDK_HTTP_Client_3.2.1.148217_WIIU" ||
                request.useragent.source.includes("PS4") == true) {
                    return true
            } else {
                if (request.header("X-SkuId") == "jdconnect-online-web" || request.url == "/songdb/v2/songs") {
                    return true;
                } else {
                    return 403;
                }
            }
        },
        getskuid: function (request) {
            if (
                request.useragent.source ==
                "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static") {
                    return "jd2017-pc-ww"
                } else {
                    return request.header("X-SkuId")
                }
        },
        interactivemanagement: {
            checkplayer: function (auth) {
                if (jdconnect.core.currentbeta[auth] == undefined) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    },
    Carousel: {
        ifsongpublic: (codename) => {
            return true; 
        },
        returncatalog: () => {
            party = require("./DATABASE/carousel.json")
			// add categories to all
			
			party.categories.forEach(function(carousel){
                // add jdmelody songs to the category
				if (carousel.title == "Just Dance Melody") {
					for (var songs in require("./DATABASE/Platforms/jd2017-pc-ww/SONGDBS.json")) {
						song = require("./DATABASE/Platforms/jd2017-pc-ww/SONGDBS.json")[songs]
						var obj = JSON.parse('{"__class":"Item","isc":"grp_cover","act":"ui_component_base","components":[{"__class":"JD_CarouselContentComponent_Song","mapName":"' + song.mapName + '"}],"actionList":"partyMap"}');
						if (song.tags.includes("melody") == true) { carousel.items.push(obj) }
					}
				}

				// add all the songs to the jdconnect catagory
				if (carousel.title == "Just Dance Connect") {
					for (var songs in require("./DATABASE/Platforms/jd2017-pc-ww/SONGDBS.json")) {
						song = require("./DATABASE/Platforms/jd2017-pc-ww/SONGDBS.json")[songs]
						var obj = JSON.parse('{"__class":"Item","isc":"grp_cover","act":"ui_component_base","components":[{"__class":"JD_CarouselContentComponent_Song","mapName":"' + song.mapName + '"}],"actionList":"partyMap"}');
						if (jdconnect.Carousel.ifsongpublic(song.mapName) == true) { carousel.items.push(obj) }
					}
				}
				
				// add season songs if enabled
				if (carousel.title == "[SEASON NUMBER] SEASON NAME") {
					if (jdconnect.interactiveconfig.playerseason.isseasonactive == true) {
						carousel.title = "[ Season " + jdconnect.interactiveconfig.playerseason.seasonnumber.toString() + " ] " + jdconnect.interactiveconfig.playerseason.seasonname;
						jdconnect.interactiveconfig.playerseason.seasonplaylist.forEach(function(song) {
							var obj = JSON.parse('{"__class":"Item","isc":"grp_cover","act":"ui_component_base","components":[{"__class":"JD_CarouselContentComponent_Song","mapName":"' + song + '"}],"actionList":"partyMap"}');
							if (jdconnect.Carousel.ifsongpublic(song.mapName) == true) { carousel.items.push(obj) }
						})
					}
				}
				
				// Non-Personalized Playlists
				if (carousel.title == "BLOCKED") {
					jdconnect.interactiveconfig.playlists.partyplaylist.forEach(function(song) {
						var obj = JSON.parse('{"__class":"Item","isc":"grp_cover","act":"ui_component_base","components":[{"__class":"JD_CarouselContentComponent_Song","mapName":"' + song + '"}],"actionList":"partyMap"}');
						if (jdconnect.Carousel.ifsongpublic(song.mapName) == true) { carousel.items.push(obj) }
					})
				}
				if (carousel.title == "BLOCKED #2") {
					jdconnect.interactiveconfig.playlists.top20playlist.forEach(function(song) {
						var obj = JSON.parse('{"__class":"Item","isc":"grp_cover","act":"ui_component_base","components":[{"__class":"JD_CarouselContentComponent_Song","mapName":"' + song + '"}],"actionList":"partyMap"}');
						if (jdconnect.Carousel.ifsongpublic(song.mapName) == true) { carousel.items.push(obj) }
					})
				}
				
				// Personalized Playlists
				if (carousel.title == "[icon:PLAYLIST] Recommended") {
					// personalized playlists are in development! Do not add code here unless you know what you are doing.
				}
				if (carousel.title == "[icon:PLAYLIST] Personalized Playlist Name Here") {
					// personalized playlists are in development! Do not add code here unless you know what you are doing.
				}
				
				// Add songs in their games' categories
			});
			
            coop = JSON.parse(JSON.stringify(party))
            sweat = JSON.parse(JSON.stringify(party))
            search = JSON.parse(JSON.stringify(party))
			
			// switch actionlist for coop and sweat
			coop.actionLists.coopMap = coop.actionLists.partyMap
			coop.actionLists.sweatMap = coop.actionLists.partyMap
			
			// remove search for coop and sweat
			coop.categories.forEach(function(carousel){ 
				if(carousel.title == "[icon:SEARCH_FILTER] Search") {
					delete carousel
				}
			})
			sweat.categories.forEach(function(carousel){ 
				if(carousel.title == "[icon:SEARCH_FILTER] Search") {
					delete carousel
				}
			})
			
			// add search result to search
			var current = 0
			var splice = 0
			search.categories.forEach(function(carousel){ 
				if(carousel.title == "[icon:SEARCH_FILTER] Search") {
				} else {
					current = current + 1
				}
			});
			var obj = JSON.parse('{ "__class": "Category", "title": "[icon:SEARCH_RESULT] insert search result here", "items": [], "isc": "grp_row", "act": "ui_carousel" }')
			search.categories.splice(current + 1,0,obj)
			
    }
    },
    Connecteddb: {
        CreateAccount: async function(info) {
            try {
                await client.connect();
                const database = client.db("jdconnect");
                const accounts = database.collection("users");
                var parse = JSON.parse(info)
                // create a document to be inserted
                const doc = { accountuplayusername: parse.uplayusername, isverified: false };
                const result = await accounts.insertOne(doc);
                console.log("An User Registered.");
              } finally {
                await client.close();
              }
        },
        UpdateAccount: async function(info) {
            try {
                await client.connect();
                const database = client.db("jdconnect");
                const accounts = database.collection("users");
                // create a filter for a movie to update
                const filter = JSON.parse(info).query
                // this option instructs the method to create a document if no documents match the filter
                const options = { upsert: true };
                // create a document that sets the plot of the movie
                const updateDoc = {
                  $set: JSON.parse(info).querysec
                };
                const result = await accounts.updateOne(filter, updateDoc, options);
                console.log(
                  `${result.matchedCount} user accounts were matched and ${result.modifiedCount} of them were updated.`,
                );
              } finally {
                await client.close();
              }
        },
        GetAccountInf: async function(info) {try {
            await client.connect();
            const database = client.db("jdconnect");
            const accounts = database.collection("users");
            // Query for a movie that has the title 'The Room'
            const query = JSON.parse(info).query
            const options = {};
            const account = await accounts.findOne(query, options);
            // since this method returns the matched document, not a cursor, print it directly
            return account
          } finally {
            await client.close();
          }
        }
    }
}

// other

var uuid = require("uuid-random");

var transactionid = null;
var transactiondate = null;

var party = null;
var sweat = null;
var coop = null;

var fullurl = null;

// Core

app.use((req, res, next) => {
        if (jdconnect.core.requestcheck(req) == true) {
            return next();
        } else {
            return res.send(jdconnect.core.requestcheck(req));
        }
})

app.get("/favicon.ico", (req, res) => {
    res.send("ew");
});

app.post("/profile/v2/filter-players", function (request, response) {
    response.send(
        '["00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000000"]');
});

var requestCountry = require("request-country");
app.get("/profile/v2/country", function (request, response) {
    var country = requestCountry(request);
    if (country == false) {
        country = "TR";
    }
    response.send('{ "country": "' + country + '" }');
});

app.get("/playlistdb/v1/playlists", function (request, response) {
    response.send(require("./playlistdb/v1/playlists.json"));
});

const pcpkg = require("./DATABASE/Platforms/jd2017-pc-ww/sku-packages.json")

app.get("/packages/:version/sku-packages", function (request, response) {
    if (jdconnect.core.requestcheck(request) == true) {
        if (
            request.useragent.source == "UbiServices_SDK_2017.Final.28_SWITCH64" ||
            request.header("X-SkuId") == "jd2018-nx-all" ||
	    request.header("X-SkuId") == "jd2019-nx-all" ||
            request.header("X-SkuId") == "jd2017-nx-all") {
            response.send(switchpkg);
        } else {
            if (
                request.useragent.source ==
                "UbiServices_SDK_HTTP_Client_2017.Final.4_WIIU" ||
                request.useragent.source == "UbiServices_SDK_2017.Final.28_WIIU" ||
                request.useragent.source == "UbiServices_SDK_HTTP_Client_4.2.9_WIIU") {
                response.send(wiiupkg);
            }
            if (
                request.useragent.source ==
                "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static") {
                response.send(pcpkg)
            }
            if (request.useragent.source.includes("PS4") == true) {
                response.send(ps4pkg);
            }
        }
    } else {
        response.sendStatus(jdconnect.core.requestcheck(request));
    }
});

const pcdb = require("./DATABASE/Platforms/jd2017-pc-ww/SONGDBS.json")

app.get("/songdb/:version/songs", function (request, response) {
    if (request.params.version == "v1" || request.params.version == "v2") {
    console.log("Accessed songdb " + request.params.version);
    if (
        request.useragent.source == "UbiServices_SDK_2017.Final.28_SWITCH64" ||
        request.header("X-SkuId") == "jd2018-nx-all" ||
        request.header("X-SkuId") == "jd2019-nx-all" ||
        request.header("X-SkuId") == "jd2017-nx-all") {
        response.send(switchdb);
    }
    if (
        request.useragent.source ==
        "UbiServices_SDK_HTTP_Client_2017.Final.4_WIIU" ||
        request.useragent.source == "UbiServices_SDK_2017.Final.28_WIIU" ||
        request.useragent.source == "UbiServices_SDK_HTTP_Client_4.2.9_WIIU") {
        response.send(wiiudb);
    }
    if (request.useragent.source.includes("PS4") == true) {
        response.send(ps4db);
    }
    if (
        request.useragent.source ==
        "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static" || request.header("X-SkuId") == "jdconnect-online-web") {
        if (request.header("X-SkuId") == "jd2021-pc-custom") {
            songdb = JSON.parse(JSON.stringify(pcdb));
            for (var song in songdb) {
                // skip loop if the property is from prototype
                var obj = songdb[song];
                obj.assets["banner_bkgImageUrl"] = obj.assets["map_bkgImageUrl"];
            }
            return response.send(songdb);
        } else {
            return response.send(pcdb);
        }
    }
}
});
app.get("/session-quest/v1/", function (request, response) {
    response.send(
        '{ "__class": "SessionQuestService::QuestData", "newReleases": [] }');
});

app.get("/leaderboard/v1/maps/:map/dancer-of-the-week", function (
        request,
        response) {
    if (jdconnect.core.requestcheck(request)) {
        var xhr = new XMLHttpRequest();
        var ticket = request.header("Authorization");
        var appid = request.header("X-SkuId");
        xhr.open(
            "GET",
            prodwsurl +
            "/leaderboard/v1/maps/" +
            request.params.map +
            "/dancer-of-the-week",
            false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-SkuId", appid);
        xhr.setRequestHeader("Authorization", ticket);
        xhr.send();
        response.send(xhr.responseText);
    } else {
        response.send(jdconnect.core.requestcheck(request));
    }
});

app.post("/profile/v2/map-ended", function (request,response) {
    var xhr = new XMLHttpRequest();
    var ticket = request.header("Authorization");
    var appid = request.header("X-SkuId");
    xhr.open("GET", prodwsurl + "/profile/v2/map-ended", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-SkuId", appid);
    xhr.setRequestHeader("Authorization", ticket);
    xhr.send(request.body);
    response.send(xhr.responseText);
});

app.get("/aliasdb/v1/aliases", function (request, response) {
    response.send(AliasDB);
});

app.post("/home/v1/tiles", function (request, response) {
    response.send(Tiles);
});

app.get("/dance-machine/v1/blocks", function (request, response) {
    response.send(DM);
});
app.get("/community-remix/v1/active-contest", function (request, response) {
    response.send({});
});

app.post("/carousel/v2/pages/quests", function (request, response) {
    response.send(QJSONCarousel);
});

app.post("/carousel/v2/pages/avatars", function(request, response) {
  response.send(Avatars);
});

app.post("/carousel/v2/pages/party", (request, response) => {
    if (jdconnect.core.requestcheck(request) == true) {
        if (request.body.searchString == "" || request.body.searchString == undefined) {
            if (request.body.searchString == "") {
                response.send(party);
            } else {
                response.send("DDOS someone else next time. - JDConnect Engineers")
            }
        } else {
            var songdb = pcdb;
            var query = request.body.searchString.toString().toUpperCase();
            console.log(query + " is searched");

            var matches = [];
            for (var song in songdb) {
                // skip loop if the property is from prototype

                var obj = songdb[song];

                var title = obj.title.toString().toUpperCase();
                var artist = obj.artist.toString().toUpperCase();
                var mapname = obj.mapName.toString().toUpperCase();
                var jdversion = obj.originalJDVersion.toString();
                var jdversion2 = "JUST DANCE " + obj.originalJDVersion.toString();
                var jdversion3 = "JD" + obj.originalJDVersion.toString();

                if (
                    title.includes(query) == true ||
                    jdversion.includes(query) == true ||
                    jdversion2.includes(query) == true ||
                    jdversion3.includes(query) == true ||
                    artist.includes(query) == true ||
                    mapname.includes(query) == true) {
                    matches.push(obj.mapName.toString());
                }
            }

            var carresponse = null;
			carresponse =  JSON.parse(JSON.stringify(search))
            
			carresponse.categories.forEach(function(carousel) {
				if (carousel.title == "[icon:SEARCH_RESULT] insert search result here") {
					carousel.title = "[icon:SEARCH_RESULT] " + request.body.searchString.toString();
					matches.forEach(function (arrayItem) {
						var obj = JSON.parse('{"__class":"Item","isc":"grp_cover","act":"ui_component_base","components":[{"__class":"JD_CarouselContentComponent_Song","mapName":"' + arrayItem + '"}],"actionList":"partyMap"}');
						carousel.items.push(obj);
					});
				}
			})
            
            response.send(carresponse);
        }
    } else {
        response.sendStatus(jdconnect.core.requestcheck(request));
    }
});

app.post("/carousel/v2/pages/dancerprofile", (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", prodwsurl + req.url, true);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);
    xhr.addEventListener("load", function () {
        if (xhr.readyState == 4) {
            res.send(xhr.responseText);
        }
    });
});

app.post("/carousel/v2/pages/jd2019-playlists", (request, response) => {
    response.send(
        require("./DATABASE/Platforms/jd2019-nx-all/jd2019-playlists.json"));
});

app.post("/carousel/v2/pages/jdtv", (request, response) => {
    var json = JSON.stringify(request.body);
    const httpsopts = {
        hostname: "public-ubiservices.ubi.com",
        port: 443,
        path: "/v2/profiles/sessions",
        method: "POST",
        headers: {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19022",
            Authorization: require("./DATABASE/ubiticket.json").AuthXBOX,
            "Content-Type": "application/json",
            "Ubi-AppId": "ccfda907-9767-4ae5-895c-6204e7a39cbd",
            Host: "public-ubiservices.ubi.com",
            "Content-Length": "0"
        }
    };
    redirect(httpsopts, "", function (redResponse) {
        var responsepar = JSON.parse(redResponse);
        var auth = "Ubi_v1 " + responsepar["ticket"];
        var xhr = new XMLHttpRequest();
        xhr.open("POST", prodwsurl + "/carousel/v2/pages/jdtv", true);
        xhr.setRequestHeader("X-SkuId", "jd2018-xone-emea");
        xhr.setRequestHeader("Authorization", auth);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(request.body), null, 2);
        xhr.addEventListener("load", function () {
            if (xhr.readyState == 4) {
                var parse = JSON.parse(xhr.responseText);
                response.send(parse);
            }
        });
    });
});
app.post("/carousel/v2/pages/recap-autodance", (req, res) => {
    if (jdconnect.core.requestcheck(req)) {
        var xhr = new XMLHttpRequest();
        var ticket = req.header("Authorization");
        var appid = jdconnect.core.getskuid(req);
        xhr.open(
            "POST",
            "https://" + prodwsurl + "/carousel/v2/pages/recap-autodance",
            false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-SkuId", appid);
        xhr.setRequestHeader("Authorization", ticket);
        xhr.send();
        res.send(xhr.responseText);
    } else {
        res.send(jdconnect.core.requestcheck(req));
    }
});
app.post("/ugc/v2/ugcs/*", (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", prodwsurl + req.url, true);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);
    xhr.addEventListener("load", function () {
        if (xhr.readyState == 4) {
            res.send(xhr.responseText);
        }
    });
});
app.put("/ugc/v2/ugcs/*", (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", prodwsurl + req.url, true);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);
    xhr.addEventListener("load", function () {
        if (xhr.readyState == 4) {
            res.send(xhr.responseText);
        }
    });
});

app.post("/carousel/v2/pages/friend-dancerprofile", (request, response) => {
    var ticket = request.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", prodwsurl + request.url, true);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(request));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(request.body), null, 2);
    xhr.addEventListener("load", function () {
        if (xhr.readyState == 4) {
            response.send(JSON.parse(xhr.responseText));
        }
    });
});

app.get("/questdb/v1/quests", function (request, response) {
    response.send(Quest);
});

app.get("/status/v1/ping", function (request, response) {
    if (jdconnect.core.requestcheck(request) == true) {
        var ticket = request.header("Authorization");
        var xhr = new XMLHttpRequest();
        xhr.open("GET", prodwsurl + "/status/v1/ping", true);
        xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(request));
        xhr.setRequestHeader("Authorization", ticket);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(request.body, null, 2));
        response.send(xhr.responseText);
    } else {
        response.send(jdconnect.core.requestcheck(request));
    }
});

app.get("/customizable-itemdb/v1/items", function (request, response) {
    response.send(CustomDB);
});

app.get("/constant-provider/v1/sku-constants", (req, res) => {
    res.send(SKUConstants);
});

app.post("/carousel/v2/pages/upsell-videos", function (request, response) {
    response.send(upsell);
});


app.post("/subscription/v1/refresh", function (request, response) {
    response.send(
        '{"validity": true, "errorCode": "", "timeLeft": 99999999999, "expiryTimeStamp": "99999999999", "platformId": "4b93827a-01c6-405b-b4b3-67590ef4b47b", "trialActivated": false, "consoleHasTrial": true, "trialTimeLeft": 0, "trialDuration": "90", "trialIsActive": false, "needEshopLink": false, "autoRefresh": false}');
});

var useragent = require("express-useragent");

app.get("/content-authorization/v1/maps/:map", function(request, response) {
  const skuId = request.header("X-SkuId");
  switch (skuId) {
    case skuId:
      if (request.params.map) {
      var path_JD = "./content-authorization/v1/maps/JD/";
      var path_JD2 = "./content-authorization/v1/maps/JD2/";
      var path_JD3 = "./content-authorization/v1/maps/JD3/";
      var path_JD4 = "./content-authorization/v1/maps/JD4/";
      var path_JD2014 = "./content-authorization/v1/maps/JD2014/";
      var path_JD2015 = "./content-authorization/v1/maps/JD2015/";
      var path_JD2016 = "./content-authorization/v1/maps/JD2016/";
      var path_JD2017 = "./content-authorization/v1/maps/JD2017/";
      var path_JD2018 = "./content-authorization/v1/maps/JD2018/";
      var path_JD2019 = "./content-authorization/v1/maps/JD2019/";
      var path_JD2020 = "./content-authorization/v1/maps/JD2020/";
      var path_JD2021 = "./content-authorization/v1/maps/JD2021/";
      var path_JD2022 = "./content-authorization/v1/maps/JD2022/";
      var path_JD2023 = "./content-authorization/v1/maps/JD2023/";
      var path_JD2024 = "./content-authorization/v1/maps/JD2024/";
	    var path_JDFAN = "./content-authorization/v1/maps/JDFAN/";
      var path_JDABBA = "./content-authorization/v1/maps/JDABBA/";
      var path_JDCHINA = "./content-authorization/v1/maps/JDCHINA/";
      var path_JDKIDS = "./content-authorization/v1/maps/JDKIDS/";
      var path_JDWIIU = "./content-authorization/v1/maps/JDWIIU/";
      if (fs.existsSync(path_JD + request.params.map + ".json")) {
        fs.readFile(path_JD + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2 + request.params.map + ".json")) {
        fs.readFile(path_JD2 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD3 + request.params.map + ".json")) {
        fs.readFile(path_JD3 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD4 + request.params.map + ".json")) {
        fs.readFile(path_JD4 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2014 + request.params.map + ".json")) {
        fs.readFile(path_JD2014 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2015 + request.params.map + ".json")) {
        fs.readFile(path_JD2015 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2016 + request.params.map + ".json")) {
        fs.readFile(path_JD2016 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2017 + request.params.map + ".json")) {
        fs.readFile(path_JD2017 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2018 + request.params.map + ".json")) {
        fs.readFile(path_JD2018 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2019 + request.params.map + ".json")) {
        fs.readFile(path_JD2019 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2020 + request.params.map + ".json")) {
        fs.readFile(path_JD2020 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2021 + request.params.map + ".json")) {
        fs.readFile(path_JD2021 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2022 + request.params.map + ".json")) {
        fs.readFile(path_JD2022 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDFAN + request.params.map + ".json")) {
        fs.readFile(path_JDFAN + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDABBA + request.params.map + ".json")) {
        fs.readFile(path_JDABBA + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDCHINA + request.params.map + ".json")) {
        fs.readFile(path_JDCHINA + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2023 + request.params.map + ".json")) {
        fs.readFile(path_JD2023 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2024 + request.params.map + ".json")) {
        fs.readFile(path_JD2024 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDKIDS + request.params.map + ".json")) {
        fs.readFile(path_JDKIDS + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDWIIU + request.params.map + ".json")) {
        fs.readFile(path_JDWIIU + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      }
    }
    break;
    case "jd2015-pc-cmos":
      if (request.params.map) {
      var path_JD = "./content-authorization/v1/maps/JD/";
      var path_JD2 = "./content-authorization/v1/maps/JD2/";
      var path_JD3 = "./content-authorization/v1/maps/JD3/";
      var path_JD4 = "./content-authorization/v1/maps/JD4/";
      var path_JD2014 = "./content-authorization/v1/maps/JD2014/";
      var path_JD2015 = "./content-authorization/v1/maps/JD2015/";
      var path_JD2016 = "./content-authorization/v1/maps/JD2016/";
      var path_JD2017 = "./content-authorization/v1/maps/JD2017/";
      var path_JD2018 = "./content-authorization/v1/maps/JD2018/";
      var path_JD2019 = "./content-authorization/v1/maps/JD2019/";
      var path_JD2020 = "./content-authorization/v1/maps/JD2020/";
      var path_JD2021 = "./content-authorization/v1/maps/JD2021/";
      var path_JDABBA = "./content-authorization/v1/maps/JDABBA/";
      var path_JDCHINA = "./content-authorization/v1/maps/JDCHINA/";
      var path_JDKIDS = "./content-authorization/v1/maps/JDKIDS/";
      var path_JDWIIU = "./content-authorization/v1/maps/JDWIIU/";
      if (fs.existsSync(path_JD + request.params.map + ".json")) {
        fs.readFile(path_JD + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2 + request.params.map + ".json")) {
        fs.readFile(path_JD2 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD3 + request.params.map + ".json")) {
        fs.readFile(path_JD3 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD4 + request.params.map + ".json")) {
        fs.readFile(path_JD4 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2014 + request.params.map + ".json")) {
        fs.readFile(path_JD2014 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2015 + request.params.map + ".json")) {
        fs.readFile(path_JD2015 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2016 + request.params.map + ".json")) {
        fs.readFile(path_JD2016 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2017 + request.params.map + ".json")) {
        fs.readFile(path_JD2017 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2018 + request.params.map + ".json")) {
        fs.readFile(path_JD2018 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2019 + request.params.map + ".json")) {
        fs.readFile(path_JD2019 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2020 + request.params.map + ".json")) {
        fs.readFile(path_JD2020 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2021 + request.params.map + ".json")) {
        fs.readFile(path_JD2021 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDABBA + request.params.map + ".json")) {
        fs.readFile(path_JDABBA + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDCHINA + request.params.map + ".json")) {
        fs.readFile(path_JDCHINA + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDKIDS + request.params.map + ".json")) {
        fs.readFile(path_JDKIDS + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDWIIU + request.params.map + ".json")) {
        fs.readFile(path_JDWIIU + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      }
    }
    break;
    case "jd2017-pc-ww":
      if (request.params.map) {
      var path_JD = "./content-authorization/v1/maps/JD/";
      var path_JD2 = "./content-authorization/v1/maps/JD2/";
      var path_JD3 = "./content-authorization/v1/maps/JD3/";
      var path_JD4 = "./content-authorization/v1/maps/JD4/";
      var path_JD2014 = "./content-authorization/v1/maps/JD2014/";
      var path_JD2015 = "./content-authorization/v1/maps/JD2015/";
      var path_JD2016 = "./content-authorization/v1/maps/JD2016/";
      var path_JD2017 = "./content-authorization/v1/maps/JD2017/";
      var path_JD2018 = "./content-authorization/v1/maps/JD2018/";
      var path_JD2019 = "./content-authorization/v1/maps/JD2019/";
      var path_JD2020 = "./content-authorization/v1/maps/JD2020/";
      var path_JD2021 = "./content-authorization/v1/maps/JD2021/";
      var path_JDABBA = "./content-authorization/v1/maps/JDABBA/";
      var path_JDCHINA = "./content-authorization/v1/maps/JDCHINA/";
      var path_JDKIDS = "./content-authorization/v1/maps/JDKIDS/";
      var path_JDWIIU = "./content-authorization/v1/maps/JDWIIU/";
      if (fs.existsSync(path_JD + request.params.map + ".json")) {
        fs.readFile(path_JD + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2 + request.params.map + ".json")) {
        fs.readFile(path_JD2 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD3 + request.params.map + ".json")) {
        fs.readFile(path_JD3 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD4 + request.params.map + ".json")) {
        fs.readFile(path_JD4 + request.params.map + ".json", function(err, data) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2014 + request.params.map + ".json")) {
        fs.readFile(path_JD2014 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2015 + request.params.map + ".json")) {
        fs.readFile(path_JD2015 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2016 + request.params.map + ".json")) {
        fs.readFile(path_JD2016 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2017 + request.params.map + ".json")) {
        fs.readFile(path_JD2017 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2018 + request.params.map + ".json")) {
        fs.readFile(path_JD2018 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2019 + request.params.map + ".json")) {
        fs.readFile(path_JD2019 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2020 + request.params.map + ".json")) {
        fs.readFile(path_JD2020 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JD2021 + request.params.map + ".json")) {
        fs.readFile(path_JD2021 + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDABBA + request.params.map + ".json")) {
        fs.readFile(path_JDABBA + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDCHINA + request.params.map + ".json")) {
        fs.readFile(path_JDCHINA + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDKIDS + request.params.map + ".json")) {
        fs.readFile(path_JDKIDS + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      } else if (fs.existsSync(path_JDWIIU + request.params.map + ".json")) {
        fs.readFile(path_JDWIIU + request.params.map + ".json", function(
          err,
          data
        ) {
          if (err) throw err;
          if (data) {
            var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
            response.send(pardata);
            addStats(request.params.map);
          }
        });
      }
    }
    break;
    default:
      response.send("Hey there!" + "\n" + "We spent a real good time getting all of those No HUDs... So, is a no go");
    break;
  }
});


app.post("/carousel/v2/pages/sweat", (req, res) => {
    res.send(sweat);
});
app.get("/wdf/v1/server-time", (request, response) => {
	var auth = request.header("Authorization");
	const httpsopts = {
    hostname: "prod.just-dance.com",
    port: 443,
    path: "/wdf/v1/server-time",
    method: "GET",
    headers: {
      "User-Agent": "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static",
      Accept: "*/*",
      "Accept-Language": "en-us,en",
      Authorization: auth,
      "X-SkuId": "jd2017-pc-ww"
    }
  };
  redirect(httpsopts, "", function(redResponse) {
    response.send(redResponse);
  });
});

app.post("/carousel/v2/pages/partycoop", (req, res) => {
    res.send(coop);
});

// profile/v2/


app.get("/account/v1/accounts/:game", (req, response) => {
    var ticket = req.header("Authorization");
    var xhr33 = new XMLHttpRequest();
    xhr33.open(req.method, prodwsurl + req.url, true);
    xhr33.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr33.setRequestHeader("Authorization", ticket);
    xhr33.setRequestHeader("Content-Type", "application/json");
    xhr33.send(JSON.stringify(req.body), null, 2);
    xhr33.addEventListener("load", function () {
        if (xhr33.readyState == 4) {
            response.send(xhr33.responseText.toString());
        }
    });
});

app.put("/profile/v2/favorites/maps/:map", function (req, res) {
    if (jdconnect.core.requestcheck(req)) {
        var ticket = req.header("Authorization");
        var xhr = new XMLHttpRequest();
        xhr.open(
            "PUT",
            prodwsurl + "/profile/v2/favorites/maps/" + req.params.map,
            true);
        xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
        xhr.setRequestHeader("Authorization", ticket);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(req.body, null, 2));
        res.send(xhr.responseText);
    } else {
        res.send(jdconnect.core.requestcheck(req));
    }
});
app.delete("/profile/v2/favorites/maps/:map", function (req, res) {
    if (jdconnect.core.requestcheck(req)) {
        var ticket = req.header("Authorization");
        var xhr = new XMLHttpRequest();
        xhr.open(
            "DELETE",
            prodwsurl + "/profile/v2/favorites/maps/" + req.params.map,
            true);
        xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
        xhr.setRequestHeader("Authorization", ticket);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(req.body, null, 2));
        res.send(xhr.responseText);
    } else {
        res.send(jdconnect.core.requestcheck(req));
    }
});

app.get("/profile/v2/profiles", (req, response) => {
    var ticket = req.header("Authorization");
    var xhr33 = new XMLHttpRequest();
    xhr33.open(req.method, prodwsurl + req.url, true);
    xhr33.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr33.setRequestHeader("Authorization", ticket);
    xhr33.setRequestHeader("Content-Type", "application/json");
    xhr33.send(JSON.stringify(req.body), null, 2);
    xhr33.addEventListener("load", function () {
        if (xhr33.readyState == 4) {
            response.send(xhr33.responseText.toString());
        }
    });
});
app.post("/profile/v2/profiles", (req, response) => {
    var ticket = req.header("Authorization");
    var xhr3 = new XMLHttpRequest();
    xhr3.open(req.method, prodwsurl + req.url, true);
    xhr3.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr3.setRequestHeader("Authorization", ticket);
    xhr3.setRequestHeader("Content-Type", "application/json");
    xhr3.send(JSON.stringify(req.body), null, 2);
    xhr3.addEventListener("load", function () {
        if (xhr3.readyState == 4) {
            response.send(xhr3.responseText.toString());
        }
    });
});

// video challenge
app.all("/carousel/v2/pages/*", function (req, res) {
    var ticket = req.header("Authorization");
    var xhr3 = new XMLHttpRequest();
    xhr3.open(req.method, prodwsurl + req.url, true);
    xhr3.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr3.setRequestHeader("Authorization", ticket);
    xhr3.setRequestHeader("Content-Type", "application/json");
    xhr3.send(JSON.stringify(req.body), null, 2);
    xhr3.addEventListener("load", function () {
        if (xhr3.readyState == 4) {
            res.send(xhr3.responseText.toString());
        }
    });
});

app.all("/challenge-match/*", function (req, res) {
    var ticket = req.header("Authorization");
    var xhr4 = new XMLHttpRequest();
    xhr4.open(req.method, prodwsurl + req.url, true);
    xhr4.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr4.setRequestHeader("Authorization", ticket);
    xhr4.setRequestHeader("Content-Type", "application/json");
    xhr4.send(JSON.stringify(req.body), null, 2);
    xhr4.addEventListener("load", function () {
        if (xhr4.readyState == 4) {
            res.send(xhr4.responseText.toString());
        }
    });
});

// v1
app.get("/v1/applications/:game/configuration", function (request, response) {
    if (jdconnect.core.requestcheck(request) == true) {
        response.send(v1);
    } else {
        response.sendStatus(jdconnect.core.requestcheck(request));
    }
});

// v2
app.get("/v2/spaces/:spaceid/entities", function (request, response) {
    if (jdconnect.core.requestcheck(request) == true) {
        response.send(v2);
    } else {
        response.sendStatus(jdconnect.core.requestcheck(request));
    }
});

// v3
app.get("/v3/users/:user", (req, res) => {
    var auth = req.header("Authorization");
    var sessionid = req.header("Ubi-SessionId");
    const httpsopts = {
        hostname: "public-ubiservices.ubi.com",
        port: 443,
        path: "/v3/users/" + req.params.user,
        method: "GET",
        headers: {
            "User-Agent": "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static",
            Accept: "*/*",
            Authorization: auth,
            "Content-Type": "application/json",
            "ubi-appbuildid": "BUILDID_259645",
            "Ubi-AppId": "341789d4-b41f-4f40-ac79-e2bc4c94ead4",
            "Ubi-localeCode": "en-us",
            "Ubi-Populations": "US_EMPTY_VALUE",
            "Ubi-SessionId": sessionid
        }
    };
    redirect(httpsopts, "", function (redResponse) {
        res.send(JSON.parse(redResponse));
    });
});

app.get("/leaderboard/v1/coop_points/mine", (req, res) => {
    res.send("");
});

// packages
app.post("/carousel/v2/packages", function (request, response) {
    response.send(CarouselPackages);
});

app.post("/v3/users/:user", (req, res) => {
    var json = JSON.stringify(req.body);
    const httpsopts = {
        hostname: "public-ubiservices.ubi.com",
        port: 443,
        path: "/v2/profiles/sessions",
        method: "POST",
        headers: {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19022",
            Authorization: require("./DATABASE/ubiticket.json").AuthXBOX,
            "Content-Type": "application/json",
            "Ubi-AppId": "155d58d0-94ae-4de2-b8f9-64ed5f299545",
            Host: "public-ubiservices.ubi.com",
            "Content-Length": "0"
        }
    };
    redirect(httpsopts, "", function (redResponse) {
        var responsepar = JSON.parse(redResponse);
        var auth = "Ubi_v1 " + responsepar["ticket"];
        const httpsopts2 = {
            hostname: "prod.just-dance.com",
            port: 443,
            path: "/v3/users/" + req.params.user,
            method: "POST",
            headers: {
                Accept: "*/*",
                Authorization: auth,
                "Content-Type": "application/json",
                "X-SkuId": "jd2017-xone-emea"
            }
        };
        redirect(httpsopts2, json, function (redResponse) {
            res.send(JSON.parse(redResponse));
        });
    });
});

app.post("/profile/v2/filter-players", (request, response) => {
    var json = JSON.stringify(request.body);
    const httpsopts = {
        hostname: "public-ubiservices.ubi.com",
        port: 443,
        path: "/v2/profiles/sessions",
        method: "POST",
        headers: {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19022",
            Authorization: require("./DATABASE/ubiticket.json").AuthXBOX,
            "Content-Type": "application/json",
            "Ubi-AppId": "7df3c817-cde1-4bf9-9b37-ceb9d06c4b96",
            Host: "public-ubiservices.ubi.com",
            "Content-Length": "0"
        }
    };
    redirect(httpsopts, "", function (redResponse) {
        var responsepar = JSON.parse(redResponse);
        var auth = "Ubi_v1 " + responsepar["ticket"];
        const httpsopts2 = {
            hostname: "prod.just-dance.com",
            port: 443,
            path: "/profile/v2/filter-players",
            method: "POST",
            headers: {
                Accept: "*/*",
                Authorization: auth,
                "Content-Type": "application/json",
                "X-SkuId": "jd2020-xone-all"
            }
        };
        redirect(httpsopts2, json, function (redResponse) {
            response.send(JSON.parse(redResponse));
        });
    });
});

app.get("/wdf/v1/api/rooms", (req, res) => {
    res.send(require("./DATABASE/wdf/rooms.json"));
});

app.post("/wdf/v1/assign-room", (req, res) => {
    res.send(
        '{ "room": "JD2020" }');
});

app.post("/wdf/v1/rooms/" + room + "/session", (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", prodwsurl + "/wdf/v1/rooms/PCJD2017/session", false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);
    res.sendStatus(200);
});

app.delete("/wdf/v1/rooms/" + room + "/session", (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", prodwsurl + "/wdf/v1/rooms/PCJD2017/session", false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body),null,2);
    res.sendStatus(200);
});

app.post("/wdf/v1/rooms/" + room + "/screens", (request, response) => {
    var json = JSON.stringify(request.body);
    var auth = request.header("Authorization");
    const httpsopts = {
        hostname: "prod.just-dance.com",
        port: 443,
        path: "/wdf/v1/rooms/" + room + "/screens",
        method: "POST",
        headers: {
            "User-Agent": "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static",
            Accept: "*/*",
            "Accept-Language": "en-us,en",
            Authorization: auth,
            "Content-Type": "application/json",
            "X-SkuId": "jd2017-pc-ww"
        }
    };
    redirect(httpsopts, "", function (redResponse) {
        response.send(redResponse);
    });
});

app.get("/wdf/v1/rooms/" + room + "/next-happyhours", (req, res) => {
        const httpsopts2 = {
            hostname: "prod.just-dance.com",
            port: 443,
            path: "/wdf/v1/rooms/PCJD2017/next-happyhours",
            method: "GET",
            headers: {
                Accept: "*/*",
                Authorization: req.header("Authorization"),
                "Content-Type": "application/json",
                "X-SkuId": jdconnect.core.getskuid(req)
            }
        };
        redirect(httpsopts2, JSON.stringify({}), function (redResponse) {
            res.send(JSON.parse(redResponse));
        });
});


app.get("/wdf/v1/rooms/" + room + "/online-rank-widget", (req, res) => {
        const httpsopts2 = {
            hostname: "prod.just-dance.com",
            port: 443,
            path: "/wdf/v1/rooms/PCJD2017/online-rank-widget",
            method: "GET",
            headers: {
                Accept: "*/*",
                Authorization: req.header("Authorization"),
                "Content-Type": "application/json",
                "X-SkuId": jdconnect.core.getskuid(req)
            }
        };
        redirect(httpsopts2, "{}", function (redResponse) {
            res.send(redResponse);
        });
});
app.get("/wdf/v1/rooms/" + room + "/session-recap", (req, res) => {
        const httpsopts2 = {
            hostname: "prod.just-dance.com",
            port: 443,
            path: "/wdf/v1/rooms/PCJD2017/session-recap",
            method: "GET",
            headers: {
                Accept: "*/*",
                Authorization: req.header("Authorization"),
                "Content-Type": "application/json",
                "X-SkuId": jdconnect.core.getskuid(req)
            }
        };
        redirect(httpsopts2, "{}", function (redResponse) {
            res.send(redResponse);
        });
});

app.get("/wdf/v1/rooms/PCJD2017/newsfeed", (request, response) => {
	var auth = request.header("Authorization");
	const httpsopts = {
    hostname: "prod.just-dance.com",
    port: 443,
    path: "/wdf/v1/rooms/PCJD2017/newsfeed",
    method: "GET",
    headers: {
      "User-Agent": "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static",
      Accept: "*/*",
      "Accept-Language": "en-us,en",
      Authorization: auth,
      "X-SkuId": "jd2017-pc-ww"
    }
  };
  redirect(httpsopts, "", function(redResponse) {
    response.send(redResponse);
  });
});

app.get("/wdf/v1/rooms/PCJD2017/notification", (request, response) => {
	var auth = request.header("Authorization");
	const httpsopts = {
    hostname: "prod.just-dance.com",
    port: 443,
    path: "/wdf/v1/rooms/PCJD2017/notification",
    method: "GET",
    headers: {
      "User-Agent": "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static",
      Accept: "*/*",
      "Accept-Language": "en-us,en",
      Authorization: auth,
      "X-SkuId": "jd2017-pc-ww"
    }
  };
  redirect(httpsopts, "", function(redResponse) {
    response.send(redResponse);
  });
});

app.get("/wdf/v1/rooms/" + room + "/ccu", (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/ccu",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(xhr.responseText.toString());
});

app.get(
    "/wdf/v1/rooms/" + room + "/themes/tournament/score-recap",
    (req, res) => {
     var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/tournament/score-recap",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
});

app.post(
    "/wdf/v1/rooms/" + room + "/themes/tournament/update-scores",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/tournament/update-scores",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
});

app.post(
    "/wdf/v1/rooms/" + room + "/themes/vote/update-scores",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/vote/update-scores",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
});

app.post(
    "/wdf/v1/rooms/" + room + "/themes/boss/update-scores",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/boss/update-scores",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
});

app.get(
    "/wdf/v1/rooms/" + room + "/themes/vote/choice",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/vote/choice",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
      });

app.get(
    "/wdf/v1/rooms/" + room + "/themes/vote/result",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/vote/result",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
      });

app.get(
    "/wdf/v1/rooms/" + room + "/themes/vote/score-recap",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/vote/score-recap",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
      });

app.get(
    "/wdf/v1/rooms/" + room + "/themes/boss/score-recap",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/boss/score-recap",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);
    res.send(JSON.parse(xhr.responseText));
});
app.post(
    "/wdf/v1/rooms/" + room + "/themes/teambattle/team-names",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/teambattle/team-names",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
});

app.get(
    "/wdf/v1/rooms/" + room + "/themes/boss/score-recap",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/boss/score-recap",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
});

app.get(
    "/wdf/v1/rooms/" + room + "/themes/teambattle/score-status",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/teambattle/score-status",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
      });
app.get(
    "/wdf/v1/rooms/" + room + "/themes/boss/score-status",
    (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        prodwsurl + "/wdf/v1/rooms/PCJD2017/themes/boss/score-status",
        false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);

    res.send(JSON.parse(xhr.responseText));
});


app.get("/wdf/v1/online-bosses", (req, res) => {
    res.send(bosses);
});

app.get("/leaderboard/v1/maps/*", (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    var n = req.url.lastIndexOf("/");
    var result = req.url.substr(0);
    xhr.open("GET", prodwsurl + result, false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    res.send(xhr.responseText);
});

app.post("/leaderboard/v1/maps/*", (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    var n = req.url.lastIndexOf("/");
    var result = req.url.substr(0);
    xhr.open("POST", prodwsurl + result, false);
    xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
    xhr.setRequestHeader("Authorization", ticket);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body, null, 2));
    res.send(xhr.responseText);
});
// v2/profiles/sessions

app.all("/v2/profiles/sessions", (req, res) => {
    if (jdconnect.core.requestcheck(req)) {
        var ticket = req.header("Authorization");
        var xhr = new XMLHttpRequest();
        xhr.open(req.method, "https://public-ubiservices.ubi.com/v2/profiles/sessions", true);
        xhr.setRequestHeader("X-SkuId", jdconnect.core.getskuid(req));
        xhr.setRequestHeader("Authorization", ticket);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(req.body, null, 2));
        res.send(xhr.responseText);
    } else {
        res.send(jdconnect.core.requestcheck(req));
    }
});

// v3/profiles/
app.post("/v3/*", (req, res) => {
    var reqheaders = Object.assign({}, req.headers);
    reqheaders["host"] = "public-ubiservices.ubi.com"
    axios.post("https://public-ubiservices.ubi.com/" + req.url, JSON.stringify(req.body), {
        headers: reqheaders
    })
    .then(response => {
        res.send(response.data)
    })
    .catch(err => {
        res.send(err)
        console.log("Sessions Report: An request have failed: " + err)
    })
});
app.delete("/v3/*", (req, res) => {
    var reqheaders = Object.assign({}, req.headers);
    reqheaders["host"] = "public-ubiservices.ubi.com"
    axios.delete("https://public-ubiservices.ubi.com/" + req.url, JSON.stringify(req.body), {
        headers: reqheaders
    })
    .then(response => {
        res.send(response.data)
    })
    .catch(err => {
        res.send(err)
        console.log("Sessions Report: An request have failed: " + err)
    })
});
app.get("/v3/*", (req, res) => {
    var reqheaders = Object.assign({}, req.headers);
    reqheaders["host"] = "public-ubiservices.ubi.com"
    axios.get("https://public-ubiservices.ubi.com/" + req.url, JSON.stringify(req.body), {
        headers: reqheaders
    })
    .then(response => {
        res.send(response.data)
    })
    .catch(err => {
        res.send(err)
        console.log("Sessions Report: An request have failed: " + err)
    })
});

app.get("/com-video/v1/com-videos-fullscreen", (req, res) => {
    res.send("{}");
});
var requestCountry = require("request-country");
app.all("*", (req, res) => {
    transactiondate = new Date().toISOString();
    transactionid = uuid();
    fullurl = req.protocol + "://" + req.get("host") + req.originalUrl;
    res.send(
        '<pre>{"errorCode":1003,"message":"Resource ' +
        req.url +
        ' not found.","httpCode":404,"errorContext":"' + req.method + '","moreInfo":"A link to more information will be coming soon. Please contact AleMService for more support.","transactionTime":"' +
        transactiondate +
        '","transactionId":"' +
        transactionid +
        '"}</pre>');
    console.log(req.url + " is not found (" + req.method + ")");
    console.log("transactionid: " + transactionid);
    console.log("transactiondate: " + transactiondate);
    console.log("useragent: " + req.header("User-Agent"));
    console.log("country: " + requestCountry(req));
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  jdconnect.Carousel.returncatalog();
  console.log("Your app is listening on port " + listener.address().port);
});

// Función para redireccionar a otros sitios
// Es necesario un options que contiene los detalles de ruta, la manera (GET, POST) y la dirección
function redirect(options, write, callback) {
  var Redirect = https.request(options, response => {
    response.on("data", data => {
      callback(data);
    });
  });
  Redirect.on("error", e => {
    console.log(e);
  });
  Redirect.write(write);
  Redirect.end();
}

// функция addStats
function addStats(codename) {
  fs.readFile("./statistics/playedSong/alltime.json", "utf-8", function(
    err,
    data
  ) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);
    arrayOfObjects[codename] = arrayOfObjects[codename] + 1;
    fs.writeFile(
      "./statistics/playedSong/alltime.json",
      JSON.stringify(arrayOfObjects),
      "utf-8",
      function(err) {
        if (err) throw err;
        console.log("All-Time stats of " + codename + " changed");
      }
    );
  });
  fs.readFile("./statistics/playedSong/total.json", "utf-8", function(
    err,
    data
  ) {
    if (err) throw err;
    var arrayOfObjects = JSON.parse(data);
    arrayOfObjects["total"] = arrayOfObjects["total"] + 1;
    fs.writeFile(
      "./statistics/playedSong/total.json",
      JSON.stringify(arrayOfObjects),
      "utf-8",
      function(err) {
        if (err) throw err;
        console.log("Total stats of " + codename + " changed");
      }
    );
  });
}
