import { NextResponse } from "next/server";

// Simulates a backend job scraper/aggregator fetching from Indeed, Naukri, LinkedIn
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'India';
  const experience = searchParams.get('experience') || 'fresher';

  // In a real production scenario, this API route would use Puppeteer, Cheerio, or 
  // a paid API (like RapidAPI JSearch) to scrape Indeed/Naukri securely.
  // Since we cannot run headless browsers in Vercel edge/serverless reliably for scraping
  // without getting IP blocked, we simulate the aggregator response with highly dynamic mock data
  // that matches the "India Fresher" requirement precisely.

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const jobs = [
    {
      id: `job-naukri-${Date.now()}-1`,
      title: "Software Engineer - Fresher",
      company: "Tata Consultancy Services (TCS)",
      description: "TCS is hiring fresh engineering graduates for the role of Assistant System Engineer. Must have strong programming fundamentals in Java, Python, or C++ and excellent problem-solving skills.",
      location: "Pune, Maharashtra, India",
      job_type: "Full-time",
      salary: "₹3,36,000 - ₹4,00,000 /year",
      publication_date: today.toISOString(),
      url: "https://www.naukri.com/tcs-jobs"
    },
    {
      id: `job-indeed-${Date.now()}-2`,
      title: "Junior Frontend Developer (React)",
      company: "Infosys",
      description: "Looking for passionate freshers to join our UI/UX engineering team. You will be building scalable web applications using React.js, HTML5, CSS3, and modern JavaScript.",
      location: "Bangalore, Karnataka, India",
      job_type: "Full-time",
      salary: "₹3,60,000 /year",
      publication_date: yesterday.toISOString(),
      url: "https://in.indeed.com/cmp/Infosys/jobs"
    },
    {
      id: `job-linkedin-${Date.now()}-3`,
      title: "Data Analyst Intern / Fresher",
      company: "Wipro",
      description: "Entry-level Data Analyst role. You will work on data cleaning, visualization, and basic SQL queries. Good knowledge of Python (Pandas/NumPy) and Excel required.",
      location: "Hyderabad, Telangana, India",
      job_type: "Internship",
      salary: "₹20,000 /month",
      publication_date: today.toISOString(),
      url: "https://www.linkedin.com/jobs/wipro-jobs"
    },
    {
      id: `job-naukri-${Date.now()}-4`,
      title: "Associate Product Manager - Entry Level",
      company: "Flipkart",
      description: "Exciting opportunity for recent management or engineering graduates. You will assist senior PMs in roadmap planning, user research, and feature rollout.",
      location: "Bangalore, Karnataka, India",
      job_type: "Full-time",
      salary: "₹12,00,000 - ₹15,00,000 /year",
      publication_date: twoDaysAgo.toISOString(),
      url: "https://www.naukri.com/flipkart-jobs"
    },
    {
      id: `job-indeed-${Date.now()}-5`,
      title: "Cloud Operations Engineer (Fresher)",
      company: "Amazon Web Services (AWS)",
      description: "Join AWS Support team as a cloud engineer. Basic knowledge of Linux, Networking (TCP/IP), and cloud concepts is mandatory. Excellent communication skills required.",
      location: "Remote, India",
      job_type: "Full-time",
      salary: "Competitive",
      publication_date: yesterday.toISOString(),
      url: "https://www.amazon.jobs/en/locations/india"
    },
    {
      id: `job-linkedin-${Date.now()}-6`,
      title: "Business Development Executive (Freshers)",
      company: "Byju's",
      description: "Direct sales role involving B2C educational product sales. Looking for energetic freshers with great convincing skills. Open to travel within the assigned territory.",
      location: "Mumbai, Maharashtra, India",
      job_type: "Full-time",
      salary: "₹4,00,000 + Incentives /year",
      publication_date: today.toISOString(),
      url: "https://www.linkedin.com/jobs/byjus-jobs"
    },
    {
      id: `job-naukri-${Date.now()}-7`,
      title: "Cyber Security Trainee",
      company: "Tech Mahindra",
      description: "Start your career in cybersecurity. You will be trained in SOC operations, vulnerability assessment, and basic penetration testing. B.Tech/BE in CS required.",
      location: "Noida, UP, India",
      job_type: "Full-time",
      salary: "₹3,50,000 /year",
      publication_date: twoDaysAgo.toISOString(),
      url: "https://www.naukri.com/tech-mahindra-jobs"
    },
    {
      id: `job-indeed-${Date.now()}-8`,
      title: "Junior Backend Developer (Node.js)",
      company: "Paytm",
      description: "We are hiring freshers for our core payments backend team. Strong grasp of Data Structures, Algorithms, and basic Node.js/Express knowledge is required.",
      location: "Gurgaon, Haryana, India",
      job_type: "Full-time",
      salary: "₹8,00,000 /year",
      publication_date: today.toISOString(),
      url: "https://in.indeed.com/cmp/Paytm/jobs"
    }
  ];

  const response = NextResponse.json({
    metadata: {
      source: "Aggregated (LinkedIn, Indeed, Naukri)",
      query: { location, experience },
      timestamp: new Date().toISOString()
    },
    jobs
  });
  // Cache for 5 minutes, serve stale for 2 more minutes while revalidating
  response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=120');
  return response;
}
