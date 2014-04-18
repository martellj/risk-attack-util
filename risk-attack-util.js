/*
*
* risk-attack-util.js
* Version: v.01
* Authour: John Martell
* Description:  This is a simple utility I wrote to perform attacks
*               for the board game Risk.
*
*/

(function () {
    var _ = require("underscore"),

        prompt = require("prompt"),

        score = [],

        roll = function () {
            return Math.floor((Math.random() * 6) + 1);
        },

        boardRules = {
            applyFortifiedBoardRule: function (dice) {
                _.each(dice, function (a) {
                    a++;
                });
                return dice;
            },
            applyAddOneToBottomDi: function (dice) {
                dice[dice.length - 1]++;
                return dice;
            },
            applyMakeBottomDiSix: function (dice) {
                dice[dice.length - 1] = 6;
                return dice;
            }
        },

        attackOnce = function (options) {

            var offenseDice = (function (off) {
                var val;
                if (off > 3) {
                    val = [roll(), roll(), roll()];
                } else if (off === 3) {
                    val = [roll(), roll()];
                } else if (off === 2) {
                    val = [roll()];
                } else {
                    val = [];
                }
                return val.sort().reverse();
            })(options.offense),

                defenseDice = (function (off) {
                    var val;
                    if (off > 1) {
                        val = [roll(), roll()];
                    } else if (off === 1) {
                        val = [roll()];
                    } else {
                        val = [];
                    }
                    return val.sort().reverse();
                })(options.defense);

            //Determine wins and losses
            (function () {
                var defLost = 0,
                    offLost = 0;

                console.log("Offense Dice: " + offenseDice);
                console.log("Defense Dice: " + defenseDice);

                _.each(defenseDice, function (val, idx) {
                    if (val >= offenseDice[idx]) {
                        offLost++;
                    } else {
                        defLost++;
                    }
                });

                console.log("Offense Lost: " + offLost);
                console.log("Defense Lost: " + defLost);

                options.offense = options.offense - offLost;
                options.defense = options.defense - defLost;
            })();
            return [options.offense, options.defense]
        },

        attackAgain = function () {

            prompt.get([{
                    name: "attack",
                    description: "Do you want to attack again (y/n)?"
                }],
                function (err, result) {
                    if (result.attack === "y") {
                        var attackResults = attackOnce({
                            offense: score[0],
                            defense: score[1]
                        });

                        score = attackResults;

                        console.log("The current score is: " + score);

                        if (score[1] <= 0) {
                            console.log("The defense has no guys left:(")
                        } else if (score[0] <= 1) {
                            console.log("You only got one guy left, so you can't attack:(");
                        } else {
                            attackAgain();
                        }
                    } else if (result.attack === "n") {


                    } else {
                        console.log("You must enter (y/n).");

                        attackAgain();
                    }
                });
        };

    (function () {
        var offense = 0,
            defense = 0,
            attackResults = null;

        prompt.message = "risk-attack-util";

        prompt.delimeter = ">";

        prompt.get([{
                name: "offense",
                description: "Enter Offense"
            }, {
                name: "defense",
                description: "Enter Defense"
            }],
            function (err, result) {

                offense = result.offense;
                defense = result.defense;

                attackResults = attackOnce({
                    offense: offense,
                    defense: defense
                });

                score = attackResults;

                console.log("The current score is: " + score);

                attackAgain();
            });
    })();
})();
