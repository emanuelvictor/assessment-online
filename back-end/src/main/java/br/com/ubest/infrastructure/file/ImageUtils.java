package br.com.ubest.infrastructure.file;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

import static java.awt.image.BufferedImage.TYPE_INT_RGB;

public class ImageUtils {

    /**
     * @param filePart {}
     * @return {}
     */
    public static Mono<byte[]> getBytes(final FilePart filePart) {

        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        return filePart.content().doOnEach(dataBufferSignal -> {

            if (dataBufferSignal.hasValue()) {

                final DataBuffer dataBuffer = dataBufferSignal.get();
                final int count = Objects.requireNonNull(dataBuffer).readableByteCount();
                final byte[] bytes = new byte[count];
                dataBuffer.read(bytes);

                outputStream.write(bytes, 0, bytes.length);

            }

        }).doOnComplete(() -> System.out.println(outputStream.size())).last().map(dataBuffer ->
                outputStream.toByteArray()
        );

    }

    /**
     * Extrai o buffer image do bytearray
     */
    public static BufferedImage getBufferedImageFromByteArray(final byte[] picture) throws IOException {
        final InputStream in = new ByteArrayInputStream(picture);
        return ImageIO.read(in);
    }


    /**
     * Redimensiona a imagem.
     *
     * @return array de bytes com imagem redimensionada
     */
    public static byte[] resizeImage(final byte[] imageByte, final int width, final int height) throws IOException {
        try (final InputStream inputImage = new ByteArrayInputStream(imageByte)) {
            final BufferedImage image = ImageIO.read(inputImage);
            final BufferedImage imgResized = new BufferedImage(width, height, TYPE_INT_RGB);
            imgResized.getGraphics().drawImage(image, 0, 0, width, height, Color.WHITE, null);
            return imageToByte(imgResized);
        }
    }

    /**
     * Converte BufferedImage para array de bytes no formato JPG.
     */
    private static byte[] imageToByte(final BufferedImage img) throws IOException {
        try (final ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(img, "jpg", baos);
            baos.flush();
            return baos.toByteArray();
        }
    }

}
