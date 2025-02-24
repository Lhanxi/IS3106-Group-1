# IS3106-Group-1
IS3106 Group 1 Project

## Setup Instructions

1. Create a `.env` file in the root directory of the project (outside of the `backend` folder) and input the following:
    ```properties
    MONGO_URI=<your_mongo_uri>
    ```

2. Install the dependencies for both the backend and frontend:
    ```bash
    npm install
    ```

3. Start the backend server:
    ```bash
    cd backend
    npm run dev
    ```

4. Start the frontend application:
    ```bash
    cd frontend
    npm start
    ```

## Notes

- Ensure that your MongoDB URI is correctly set in the `.env` file.
- The backend server will run on the port 5001.
- The frontend application will run on port 3000 by default.