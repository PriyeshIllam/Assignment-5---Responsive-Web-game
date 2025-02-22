$(document).ready(function() {
    
    function animateCars() {
        let cars = $('.car');
        cars.each(function(index) {
            let car = $(this);
            let startPosition = -150;
            let endPosition = $('.game-container').width();
            let speed = 5000;
            let delay = index * 2000; // Smaller delay to reduce gaps
            
            function moveCar() {
                car.css({ left: startPosition });
                car.delay(delay).animate({ left: endPosition }, speed, 'linear', function() {
                    moveCar();
                });
            }
            moveCar();
        });
    }
    animateCars();


    let container = $(".alphabet-container");

    for (let i = 65; i <= 90; i++) {  // ASCII values of A-Z
      let button = $("<button>", {
        class: "alphabet-btn",
        text: String.fromCharCode(i)
      });
      container.append(button);
    }

    const carNames = ["MERCEDES", "TESLA", "FERRARI", "AUDI", "BMW", "TOYOTA", "HONDA", "KIA", "NISSAN", "FORD"];
        const hints = {
            "toyota": "Japanese brand known for reliability",
            "honda": "Popular for motorcycles and cars",
            "audi": "German luxury brand with four rings",
            "bmw": "Luxury cars with sporty performance",
            "mercedes": "High-end German automobile manufacturer",
            "tesla": "Electric car pioneer led by Elon Musk",
            "ford": "American brand famous for the Mustang",
            "volvo": "Swedish brand known for safety",
            "porsche": "Luxury sports cars from Germany",
            "ferrari": "Italian supercar brand with a prancing horse",
            "kia": "This car brand's name sounds like a Korean word for 'to rise.'",
            "nissan": "This car brand is known for its reliable 'innovation that excites.'"
        };

    session = false
    player1_wins = 0
    player2_wins = 0

    let wordToGuess = "";
    let guessedLetters = [];
    let guessesLeft = 6;
    let wordDisplay = "";
    let currentPlayer = 1; // Player 1 starts
    let player1GuessesLeft = guessesLeft;
    let player2GuessesLeft = guessesLeft;
    let isTwoPlayerMode = false;
    let player1Wins = false;
    let player2Wins = false;

    function startGame() {
        wordToGuess = carNames[Math.floor(Math.random() * carNames.length)];
        hint = hints[wordToGuess.toLowerCase()]       
        guessedLetters = [];
        player1GuessesLeft = guessesLeft;
        player2GuessesLeft = guessesLeft;
        wordDisplay = "_".repeat(wordToGuess.length);
        $(".word-display").text(wordDisplay);
        $(".word-hint").text(hint);
        $(".guesses-left").text(player1GuessesLeft);
        if(isTwoPlayerMode){
            $(".message").text("Player 1's turn!");
        }
        else{
            $(".message").text("Single player mode selected!");
        }
        $(".winner-display").text("Guess the car: \u{1F609}");  // Clear previous winner
        $(".game-container").show();
        //$(".continue-game").hide();
        $(".alphabet-btn").prop("disabled", false).removeClass('correct incorrect active');
        $(".alphabet-btn").addClass('active');       
    }

    function updateDisplay() {
        //wordDisplay = wordToGuess.split("").map(letter => guessedLetters.includes(letter) ? letter : "_").join("");
        wordDisplay = "";
        let i = 0;
        while (i < wordToGuess.length) {
        let letter = wordToGuess[i];
        wordDisplay += guessedLetters.includes(letter) ? letter : "_";
        i++;
        }

        $(".word-display").text(wordDisplay);
        if (currentPlayer === 1) {
            $(".guesses-left").text(player1GuessesLeft);
        } else {
            $(".guesses-left").text(player2GuessesLeft);
        }        
    }

    function handleGuess(letter) {
        if (guessedLetters.includes(letter)) return; // Ignore already guessed letters
    
        guessedLetters.push(letter);
        let correctGuess = wordToGuess.includes(letter);
    
        $(".alphabet-btn").filter(function() {
            return $(this).text() === letter;
        }).prop("disabled", true).removeClass('active');        
        if (correctGuess) {
            $(".alphabet-btn").filter(function() {
                return $(this).text() === letter;
            }).addClass('correct');
        } else {
            if (currentPlayer === 1) {
                player1GuessesLeft--;
            } else {
                player2GuessesLeft--;
            }
            $(".alphabet-btn").filter(function() {
                return $(this).text() === letter;
            }).addClass('incorrect');
        }
    
        updateDisplay();        
    
        // **Check if the game is over BEFORE switching players**
        if (checkGameOver()) {
            return;
        }
    
        // **Switch player ONLY if the guess was incorrect**
        if (isTwoPlayerMode && !correctGuess) {           
            //setTimeout(switchPlayer, 700); // Small delay for clarity
            //switchPlayer()
        }
        return correctGuess
    }
    
    function checkGameOver() {        
        if (!wordDisplay.includes("_")) {
            if(currentPlayer == 1){
                ++player1_wins
            }
            else{
                ++player2_wins 
            }
            if(!isTwoPlayerMode){
                $(".session").text(`Player 1 won the game ${player1_wins} times!`);
            }
            else{
                $(".session").text(`Player 1 won the game ${player1_wins} times! Player 2 won the game ${player2_wins} times!`);
            }
            $(".message").text(`Congratulations! Player ${currentPlayer} wins!`);            
            $(".winner-display").text("The word was:"+ wordToGuess);
            $(".alphabet-btn").prop("disabled", true);
            
            //$(".continue-game").show();
            return true;
        }
    
        if (isTwoPlayerMode) {
            if (player1GuessesLeft <= 0) {
                ++player2_wins
                $(".message").text(`Game Over! Player 1 has no attempts left. Player 2 wins!`);
                $(".winner-display").text("The word was:"+ wordToGuess);
                $(".alphabet-btn").prop("disabled", true);
                $(".session").text(`Player 1 won the game ${player1_wins} times! Player 2 won the game ${player2_wins} times!`);
                //$(".continue-game").show();
                return true;
            }
            if (player2GuessesLeft <= 0) {
                ++player1_wins
                $(".message").text(`Game Over! Player 2 has no attempts left. Player 1 wins!`);
                $(".winner-display").text("The word was:"+ wordToGuess);
                $(".alphabet-btn").prop("disabled", true);
                $(".session").text(`Player 1 won the game ${player1_wins} times! Player 2 won the game ${player2_wins} times!`);
                //$(".continue-game").show();
                return true;
            }
            
        } else {
            if (player1GuessesLeft <= 0) {
                $(".message").text(`Game Over! You lost.`);
                $(".winner-display").text("The word was:"+ wordToGuess);
                $(".alphabet-btn").prop("disabled", true);
               // $(".continue-game").show();
                return true;
            }
        }
        return false;
    }
    
    

    function switchPlayer() {
        if (player1GuessesLeft <= 0 || player2GuessesLeft <= 0) {
            return; // Stop switching if game is over
        }
    
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        $(".message").text(`Player ${currentPlayer}'s turn!`);
    
        // **Ensure the correct remaining attempts are displayed**
        $(".guesses-left").text(currentPlayer === 1 ? player1GuessesLeft : player2GuessesLeft);
    }

    $(".mode-selection").show();
    // Mode selection
    $(".single-player").click(function() {
        isTwoPlayerMode = false;
        player1_wins = 0
        player2_wins = 0
        $(".session").text(`Player 1 won the game 0 times!`);
        startGame();
        $(".mode-selection").hide();
        
    });

    $(".two-player").click(function() {
        isTwoPlayerMode = true;
        currentPlayer = 1;
        player1_wins = 0
        player2_wins = 0
        startGame();
        $(".mode-selection").hide();
        $(".message").text("Player 1's turn!");
        $(".session").text(`Player 1 won the game 0 times! Player 2 won the game 0 times!`);
    });

    // Handle letter guess
    $(".alphabet-btn").click(function() {
        let letter = $(this).text();
        correctGuess = handleGuess(letter);
        $(this).removeClass('active'); // Remove active class once clicked        

        // If in two-player mode, switch players after each guess      
        if (isTwoPlayerMode && !correctGuess && correctGuess!= undefined) {
            switchPlayer();
        }
    });

    // Next game
    $(".continue-game").click(function() {
        startGame();
        //$(this).hide();
    });

    // Mode selection
    $(".change-player-selection").click(function() {
        isTwoPlayerMode = false;
        $(".mode-selection").show();
        $(".game-container").hide();
    });

    
    // Next game
    $(".restart-session").click(function() {
        player1_wins = 0
        player2_wins = 0
        if(!isTwoPlayerMode){
            $(".session").text(`Player 1 won the game ${player1_wins} times!`);            
        }
        else{
            $(".session").text(`Player 1 won the game ${player1_wins} times! Player 2 won the game ${player2_wins} times!`);
        }
        startGame();
        //$(this).hide();
    });
    
});
