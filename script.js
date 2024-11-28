var $board = $('main'),
    $card = $('.card'),
    $itemCount = $('.score span'),
    $wins = $('.wins span'),
    $turns = $('.turns span'),
    $attempts = $('.attempts span'),
    $attemptsOverall = $('.attempts-overall span'),
    $success = $('.success'),
    $successMsg = $('.success-message'),
    $successIcon = $('.success-icon'),
    $btnContinue = $('.btn-continue'),
    $btnSound = $('.btn-sound'),
    selectedClass = 'is-selected',
    visibleClass = 'is-visible',
    playSoundClass = 'is-playing',
    scoreUpdateClass = 'is-updating',
    lastTurnClass = 'last-turn',
    dataMatch = 'data-matched',
    dataType = 'data-type',
    turnsCount = 2,
    winsCount = 0,
    attemptsCount = 0,
    attemptsOverallCount = 0,
    tooManyAttempts = 8,
    timeoutLength = 600,
    card1, card2, msg;


// sonidos del juego
var assetsUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/',
    sound = [
      'smb3_1-up.mp3',
      'smb3_nspade_match.mp3',
      'smb3_bonus_game_no_match.mp3'
    ],
    $themeSongEl = $('#theme-song')[0],
    soundSuccess = new Audio(assetsUrl + sound[0]),
    soundMatch = new Audio(assetsUrl + sound[1]),
    soundNoMatch = new Audio(assetsUrl + sound[2]);


// Activa el sonido si quieres vivir una experiencia retrospectiva real
$btnSound.on('click', function(e) {
  e.preventDefault();
  $(this).toggleClass(playSoundClass);
  if ($(this).hasClass(playSoundClass)) {
    $themeSongEl.play();
  } else {
    $themeSongEl.pause();
  }
});


// baraja el mazo
shuffleCards();

$card.on('click', function() {

// Agrega la clase seleccionada a una tarjeta solo si aún no coincide
  if ($(this).attr(dataMatch) == 'false') {
    $(this).addClass(selectedClass);
  }

  var selectedCards = $('.' + selectedClass);


//Comprueba si las cartas coinciden
  if (selectedCards.length == 2) {
    card1 = selectedCards.eq(0).attr(dataType);
    card2 = selectedCards.eq(1).attr(dataType);

    if (card1 == card2) {
      if ($btnSound.hasClass(playSoundClass)) {
        soundMatch.play(); 
      }
      selectedCards
        .attr(dataMatch, true)
        .removeClass(selectedClass)

    } else {
      if ($btnSound.hasClass(playSoundClass)) {
        soundNoMatch.play(); 
      }
      setTimeout(function() {
        turnsCount--;
        $turns
          .addClass(scoreUpdateClass)
          .html(turnsCount);
        selectedCards.removeClass(selectedClass);
      }, timeoutLength);

      if(turnsCount === 1) {
        setTimeout(function() {
          $turns.addClass(lastTurnClass);
        }, timeoutLength);
      }

      if(turnsCount <= 0) {
        setTimeout(function() {
          turnsCount = 2;
          $turns
            .removeClass(lastTurnClass)
            .html(turnsCount);
          $card.attr(dataMatch, false);
          attemptsCount += 1;
          $attempts
            .addClass(scoreUpdateClass)
            .html(attemptsCount);
        }, timeoutLength);
      }

    }
  }

  // Ganador
  if ($('[' + dataMatch + '="true"]').length == $card.length) {

// Mostrar pantalla de ganador
    $success.addClass(visibleClass);
    if (attemptsCount <= tooManyAttempts) {
      setTimeout(function() {
        if ($btnSound.hasClass(playSoundClass)) {
          soundSuccess.play(); 
        }
      }, 600);
    }
// Actualiza el mensaje de ganador según la cantidad de intentos
    switch(true) {
      case (attemptsCount <= 2):
        msg = "SUPER!!!";
        $successIcon.attr(dataType, "star");
        break;
      case (attemptsCount > 2 && attemptsCount <= 5):
        msg = "¡Buen trabajo!";
        $successIcon.attr(dataType, "mushroom");
        break;
      case (attemptsCount > 5 && attemptsCount <= 8):
        msg = "¡Puedes hacerlo mejor!";
        $successIcon.attr(dataType, "flower");
        break;
      case (attemptsCount > tooManyAttempts):
        msg = 
        "Eso tomó un tiempo...";
        $successIcon.attr(dataType, "chest");
        break;
    }
    $successMsg.text(msg);

    setTimeout(function() {
      attemptsOverallCount += attemptsCount;
      $attemptsOverall
        .addClass(scoreUpdateClass)
        .html(attemptsOverallCount);
      winsCount += 1;
      $wins
        .addClass(scoreUpdateClass)
        .html(winsCount);
      $card.attr(dataMatch, false);
    }, 1200);
  }

});


// Elimina la clase de actualización de puntuación una vez completada la animación.
$itemCount.on(
  "webkitAnimationEnd oanimationend msAnimationEnd animationend",
  function() {
    $itemCount.removeClass(scoreUpdateClass);
  }
);

// ¡A la siguiente ronda!
$btnContinue.on('click', function() {
  $success.removeClass(visibleClass);
  shuffleCards();
  setTimeout(function() {
    turnsCount = 2;
    $turns
      .removeClass(lastTurnClass)
      .html(turnsCount);
    attemptsCount = 0;
    $attempts.html(attemptsCount);
  }, 300);
});


// Función de barajar cartas
function shuffleCards() {
  var cards = $board.children();
  while (cards.length) {
    $board.append(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
  }
}