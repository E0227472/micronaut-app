package org.micronaut.controller;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.validation.Validated;
import org.micronaut.domain.ScoreCard;
import org.micronaut.service.GameService;

import java.util.List;

@Controller("/scorecard")
@Validated
public class ScoreCardController {

    private GameService gameService;

    public ScoreCardController(GameService gameService) {
        this.gameService = gameService;
    }


    @Get(value = "allcards",produces = MediaType.APPLICATION_JSON)
    public List<ScoreCard> getAllScoreCard(){
        return gameService.getAllScoreCards();
    }

    @Get(value = "/totalscore",produces = MediaType.APPLICATION_JSON)
    public int getTotalScore(){
            return gameService.getTotalScore(1l);
    }


}