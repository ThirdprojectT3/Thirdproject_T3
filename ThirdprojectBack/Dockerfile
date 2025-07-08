FROM openjdk:17
VOLUME /tmp
COPY target/Thridprojectback.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar", "--spring.profiles.active=prod"]