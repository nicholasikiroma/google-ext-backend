# API Title: Video Upload and Playback Service API

**Description**: This API allows users to upload videos and play them through a web interface.

**Base URL**: <https://recorder-service.onrender.com/api>

**Endpoints**:

1. **Fetch all Recordings**
   - **Endpoint**: `/videos`
   - **Method**: GET
   - **Request Format**:
     - URL Parameter: sessionId (UUID) - The unique identifier of the uploaded video.
   - **Response Format**:
     - Status Code: 200 OK
     - Body: JSON

     ```json
     {
       "data": [
        {
          "sessionId": "3f928b0e-3773-481e-8c7f-458f9609462s",
          "dateCreated": "date object",
          "mimeType": "video/webm" or null,
          "transcriptions": "Transcription text if any" or null,
          "fileSize":"18289" or null,
          "videoUrl": <link to video>
        }
       ]
     }
     ```

   - **Description**: Fetch all videos

2. **Fetch one video**
   - **Endpoint**: `/videos/sessionId`
   - **Method**: GET
   - **Request Format**:
     - URL Parameter: sessionId (UUID) - The unique identifier of the uploaded video.
   - **Response Format**:
     - Status Code: 200 OK
     - Body: Video stream

   - **Description**: Fetch one

3. **Stop Recording**
   - **Endpoint**: `/stop-recording/sessionId`
   - **Method**: POST
   - **Request Format**:
     - URL Parameter: sessionId (UUID) - The unique identifier of the uploaded video.
   - **Response Format**:
     - Status Code: 200 OK
     - Body: No

     ```json
     {
       "message": "Recording stopped and saved",
       "data":
       [
        sessionId": "3f928b0e-3773-481e-8c7f-458f9609462s",
        "dateCreated": "date object",
        "mimeType": "video/webm(or null)",
        "transcriptions": "Transcription text if any(or null)",
        "fileSize":"18289(or null)",
        "videoUrl": "<link to video>"
      ],
     }
     ```

   - **Description**: Retrieve a vidoe.

4. **Start recording**
   - **Endpoint**: `/start-recording`
   - **Method**: POST
   - **Request Format**:
     - Content-Type: multipart/form-data
     - Body: File (Video File)

    ```json
     {
      "mimetype": "video/webm"
     }
     ```

   - **Response Format**:
     - Status Code: 200 OK
     - Body: JSON

     ```json
     {
      "sessionId": "ashd-2u48-wjdn"
     }

   - **Description**: Generate upload session with server.

5. **Record video chunks**
   - **Endpoint**: `/record-data/:sessionId`
   - **Method**: POST
   - **Request Format**:
     - URL Parameter: sessionId (UUID) - The unique identifier of the uploaded video.
     - Body: dataChunk(base64 string) - Blob object converted to base64

     ```json
     {
        "dataChunk": "data"
     }
     ```

   - **Response Format**:
     - Status Code: 200 OK
     - Body: JSON

     ```json
     {
        "message": "Data received and saved"
     }
     ```

   - **Description**: Send video chunks

**Example Usage**:

- Start Recording:
  - Request:

    ```json
    POST https://api-domain.com/api/start-recording
    Content-Type: application/json
    Body: mimetype (ex "video/webm")
    ```

  - Response:
  200 OK

    ```json
    {
      "sessionId": "UUID string"
    }
    ```

- Record Data:
  - Request:

    ```json
    POST https://your-api-domain.com/api/record-data/:sessionId
    Content-Type: application/json
    Body: dataChunk (base64 string)
    ```

  - Response:
  200 OK

    ```json
    {
      "message": "Data received and saved"
    }
    ```

- Stop recording:
  - Request:

    ```json
    POST https://api-domain.com/api/stop-recording/:sessionId
    Content-Type: application/json
    Body: No Body
    ```

  - Response:
  200 OK

    ```json
    {
      "message": "Recording received and saved",
      "videoURL": "http://domain.com/video.mp4"
    }
    ```

**Additional Information**:

- This API does not require authentication, as per the task requirements.
- The uploaded videos are stored on the server's file system.
