package online.meavalia.application.aspect.handler;

/*
 * Copyright 2002-2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.ConversionNotSupportedException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.lang.Nullable;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.util.WebUtils;

import java.util.List;
import java.util.Set;

public abstract class ResponseEntityExceptionHandler {

    /**
     * Log category to use when no mapped handler is found for a request.
     *
     * @see #pageNotFoundLogger
     */
    public static final String PAGE_NOT_FOUND_LOG_CATEGORY = "org.springframework.web.servlet.PageNotFound";

    /**
     * Specific logger to use when no mapped handler is found for a request.
     *
     * @see #PAGE_NOT_FOUND_LOG_CATEGORY
     */
    protected static final Log pageNotFoundLogger = LogFactory.getLog(PAGE_NOT_FOUND_LOG_CATEGORY);

    /**
     * Common logger for use in subclasses.
     */
    protected final Log logger = LogFactory.getLog(getClass());


    /**
     * Provides handling for standard Spring MVC exceptions.
     *
     * @param ex      the target exception
     * @param request the current request
     */
    @ExceptionHandler({
            HttpRequestMethodNotSupportedException.class,
            HttpMediaTypeNotSupportedException.class,
            HttpMediaTypeNotAcceptableException.class,
            MissingPathVariableException.class,
            MissingServletRequestParameterException.class,
            ServletRequestBindingException.class,
            ConversionNotSupportedException.class,
            TypeMismatchException.class,
            HttpMessageNotReadableException.class,
            HttpMessageNotWritableException.class,
            MethodArgumentNotValidException.class,
            MissingServletRequestPartException.class,
            BindException.class,
            NoHandlerFoundException.class,
            AsyncRequestTimeoutException.class
    })
    @Nullable
    public final ResponseEntity<Object> handleException(Exception ex, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        if (ex instanceof HttpRequestMethodNotSupportedException) {
            HttpStatus status = HttpStatus.METHOD_NOT_ALLOWED;
            return handleHttpRequestMethodNotSupported((HttpRequestMethodNotSupportedException) ex, headers, status);
        } else if (ex instanceof HttpMediaTypeNotSupportedException) {
            HttpStatus status = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
            return handleHttpMediaTypeNotSupported((HttpMediaTypeNotSupportedException) ex, headers, status);
        } else if (ex instanceof HttpMediaTypeNotAcceptableException) {
            HttpStatus status = HttpStatus.NOT_ACCEPTABLE;
            return handleHttpMediaTypeNotAcceptable((HttpMediaTypeNotAcceptableException) ex, headers, status);
        } else if (ex instanceof MissingPathVariableException) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            return handleMissingPathVariable((MissingPathVariableException) ex, headers, status);
        } else if (ex instanceof MissingServletRequestParameterException) {
            HttpStatus status = HttpStatus.BAD_REQUEST;
            return handleMissingServletRequestParameter((MissingServletRequestParameterException) ex, headers, status);
        } else if (ex instanceof ServletRequestBindingException) {
            HttpStatus status = HttpStatus.BAD_REQUEST;
            return handleServletRequestBindingException((ServletRequestBindingException) ex, headers, status);
        } else if (ex instanceof ConversionNotSupportedException) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            return handleConversionNotSupported((ConversionNotSupportedException) ex, headers, status);
        } else if (ex instanceof TypeMismatchException) {
            HttpStatus status = HttpStatus.BAD_REQUEST;
            return handleTypeMismatch((TypeMismatchException) ex, headers, status);
        } else if (ex instanceof HttpMessageNotReadableException) {
            HttpStatus status = HttpStatus.BAD_REQUEST;
            return handleHttpMessageNotReadable((HttpMessageNotReadableException) ex, headers, status);
        } else if (ex instanceof HttpMessageNotWritableException) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            return handleHttpMessageNotWritable((HttpMessageNotWritableException) ex, headers, status);
        } else if (ex instanceof MethodArgumentNotValidException) {
            HttpStatus status = HttpStatus.BAD_REQUEST;
            return handleMethodArgumentNotValid((MethodArgumentNotValidException) ex, headers, status);
        } else if (ex instanceof MissingServletRequestPartException) {
            HttpStatus status = HttpStatus.BAD_REQUEST;
            return handleMissingServletRequestPart((MissingServletRequestPartException) ex, headers, status);
        } else if (ex instanceof BindException) {
            HttpStatus status = HttpStatus.BAD_REQUEST;
            return handleBindException((BindException) ex, headers, status);
        } else if (ex instanceof NoHandlerFoundException) {
            HttpStatus status = HttpStatus.NOT_FOUND;
            return handleNoHandlerFoundException((NoHandlerFoundException) ex, headers, status);
        } else if (ex instanceof AsyncRequestTimeoutException) {
            HttpStatus status = HttpStatus.SERVICE_UNAVAILABLE;
            return handleAsyncRequestTimeoutException(
                    (AsyncRequestTimeoutException) ex, headers, status);
        } else {
            if (logger.isWarnEnabled()) {
                logger.warn("Unknown exception type: " + ex.getClass().getName());
            }
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            return handleExceptionInternal(ex, null, headers, status);
        }
    }

    /**
     * A single place to customize the response body of all Exception types.
     * <p>The default implementation sets the {@link WebUtils#ERROR_EXCEPTION_ATTRIBUTE}
     * request attribute and creates a {@link ResponseEntity} from the given
     * body, headers, and status.
     *
     * @param ex      the exception
     * @param body    the body for the response
     * @param headers the headers for the response
     * @param status  the response status
     */
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, @Nullable Object body,
                                                             HttpHeaders headers, HttpStatus status) {

        return new ResponseEntity<>(body, headers, status);
    }

    /**
     * Customize the response for HttpRequestMethodNotSupportedException.
     * <p>This method logs a warning, sets the "Allow" header, and delegates to
     * {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                                         HttpHeaders headers, HttpStatus status) {

        pageNotFoundLogger.warn(ex.getMessage());

        Set<HttpMethod> supportedMethods = ex.getSupportedHttpMethods();
        if (!CollectionUtils.isEmpty(supportedMethods)) {
            headers.setAllow(supportedMethods);
        }
        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for HttpMediaTypeNotSupportedException.
     * <p>This method sets the "Accept" header and delegates to
     * {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
                                                                     HttpHeaders headers, HttpStatus status) {

        List<MediaType> mediaTypes = ex.getSupportedMediaTypes();
        if (!CollectionUtils.isEmpty(mediaTypes)) {
            headers.setAccept(mediaTypes);
        }

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for HttpMediaTypeNotAcceptableException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(HttpMediaTypeNotAcceptableException ex,
                                                                      HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for MissingPathVariableException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     * @since 4.2
     */
    protected ResponseEntity<Object> handleMissingPathVariable(MissingPathVariableException ex,
                                                               HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for MissingServletRequestParameterException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex,
                                                                          HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for ServletRequestBindingException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleServletRequestBindingException(ServletRequestBindingException ex,
                                                                          HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for ConversionNotSupportedException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleConversionNotSupported(ConversionNotSupportedException ex,
                                                                  HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for TypeMismatchException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleTypeMismatch(TypeMismatchException ex, HttpHeaders headers,
                                                        HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for HttpMessageNotReadableException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
                                                                  HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for HttpMessageNotWritableException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex,
                                                                  HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for MethodArgumentNotValidException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for MissingServletRequestPartException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleMissingServletRequestPart(MissingServletRequestPartException ex,
                                                                     HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for BindException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     */
    protected ResponseEntity<Object> handleBindException(BindException ex, HttpHeaders headers,
                                                         HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for NoHandlerFoundException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     * @since 4.0
     */
    protected ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status) {

        return handleExceptionInternal(ex, null, headers, status);
    }

    /**
     * Customize the response for NoHandlerFoundException.
     * <p>This method delegates to {@link #handleExceptionInternal}.
     *
     * @param ex      the exception
     * @param headers the headers to be written to the response
     * @param status  the selected response status
     * @return a {@code ResponseEntity} instance
     * @since 4.2.8
     */
    @Nullable
    protected ResponseEntity<Object> handleAsyncRequestTimeoutException(
            AsyncRequestTimeoutException ex, HttpHeaders headers, HttpStatus status) {

//        if (webRequest instanceof ServletWebRequest) {
//            ServletWebRequest servletWebRequest = (ServletWebRequest) webRequest;
//            HttpServletRequest request = servletWebRequest.getRequest();
//            HttpServletResponse response = servletWebRequest.getResponse();
//            if (response != null && response.isCommitted()) {
//                if (logger.isDebugEnabled()) {
//                    logger.debug("Async timeout for " + request.getMethod() + " [" + request.getRequestURI() + "]");
//                }
//                return null;
//            }
//        }

        return handleExceptionInternal(ex, null, headers, status);
    }

}