package com.temrin.service;

import org.springframework.stereotype.Service;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class EncryptAndDecryptService {


//https://www.cesarsotovalero.net/blog/encoding-encryption-hashing-and-obfuscation-in-java.html
    public  String encodeToBase64(String message) {
        return Base64.getEncoder().encodeToString(message.getBytes());
    }

    public  String decodeFromBase64(String encodedMessage) {
        byte[] decodedBytes = Base64.getDecoder().decode(encodedMessage);
        String decodedString = new String(decodedBytes);
        return decodedString;
    }

//    public static void main(String[] args) {
//        String sifre = encodeToBase64("2056");
//        System.out.println(sifre);
//        System.out.println("duzentme");
//        System.out.println(decodeFromBase64(sifre));
//        try{
//            System.out.println(decodeFromBase64("MjAE1Ng=="));
//
//        }catch (IllegalArgumentException e){
//            System.out.println("sifre patlıyor");
//        }catch (Exception e){
//            System.out.println("farklı hata");
//        }
//        /**
//         * MzQxOA==
//         * duzentme
//         * 3418
//         */
//    }


}
