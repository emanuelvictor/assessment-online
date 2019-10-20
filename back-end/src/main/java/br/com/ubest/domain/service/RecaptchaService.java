package br.com.ubest.domain.service;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;


@Service
@RequiredArgsConstructor
public class RecaptchaService {

    @Value("${google.recaptcha.site-key}")
    private String siteKey;

    @Value("${google.recaptcha.secret-key}")
    private String secretKey;

    @Value("${google.recaptcha.urltoverify}")
    private String urlToVerify;

    /**
     * @param recap String
     * @return boolean
     */
    public boolean checkRecaptcha(final String recap) {

        try {

            if (recap == null)
                return false;

            final String urlGoogle = this.urlToVerify + "?secret=%s&response=%s";
            final String urlFormatada = String.format(urlGoogle, this.secretKey, recap);
            final HttpURLConnection conn = (HttpURLConnection) new URL(urlFormatada).openConnection();
            conn.setRequestMethod("GET");
            final BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            final StringBuilder outputString = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                outputString.append(line);
            }

            final RecaptchaService.CaptchaResponse capRes = new Gson().fromJson(outputString.toString(), RecaptchaService.CaptchaResponse.class);
            return capRes.isSuccess();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Classe auxiliar para o retorno do reCaptcha
     */
    private class CaptchaResponse {
        private boolean success;
//        private String[] errorCodes;

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

//        public String[] getErrorCodes() {
//            return errorCodes;
//        }
//
//        public void setErrorCodes(String[] errorCodes) {
//            this.errorCodes = errorCodes;
//        }
    }

    /**
     * @return String
     */
    public String getSiteKey() {
        return this.siteKey;
    }
}
