export default async function handler(req, res) {
  // ---------------------------
  // CORS configuration
  // ---------------------------
  const allowedOrigins = [
    'https://leonardofiduccia.github.io',
    'http://localhost:5500'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ---------------------------
  // Only allow GET requests
  // ---------------------------
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ---------------------------
  // Google Sheets config
  // ---------------------------
  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.API_KEY;
  const RANGE = 'Sheet1!A2:C';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      return res.status(200).json({ questions: [] });
    }

   const questions = data.values
     .map(row => ({
       text: row[0],
       category: row[1] || null,
       display: String(row[2]).toUpperCase() === 'TRUE'
     }))
     .filter(q => q.text && q.display);

    return res.status(200).json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
}
