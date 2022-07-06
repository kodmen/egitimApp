package com.temrin.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.PutObjectResult;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class AwsService {

    private static String bucketName;
    private static final AWSCredentials credentials;
    private AmazonS3 s3client;

    static {
        //put your accesskey and secretkey here
        credentials = new BasicAWSCredentials("AKIAXJ6BKKZ6HOSW36HU", "XPtfFweNOSEF1DkEUQ03uLHomNGEFrqWo6k76ccQ");
    }

    AwsService() {
        s3client =
            AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.EU_CENTRAL_1)
                .build();

        bucketName = "temrinbucket";
    }

    public void uploadFile(String key, File file) {
        putObject(bucketName, key, file);
    }

    public PutObjectResult putObject(String bucketName, String key, File file) {
        return s3client.putObject(bucketName, key, file);
    }

    public void deleteFile(String objectKey) {
        deleteObject(bucketName, objectKey);
    }

    public void deleteObject(String bucketName, String objectKey) {
        s3client.deleteObject(bucketName, objectKey);
    }
}
