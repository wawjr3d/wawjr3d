(function(global, $) {
    "use strict";

    var AVAILABLE_MOODS = ["normal", "elated", "happy", "frowny"].join(" "),

        AVAILABLE_SPECIFICS = ["normal", "inquisitive", "lying", "honest", "angry", "constipated"].join(" "),

        ALL_SMILEYS = [AVAILABLE_MOODS, AVAILABLE_SPECIFICS].join(" "),

        DEFAULT_SIZE = "1",

        SIZE_UNITS = "px",

        MAX_SIZE = 32,
        MIN_SIZE = 5,

        // keys i care about
        KEYUP = 38,
        KEYDOWN = 40,

        FIELDS = {
            SIZE: "size",
            MOOD: "mood",
            SPECIFIC: "specific"
        };


    var $form, $smiley, $size, $up, $down;

    String.prototype.escapeHTML = function () {
        return this.replace(/>/g, "&gt;")
                    .replace(/</g, "&lt;")
                    .replace(/"/g, "&quot;");
    };

    function pickSmiley() {
        var size = $size.val() || DEFAULT_SIZE;

        $smiley.css("fontSize", size + SIZE_UNITS);

        $smiley.removeClass(ALL_SMILEYS);
        $smiley.addClass($form.find("select[name=" + FIELDS.MOOD + "]").val());
        $smiley.addClass($form.find("select[name=" + FIELDS.SPECIFIC + "]").val());
    }

    function killSubmit(e) {
        e.preventDefault();
    }

    function capSize(size) { // not functioning pun
        if (isNaN(size)) { return MIN_SIZE; }
        return Math.max(Math.min(size, MAX_SIZE), MIN_SIZE);
    }

    function updateSize(e) {
        var size = parseInt($size.val() || 0, 10);

        switch (e.keyCode) {
        case KEYUP:
            $size.val(capSize(size + 1));
            pickSmiley();
            break;

        case KEYDOWN:
            $size.val(capSize(size - 1));
            pickSmiley();
            break;

        default:
            break;
        }
    }

    function upDownPickSmiley(e) {
        var keycode = e.keyCode;

        if (keycode == KEYUP || keycode == KEYDOWN) {
            pickSmiley();
        }
    }

    var getQueryStringParam = (function() {
        var query_string = (window.location.search.length > 1) ? window.location.search.substring(1) : null;
        var pairs = (query_string != null) ? query_string.split("&") : [];
        var params = {};

        for (var i=0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");

            params[pair[0]] = pair[1] != null ? pair[1] : null;
        }

        return function(name) {
            return params[name] != null ? decodeURIComponent(params[name]) : null;
        };
    })();

    function inititializeSmiley() {
        var size = getQueryStringParam(FIELDS.SIZE),
            mood = getQueryStringParam(FIELDS.MOOD),
            specific = getQueryStringParam(FIELDS.SPECIFIC);

        if (size) {
            $size.val(capSize(parseInt(size || 0, 10)));
        }

        if (mood) {
            $form.find("select[name=" + FIELDS.MOOD + "] option[value=" + mood + "]").prop("selected", true);
        }

        if (specific) {
            $form.find("select[name=" + FIELDS.SPECIFIC + "] option[value=" + specific + "]").prop("selected", true);
        }

        pickSmiley();
    }

    $(function() {
        $form = $("form.pick-a-smiley");
        $size = $form.find("input[name=" + FIELDS.SIZE + "]");
        $up = $form.find(".up");
        $down = $form.find(".down");
        $smiley = $(".smiley");

        $form.submit(killSubmit);

        $size
            .keydown(updateSize)
            .change(pickSmiley);

        $up.click(function() {
            updateSize({ keyCode: KEYUP });
        });

        $down.click(function() {
            updateSize({ keyCode: KEYDOWN });
        });

        $form.find("select[name=" + FIELDS.MOOD + "], select[name=" + FIELDS.SPECIFIC + "]")
            .change(pickSmiley)
            .keyup(upDownPickSmiley);

        inititializeSmiley();
    });

})(this, jQuery);
