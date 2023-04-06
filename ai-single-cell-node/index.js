const express = require('express');
const fs = require('fs-extra');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path')
const mime = require('mime');
const archiver = require('archiver');
const util = require('util');
const stat = util.promisify(fs.stat);
const multer = require("multer");
const FILE_UPLOAD_MAX_SIZE = 1024 * 1024 * 1024;
const hostIp = process.env.SSH_CONNECTION.split(' ')[2];

console.log('HOSTURL: ' + process.env.HOST_URL);
const app = express();
app.use(cors({
    origin: [`http://${process.env.HOST_URL}:3000`, `http://${hostIp}:3000`],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

const dbConfig = JSON.parse(fs.readFileSync('./configs/dbconfigs.json'));
const storageConfig = JSON.parse(fs.readFileSync('./configs/storageConfig.json'));

const storageDir = storageConfig.storageDir;
// Create a connection pool to handle multiple connections to the database
const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    connectionLimit: dbConfig.connectionLimit
});

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

function getUserFromToken(token) {
    if (typeof token !== 'string') {
        return 'Unauthorized';
    }

    try {
        const decoded = jwt.verify(token, 'secret');

        console.log('token: ' + decoded.username);
        if (!decoded.username) {
            return 'Unauthorized';
        }

        return decoded.username;
    } catch (err) {
        console.log('eee ' + err)
        return 'Unauthorized';
    }
}

// Route to handle user signup
app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password using bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            res.json({ status: 500, message: 'Internal Server Error' });
            return;
        }

        // Insert the user into the database
        pool.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash], (err) => {
            if (err) {
                console.error(err);
                res.json({ status: 500, message: 'An Account is already present with the given email or username. Please try to login or create a new account using different email.' });
                return;
            }

            try {
                if(!err) {
                    fs.promises.mkdir(storageDir + username);
                    res.json({ status: 200, message: 'User account created successfully' });
                }          
            }
            catch (error) {
                res.json({ status: 500, message: 'Error occured while creating a storage directory for the user' });
            }

        });
    });
});

// Route to handle user login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            res.json({ status: 500, message: 'Internal Server Error' });
            return;
        }

        if (results.length === 0) {
            res.json({ status: 401, message: 'Invalid credentials' });
            return;
        }

        const user = results[0];

        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.error(err);
                res.json({ status: 500, message: 'Internal Server Error' });
                return;
            }

            if (!isMatch) {
                res.json({ status: 401, message: 'Invalid credentials' });
                return;
            }

            // Create JWT token and send it back to the client
            const jwtToken = jwt.sign({ username, password }, 'secret', { expiresIn: '1h' });

            // the cookie will be set with the name "jwtToken" and the value of the token
            // the "httpOnly" and "secure" options help prevent XSS and cookie theft
            // the "secure" option is only set if the app is running in production mode
            // set the cookie with the JWT token on the response object
            res.cookie("jwtToken", jwtToken, {
                //httpOnly: true,
                maxAge: 60 * 60 * 1000,
                path: "/"
                //secure: process.env.NODE_ENV === "production",
            });

            console.log(req.cookies);
            res.json({ status: 200, message: 'Logged in successfully', jwtToken });
        });
    });
});

// Route to handle protected resource
app.get('/protected', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({ message: 'You have access to the protected resource', authData });
        }
    });
});


app.post('/createDataset', (req, res) => {
    const { title, n_cells, reference, summary, authToken, files } = req.body;
    const username = getUserFromToken(authToken);

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.beginTransaction(function (err) {
            if (err) throw err;

            // Run SELECT command
            connection.query('SELECT user_id FROM users WHERE username = ? LIMIT 1', [username], function (err, userRows) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }

                const userId = userRows[0].user_id;

                if (!userId) {
                    res.status(400).send('User not found');
                    connection.rollback(function () {
                        connection.release();
                    });
                    return;
                }

                // Run INSERT command
                connection.query('INSERT INTO dataset (title, n_cells, reference, summary, user_id) VALUES (?, ?, ?, ?, ?)', [title, n_cells, reference, summary, userId], function (err, datasetResult) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }

                    const datasetId = datasetResult.insertId;

                    for (const file of files) {
                        connection.query('INSERT INTO file (file_loc, dataset_id) VALUES (?, ?)', [file, datasetId]);
                    }

                    // Commit transaction
                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }

                        console.log('Transaction completed successfully');
                        connection.release();
                        res.status(201).jsonp('Dataset Created.');
                    });
                });
            });
        });
    });
});



app.post('/renameFile', async (req, res) => {
    let { oldName } = req.query;
    let { newName } = req.query;
    let { authToken } = req.query;

    oldName = oldName.replace('//', '/');
    newName = newName.replace('//', '/');

    const uname = getUserFromToken(authToken);
    if (uname == 'Unauthorized')
        return res.status(403).jsonp('Unauthorized');

    pool.query(`UPDATE aisinglecell.file f JOIN aisinglecell.dataset d ON f.dataset_id = d.dataset_id JOIN aisinglecell.users u ON d.user_id = u.user_id SET f.file_loc = CONCAT('${newName}', SUBSTRING(f.file_loc, LENGTH('${oldName}') + 1)) WHERE u.username = '${uname}' AND f.file_loc LIKE '${oldName}%';`, [newName, oldName, uname, oldName + '%'], (err, results) => {

        console.log(results);
        if (err) {
            console.error(err);
            res.json({ status: 500, message: 'Internal Server Error' });
            return;
        }
    })

    fs.rename(`${storageDir}${uname}/${oldName}`, `${storageDir}${uname}/${newName}`, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File renamed successfully!');
        }
    });
    return res.status(200).jsonp('Ok');
});

app.post('/download', async (req, res) => {
    const { fileList } = req.body;
    const { authToken } = req.query;
    console.log('Entered download function');

    const username = getUserFromToken(authToken);
    console.log('Username is: ' + username);
    if (fileList && Array.isArray(fileList)) {
        const zipName = 'files.zip';
        const output = fs.createWriteStream(zipName);
        const archive = archiver('zip');

        archive.pipe(output);

        async function appendToArchive(filePath, archivePath) {
            const fileStat = await stat(filePath);

            if (fileStat.isDirectory()) {
                // Recursively append directory contents
                const dirEntries = await fs.promises.readdir(filePath);
                for (const entry of dirEntries) {
                    const entryPath = path.join(filePath, entry);
                    const entryArchivePath = path.join(archivePath, entry);
                    await appendToArchive(entryPath, entryArchivePath);
                }
            } else {
                // Append file to archive
                archive.append(fs.createReadStream(filePath), { name: archivePath });
            }
        }

        for (const item of fileList) {
            const filePath = path.join(storageDir, username, item);
            const archivePath = item;
            await appendToArchive(filePath, archivePath);
        }

        archive.finalize();

        output.on('close', () => {
            const zipPath = path.join(__dirname, zipName);
            const zipSize = fs.statSync(zipPath).size;
            res.setHeader('Content-disposition', 'attachment; filename=' + zipName);
            res.setHeader('Content-type', 'application/zip');
            res.setHeader('Content-length', zipSize);

            const zipstream = fs.createReadStream(zipPath);
            zipstream.pipe(res);

            // Delete the zip file after it has been sent to the client
            // fs.unlinkSync(zipPath);
        });
    } else {
        return res.status(400).jsonp('Invalid request');
    }
});

app.get('/download', async (req, res) => {
    const { fileUrl, authToken } = req.query;
    const username = getUserFromToken(authToken);
    console.log('Entered download function');

    if (!fileUrl) {
        return res.status(400).jsonp('Invalid request');
    }

    const filePath = `${storageDir}/${username}/${fileUrl}`
    const fileStat = await fs.promises.stat(filePath);

    if (fileStat.isFile()) {
        // Download file
        const filename = path.basename(fileUrl);
        const mimetype = mime.getType(filePath, { legacy: true });

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        const filestream = fs.createReadStream(filePath);
        console.log('Filename: ' + filename)
        filestream.pipe(res);
    } else if (fileStat.isDirectory()) {
        // Download folder as zip
        const folderName = path.basename(filePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.directory(filePath, folderName);
        archive.pipe(res);

        res.setHeader('Content-disposition', 'attachment; filename=' + folderName + '.zip');
        res.setHeader('Content-type', 'application/zip');

        archive.finalize();
    } else {
        return res.status(400).jsonp('Invalid request');
    }
});

app.delete('/deleteFiles', async (req, res) => {
    const { fileList } = req.body;
    const { authToken } = req.query;
    console.log('Entered delete function');
    const uname = getUserFromToken(authToken);
    if (uname === 'Unauthorized') {
        return res.status(403).json('Unauthorized');
    }
    if (fileList && Array.isArray(fileList)) {
        let successCount = 0;
        let errorCount = 0;
        let failFlag = false;
        for (const file of fileList) {
            try {
                const [rows, fields] = await pool.promise().execute(`SELECT f.file_loc FROM aisinglecell.file f JOIN aisinglecell.dataset d ON f.dataset_id = d.dataset_id JOIN aisinglecell.users u ON d.user_id = u.user_id WHERE u.username = '${uname}' AND f.file_loc like '${file}%';`);
                console.log('Count: ' + rows.length);
                if (rows.length > 0) {
                    res.status(401).json({ message: 'File(s) being used by datasets.' });
                    return;
                } else {
                    const filePath = `${storageDir}${uname}/${file}`;
                    console.log(filePath);
                    try {
                        if (fs.existsSync(filePath)) {
                            fs.removeSync(filePath);
                            // file or folder removed
                            successCount++;
                        } else {
                            console.log('Error Deleting: ' + filePath);
                            errorCount++;
                        }
                    } catch (err) {
                        console.error(err);
                        errorCount++;
                    }
                }
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        }
        return res.jsonp({ success: successCount, errorCount: errorCount });
    } else {
        return res.status(400).jsonp('Invalid request');
    }
});



const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate;
}


app.get('/getDirContents', async (req, res) => {
    try {
        console.log(`HOSTURL: ${process.env.HOST_URL}`);
        const { dirPath } = req.query;
        const { authToken } = req.query;

        let uid = getUserFromToken(authToken);
        if (uid == "Unauthorized") {
            return res.status(403).jsonp(uid);
        }

        subdir = req.query.subdir;
        console.log(req.query.subdir);
        var directoryPath = path.join(storageDir + uid + "/" + dirPath + "/");
        if (subdir != undefined)
            directoryPath = path.join(storageDir + uid + "/", subdir);
        const directoryContents = fs.readdirSync(directoryPath);
        const dirList = [];
        const fileList = [];


        directoryContents.forEach((item) => {
            const itemPath = `${directoryPath}/${item}`;
            const itemStats = fs.statSync(itemPath);


            if (itemStats.isDirectory() == true)
                dirList.push({ "name": item, "created": formatDate(itemStats.birthtime) });
            else {
                let dotIndex = item.lastIndexOf('.');
                fileList.push({ "name": item, "created": formatDate(itemStats.birthtime), "type": (dotIndex != -1 ? item.substring(dotIndex + 1).toUpperCase() + " " : "") });
            }
        });

        return res.json({ 'Directories': dirList, 'Files': fileList });

    }
    // uid = req.session.username;
    catch (e) {
        console.log('Errordsd: ' + e);
        // return res.status(400).jsonp('Invalid request');
    }

});

// app.post('/upload', async (req, res) => {
//     let { uploadDir, authToken } = req.query;
//     let username = getUserFromToken(authToken);
//     let storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, `${storageDir}/${username}/${uploadDir}`);
//         },
//         filename: (req, file, cb) => {
//             console.log(file.originalname);
//             cb(null, file.originalname);
//         },
//     });

//     let uploadFiles = multer({
//         storage: storage,
//         limits: { fileSize: FILE_UPLOAD_MAX_SIZE },
//     }).array("files", 10);

//     let uploadFunction = util.promisify(uploadFiles);

//     console.log(`${storageDir}/${username}/${uploadDir}`);
//     try {
//         await uploadFunction(req, res);
//         res.status(200).json({ message: 'File uploaded successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to upload file', error });
//     }
// });


app.post('/upload', async (req, res) => {
    let { uploadDir, authToken } = req.query;
    let username = getUserFromToken(authToken);

    let destDir = `./storage/${username}/${uploadDir}`; // Replace with your storage directory
    let tempDir = './uploads'; // Replace with a temporary directory for uploads

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, tempDir);
        },
        filename: (req, file, cb) => {
            console.log(file.originalname);
            cb(null, file.originalname);
        },
    });

    let uploadFiles = multer({
        storage: storage,
        limits: { fileSize: FILE_UPLOAD_MAX_SIZE },
    }).array("files", 10);

    let uploadFunction = util.promisify(uploadFiles);

    try {
        await uploadFunction(req, res);

        // Move uploaded files to storage directory
        let files = req.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let tempFilePath = path.join(tempDir, file.filename);
            let destFilePath = path.join(destDir, file.originalname);

            console.log(`Tempstorage: ${tempFilePath}, DestinationL ${destFilePath}`);
            if (!fs.existsSync(path.join(destDir, username, uploadDir))) {
                fs.mkdirSync(path.join(destDir, username, uploadDir), { recursive: true });
            }

            fs.copyFileSync(tempFilePath, destFilePath);
            fs.unlinkSync(tempFilePath);
        }

        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload file', error });
    }
});


app.post('/createNewFolder', (req, res) => {
    const { pwd, folderName, authToken } = req.query;
    const username = getUserFromToken(authToken);
    const folderPath = `${storageDir}/${username}/${pwd}/${folderName}`;
    if (fs.existsSync(folderPath)) {
        res.status(400).jsonp('Folder already exists');
        return;
    }
    try {
        fs.promises.mkdir(folderPath);
        res.status(201).jsonp('Folder created')
    }
    catch (err) {
        res.status(404).jsonp('Bad root folder: ' + err);
    }
})

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
