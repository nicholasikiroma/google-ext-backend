# API Title: Video Upload and Playback Service API

**Description**: This API allows users to upload videos and play them through a web interface.

**Base URL**: `https://localhost:3000`

**Endpoints**:

1. **Upload Video**
   - **Endpoint**: `/api/videos`
   - **Method**: POST
   - **Request Format**:
     - Content-Type: multipart/form-data
     - Body: File (Video File)

    ```json
     {
      "value": "upload-videos"
     }
     ```

   - **Response Format**:
     - Status Code: 200 OK
     - Body: None
   - **Description**: Upload a video file to the server. The uploaded file will be stored on the server.

2. **Render Video**
   - **Endpoint**: `/videos/:fileName`
   - **Method**: GET
   - **Request Format**:
     - URL Parameter: fileName (string) - The unique identifier of the uploaded video.
   - **Response Format**:
     - Status Code: 200 OK
     - Body: Video stream.
   - **Description**: Retrieve a vidoe.

3. **Fetch all videos**
   - **Endpoint**: `/videos`
   - **Method**: GET
   - **Request Format**:
     - No request params or body.
   - **Response Format**:
     - Status Code: 200 OK
     - Body: JSON

     ```json
     {
      "data": [
        {
          "fileName": "example.mp4",
          "streamLink": "http://localhost:3000/api/videos/example.mp4"
        },
        {
          "fileName": "example-two.mp4",
          "streamLink": "http://localhost:3000/api/videos/example-two.mp4"
        } 
      ]
     }
     ```

   - **Description**: Retrieve a vidoe.

**Example Usage**:

- Uploading a video:
  - Request:

    ```json
    POST https://your-api-domain.com/api/upload
    Content-Type: multipart/form-data
    Body: (Video File)
    ```

  - Response:

    ```json
    200 OK
    ```

- Playing an uploaded video:
  - Request:

    ```json
    GET https://your-api-domain.com/playback/:videoId
    ```

  - Response:

    ```json
    200 OK
    (HTML page with video player)
    ```

**Error Handling**:

- If the video upload fails for any reason, return an appropriate error response (e.g., 400 Bad Request).
- If the requested video doesn't exist, return a 404 Not Found error.

**Additional Information**:

- This API does not require authentication, as per the task requirements.
- The uploaded videos are stored on the server's file system.
