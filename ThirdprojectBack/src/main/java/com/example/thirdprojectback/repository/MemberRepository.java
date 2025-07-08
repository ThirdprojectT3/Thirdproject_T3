package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT m.userId FROM Member m WHERE m.age BETWEEN :minAge AND :maxAge")
    List<Long> findUserIdsByAgeRange(@Param("minAge") int minAge, @Param("maxAge") int maxAge);
}
