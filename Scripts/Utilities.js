"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*================================================================================
 * @name: UtilitiesEngine - collection of helpers
 * @author/Collector: (c)Jack Makhoul (jack.makhoul@bloomerangs.com)
 * @version: 3.0.6
 ================================================================================*/
$.extend({

    /* REQUIREMENTS*/
    //jquery - latest version
    //amplify.js  v1.1.2
    //alertify.js v1.11.0
    //bpopup.js v0.11.0
    //momentjs.js v2.20.1
    //momentjs-timezone.js v0.5.14
    /* REQUIREMENTS*/

    /* DECLARATION REGION */
    //@ No DECLARATION NEEDED
    /* DECLARATION REGION */
    bloooomUtilities: {
        bloooomStorage: {
            create: function create(type, name, data) {
                var daysToExp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

                var expInMs = null;
                if (daysToExp != null) expInMs = daysToExp * 24 * 60 * 60 * 1000;
                switch (type.toLowerCase()) {
                    case "local":
                        amplify.store.localStorage(name, data, { expires: expInMs });
                        break;

                    case "session":
                        amplify.store.sessionStorage(name, data, { expires: expInMs });
                        break;

                    case "cookie":
                    default:
                        $.bloooomUtilities.createCookie(name, data, expInMs);
                        break;
                }
            },
            read: function read(type, name) {
                switch (type.toLowerCase()) {
                    case "local":
                        return amplify.store.localStorage(name);

                    case "session":
                        return amplify.store.sessionStorage(name);

                    case "cookie":
                    default:
                        return $.bloooomUtilities.readCookie(name);
                }
            },
            delete: function _delete(type, name) {
                switch (type.toLowerCase()) {
                    case "local":
                        amplify.store.localStorage(name, null);

                    case "session":
                        amplify.store.sessionStorage(name, null);

                    case "cookie":
                    default:
                        $.bloooomUtilities.deleteCookie(name);
                }
            }
        },

        createCookie: function createCookie(name, data, expInMs) {
            // save data in cookies 
            if (expInMs) {
                var date = new Date();
                date.setTime(date.getTime() + expInMs);
                var expires = "; expires=" + date.toGMTString();
            } else expires = "";
            document.cookie = escape(name) + "=" + escape(data) + expires + "; path=/"; //;secure =true for ssl secure cookie
        },

        readCookie: function readCookie(name) {
            // read data from cookies
            var nameEQ = escape(name) + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                } if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
            } //return null;
        },

        deleteCookie: function deleteCookie(name) {
            // delete data from specefic
            $.bloooomUtilities.createCookie(name, "", -1);
        },

        ESubscribe: function ESubscribe(topic, context, callback, priority) {
            // register / subscribe for an event
            amplify.subscribe(topic, context, callback, priority);
        },

        EDismiss: function EDismiss(topic, callback) {
            // unregister / unsubscribe for an event
            amplify.unsubscribe(topic, callback);
        },

        EFire: function EFire(topic, variables) {
            // publish an event
            console.log("FIRE --- " + topic);
            amplify.publish(topic, variables);
        },

        toUtc: function toUtc(strDateTime, formatIn, formatOut) {
            var str = "";
            if (formatOut) {
                str = moment(strDateTime, formatIn).utc().format(formatOut);
            } else {
                str = moment(strDateTime, formatIn).utc().format(formatIn);
            }

            if (str == "Invalid date") return null; else return str;
        },

        toLocal: function toLocal(strUtcDateTime, formatIn, formatOut) {
            var str = "";
            if (formatOut) {
                str = moment.utc(strUtcDateTime, formatIn).local().format(formatOut);
            } else {
                str = moment.utc(strUtcDateTime, formatIn).local().format(formatIn);
            }

            if (str == "Invalid date") return null; else return str;
        },

        dateTimeParseAny: function dateTimeParseAny(strDT, format) {
            var utc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (utc === false) {
                return moment(strDT, format)._d;
            } else {
                return moment.utc(strDT, format)._d;
            }
        },


        enterEvent: function enterEvent(textCntrl, fct) {
            // bind keydown = Keyboard enter to specefic function
            $(textCntrl).on("keydown", function (event) {
                if (event.keyCode == 13) {
                    fct();
                }
            });
        },

        isNullOrEmpty: function isNullOrEmpty(str) {
            if (str == null) return true; else if (str == NaN) return true; else if (str == undefined) return true; else if (str == "") return true;
        },

        tryParseFloat: function tryParseFloat(n) {
            if (n == null) return 0; else if (n == NaN) return 0; else if (n == undefined) return 0; else if (n == "") return 0; else {
                try {
                    return parseFloat(n);
                } catch (e) {
                    return 0;
                }
            }
        },

        acceptNumbersOnly: function acceptNumbersOnly(textCntrl) {
            // bind only number to a text box
            $(textCntrl).keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true) ||
                    // Allow: home, end, left, right, down, up
                    e.keyCode >= 35 && e.keyCode <= 40) {
                    // let it happen, don't do anything
                    return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        },

        isValidEmailAddress: function isValidEmailAddress(emailAddress) {
            // check if email is valid
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        },

        isValidEmailAddress_Multi: function isValidEmailAddress_Multi(emailAddresses) {
            var res = true;
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            if (!$.bloooomUtilities.isNullOrEmpty(emailAddresses)) {
                if (emailAddresses.indexOf(",") > -1) {
                    var arr_emailAddr = emailAddresses.split(",");
                    $.each(arr_emailAddr, function (i, elem) {
                        if (pattern.test(elem) == false) res = false;
                    });
                    return res;
                } else {
                    // check if email is valid
                    return pattern.test(emailAddresses);
                }
            }
            return false;
        },

        isValidMobileLocalWithCCode: function isValidMobileLocalWithCCode(mobile) {
            var pattern = new RegExp(/^\+[1-9]{3}[0-9]{2}[0-9]{3}[0-9]{3}$/);
            return pattern.test(mobile);
        },

        isValidMobileLocalAllOp1: function (mobile) {
            var pattern = new RegExp(/^[0-9]\d{7}$|^[+][0-9]\d{10}$/);
            return pattern.test(mobile);
        },
        isValidMobileLocalAllOp2: function (mobile) {
            var pattern = new RegExp(/^[+9613][0-9]\d{9}$/);
            return pattern.test(mobile);
        },

        isValidMobile: function isValidMobile(mobile) {
            var pattern = new RegExp(/^\+[1-9]{1}[0-9]{3,14}$/); // (/^[+]?\d+$/);
            return pattern.test(mobile);
        },

        isValidMobileNumber: function isValidMobileNumber(mobile) {
            if (mobile.startsWith("+") === true)
                mobile = mobile.replace("+", "");
            return $.bloooomUtilities.isNumber(mobile);
            //var pattern = new RegExp("/^[+|(?:00)]*[]{0,1}[0-9]{1,4}[]{0,1}[0-9]*$/g");//^(?:00|\\+)[0-9\\s.\\/-]{6,20}$"/); // (/^[+]?\d+$
            //return pattern.test(mobile);
        },

        isValidMobileLocalWithoutCCode: function isValidMobileLocalWithoutCCode(mobile) {
            var pattern = new RegExp("^\\d{9}$");
            return pattern.test(mobile);
        },

        isValidSaudiNumber: function isValidSaudiNumber(mobile) {
            var pattern = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
            return pattern.test(mobile);
        },

        isNumber: function isNumber(nbr) {
            return !isNaN(parseFloat(nbr)) && isFinite(nbr);
        },

        isInteger: function isInteger(value) {
            // check if number is integer
            if (undefined === value || null === value) {
                return false;
            }
            return value % 1 == 0;
        },

        escape: function escape(type, str) {
            //type = escape || unescape
            if (type != undefined && type != "") {
                switch (type.toLowerCase()) {
                    case "unescape":
                        return String(str).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

                    case "escape":
                        return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
            } else return str;
        },

        base64: function base64(type, str) {
            //type  = encode || decode
            if (type != undefined && type != "") {
                var Base64 = {
                    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function encode(e) {
                        var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) {
                            n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) {
                                u = a = 64;
                            } else if (isNaN(i)) {
                                a = 64;
                            } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
                        } return t;
                    }, decode: function decode(e) {
                        var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) {
                            s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) {
                                t = t + String.fromCharCode(r);
                            } if (a != 64) {
                                t = t + String.fromCharCode(i);
                            }
                        } t = Base64._utf8_decode(t); return t;
                    }, _utf8_encode: function _utf8_encode(e) {
                        e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) {
                            var r = e.charCodeAt(n); if (r < 128) {
                                t += String.fromCharCode(r);
                            } else if (r > 127 && r < 2048) {
                                t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128);
                            } else {
                                t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128);
                            }
                        } return t;
                    }, _utf8_decode: function _utf8_decode(e) {
                        var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) {
                            r = e.charCodeAt(n); if (r < 128) {
                                t += String.fromCharCode(r); n++;
                            } else if (r > 191 && r < 224) {
                                c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2;
                            } else {
                                c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3;
                            }
                        } return t;
                    }
                };
                switch (type.toLowerCase()) {
                    case "encode":
                        return Base64.encode(str);

                    case "decode":
                        return Base64.decode(str);

                    default:
                        return "";
                }
            }
            return "";
        },

        qs: function qs(key) {
            /*Get query string from Url*/
            key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx control chars
            var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
            return match && decodeURIComponent(match[1].replace(/\+/g, " "));
        },

        isMobile: function isMobile(query) {
            /*Check if is mobile device based on device information or based on query if exist (CSS media query)*/
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)) || Modernizr.mq(query)) {
                return true;
            } else return false;
        },

        isIpad: function isIpad() {
            /*to be removed later, isMobile fnc to return if is ipad, mobile or desktop*/
            return navigator.userAgent.match(/iPad/i) != null;
        },

        loadScript: function loadScript(url, callback, before, complete) {
            /*load external scripts */
            jQuery.ajax({
                url: url,
                dataType: 'script',
                beforeSend: before,
                complete: complete,
                success: callback,
                async: true
            });
        },

        sendAjaxRequest: function sendAjaxRequest(data, url, beforeSend, complete, success, error) {
            var dataType = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "json";
            var requestType = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "POST";
            var contentType = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "application/json; charset=utf-8";
            var processData = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : null;
            var async = arguments[10];
            /*send ajax request /data:json/ /url:string/ */
            var request = {
                type: requestType,
                url: url,
                contentType: contentType,
                dataType: dataType
            };
            if (beforeSend) {
                request["beforeSend"] = beforeSend;
            }
            if (complete) {
                request["complete"] = complete;
            }
            if (success) {
                request["success"] = success;
            }
            if (processData !== null) {
                request["processData"] = processData;
            }
            if (error) {
                request["error"] = error;
            } else {
                request["error"] = function (data) {
                    try {
                        var error = data.statusText;
                        $.bloooomUtilities.displayMessage(error, "error", "dialog", "Request Error"); //encodeURIComponent
                    } catch (e) {
                        alert(e.message);
                    }
                };
            }

            if (data) {
                request["data"] = data;
            }
            if (async == true) {
                request["async"] = true;
            }
            $.ajax(request);
        },

        displayMessage: function displayMessage(msg, msgType, displayType, title, onDismiss, onConfirm) {
            var okText = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'Confirm';
            var cancelText = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'Cancel';
            var width = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
            var pinnable = arguments[9];
            // requires alertify.js
            alertify.set('notifier', 'position', 'top-right');
            switch (displayType) {
                case "dialog":
                    if (pinnable) alertify.alert(title, msg, onDismiss).set({ 'pinnable': true, 'modal': false, 'moveBounded': true }); else alertify.alert(title, msg, onDismiss).set('movable', false);
                    break;
                case "confirm":
                    var confirm = alertify.confirm().set('movable', false).set('reverseButtons', true).set({ transition: 'fade', closableByDimmer: false }).set('labels', { ok: okText, cancel: cancelText });
                    confirm.setHeader(title);
                    confirm.setMessage(msg);
                    confirm.set('onok', onConfirm);
                    confirm.set('oncancel', onDismiss);
                    if (width > 0) $(confirm.elements.dialog).width(width); else $(confirm.elements.dialog).removeAttr("style");

                    confirm.show();
                    break;
                case "notification":
                default:
                    switch (msgType) {
                        case "error":
                            alertify.error(msg, onDismiss);
                            break;

                        case "notify":
                            alertify.notify(msg, onDismiss);
                            break;

                        case "success":
                            alertify.success(msg, onDismiss);
                            break;

                        case "warning":
                            alertify.warning(msg, onDismiss);
                            break;

                        case "message":
                        default:
                            alertify.message(msg, onDismiss);
                            break;
                    }
                    break;
            }
        },

        expandCollapse: function expandCollapse(target, actionBtn, speed) {
            $(actionBtn).on("click", function () {
                $(target).slideToggle(speed);
            });
        },

        blockUI: function blockUI(message, element) {
            if (element != undefined) {
                $(element).block({
                    overlayCSS: { cursor: 'default', backgroundColor: '#ffffff' },
                    css: {
                        border: 'none',
                        background: 'transparent',
                        padding: '15px',
                        opacity: .8,
                        color: '#fff',
                        cursor: 'default'
                    }, message: '<h5>' + message + '</h5>'
                });
            } else {
                $.blockUI({
                    overlayCSS: { backgroundColor: '#ffffff' },
                    css: {
                        border: 'none',
                        background: 'transparent',
                        padding: '15px',
                        opacity: .8,
                        color: '#fff'
                    }, message: '<h5>' + message + '</h5>'
                });
            }
        },

        unblockUI: function unblockUI(element) {
            if (element != undefined) {
                $(element).unblock();
            } else {
                $.unblockUI();
            }
        },

        openPopup: function openPopup(id, closeClass, onOpen, onClose) {
            $("#" + id).bPopup({
                modalClose: false,
                modalColor: 'black',
                opacity: 0.5,
                closeClass: closeClass,
                positionStyle: 'fixed',
                follow: [true, true],
                onOpen: onOpen,
                onClose: onClose
            });
        },

        generateInputForCalendar: function generateInputForCalendar(id, name, type, relatedTo, CssClass, Value, Placeholder, inline, showTime, minDate, maxDate, format, attr) {
            if (inline == false) {
                return '<input type="text" data-type="' + type + '" id="' + id + '" name="' + name + '" class="' + CssClass + '" value="' + Value + '" placeholder="' + Placeholder + '" data-relatedTo="' + relatedTo + '" data-minDate="' + minDate + '" data-maxDate="' + maxDate + '" data-showTime="' + showTime + '" data-format="' + format + '" ' + attr + ' />';
            } else {
                return '<div type="text" data-type="' + type + '" id="' + id + '" name="' + name + '" class="' + CssClass + '" value="' + Value + '" data-relatedTo="' + relatedTo + '" data-minDate="' + minDate + '" data-maxDate="' + maxDate + '" data-showTime="' + showTime + '" data-format="' + format + '"></div>';
            }
        },


        getObjects: function getObjects(obj, key, val) {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (_typeof(obj[i]) == 'object') {
                    objects = objects.concat(this.getObjects(obj[i], key, val));
                } else if (i == key && obj[key] == val) {
                    objects.push(obj);
                }
            }
            return objects;
        },

        getObjectsIndex: function getObjectsIndex(obj, key, val) {
            var ind = -1;
            obj.map(function (d, index) {
                if (d[key] == val) ind = index;
            });
            return ind;
        },

        findObjInArray: function findObjInArray(arr, key, val) {
            try {
                return arr.filter(function (item) {
                    return item[key] === val;
                });
            } catch (e) {
                return [];
            }
        },

        // to be tested
        trim: function trim(str) {
            return str.replace(/^s+|s+$/g, "");
        },
        getArrayMaxVal: function getArrayMaxVal(Arr) {
            return Math.max.apply(Math, Arr);
        },
        getArrayMinVal: function getArrayMinVal(Arr) {
            return Math.min.apply(Math, Arr);
        },
        emptyArray: function emptyArray(Arr) {
            Arr.length = 0;
            return Arr;
        },
        parseJSON: function parseJSON(str) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return null;
            }
        }
    }
});
var $B = $.bloooomUtilities;
$.settingsToDelete = [];
$.settingsExistAlready = [];

/*!
 * jQuery.parseJSON() extension (supports ISO & Asp.net date conversion)
 *
 * Version 1.0 (13 Jan 2011)
 *
 * Copyright (c) 2011 Robert Koritnik
 * Licensed under the terms of the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {

    // JSON RegExp
    var rvalidchars = /^[\],:{}\s]*$/;
    var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
    var dateISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i;
    var dateNet = /\/Date\((\d+)(?:-\d+)?\)\//i;

    // replacer RegExp
    var replaceISO = /"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:[.,](\d+))?Z"/i;
    var replaceNet = /"\\\/Date\((\d+)(?:-\d+)?\)\\\/"/i;

    // determine JSON native support
    var nativeJSON = window.JSON && window.JSON.parse ? true : false;
    var extendedJSON = nativeJSON && window.JSON.parse('{"x":9}', function (k, v) {
        return "Y";
    }) === "Y";

    var jsonDateConverter = function jsonDateConverter(key, value) {
        if (typeof value === "string") {
            if (dateISO.test(value)) {
                return new Date(value);
            }
            if (dateNet.test(value)) {
                return new Date(parseInt(dateNet.exec(value)[1], 10));
            }
        }
        return value;
    };

    $.extend({
        parseJSON: function parseJSON(data, convertDates) {
            /// <summary>Takes a well-formed JSON string and returns the resulting JavaScript object.</summary>
            /// <param name="data" type="String">The JSON string to parse.</param>
            /// <param name="convertDates" optional="true" type="Boolean">Set to true when you want ISO/Asp.net dates to be auto-converted to dates.</param>

            if (typeof data !== "string" || !data) {
                return null;
            }

            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = $.trim(data);

            // Make sure the incoming data is actual JSON
            // Logic borrowed from http://json.org/json2.js
            if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
                // Try to use the native JSON parser
                if (extendedJSON || nativeJSON && convertDates !== true) {
                    return window.JSON.parse(data, convertDates === true ? jsonDateConverter : undefined);
                } else {
                    data = convertDates === true ? data.replace(replaceISO, "new Date(parseInt('$1',10),parseInt('$2',10)-1,parseInt('$3',10),parseInt('$4',10),parseInt('$5',10),parseInt('$6',10),(function(s){return parseInt(s,10)||0;})('$7'))").replace(replaceNet, "new Date($1)") : data;
                    return new Function("return " + data)();
                }
            } else {
                $.error("Invalid JSON: " + data);
            }
        }
    });
})(jQuery);

/*Parse form as json*/

(function ($) {
    $.fn.serializeObject = function () {

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push": /^$/,
                "fixed": /^\d+$/,
                "named": /^[a-zA-Z0-9_]+$/
            };

        this.build = function (base, key, value) {
            base[key] = value;
            return base;
        };

        this.push_counter = function (key) {
            if (push_counters[key] === undefined) {
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function () {

            // skip invalid keys
            if (!patterns.validate.test(this.name)) {
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while ((k = keys.pop()) !== undefined) {

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if (k.match(patterns.push)) {
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if (k.match(patterns.fixed)) {
                    merge = self.build([], k, merge);
                }

                // named
                else if (k.match(patterns.named)) {
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);