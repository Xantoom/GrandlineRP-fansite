<?php

namespace App\Service;

use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileStorageService
{
	private S3Client $s3Client;
	private string $bucket;

	public function __construct(
		string $accessKey,
		string $secretKey,
		string $endpoint,
		string $bucket
	)
	{
		$this->s3Client = new S3Client([
			'version' => 'latest',
			'region' => 'eu-east-1', // Region is not used for MinIO, but required by the SDK
			'endpoint' => $endpoint,
			'use_path_style_endpoint' => true,
			'credentials' => [
				'key' => $accessKey,
				'secret' => $secretKey,
			],
		]);
		$this->bucket = $bucket;
	}

	/**
	 * Upload a file to the storage
	 */
	public function uploadFile(UploadedFile $file, string $directory = ''): string
	{
		$filename = sprintf('%s/%s', $directory, uniqid('', true) . '-' . $file->getClientOriginalName());

		$this->s3Client->putObject([
			'Bucket' => $this->bucket,
			'Key' => $filename,
			'Body' => fopen($file->getPathname(), 'rb'),
			'ContentType' => $file->getMimeType(),
		]);

		return $filename;
	}

	/**
	 * Check if a file exists in the storage
	 */
	public function fileExists(string $filename): bool
	{
		try {
			return $this->s3Client->doesObjectExist($this->bucket, $filename);
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * Delete a file from the storage
	 */
	public function deleteFile(string $filename): bool
	{
		try {
			if (!$this->fileExists($filename)) {
				return false;
			}

			$this->s3Client->deleteObject([
				'Bucket' => $this->bucket,
				'Key' => $filename,
			]);

			return true;
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * Get the public URL for a file
	 */
	public function getFileUrl(string $filename): string
	{
		return $this->s3Client->getObjectUrl($this->bucket, $filename);
	}

	/**
	 * Get the contents of a file
	 */
	public function getFileContents(string $filename): ?string
	{
		try {
			if (!$this->fileExists($filename)) {
				return null;
			}

			$result = $this->s3Client->getObject([
				'Bucket' => $this->bucket,
				'Key' => $filename,
			]);

			return (string) $result['Body'];
		} catch (S3Exception $e) {
			return null;
		}
	}

	/**
	 * Put raw content as a file in the storage
	 */
	public function putFileContent(string $content, string $filename, string $contentType = 'application/octet-stream'): bool
	{
		try {
			$this->s3Client->putObject([
				'Bucket' => $this->bucket,
				'Key' => $filename,
				'Body' => $content,
				'ContentType' => $contentType,
			]);

			return true;
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * List files in a directory
	 */
	public function listFiles(string $directory = ''): array
	{
		try {
			$prefix = empty($directory) ? '' : rtrim($directory, '/') . '/';

			$results = $this->s3Client->listObjects([
				'Bucket' => $this->bucket,
				'Prefix' => $prefix,
			]);

			$files = [];
			if (isset($results['Contents'])) {
				foreach ($results['Contents'] as $object) {
					$files[] = $object['Key'];
				}
			}

			return $files;
		} catch (S3Exception $e) {
			return [];
		}
	}
}
