package br.com.assessment.infrastructure.util;

import java.util.Arrays;
import java.util.List;

public class ArrayUtil {

    /**
     *
     * @param array
     * @param <T>
     * @return
     */
    public static <T> List<T> getListFromArray(T[] array) {
        if (array.length == 0)
            return null;
        return Arrays.asList(array);
    }
}
