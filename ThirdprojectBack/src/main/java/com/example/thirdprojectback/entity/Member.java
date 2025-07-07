package com.example.thirdprojectback.entity;

import com.example.thirdprojectback.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    private int height;

    private int age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Goal goal;

    // 중첩 enum 정의
    public static enum Goal {
        체중감량("체중 감량"),
        근육증가("근력 향상");

        private final String description;

        Goal(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // ✅ gender 필드 추가
    private Gender gender;

    // ✅ static 중첩 enum 정의
    public static enum Gender {
        MALE("남성"),
        FEMALE("여성"),
        OTHER("기타");

        private final String description;

        Gender(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    @Convert(converter = StringListConverter.class)
    @Column(name = "diseases")
    private List<String> diseases;

}
