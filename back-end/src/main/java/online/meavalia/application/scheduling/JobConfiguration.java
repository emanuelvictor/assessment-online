package online.meavalia.application.scheduling;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.service.FaturaService;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;

import static org.quartz.SimpleScheduleBuilder.simpleSchedule;

@Configuration
public class JobConfiguration {

    /**
     * Pega a data corrente com a data setada para meia noite
     *
     * @return Date
     */
    private static Date getMeiaNoite() {
        final Calendar meiaNoite = Calendar.getInstance();
        meiaNoite.set(meiaNoite.get(Calendar.YEAR),
                meiaNoite.get(Calendar.MONTH),
                meiaNoite.get(Calendar.DAY_OF_MONTH),
                23,
                59,
                59);
        return meiaNoite.getTime();
    }

    /**
     * @return {JobDetail}
     */
    @Bean
    public JobDetail jobDetail() {
        return JobBuilder.newJob()
                .ofType(LocalJob.class).storeDurably()
                .withIdentity(LocalJob.class.getName()).build();
    }

    /**
     * @param job {JobDetail}
     * @return {Trigger}
     */
    @Bean
    public Trigger trigger(final JobDetail job) {
        return TriggerBuilder.newTrigger()
//                .startNow()
//                // Inicia a meia noite
                .startAt(DateBuilder.evenHourDate(getMeiaNoite()))
                .forJob(job)
                .withIdentity(LocalJob.class.getName())
                .withSchedule(simpleSchedule()
//                        .repeatForever().withIntervalInSeconds(300))
                        .repeatForever().withIntervalInHours(24))
                .build();
    }

    /**
     *
     */
    @Component
    @RequiredArgsConstructor
    public static class LocalJob implements Job {

        /**
         *
         */
        private final FaturaService faturaService;

        /**
         * @param context JobExecutionContext
         */
        public void execute(final JobExecutionContext context) {
            final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            final LocalDateTime dateTime = LocalDateTime.parse("2020-03-01 00:00", formatter);
            if (LocalDateTime.now().isAfter(dateTime))
                faturaService.verificarFaturas();
        }
    }

}
