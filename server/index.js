
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/**
 * DB CONFIGURATION
 * Update these if your XAMPP/MySQL password is not empty.
 */
const dbConfig = {
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'alumnexus',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Verify Connection and Schema on Startup
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('-----------------------------------------');
        console.log('🚀 SERVER: http://localhost:' + PORT);
        console.log('✅ DATABASE: alumnexus connected successfully');
        
        // Quick check if table exists
        await connection.query('SELECT 1 FROM users LIMIT 1');
        console.log('✅ TABLE: "users" is ready');
        console.log('-----------------------------------------');
        
        connection.release();
    } catch (err) {
        console.error('-----------------------------------------');
        console.error('❌ DATABASE ERROR!');
        console.error('Message:', err.message);
        console.error('FIX: Ensure XAMPP is running and you have created the "users" table.');
        console.log('-----------------------------------------');
    }
}
checkConnection();

// Helper: Parse JSON fields from DB safely
const parseUser = (user) => ({
    ...user,
    graduationYear: user.graduation_year,
    jobTitle: user.job_title,
    skills: typeof user.skills === 'string' ? JSON.parse(user.skills) : (user.skills || []),
    interests: typeof user.interests === 'string' ? JSON.parse(user.interests) : (user.interests || []),
    privacySettings: typeof user.privacy_settings === 'string' ? JSON.parse(user.privacy_settings) : (user.privacy_settings || {}),
    socialLinks: typeof user.social_links === 'string' ? JSON.parse(user.social_links) : (user.social_links || {}),
    preferences: typeof user.preferences === 'string' ? JSON.parse(user.preferences) : (user.preferences || {})
});

// GET: Server Status
app.get('/api/status', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

// GET: All Users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows.map(parseUser));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Register User
app.post('/api/register', async (req, res) => {
    try {
        const { id, name, email, role, avatar, graduationYear, department, bio, privacySettings } = req.body;
        
        const query = `
            INSERT INTO users 
            (id, name, email, role, avatar, graduation_year, department, bio, skills, interests, privacy_settings, social_links, preferences)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const emptyJson = JSON.stringify([]);
        const emptyObj = JSON.stringify({});

        await pool.query(query, [
            id, name, email, role, avatar, graduationYear, department, bio, 
            emptyJson, emptyJson, JSON.stringify(privacySettings || {}), emptyObj, emptyObj
        ]);

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database insertion failed. Does the table exist?' });
    }
});

// PUT: Update User Profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bio, skills, interests, jobTitle, company, graduationYear, department, socialLinks, privacySettings } = req.body;

        const query = `
            UPDATE users SET 
            name = ?, bio = ?, skills = ?, interests = ?, job_title = ?, 
            company = ?, graduation_year = ?, department = ?, social_links = ?, privacy_settings = ?
            WHERE id = ?
        `;

        await pool.query(query, [
            name, bio, JSON.stringify(skills || []), JSON.stringify(interests || []), 
            jobTitle, company, graduationYear, department, 
            JSON.stringify(socialLinks || {}), JSON.stringify(privacySettings || {}),
            id
        ]);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server process listening on port ${PORT}`);
});
