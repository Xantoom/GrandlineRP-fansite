<?php

namespace App\Service;

use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;

class FileStorageService
{
	private S3Client $s3Client;
	private string $bucket;

	public function __construct(
		string $accessKey,
		string $secretKey,
		string $endpoint,
		string $bucket,
	)
	{
		$this->bucket = $bucket;
		$this->s3Client = new S3Client([
			'version' => 'latest',
			'region' => 'eu-east-1', // Region is not used for MinIO, but required by the SDK
			'credentials' => [
				'key' => $accessKey,
				'secret' => $secretKey,
			],
			'endpoint' => $endpoint,
			'use_path_style_endpoint' => true,
		]);
	}

	/**
	 * Check if a directory exists
	 */
	public function directoryExists(string $directory): bool
	{
		// Ensure directory ends with a slash
		$directory = rtrim($directory, '/') . '/';

		try {
			$result = $this->s3Client->listObjectsV2([
				'Bucket' => $this->bucket,
				'Prefix' => $directory,
				'MaxKeys' => 1,
			]);

			return isset($result['Contents']) && is_array($result['Contents']) && count($result['Contents']) > 0;
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * Create a directory
	 */
	public function createDirectory(string $directory): bool
	{
		// Ensure directory ends with a slash
		$directory = rtrim($directory, '/') . '/';

		try {
			$this->s3Client->putObject([
				'Bucket' => $this->bucket,
				'Key' => $directory,
				'Body' => '',
			]);

			return true;
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * Delete a directory and all its contents
	 */
	public function deleteDirectory(string $directory): bool
	{
		// Ensure directory ends with a slash
		$directory = rtrim($directory, '/') . '/';

		try {
			// List all objects in the directory
			$objects = $this->s3Client->listObjectsV2([
				'Bucket' => $this->bucket,
				'Prefix' => $directory,
			]);

			if (isset($objects['Contents']) && is_array($objects['Contents']) && count($objects['Contents']) > 0) {
				$objectsToDelete = [];
				/** @var array<string, mixed> $object */
				foreach ($objects['Contents'] as $object) {
					if (isset($object['Key']) && is_string($object['Key'])) {
						$objectsToDelete[] = ['Key' => $object['Key']];
					}
				}

				if (!empty($objectsToDelete)) {
					// Delete all objects in the directory
					$this->s3Client->deleteObjects([
						'Bucket' => $this->bucket,
						'Delete' => [
							'Objects' => $objectsToDelete,
						],
					]);
				}
			}

			return true;
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * Check if a file exists
	 */
	public function fileExists(string $filePath): bool
	{
		try {
			return $this->s3Client->doesObjectExist($this->bucket, $filePath);
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * Upload a file
	 *
	 * @param string $filePath The path where to save the file
	 * @param string|resource|\Psr\Http\Message\StreamInterface $fileContent The file content
	 * @param string|null $contentType Optional content type
	 */
	public function uploadFile(string $filePath, $fileContent, ?string $contentType = null): bool
	{
		try {
			$params = [
				'Bucket' => $this->bucket,
				'Key' => $filePath,
				'Body' => $fileContent,
			];

			if ($contentType !== null) {
				$params['ContentType'] = $contentType;
			}

			$this->s3Client->putObject($params);

			return true;
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * Get file content
	 *
	 * @return string|null The file content or null if file doesn't exist
	 */
	public function getFileContent(string $filePath): ?string
	{
		try {
			$result = $this->s3Client->getObject([
				'Bucket' => $this->bucket,
				'Key' => $filePath,
			]);

			if (isset($result['Body']) && is_object($result['Body'])) {
				$body = $result['Body'];

				if (method_exists($body, 'getContents')) {
					$contents = $body->getContents();
					return is_string($contents) ? $contents : null;
				}
			}

			return null;
		} catch (S3Exception $e) {
			return null;
		}
	}

	/**
	 * Delete a file
	 */
	public function deleteFile(string $filePath): bool
	{
		try {
			$this->s3Client->deleteObject([
				'Bucket' => $this->bucket,
				'Key' => $filePath,
			]);

			return true;
		} catch (S3Exception $e) {
			return false;
		}
	}

	/**
	 * Get a presigned URL for a file (temporary access)
	 */
	public function getPresignedUrl(string $filePath, int $expiresIn = 3600): ?string
	{
		try {
			$command = $this->s3Client->getCommand('GetObject', [
				'Bucket' => $this->bucket,
				'Key' => $filePath,
			]);

			$request = $this->s3Client->createPresignedRequest($command, "+{$expiresIn} seconds");

			return (string) $request->getUri();
		} catch (S3Exception $e) {
			return null;
		}
	}
}
