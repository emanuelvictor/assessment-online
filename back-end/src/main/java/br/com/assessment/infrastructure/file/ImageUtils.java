package br.com.assessment.infrastructure.file;

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

public class ImageUtils {

    public static byte[] scale(byte[] fileData, int width, int height) {
        ByteArrayInputStream in = new ByteArrayInputStream(fileData);
        try {
            BufferedImage img = ImageIO.read(in);
            if (height == 0) {
                height = (width * img.getHeight()) / img.getWidth();
            }
            if (width == 0) {
                width = (height * img.getWidth()) / img.getHeight();
            }
            Image scaledImage = img.getScaledInstance(width, height, Image.SCALE_SMOOTH);
            BufferedImage imageBuff = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            imageBuff.getGraphics().drawImage(scaledImage, 0, 0, new Color(0, 0, 0), null);

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();

            ImageIO.write(imageBuff, "png", buffer);

            return buffer.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("IOException in scale");
        }
    }

    /**
     * @param filePart
     * @return
     */
    public static Mono<byte[]> getBytes(final FilePart filePart) {

        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        return filePart.content().doOnEach(dataBufferSignal -> {

            if (dataBufferSignal.hasValue()) {

                final DataBuffer dataBuffer = dataBufferSignal.get();
                final int count = dataBuffer.readableByteCount();
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
     * @param picture
     * @return
     * @throws IOException
     */
    public static BufferedImage getBufferedImageFromByteArray(final byte[] picture) throws IOException {

        final InputStream in = new ByteArrayInputStream(picture);

        return ImageIO.read(in);
    }
}
