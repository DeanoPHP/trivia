$(document).ready(function () {
    const global = {
        page: window.location.pathname,
        score: 0,
        incorrect: 0
    }

    const play_sound = () => {
        $('#sound-btn').on('click', function () {
            clickSound.play()
            
            setTimeout(() => {
                window.location.href = 'game.html'
            }, 7000)     
        })
    }

    const fetch_data = async () => {
        try {
            const response = await fetch('https://the-trivia-api.com/api/questions?limit=1&difficulty=easy')
            const data = await response.json()

            return data
        } catch (error) {
            console.log('Error responce: ' + error)
        }   
    }

    const start_game = async () => {
        $('#score').text(global.score);

        // Reset the buttons to their default state
        $('.choice-btn').each(function() {
            $(this).css({
                background: '#fafafa',
                color: '#333'
            }).prop('disabled', false); // Re-enable buttons
        });

        const questions = await fetch_data()
        console.log(questions)
        $('#question-area').text(questions[0].question)

        const incorrectAnswers = questions[0].incorrectAnswers
        const correctAnswer = questions[0].correctAnswer
        const allAnswers = [...incorrectAnswers, correctAnswer]
        
        // Shuffle allAnsers 
        allAnswers.sort(() => Math.random() - 0.5)
        
        $('.choice-btn').each(function(index) {
            if (index < allAnswers.length) {
                $(this).text(allAnswers[index])
            }
        })

        check_answer(correctAnswer)
    }

    const setting_to_storage = () => {
        // current question, score, incorrectAnswers, top score
    }

    const getFromLocalStorage = () => {

    }

    const check_answer = (correctAnswer) => {
        $('.choice-btn').off('click').on('click', function() {
            // Disable all buttons after one is clicked

            $('.choice-btn').off('click').prop('disabled', true);
    
            if ($(this).text() === correctAnswer) {
                $(this).css({
                    background: 'green',
                    color: '#fafafa'
                });
    
                correctSound.play();

                global.score++
            } else {
                $(this).css({
                    background: 'red',
                    color: '#fafafa'
                });

                // Highlight the correct answer
                setTimeout(() => {
                    $('.choice-btn').each(function(index, ans) {
                        if ($(ans).text() === correctAnswer) {
                            $(ans).css({
                                background: 'green',
                                color: '#fafafa'
                            });
                        }
                    });
                }, 1000);
                
                incorrectSound.play();

                show_incorrect_answer_crosses()                
            }
    
            // Wait for 3 seconds and then start a new game round
            setTimeout(() => {
                start_game();
            }, 3000); 
        });
    }

    const show_incorrect_answer_crosses = () => {
        const crossbox = $('.cross-box');
        
        if (global.incorrect < crossbox.length) {
            $(crossbox[global.incorrect]).css({
                visibility: 'visible'
            });
            // Increment incorrect count
            global.incorrect++;
        } 
    
        if (global.incorrect > 2) {
            console.log('Game Over');

            // global.score = 0;
            // global.incorrect = 0;
    
            // Optionally, reset any visual indicators here
            $('.choice-btn').css({
                background: '#fafafa',
                color: '#333'
            });
    
            setTimeout(() => {
                $('.cross-box').css({
                    visibility: 'hidden'
                })
            }, 2000)

            setTimeout(() => {
                game_over()
            }, 3000)
            
        } 
    }

    const game_over = () => {
        // Get the div that is going to display the message
        $('#game-over').css({
            visibility: 'visible'
        })

        $('#end-game')[0].play()

        // display a message to the user saying well done and display the users score
        $('#user_score').text(global.score)

        // set the score and all setting from above back to start game settings. Maybe put this in a function of its own
        global.score = 0
        global.incorrect = 0;

        // Redirect the user back to index 
        setTimeout(() => {
            window.location.href = '/'
        }, 4000)
    }
    
    const pages_switch = () => {
        switch (global.page) {
            case '/trivia/':
                play_sound()
            break;
            case '/trivia/game.html':
                start_game()
            break;
            default:
                console.log(global.page)
        }
    }

    pages_switch()
})