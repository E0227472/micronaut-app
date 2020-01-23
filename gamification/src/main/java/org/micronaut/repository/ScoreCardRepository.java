package org.micronaut.repository;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import org.micronaut.domain.ScoreCard;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.List;

/*
Basic Crud Operations for Score Card.
Finding the sum of the scores to get total score in score column.
*/
@Repository
public abstract class ScoreCardRepository implements CrudRepository<ScoreCard, Long> {

    private final EntityManager entityManager;

    private final String query = "SELECT s.userId, SUM(s.score) " +
            "FROM org.micronaut.domain.ScoreCard s " +
            "GROUP BY s.userId ORDER BY SUM(s.score) DESC";

    public ScoreCardRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }


    // get total score of 1 user
    public abstract int findSumScoreByUserId(long userId);

    // get total count of attempts for 1 user
    public abstract int countByUserId(long userId);

    @Transactional
    public List<Object[]> findAllLeaders() {
        return entityManager.createQuery(this.query)
                .getResultList();
    }
}
