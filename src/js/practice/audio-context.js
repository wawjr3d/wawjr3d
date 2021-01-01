(function(global, BandJS, undefined) {
  "use strict";

  var currentMusic;

  document.querySelector(".stop_music").addEventListener("click", function() {
    if (!currentMusic) {
      return;
    }

    stopMusic(currentMusic);
  });

  document.querySelector(".im_different").addEventListener("click", function() {
    currentMusic = playImDifferent();
  });

  function stopMusic(music) {
    music.destroy();
  }

  function playImDifferent() {
    var music = new BandJS();
    music.setTimeSignature(2, 2);
    music.setTempo(120);

    var piano = music.createInstrument();

    playImDifferentMelody(piano)
    .rest("whole");
    playImDifferentMelody(piano);

    piano.finish();

    music.end();

    music.play();

    return music;
  }

  function playImDifferentMelody(piano) {
    piano
      .rest("quarter")
      .note("whole", "C5")
      .note("dottedHalf", "B4")
      .note("dottedQuarter", "E4")
      .note("tripletHalf", "A4")
      .note("tripletHalf", "A4")
      .note("whole", "F4")
      .rest("whole")
      .note("tripletHalf", "E4");

    return piano;
  }

})(this, BandJS);
