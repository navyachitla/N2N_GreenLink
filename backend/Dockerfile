# Step 1: Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./tools/apache-maven-3.9.6/bin/mvn 2>/dev/null || true
RUN ./tools/apache-maven-3.9.6/bin/mvn package -DskipTests || mvn package -DskipTests

# Step 2: Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/greenlink-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
