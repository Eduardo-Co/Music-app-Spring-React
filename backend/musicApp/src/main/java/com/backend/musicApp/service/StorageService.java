package com.backend.musicApp.service;


import com.backend.musicApp.Utils.ImageUtils;
import com.backend.musicApp.entity.FileData;
import com.backend.musicApp.entity.ImageData;
import com.backend.musicApp.exception.StorageException;
import com.backend.musicApp.exception.StorageFileNotFoundException;
import com.backend.musicApp.repository.FileDataRepository;
import com.backend.musicApp.repository.StorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Optional;
import java.nio.file.Path;

@Service
public class StorageService {

    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private FileDataRepository storageFileRepository;
    private final String FOLDER_PATH = "C:\\Users\\eduardo.cardozo\\Documents\\Codes\\Projetos Pessoais\\Java" +
            "\\music-app\\backend\\musicApp\\src\\main\\resources\\Images\\Artists\\";

    public String uploadImage(MultipartFile file) throws IOException {

        ImageData imageData = storageRepository.save(ImageData.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .imageData(ImageUtils.compressImage(file.getBytes())).build());

        if(imageData != null){
            return "file uploaded successfully : " + imageData.getName();
        }

        return null;
    }

    public byte[] downloadImage(String imageName) throws IOException {
        Optional<ImageData> imageData = storageRepository.findByName(imageName);
        return imageData.map(data -> ImageUtils.decompressImage(data.getImageData())).orElse(null);
    }

    public Optional<FileData> uploadImageToFileSystem(MultipartFile file) throws IOException {

        String filePath = FOLDER_PATH + file.getOriginalFilename();
        FileData fileData = storageFileRepository.save(FileData.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .filePath(filePath).build()
        );

        file.transferTo(new File(filePath));

        return Optional.of(fileData);
    }

    public ResponseEntity<byte[]> downloadImageFromFileSystem(Long id) throws IOException {
        Optional<FileData> fileData = storageFileRepository.findById(id);
        if (fileData.isPresent()) {
            String filePath = fileData.get().getFilePath();
            byte[] imageBytes = Files.readAllBytes(new File(filePath).toPath());

            String fileName = fileData.get().getName();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(imageBytes);
        }
        return ResponseEntity.notFound().build();
    }
    public void deleteImageFromFileSystem(String photoUrl) throws IOException {
        String fileName = photoUrl.substring(photoUrl.lastIndexOf('/') + 1);
        String filePath = FOLDER_PATH + fileName;

        Path imagePath = new File(filePath).toPath();
        if (!Files.exists(imagePath)) {
            throw new StorageFileNotFoundException("Arquivo não encontrado: " + fileName);
        }

        try {
            boolean fileDeleted = Files.deleteIfExists(imagePath);
            if (!fileDeleted) {
                throw new StorageException("Falha ao tentar deletar o arquivo: " + fileName);
            }
        } catch (IOException e) {
            throw new StorageException("Erro ao tentar deletar o arquivo: " + fileName, e);
        }
    }

}
