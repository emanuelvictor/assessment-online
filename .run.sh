cd front-end
npm install && npm run build
cd ../back-end
mvn spring-boot:run -Drun.jvmArguments="-Xmx2048m -Xms2048m --add-modules java.se --add-exports java.base/jdk.internal.ref=ALL-UNNAMED --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.nio=ALL-UNNAMED --add-opens java.base/sun.nio.ch=ALL-UNNAMED --add-opens java.management/sun.management=ALL-UNNAMED --add-opens jdk.management/com.sun.management.internal=ALL-UNNAMED"  -Dspring-boot.run.profiles=RELEASE &
