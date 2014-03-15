(function(global, $, BandJS, undefined) {
    "use strict";

    var currentMusic;

    $(".stop_music").on("click", function() {
        if (!currentMusic) {
            return;
        }

        stopMusic(currentMusic);
    });

    $(".im_different").on("click", function() {
        currentMusic = playImDifferent();
    });

    function stopMusic(music) {
        music.destroy();
    }

    function playImDifferent() {
        var music = new BandJS();
        music.setTimeSignature(4, 4);
        music.setTempo(120);

        var piano = music.createInstrument();

        piano
            .note("quarter", "C4")
            .rest("half")
            .note("quarter", "B4")
            .rest("half")
            .note("eighth", "F4")
            .note("eighth", "A4")
            .note("eighth", "A4")
            .note("half", "G4")
            .note("quarter", "F4");

        piano.finish();

        music.end();

        music.play();

        return music;
    }

})(this, jQuery, BandJS);
