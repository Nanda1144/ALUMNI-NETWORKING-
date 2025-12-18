import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Database Connection Configuration
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

// Helper to format DB rows to Frontend JSON
const formatUser = (userRow, skills, interests) => ({
    ...userRow,
    id: userRow.id,
    graduationYear: userRow.graduation_year,
    jobTitle: userRow.job_title,
    socialLinks: typeof userRow.social_links === 'string' ? JSON.parse(userRow.social_links) : userRow.social_links || {},
    privacySettings: typeof userRow.privacy_settings === 'string' ? JSON.parse(userRow.privacy_settings) : userRow.privacy_settings || { showEmail: true, showCompany: true, showSocials: true },
    preferences: typeof userRow.preferences === 'string' ? JSON.parse(userRow.preferences) : userRow.preferences || {},
    skills: skills || [],
    interests: interests || []
});

// GET: Fetch All Users
app.get('/api/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        const formattedUsers = await Promise.all(users.map(async (u) => {
            const [skills] = await pool.query('SELECT skill FROM user_skills WHERE user_id = ?', [u.id]);
            const [interests] = await pool.query('SELECT interest FROM user_interests WHERE user_id = ?', [u.id]);
            return formatUser(u, skills.map(s => s.skill), interests.map(i => i.interest));
        }));
        res.json(formattedUsers);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// POST: Register New User
app.post('/api/register', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const { id, name, email, role, avatar, graduationYear, department, bio, privacySettings } = req.body;
        
        const query = `
            INSERT INTO users 
            (id, name, email, role, avatar, graduation_year, department, bio, privacy_settings, social_links, preferences)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await connection.query(query, [
            id, name, email, role, avatar, graduationYear, department, bio, 
            JSON.stringify(privacySettings || {}), 
            JSON.stringify({}), 
            JSON.stringify({})
        ]);

        await connection.commit();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Registration Error:", error);
        res.status(500).json({ error: 'Registration failed' });
    } finally {
        if (connection) connection.release();
    }
});

// PUT: Update User (Collects from website and updates DB)
app.put('/api/users/:id', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const { id } = req.params;
        const { name, bio, jobTitle, company, skills, location, socialLinks, privacySettings, interests } = req.body;

        const updateQuery = `
            UPDATE users SET 
            name = ?, bio = ?, job_title = ?, company = ?, location = ?, 
            social_links = ?, privacy_settings = ?
            WHERE id = ?
        `;
        
        await connection.query(updateQuery, [
            name, bio, jobTitle, company, location, 
            JSON.stringify(socialLinks || {}), 
            JSON.stringify(privacySettings || {}),
            id
        ]);

        // Sync Skills
        await connection.query('DELETE FROM user_skills WHERE user_id = ?', [id]);
        if (skills && skills.length > 0) {
            const skillValues = skills.map(s => [id, s]);
            await connection.query('INSERT INTO user_skills (user_id, skill) VALUES ?', [skillValues]);
        }

        // Sync Interests
        await connection.query('DELETE FROM user_interests WHERE user_id = ?', [id]);
        if (interests && interests.length > 0) {
            const interestValues = interests.map(i => [id, i]);
            await connection.query('INSERT INTO user_interests (user_id, interest) VALUES ?', [interestValues]);
        }

        await connection.commit();
        res.json({ message: 'Database updated successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Update Error:", error);
        res.status(500).json({ error: 'Database update failed' });
    } finally {
        if (connection) connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});