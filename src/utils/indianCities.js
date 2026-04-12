/**
 * indianCities.js — Indian City Data for Map Search
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */

// Top Indian cities with coordinates for carpooling routes - Top 30 specifically selected as per requirements.
export const INDIAN_CITIES_24BCI0098 = [
  // Requested Additions
  { name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325, population: '0.5M' },
  
  // South Focus
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, population: '12M' },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, population: '10M' },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, population: '10M' },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, population: '2.1M' },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, population: '1.7M' },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, population: '2.2M' },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, population: '1.7M' },
  { name: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394, population: '1.2M' },
  { name: 'Mangalore', state: 'Karnataka', lat: 12.9141, lng: 74.8560, population: '0.7M' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, population: '2.1M' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, population: '1.5M' },
  { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, population: '0.5M' },
  { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, population: '0.6M' },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, population: '0.9M' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, population: '1.1M' },
  { name: 'Hubli', state: 'Karnataka', lat: 15.3647, lng: 75.1240, population: '1.0M' },
  { name: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977, population: '0.6M' },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941, population: '0.8M' },
  { name: 'Ooty', state: 'Tamil Nadu', lat: 11.4100, lng: 76.6950, population: '0.1M' },
  { name: 'Kanyakumari', state: 'Tamil Nadu', lat: 8.0883, lng: 77.5385, population: '0.1M' },
  { name: 'Pondicherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083, population: '0.7M' },
  { name: 'Manipal', state: 'Karnataka', lat: 13.3409, lng: 74.7858, population: '0.1M' },
  
  // North & Central
  { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, population: '32M' },
  { name: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, population: '1.15M' },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, population: '0.6M' },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, population: '3.7M' },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, population: '3.1M' },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, population: '1.2M' },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, population: '1.6M' },
  { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794, population: '1.2M' },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, population: '1.1M' },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, population: '1.6M' },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, population: '4M' },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, population: '0.5M' },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, population: '1.1M' },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, population: '3.2M' },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, population: '2.4M' },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, population: '1.1M' },
  { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, population: '0.7M' },
  
  // West
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, population: '21M' },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, population: '7M' },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, population: '2.9M' },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, population: '1.5M' },
  { name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, population: '1.2M' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, population: '8M' },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, population: '6.5M' },
  { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, population: '2.1M' },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, population: '1.3M' },
  { name: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278, population: '0.1M' },
  
  // East & North-East
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, population: '15M' },
  { name: 'Darjeeling', state: 'West Bengal', lat: 27.0410, lng: 88.2663, population: '0.1M' },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, population: '1.2M' },
  { name: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8312, population: '0.2M' },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, population: '2.4M' },
  { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002, population: '0.5M' },
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, population: '1.1M' },
  { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, population: '1.3M' },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, population: '1.1M' },
  { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, population: '0.1M' },
  { name: 'Gangtok', state: 'Sikkim', lat: 27.3314, lng: 88.6138, population: '0.1M' },
  { name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368, population: '0.3M' },
  { name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868, population: '0.4M' }
];

// Mock carpool rides for Indian cities — developed by Harshit Chhabi (24BCI0098)
export const MOCK_CARPOOLS_INDIA_24BCI0098 = [
  {
    id: 'ride-hc-001',
    driver: 'Aditi Sharma',
    startCity: 'New Delhi',
    startLocationAddress: 'Connaught Place, New Delhi',
    startLocation: { lat: 28.6315, lng: 77.2167 },
    destinationCity: 'Gurugram',
    destinationAddress: 'Cyber Hub, Gurugram',
    destination: { lat: 28.4950, lng: 77.0888 },
    departureTime: '2026-04-02T08:30',
    seatsAvailable: 3,
    seatsTotal: 4,
    costPerPerson: '₹150',
    vehicleType: 'Maruti Suzuki Baleno',
    rating: 4.8,
  },
  {
    id: 'ride-hc-002',
    driver: 'Rahul Verma',
    startCity: 'Mumbai',
    startLocationAddress: 'Andheri West, Mumbai',
    startLocation: { lat: 19.1364, lng: 72.8296 },
    destinationCity: 'Pune',
    destinationAddress: 'Hinjewadi IT Park, Pune',
    destination: { lat: 18.5912, lng: 73.7390 },
    departureTime: '2026-04-02T07:00',
    seatsAvailable: 2,
    seatsTotal: 3,
    costPerPerson: '₹400',
    vehicleType: 'Honda City',
    rating: 4.6,
  },
  {
    id: 'ride-hc-003',
    driver: 'Priya Nair',
    startCity: 'Bangalore',
    startLocationAddress: 'Koramangala, Bangalore',
    startLocation: { lat: 12.9352, lng: 77.6245 },
    destinationCity: 'Bangalore',
    destinationAddress: 'Electronic City, Bangalore',
    destination: { lat: 12.8399, lng: 77.6770 },
    departureTime: '2026-04-02T09:15',
    seatsAvailable: 4,
    seatsTotal: 4,
    costPerPerson: '₹80',
    vehicleType: 'Hyundai Creta',
    rating: 4.9,
  },
  {
    id: 'ride-hc-004',
    driver: 'Vikram Patel',
    startCity: 'Chennai',
    startLocationAddress: 'T. Nagar, Chennai',
    startLocation: { lat: 13.0418, lng: 80.2341 },
    destinationCity: 'Chennai',
    destinationAddress: 'Sholinganallur IT Corridor, Chennai',
    destination: { lat: 12.9010, lng: 80.2278 },
    departureTime: '2026-04-02T08:00',
    seatsAvailable: 1,
    seatsTotal: 3,
    costPerPerson: '₹120',
    vehicleType: 'Toyota Innova',
    rating: 4.7,
  },
  {
    id: 'ride-hc-005',
    driver: 'Neha Gupta',
    startCity: 'Hyderabad',
    startLocationAddress: 'Jubilee Hills, Hyderabad',
    startLocation: { lat: 17.4325, lng: 78.4073 },
    destinationCity: 'Hyderabad',
    destinationAddress: 'HITEC City, Hyderabad',
    destination: { lat: 17.4435, lng: 78.3772 },
    departureTime: '2026-04-02T09:00',
    seatsAvailable: 3,
    seatsTotal: 4,
    costPerPerson: '₹60',
    vehicleType: 'Tata Nexon EV',
    rating: 5.0,
  },
];

// Mock parking data for Indian cities
export const MOCK_PARKING_INDIA_24BCI0098 = [
  {
    id: 'park-001',
    name: 'CP Underground Parking',
    address: 'Connaught Place, New Delhi',
    position: { lat: 28.6304, lng: 77.2177 },
    totalSpots: 250,
    available: 42,
    pricePerHour: '₹60',
    features: ['CCTV', 'EV Charging', 'Covered'],
    rating: 4.2,
  },
  {
    id: 'park-002',
    name: 'Phoenix Mall Parking',
    address: 'Lower Parel, Mumbai',
    position: { lat: 18.9952, lng: 72.8303 },
    totalSpots: 500,
    available: 85,
    pricePerHour: '₹80',
    features: ['CCTV', 'Valet', 'Covered', 'EV Charging'],
    rating: 4.5,
  },
  {
    id: 'park-003',
    name: 'Orion Mall Parking',
    address: 'Rajajinagar, Bangalore',
    position: { lat: 13.0107, lng: 77.5556 },
    totalSpots: 350,
    available: 120,
    pricePerHour: '₹50',
    features: ['CCTV', 'Covered'],
    rating: 4.0,
  },
  {
    id: 'park-004',
    name: 'Express Avenue Parking',
    address: 'Royapettah, Chennai',
    position: { lat: 13.0590, lng: 80.2629 },
    totalSpots: 400,
    available: 67,
    pricePerHour: '₹40',
    features: ['CCTV', 'Covered', 'Wheelchair Access'],
    rating: 4.3,
  },
];

/**
 * searchIndianCities_24BCI0098 — Search cities by name
 * @param {string} query
 * @returns {Array} Matching cities
 */
export function searchIndianCities_24BCI0098(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return INDIAN_CITIES_24BCI0098.filter(
    (city) =>
      city.name.toLowerCase().includes(q) ||
      city.state.toLowerCase().includes(q)
  );
}
