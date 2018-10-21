/* Copyright 2016 Phucbm */
app = {};
dev = {};
mess = {};
input = {};
jQuery(document).ready(function ($) {
    /************************************
     * Dev functions
     ************************************/
    dev.status = true;
    dev.log = function (text) {
        if (dev.status) console.log(text);
    };

    /************************************
     * Message control
     ************************************/
    mess.$ = $("#message");
    mess.clear = function () {
        mess.$.html('');
    };
    /**
     * Set validation message
     * @param errorCode
     */
    mess.setValidation = function (errorCode) {
        // break if mess existed
        if (mess.$.find('.validation.' + errorCode).length) return;

        // define
        var classes = 'validation ' + errorCode,
            text, html;

        // switch error code
        switch (errorCode) {
            case 'too-long-input':
                text = "Hãy nhập giá trị ngắn hơn.";
                break;
            case 'empty-input':
                text = "Hãy quét chọn hoặc gõ ngoại tệ mà bạn muốn đổi.";
                break;
            case 'currency-code-not-found':
                text = "Hãy gõ mã ngoại tệ.";
                break;
            case 'number-not-found':
                text = "Hãy gõ số lượng bạn muốn đổi.";
                break;
            default:
                text = "";
        }

        // build html
        html = '<p class="' + classes + '">' + text + '</p>';

        mess.$.append(html);
    };

    /**
     * Remove validation message
     * @param errorCode
     */
    mess.unsetValidation = function (errorCode) {
        var validation = mess.$.find('.validation.' + errorCode);
        if (validation.length) validation.remove();
    };

    /*************************************
     * Input
     *************************************/
    input.$ = $("#input");
    input.valid = false;
    input.data = {
        raw: '',
        number: 0,
        currencyID: 0,
        currencyName: function () {
            if (!input.valid) return;
            return app.currencyData.currencies[input.data.currencyID].name;
        },
        currencyRate: function () {
            if (!input.valid) return;
            return app.currencyData.currencies[input.data.currencyID].rate;
        },
        convertedNumber: function () {
            if (!input.valid) return;
            return this.number * this.currencyRate();
        },
        resultText: function () {
            if (!input.valid) return;
            return this.number + this.currencyName() + " = " + app.formatCurrency(this.convertedNumber().toFixed(2)) + " VNĐ";
        }
    };

    /*************************************
     * App
     *************************************/
    /**
     *  Currency data
     * @type {{status: boolean, method: string, currencies: {}, update_text: string}}
     */
    app.currencyData = {
        status: false,
        method: '',
        update_text: '',
        currencies: {}
    };

    /**
     * Remove space, special characters
     * @param str
     * @returns {*}
     */
    app.textFilter = function (str) {
        // Break if str empty
        if (!str.length) return false;

        // Do filter
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/đ/g, "d");
        str = str.replace(/ /g, "");

        //dev.log("Text filtered: " + str);
        return str;
    };

    /**
     * Get number digit and dot, return false if no digit found
     * @param str
     * @returns {*}
     */
    app.numberFilter = function (str) {
        // Break if str empty
        if (!str.length) return false;

        // Do filter
        var number = "";
        for (var i = 0; i < str.length; i++) {
            // only get number digit, dot
            if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57 || str[i] === "." || str[i] === ",") {
                number += str[i];
            }
        }

        if (number === '') {
            number = false;
        } else {
            number = parseFloat(number);
        }
        dev.log("Number filtered: " + number);
        return number;
    };

    /**
     * Format currency, add commas
     * @param str
     * @returns {string}
     */
    app.formatCurrency = function (str) {
        str = str.toString();
        var x = str.split('.'), x1 = x[0], x2 = x.length > 1 ? '.' + x[1] : '', rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };

    /**
     * Get currency data
     */
    app.getCurrencyData = function () {
        // Break if already have, only get data once
        if (app.currencyData.status) return;

        // Definition
        var local_currency = {
            update_text: "Theo tỉ giá Vietcombank cập nhật lúc 17/10/2018 14:45",
            currencies: [
                {
                    name: " đô la Úc",
                    rate: 16731.79,
                    currencyCode: [
                        "aud",
                        "australiandollar",
                        "dolauc",
                        "tienuc"
                    ],
                    site: []
                },
                {
                    name: " đô la Canada",
                    rate: 18113.10,
                    currencyCode: [
                        "cda",
                        "canadiandollar",
                        "dolacanada",
                        "cad",
                        "tiencanada"
                    ],
                    site: []
                },
                {
                    name: " Swiss France",
                    rate: 23699.50,
                    currencyCode: [
                        "chf",
                        "swiss",
                        "franc",
                        "thuysi"
                    ],
                    site: []
                },
                {
                    name: " Danish Krone",
                    rate: 3673.75,
                    currencyCode: [
                        "dkk",
                        "danish",
                        "krone",
                        "danmach"
                    ],
                    site: []
                },
                {
                    name: " euro",
                    rate: 2710057,
                    currencyCode: [
                        "eur",
                        "€",
                        "euro"
                    ],
                    site: []
                },
                {
                    name: " bảng Anh",
                    rate: 30881.99,
                    currencyCode: [
                        "gbp",
                        "£",
                        "pound",
                        "anh",
                        "bang",
                        "british"
                    ],
                    site: []
                },
                {
                    name: " đô la HK",
                    rate: 3000.27,
                    currencyCode: [
                        "hkd",
                        "$hk",
                        "hk",
                        "hongkongdollar",
                        "dolahongkong",
                        "dolahk",
                        "hongkong"
                    ],
                    site: []
                },
                {
                    name: " rupee Ấn Độ",
                    rate: 329.39,
                    currencyCode: [
                        "inr",
                        "indianrupee",
                        "rupee",
                        "ando"
                    ],
                    site: []
                },
                {
                    name: " yên Nhật",
                    rate: 212.02,
                    currencyCode: [
                        "yen",
                        "jpy",
                        "¥",
                        "￥",
                        "円",
                        "japaneseyen",
                        "nhat"
                    ],
                    site: [
                        "amazon.co.jp",
                        ".jp",
                        "ikea.com/jp/en/"
                    ]
                },
                {
                    name: " won",
                    rate: 21.40,
                    currencyCode: [
                        "won",
                        "krw",
                        "₩",
                        "southkorean",
                        "han"
                    ],
                    site: [
                        ".kr"
                    ]
                },
                {
                    name: " ringgit Malaysia",
                    rate: 5657.74,
                    currencyCode: [
                        "myr",
                        "ringgit",
                        "malai",
                        "malay",
                        "rm"
                    ],
                    site: []
                },
                {
                    name: " kroner Na Uy",
                    rate: 2906.70,
                    currencyCode: [
                        "nok",
                        "kroner",
                        "nauy",
                        "norwegian"
                    ],
                    site: []
                },
                {
                    name: " rub Nga",
                    rate: 397.04,
                    currencyCode: [
                        "rub",
                        "nga"
                    ],
                    site: []
                },
                {
                    name: " krona Thụy Điển",
                    rate: 2649.39,
                    currencyCode: [
                        "sek",
                        "krona",
                        "thuydien",
                        "swedish"
                    ],
                    site: []
                },
                {
                    name: " đô la Sing",
                    rate: 17073.36,
                    currencyCode: [
                        "sgd",
                        "dolasing",
                        "singapo",
                        "sing",
                        "dosing"
                    ],
                    site: []
                },
                {
                    name: " baht Thái",
                    rate: 732.45,
                    currencyCode: [
                        "thb",
                        "฿",
                        "bath",
                        "baht",
                        "thai"
                    ],
                    site: []
                },
                {
                    name: " đô la Mỹ",
                    rate: 23385,
                    currencyCode: [
                        "$",
                        "usd",
                        "usdollar",
                        "dola",
                        "hoaki",
                        "hoaky",
                        "my"
                    ],
                    site: []
                },
                {
                    name: " nghìn",
                    rate: 1000,
                    currencyCode: [
                        "nghin"
                    ],
                    site: []
                },
                {
                    name: " nhân dân tệ",
                    rate: 3470,
                    currencyCode: [
                        "cny",
                        "ndt",
                        "nhandante",
                        "te",
                        "tq",
                        "trung"
                    ],
                    site: [
                        "taobao.com",
                        "1688.com",
                        ".cn",
                        "tmall.com"
                    ]
                }
            ]
        };

        // Fetch currency from Git
        $.ajax({
            url: "https://raw.githubusercontent.com/phucbm/em-oi-doi-tien/master/core/currency-z.txt",
            dataType: 'text',
            success: function (data) {
                data = JSON.parse(data);
                app.currencyData.currencies = data.currencies;
                app.currencyData.update_text = data.update_text;
                app.currencyData.method = 'ajax';
                dev.log("Get currency from Git.");
            },
            error: function () {
                // If ajax fail, use local data
                app.currencyData.currencies = local_currency.currencies;
                app.currencyData.update_text = local_currency.update_text;
                app.currencyData.method = 'local';
                dev.log("Get currency from local variable.");
            }
        });

        app.currencyData.status = true;
        //dev.log(app.currencyData);
    };

    /**
     * Return currency index key if found
     * @param str
     * @returns {*}
     */
    app.findCurrencyID = function (str) {
        str = str.toString();
        var currencies = app.currencyData.currencies,
            hasFound = false,
            currencyCode = '',
            currencyID = 0;

        // Loop each currency
        for (var i = 0; i < currencies.length; i++) {
            // Loop each currency code
            for (var j = 0; j < currencies[i].currencyCode.length; j++) {
                currencyCode = currencies[i].currencyCode[j];
                if (str.indexOf(currencyCode) >= 0) {
                    // Currency code found in string
                    hasFound = true;
                    currencyID = i;
                    break;
                }
            }
            if (hasFound) break;
        }

        if (hasFound) {
            dev.log("Currency code found: " + currencyCode);
            return currencyID;
        }
        return false;
    };

    /**
     * Validate and render input
     * @param valRaw
     * @returns boolean
     */
    app.validateInput = function (valRaw) {
        // Definition
        var valTextFiltered,
            valNumber,
            currencyID;
        dev.log("Input: " + valRaw);

        // Check empty
        if (valRaw.length === 0) {
            mess.clear();
            mess.setValidation('empty-input');
            return false;
        } else {
            mess.unsetValidation('empty-input');
        }

        // Check length
        if (valRaw.length >= input.$.attr("maxlength")) {
            mess.setValidation('too-long-input');
            return false;
        } else {
            mess.unsetValidation('too-long-input');
        }

        // Text filter
        valTextFiltered = app.textFilter(valRaw);

        // Number filter
        valNumber = app.numberFilter(valTextFiltered);
        if (valNumber !== false) {
            mess.unsetValidation('number-not-found');
        } else {
            mess.setValidation('number-not-found');
            return false;
        }

        // Find currency
        currencyID = app.findCurrencyID(valTextFiltered);
        if (currencyID !== false) {
            mess.unsetValidation('currency-code-not-found');
        } else {
            // Currency code not found
            mess.setValidation('currency-code-not-found');
            return false;
        }

        // Gather value
        input.valid = true;
        input.data.raw = valRaw;
        input.data.number = valNumber;
        input.data.currencyID = currencyID;

        return true;
    };

    app.convert = function (val) {
        // Return if fail validation
        if (!app.validateInput(val)) return;

        // Definition
        var resultText = input.data.resultText();

        mess.$.html(resultText);
        dev.log(resultText);
    };

    // Run app
    app.run = function () {
        // Get currencies data
        app.getCurrencyData();

        // On key up
        input.$.on('keyup', function () {
            // Run convert
            app.convert(input.$.val());
        });

        // On user selection
    };
    app.run();

});