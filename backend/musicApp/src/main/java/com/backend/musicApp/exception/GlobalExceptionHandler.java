package com.backend.musicApp.exception;

import com.backend.musicApp.dto.ErrorResourceAlreadyExistsDto;
import com.backend.musicApp.dto.ErrorResponseDto;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> validationErrors = new HashMap<>();
        List<ObjectError> validationErrorList = ex.getBindingResult().getAllErrors();

        validationErrorList.forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String validationMsg = error.getDefaultMessage();
            validationErrors.put(fieldName, validationMsg);
        });
        return new ResponseEntity<>(validationErrors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGlobalException(Exception exception,
                                                                  WebRequest webRequest) {
        ErrorResponseDto errorResponseDTO = new ErrorResponseDto(
                webRequest.getDescription(false),
                HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorResponseDTO);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleResourceNotFoundException(ResourceNotFoundException exception,
                                                                            WebRequest webRequest) {
        ErrorResponseDto errorResponseDTO = new ErrorResponseDto(
                webRequest.getDescription(false),
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponseDTO, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResourceAlreadyExistsDto> handleResourceAlreadyExistsException(ResourceAlreadyExistsException ex,
                                                                                              WebRequest webRequest) {
        ErrorResourceAlreadyExistsDto errorResponseDTO = new ErrorResourceAlreadyExistsDto(
                webRequest.getDescription(false),
                HttpStatus.CONFLICT,
                ex.getMessage(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponseDTO, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(UserNotAuthenticatedException.class)
    public ResponseEntity<ErrorResponseDto> handleUserNotAuthenticatedException(UserNotAuthenticatedException ex,
                                                                                             WebRequest webRequest) {
        ErrorResponseDto errorResponseDTO = new ErrorResponseDto(
                webRequest.getDescription(false),

                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AudioNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleAudioNotFoundException(AudioNotFoundException ex,
                                                                         WebRequest webRequest) {
        ErrorResponseDto errorResponseDTO = new ErrorResponseDto(
                webRequest.getDescription(false),

                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponseDTO, HttpStatus.NOT_FOUND);
    }
}
