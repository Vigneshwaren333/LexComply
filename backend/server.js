require('dotenv').config();

const bcrypt = require('bcrypt'); // Add this at the top with other requires
const jwt = require('jsonwebtoken'); // Add this at the top
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true // Enable credentials
}));

app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1109',
  database: 'rti_database',
  port: 3308
}).promise(); // Using promise-based connection consistently

// Create a helper function for database queries
const query = async (sql, params) => {
  try {
    const [results] = await db.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Enhanced file upload configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    // Add timestamp to ensure unique filenames
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
  }
});

//============= Login and sign up page==========

// User Registration
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Registration endpoint - Fixed to use bcrypt for password hashing
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check for existing user
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Generate token
    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: result.insertId,
        name,
        email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message
    });
  }
});

// Login endpoint - Fixed to use bcrypt for password verification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed: ' + error.message
    });
  }
});

// ============ RTI APPLICATION ROUTES ============

// Submit new RTI application - Fixed to use proper async query handling
app.post('/api/rti/submit', upload.array('documents'), async (req, res) => {
  const {
    fullName,
    email,
    phone,
    idProofType,
    publicAuthority,
    subjectMatter,
    informationRequired,
    timePeriodStart,
    timePeriodEnd
  } = req.body;

  try {
    const applicationId = `RTI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const documentPaths = req.files ? req.files.map(file => file.path).join(',') : null;

    const query = `
      INSERT INTO rti_applications 
      (application_id, full_name, email, phone, id_proof_type, public_authority, 
       subject_matter, information_required, time_period_start, time_period_end, document_paths, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    await db.execute(
      query,
      [applicationId, fullName, email, phone, idProofType, publicAuthority,
       subjectMatter, informationRequired, timePeriodStart, timePeriodEnd, documentPaths]
    );

    res.json({ 
      success: true, 
      applicationId,
      message: 'RTI application submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting RTI application:', error);
    // Cleanup uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit application' 
    });
  }
});

// Get RTI application status
app.get('/api/rti/status/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const results = await query(
      'SELECT * FROM rti_applications WHERE application_id = ?',
      [applicationId]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    res.json({
      success: true,
      application: results[0]
    });
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch application status' 
    });
  }
});

// Get all RTI applications for a user
app.get('/api/rti/applications/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const results = await query(
      'SELECT * FROM rti_applications WHERE email = ? ORDER BY created_at DESC',
      [email]
    );
    
    res.json({
      success: true,
      applications: results
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch applications' 
    });
  }
});

// ============ CYBERLAW APPLICATION ROUTES ============

// Enhanced cyberlaw application submission
app.post('/api/cyberlaw/submit', upload.array('documents'), async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      applicationType,
      subject,
      description
    } = req.body;

    // Enhanced input validation
    if (!fullName || !email || !phone || !applicationType || !subject) {
      throw new Error('All required fields must be filled');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Invalid phone number format');
    }

    // Generate unique application ID
    const applicationId = `CL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Get uploaded file paths
    const documentPaths = req.files ? req.files.map(file => file.path).join(',') : null;

    const insertQuery = `
      INSERT INTO cyberlaw_applications 
      (application_id, full_name, email, phone, application_type, subject, description, document_paths, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    await query(insertQuery, [
      applicationId,
      fullName,
      email,
      phone,
      applicationType,
      subject,
      description,
      documentPaths
    ]);

    res.json({
      success: true,
      applicationId,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    // Cleanup uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
});

// ============ CONSULTATION ROUTES ============

app.post('/api/consultation/submit', async (req, res) => {
  const { name, email, phone, caseType, urgency, message } = req.body;

  if (!name || !email || !phone || !caseType || !urgency || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required' 
    });
  }

  try {
    const consultationId = `CONS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const queryText = `
      INSERT INTO consultations 
      (consultation_id, name, email, phone, case_type, urgency, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    await query(queryText, [
      consultationId, 
      name, 
      email, 
      phone, 
      caseType, 
      urgency, 
      message
    ]);

    res.json({ 
      success: true, 
      consultationId,
      message: 'Consultation request submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting consultation request:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit consultation request' 
    });
  }
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Add this after your existing RTI routes

// ============ COMPLIANCE ASSESSMENT ROUTES ============


// Updated compliance assessment route with enhanced error handling
app.post('/api/compliance-assessment', async (req, res) => {
  try {
    const {
      organizationName,
      industryType,
      complianceAreas,
      challenges
    } = req.body;

    // Enhanced validation
    if (!organizationName?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Organization name is required'
      });
    }

    if (organizationName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Organization name must be at least 2 characters'
      });
    }

    if (!industryType) {
      return res.status(400).json({
        success: false,
        error: 'Industry type is required'
      });
    }

    if (!complianceAreas || !Object.values(complianceAreas).some(v => v)) {
      return res.status(400).json({
        success: false,
        error: 'At least one compliance area must be selected'
      });
    }

    if (!challenges?.trim() || challenges.length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Please provide more detailed challenges (minimum 20 characters)'
      });
    }

    // Generate unique application ID
    const applicationId = `COMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Use the query helper function you defined earlier instead of db.promise().query()
    const insertQuery = `
      INSERT INTO compliance_assessments 
      (application_id, organization_name, industry_type, compliance_areas, challenges, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    await query(
      insertQuery,
      [
        applicationId,
        organizationName.trim(),
        industryType,
        JSON.stringify(complianceAreas),
        challenges.trim()
      ]
    );

    // Send success response
    res.json({
      success: true,
      applicationId,
      message: 'Compliance assessment submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting compliance assessment:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'This assessment has already been submitted'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to submit compliance assessment. Please try again later.'
    });
  }
});